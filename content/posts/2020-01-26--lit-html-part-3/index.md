---
title: "lit-html Part 3 - Event listeners"
comments: true
category: WebComponents
cover: listen.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Lee Campbell](https://unsplash.com/@leecampbell)

[In a previous post](/handling-web-component-markup-with-lit-html/) I covered the basics of lit-html. If you haven't read it yet, some of this post will probably not make sense.

Event listeners are an important part of the way we  build components for the modern web. When an input changes, or a user changes the state of a component, and event is the way we let parent components know there's an action to take.

lit-html provides a simple syntax to help us handle adding, and removing, event listeners to a component. The syntax is straight forward. Just add a `@` then the event name you are listening for at an attribute of the component. Then use the lit-html style binding syntax to associate a function to fire when the event is emitted.

Let's check out an example:

```javascript
import { html, render } from 'lit-html';

function handleClick() {
  alert('Yay for clicking the button!');
}

const template = html`<button @click=${handleClick}>Click Me!<button>`;

render(template, document.body);
```

This works exactly as you would expect. When a user clicks the button, the `handleClick` function will be fired.

## `this` context in an event

The usual rules apply here for maintaining the appropriate `this` context. If you are going to reference a method from a class (eg Web Component)you have two options:

1. Use a fat arrow function (() => {})
2. Bind the function to the appropriate `this`

If you are unfamiliar with web components, check out [my series on them](/web-components-part-1/).

### Using a fat arrow function

Fat arrow functions maintain their `this` context from wherever they are created. This makes them an easy way to handle event `this` context maintenance.

Here's what that looks like:

```javascript
import { html, render } from 'lit-html';

class AlertButton extends {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.clickCount = 0;
  }

  connectedCallback() {
    this.template = ({clickCount}) => html`<button @click=${(event) => this._handleClick(event)}`;
  }

  _handleClick(event) {
    this._clickCount++;
    this.render();
  }

  render() {
    render(this.template(this), this.shadowRoot);
  }
}
```

There's a lot going on here, but most of it is covered either in the [a lit-html](/handling-web-component-markup-with-lit-html/) post or [a web components post](/web-components-part-1/).

Let's stay focused on the lit-html part. We're binding a fat arrow function to the `click` event listener that will maintain the `this` context for our method. This means we will be able to properly increment the `clickCount` and then fire `render()`.

### Using `.bind()`

The `bind` method allows us to force a specific `this` context onto a function.

### Pros and Cons


