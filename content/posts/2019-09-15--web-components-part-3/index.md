---
title: "Web Components Part 3 - Slots"
comments: true
category: WebComponents
cover: web-components-part-3-cover.jpg
author: Andy Desmarais
---

Cover photo credit: [Jacqueline Macou](https://pixabay.com/users/jackmac34-483877)

## Before we get started

This article requires a prior knowledge of Web Components. If you are new to web components, please check out [Part 1](/web-components-part-1) of this series.

# What is a slot?

A slot is a new element introduced for use with Web Components. They allow providing content that will be rendered within the [shadow DOM](/web-components-part-1/#shadow-dom) of a Web Component.

Slots are one of the most powerful tools we have to make useful Web Components.

# Why do they matter?

Slots are the primary way for us to build complex Web Components via composition. Breaking down the functionality of a complex object into many small parts has become an important best practice for modern web development.

- How do I get the list of elements into a custom select?
- How can I have a title with an image for a custom section?
- How can I create a nested menu of custom menu items?

These are the type of questions we can answer using the slot tag!

The concept of slots exist across most front-end frameworks:

- Vue - Uses the [slot tag](https://vuejs.org/v2/guide/components-slots.html) in a very similar way to native Web Components
- React - Uses the `props.children` property to [map children down through components](https://reactjs.org/docs/composition-vs-inheritance.html).
- Angular - Calls this process [Content Projection](https://blog.angular-university.io/angular-ng-content/) and uses the `ng-content` tag


# Default vs named slots
# Slot nuances
## Must be top level
## Multiple elements with named vs unnamed slots
# Programmatic access to elements
# Slot change events
