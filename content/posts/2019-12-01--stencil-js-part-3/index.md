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

`@Prop` is a bit of s misnomer. It's not only a `property` but it also represents, and can reflect an `attribute` on the tag of our component.

### Immutability

The first major note is the all class properties decorated with `@Prop` are immutable by default. This is good basic practice to ensure a more one-way binding approach is being taken.

However, there are exceptions to
