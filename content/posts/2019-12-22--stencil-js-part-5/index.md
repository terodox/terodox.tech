---
title: "StencilJs - Part 4 - @State Decorator"
comments: true
category: WebComponents
cover: state.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Alfred Schrock](https://unsplash.com/@puregeorgia)

This article assumes you have a working knowledge of web components. If you don't, please check out my earlier series on [web components](/web-components-part-1).

It's also building on a [previous article](/stencil-js-part-1), so please check that out too.

## Component State

Many times when writing components we need to store some stateful information that's only relevant to that component. Stencil handles this with the `@State` decorator for properties.

The key concept with `@State` is that it should only be used on properties that will require a rerender if they change. You should avoid using this decorator for anything that does not require the render method to be called again.

There are no options for this decorator.
