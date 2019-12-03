---
title: "StencilJs - Part 3 - @Prop, @Watch, and @Method Decorators"
comments: true
category: WebComponents
cover: knobs-and-switches.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Drew Patrick Miller](https://unsplash.com/@drewpatrickmiller)

This article assumes you have a working knowledge of web components. If you don't, please check out my earlier series on [web components](/web-components-part-1).

It's also building on a [previous article](/stencil-js-part-1), so please check that out too.

## Component interfaces

The `@Prop` and `@Method` decorators help us provide the interface for our web components to consumers. They handle the public facing contract that consumers will use to interact with and update our components.

There are some misnomers and nuance to be aware of with each of the three decorators. We're going to take a deep look at:

- [@Prop](#the-prop-decorator)
- [@Watch](#the-watch-decorator)
- [@Method](#the-method-decorator)

## The @Prop decorator

`@Prop` is a bit of a misnomer. It's not only a `property` but it also represents an `attribute` on the tag of our component. This makes it a powerful way to interface with a consumer. They can declaratively pass down primitive types that can be parsed from a string using the attribute, or handle more complex data using the property.

### Camel case to kebab case

Stencil reflects `@Prop` class properties to the tag as a kebab case translation of the camel case variable.

As an example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Prop() anExampleProp: string;
}
```

Is used in HTML like this:

```html
<my-custom-element an-example-prop="Something stringy"></my-custom-element>
```

### Primitive types

Props need to be a primitive type if they are going to be reflected as attributes. This means that we can only take primitive types in from attributes. Stencil will automatically handle the parsing and type casting of primitive types for you.

Here's an example:

```tsx
@Component({
  tag: 'my-custom-element',
})
export class MyCustomElement {
  @Prop() aString: string;
  @Prop() aNumber: number;
  @Prop() aBoolean: boolean;

  render() {
    return [
      <div>{typeof this.aString}</div>,
      <div>{typeof this.aNumber}</div>,
      <div>{typeof this.aBoolean}</div>,
    ];
  }
}
```

HTML:

```html
  <my-component
    a-string="This is a string"
    a-number="12345"
    a-boolean="true"
    ></my-component>
```

The output of this is:

```html
<div>string</div>
<div>number</div>
<div>boolean</div>
```

### Complex data types

When you need a non-primitive type to be passed in then your consumer will need to reference the tag directly and assign properties on that object directly. This can be done as the element is created, but before it is attached to the DOM.

Here's an example of what that can look like:

```tsx
@Component({
  tag: 'my-custom-element',
})
export class MyCustomElement {
  @Prop() aUrl: URL;

  render() {
    return [
      <div>{this.aUrl.toString()}</div>,
    ];
  }
}
```

HTML:

```html
  <my-custom-element></my-custom-element>
  <script>
    document.querySelector('my-custom-element').aUrl = new URL('https://google.com');
  </script>
```

The output of this is:

```html
<div>https://google.com/</div>
```

### Attribute name

A common problem with writing web components with Stencil is the desire to have the class property name differ from the attribute name on the tag. You may want `isValid` as the property, but `valid` as the attribute. This can be accomplished using the `attribute` property of `@Prop`.

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Prop({ attribute: 'different' }) differentFromProperty: string;
  @Prop() sameAsProperty: string;
}
```

DOM usage:

```html
<my-custom-element different="Simpler" same-as-property="potentially more complex"></my-custom-element>
```

### Immutability

It's important to know that all of the class properties marked with `@Prop` should be treated as immutable by default. This is good basic practice to ensure a more one-way binding approach is being taken.

However, there are exceptions to every rule, and because of this Stencil allows you to override this default. Setting the `mutable` property on the `@Prop` decorator will tell consumers you plan to modify the value of the property.

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Prop({
    mutable: true // Defaults to false
  }) aMutableProp: string = 'A mutable default';
  @Prop() immutableProp: string = 'Should not be changed later';

  componentDidLoad() {
    this.aMutableProp = 'Something completely different';
  }
}
```

**NOTE:** As of version Stencil 1.3.3 they do not appear to be enforcing this! It's up to you as a developer to be disciplined in using this property appropriately. You will not get an error if you change a prop that is marked `mutable: false`, which is the current default.

### Reflect

This property is designed to allow you to reflect values of `@Prop` properties as attributes on the custom element tag. This is valuable for providing the DOM with updates as values are changing in your custom element.

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Prop({
    reflect: true // Defaults to false
  }) aReflectedProp: string = 'I am reflected';
  @Prop() unreflectedProp: string = 'I am not updated in the DOM';
}
```

After the component is loaded the DOM will reflect the `aReflectedProp` value.

```html
<my-custom-element a-reflected-prop="I am reflected"></my-custom-element>
```

## The @Watch decorator

If you read through my series on web components you'll know about the [attributeChangedCallback](https://terodox.tech/web-components-part-2#attributechangedcallback). The `@Watch` decorator is how Stencil exposes this functionality.

`@Watch` takes the name of the `@Prop` variable to monitor as a parameter. Any time the value of that prop changes the function decorated by `@Watch` will be invoked with the 'newValue' and 'oldValue' as parameters. This is called first out of the lifecycle callbacks after a prop changes.

The value of `@Watch` is that you can do property validation before any of the other lifecycle events fire. If someone provided an invalid value to the `@Prop`, then throwing an error and correcting can prevent any potentially odd behavior.

**NOTE:** `@Watch` is NOT invoked for the first render. It is only invoked for subsequent changes.

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  private isInvalidUsername: boolean = false;

  @Prop() username: string;
  @Watch('username')
  validateDate(newValue, oldValue) {
      if(newValue.trim() === '') {
          isInvalidUsername = true;
          throw new Error('username is required');
      }
  }
}
```

## The @Method decorator

This might sound odd, but don't use this if at all possible. Using publicly facing methods will be much more challenging for a consumer then a prop/attribute. It also breaks traditional models for how frameworks will interact with your component. They are available if you cannot find a way to work with a prop/attribute effectively.

Now let's talk about how they actually work!

The `@Method` decorator is designed to let a consumer know about a publicly facing method. It has only one requirement: the function MUST return a promise. This can be accomplished either by marking the function `async`, or by returning a promise directly.

Quick example: [mirrors Stencil docs](https://stenciljs.com/docs/methods#method-decorator)

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
    // VALID: using async
    @Method()
    async myMethod() {
        return 42;
    }

    // VALID: using Promise.resolve()
    @Method()
    myMethod2() {
        return Promise.resolve(42);
    }

    // VALID: even it returns nothing, async will force it to return a promise
    @Method()
    async myMethod3() {
        console.log(42);
    }

    // INVALID
    @Method()
    notOk() {
        return 42;
    }
}
```

## Wrapping up

This article covers all of the ways a consumer can directly interact with a Stencil component. It is strongly recommended to use `@Prop` instead of `@Method` for interacting with a component, and `@Watch` gives us a way to handle validation we would otherwise need a method for.
