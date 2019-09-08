---
title: "Web Components Part 2 - Lifecycle callbacks"
comments: true
category: WebComponents
cover: web-components-part-2-cover.jpg
author: Andy Desmarais
---

Cover photo credit: [Artem Sapegin](https://unsplash.com/@sapegin)

## Before we get started

I'll talk purely about custom elements for this article. If you are unsure what a custom element is, please check out [Part 1](/web-components-part-1) of this series.

## What's a lifecycle callback?

<img class="right" src="webcomponents.svg" title="Web Components" width="200" style="background-color: #FFF; float: right;">

If you are new to the web development world you may not have heard this term before. Simply put lifecycle callbacks are a way for us to know about what's happening to our custom element in the DOM.

- Is it in the DOM yet? - connectedCallback
- Has it been removed from the DOM? - disconnectedCallback
- Did an attribute value change? - attributeChangedCallback
- Are we in a different DOM? - adoptedCallback

These are the questions we can answer using lifecycle callbacks.

## What does this look like in a custom element?

To show this we'll use our friend the HelloWorld component from [Part 1](/web-components-part-1).

```javascript
class HelloWorld extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        console.log("I've been added to the DOM!");
    }

    disconnectedCallback() {
        console.log("I've been removed from the DOM");
    }

    static get observedAttributes() {
        // List the attributes we want to trigger the attributeChangedCallback
        return [ "name" ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`An attribute change! Name: ${name}, Old Value: ${oldValue}, New Value: ${newValue}`);
    }

    adoptedCallback() {
        console.log("I've switched to a new DOM!");
    }
}
```

They are all class methods. Simple as that. Let's dig in to what they each do!

### connectedCallback

This is the method to let us know we've been added to the DOM. It will be fired in any scenario that results in the element being added to the DOM.  Here's a few examples:

- The tag is already in the HTML when the document is rendered
- We create the element using `document.createElement()` then add it to the DOM using `appendChild`
- The element is a child component of another element that is added to the DOM using `apendChild`

This is far from an exhaustive list of scenarios, but you get the idea.

Compare this to:

- React: `componentDidMount`
- Vue: `mounted`
- Angular: `ngOnInit`

### disconnectedCallback

This method is invoked anytime the element is removed from the DOM. Here's a few examples:

- We remove the element using `removeChild`
- The element is a child component of another element that is removed from the DOM using `removeElement`

Again, not an exhaustive list, but a few examples.

Compare this to:

- React: `componentWillUnmount` (NOTE: In React this is called __before__ the component is removed. Custom elements are __after__ )
- Vue: `destroyed`
- Angular: `ngOnDestroy` (NOTE: Similar to React this is called __before__ the component is removed. Custom elements are __after__ )

### adoptedCallback

This is an odd duck. The primary use case I've been able to find for this scenario is promoting an element from an iframe to the iframe's parent document. The element is not exactly being removed from the DOM, but instead being promoted to a new DOM altogether. This is a pretty unique case, and I can't say I've found any real world utility for this lifecycle callback yet.

As far as I can tell, there is not an equivalent to this method in the Big Three Frameworks.

### attributeChangedCallback

This is the most complex of the callbacks.

The first thing to note is that this method will never be invoked if we do not declare a set of attributes to be observed. We accomplish this task using a __static getter__ method on the class called `observedAttributes`. This should return an array of strings naming the attributes we want to trigger the `attributeChangedCallback` method. My understanding for the required set of attributes to watch is mostly around performance. The DOM only need to track the specified attributes for calling back, keeping things much more efficient.

When the `attributeChangedCallback` is invoked we get three pieces of information:

- Attribute name
- The old value
- The new value

The method signature is:

```javascript
attributeChangedCallback(name, oldValue, newValue) { }
```

Compare this to:

- React: `componentWillReceiveProps` is the closest, but is not __exactly__ the same.
- Vue: `watch` appears to be the closes as it defines what to watch (observedAttributes equivalent) and defines a callback (attributeChangedCallback equivalent)
- Angular: `ngOnChanges`

## Wrapping up

With these lifecycle callbacks we now have the tools needed to create custom elements that can understand their state in the dom and react to outside changes to their attributes! We have the building blocks needed to build some basic components that allow interaction and updates.

## Part 3: Slots! (Coming soon!)
