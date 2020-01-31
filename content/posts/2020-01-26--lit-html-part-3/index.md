---
title: "lit-html Part 3 - Event listeners"
comments: true
category: WebComponents
cover: listen.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Lee Campbell](https://unsplash.com/@leecampbell)

[In a previous post](/handling-web-component-markup-with-lit-html/) I covered the basics of lit-html. If you haven't read it yet, some of this post will probably not make sense.

Event listeners are an important part of the way we  build components for the modern web. When an input changes, or a user changes the state of a component, an event is the way we let parent components know there's an action to take.

lit-html provides a simple syntax to help us handle adding, and removing, event listeners to a component. The syntax is straight forward. Just add a `@` then the event name you are listening for as an attribute of the tag. Then use the lit-html style binding syntax to associate a function to fire when the event is emitted.

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

The `this` context for an event handler can be set by using the `eventContext` property of the options object passed as a third parameter to the render function. This allows you to directly control the `this` context that the event handler will have when it is invoked. This is similar to using `handleClick.bind(this)`.

Quick example:

```javascript
import { html, render } from 'lit-html';

export function renderButtonToBody() {
  const scopedValue = 'Nintendo Super Scoped';

  function handleClick() {
    alert(scopedValue);
  }

  const template = html`<button @click=${handleClick}>Click Me!<button>`;

  render(template, document.body, { eventContext: this });
}
```

## Event listener options

If you need to take advantage of other options available to you with the `addEventListener` method, you can use an object to define the event listener instead. This will allow using options like `capture`, `once`, and `passive`. Check out [MDN for more info](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) on those.

Here's how that could look:


```javascript
import { html, render } from 'lit-html';

const clickHandler = {
  handleEvent(e) {
    alert('Yay for clicking the button!');
  },
  capture: true,
};

const template = html`<button @click=${clickHandler}>Click Me!<button>`;

render(template, document.body);
```

The `handleEvent` method is required. The other options can then be added as sibling properties to the `handleEvent` function.

The `handleEvent` will get a `this` context of the `clickHandler` object.

## Wrapping up

Binding to events is essential for the modern web, and lit-html has done a great job making them trivial to work with.
