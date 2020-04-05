---
title: "The 1, 2, n pattern"
comments: true
category: JavaScript
cover: canning-line.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Evan Dvorkin](https://unsplash.com/@evphotocinema)

When do we create an abstraction? It's an interesting question that has many different potential answers. I want to present to you a pattern that I've used very successfully throughout my software engineering career that answers this question.

## 1, 2, n pattern

The philosophy behind this pattern is that early abstractions are bad abstractions.

We don't want to create an abstraction with our first use case because we will inevitably miss a critical use that will fundamentally shift how our code functions.

We also don't want to create an abstraction too late, because then we have copied and pasted code all over the code base that will rot and fall out of sync over time.

With that in mind, here's the pattern:

> When the code you are writing already exists in two places, and you are writing (or copying) it for a third time, that is generally the right time to abstract that code into a reusable module.

The main point is that with more information, we can make a more educated decision about what the abstraction should be.

## Try it

Using the 1, 2, n pattern might feel weird at first. I have watched engineers have small breakdowns when I suggest they leave the same function in multiple places. "But that's not DRY!?" My response is generally the same to all of them, the maintenance for two function is very small compared to a bad abstraction that can grown into a monster very quickly.
