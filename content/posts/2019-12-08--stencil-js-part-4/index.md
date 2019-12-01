---
title: "StencilJs - Part 4 - @Event and @Listen Decorators"
comments: true
category: WebComponents
cover: listen.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Alphacolor](https://unsplash.com/@duck58cth)

This article assumes you have a working knowledge of web components. If you don't, please check out my earlier series on [web components](/web-components-part-1).

It's also building on a [previous article](/stencil-js-part-1), so please check that out too.

## Firing events

Events are an important part of any web component that is going to take user feedback.  It's the components way to let consumers know that something has happened.

Luckily for us Stencil makes this incredibly easy. The `@Event` property allows us expose an `EventEmitter` that will publish events. The `@Event` decorator takes some options that can help us customize how the event will be published.

The `EventEmitter` is a generic type allowing us to mark it with the data type that will be published. For example, if we want to publish a number in the event we would mark it like this: `EventEmitter<number>`

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Event() numberOfClicks: EventEmitter<number>;
}
```

### Event name

By default the event will be named the same as the variable name. In the example above the event would be named `numberOfClicks`. This is not always desirable, and because of this we have the `eventName` option that can be provided to the `@Event` decorator. It does exactly what it says, sets the name of the published event.

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Event({
    eventName: 'greatEventName'
  }) aTerribleEventNameYouWouldNotWantButMakesSenseInTheCode: EventEmitter<number>;
}
```

### Bubbles

Nope, it's not the name of your favorite pet. `bubbles` controls whether or not the event should bubble through the DOM. It's talked about more thoroughly [on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles).

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Event({
    bubbles: false // defaults to true
  }) anEventThatWillNotBubbleThroughTheDom: EventEmitter<number>;
}
```

### Cancelable

This property is designed to allow events to be cancelled. This really translated to whether or not you can use `event.preventDefault()` or not. More reading [on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable) if you're interested.

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Event({
    cancelable: false // defaults to true
  }) anEventThatCannotBeCancelled: EventEmitter<number>;
}
```

### Composed

This is one of the cooler new properties for events. Setting the `composed` option to false will prevent the emitted event from crossing the shadow DOM boundary. It's a powerful way to write components that have a heavy reliance on events internally, but don't want those events exposed to consumers. Once again, more reading [on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) if you're interested.

Quick example:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {
  @Event({
    composed: false // defaults to true
  }) willNotEscapedShadowRoot: EventEmitter<number>;
}
```

## `@Listen` decorator

Emitting events isn't helpful if we can't respond to them in a reasonable way. Stencil handles this via the `@Listen` decorator.
