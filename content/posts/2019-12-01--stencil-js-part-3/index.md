---
title: "StencilJs - Part 1 - @Prop, @Watch, and @Method Decorators"
comments: true
category: WebComponents
cover: knobs-and-switches.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Drew Patrick Miller](https://unsplash.com/@drewpatrickmiller)

This article assumes you have a working knowledge of web components. If you don't, please check out my earlier series on [web components](/web-components-part-1).

It's also building on a [previous article](/stencil-js-part-1), so please check that out too.

## Component interfaces

The @Prop and @Method decorators help us provide the interface for our web components to consumers. The handle the public facing contact that consumers will use to interact with, and update, our components.

There are some misnomers and nuance to be aware of with each of the three decorators. We;re going to take a deep look at:

- @Prop
- @Watch
- @Method

## The @Prop decorator

`@Prop` is a bit of s misnomer. It's not only a `property` but it also represents, and can reflect an `attribute` on the tag of our component. This makes it a powerful way to interface with a consumer. They can declaratively pass down primitive types that can be parsed from a string.

### Camel case to kebab case

Stencil reflects `@Prop` class properties to the tag as kebab case translation of the camel case variable.

As an example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Prop() anExampleProp: string;
}
```

Is use in HTML like this:

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

Stencil Component:

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

### Immutability

The first major note is the all class properties decorated with `@Prop` are immutable by default. This is good basic practice to ensure a more one-way binding approach is being taken.

However, there are exceptions to every rule, and because of this Stencil allows you to override this default. Setting the `mutable` property on the `@Prop` decorator will allow you to modify the value of the property.

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Prop({ mutable: true }) aMutableProp: string = 'a mutable default';
  @Prop() immutableProp: string = 'Cannot be changed later;

  componentDidLoad() {

  }
}
```
