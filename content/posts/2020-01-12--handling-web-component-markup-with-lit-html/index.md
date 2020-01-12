---
title: "Handling Web Component markup with Lit HTML"
comments: true
category: WebComponents
cover: template.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Tim Arterbury](https://unsplash.com/@tim_arterbury)

The power of web components is that we don't have to rely on a framework. We can avoid framework fatigue from constant changes and updates. This has been a cornerstone to why I personally go as native as possible with web components as possible. However, as with all things, there is a time and a place to introduce tooling.

The best example I can give for this is managing the display of a user selectable set of items. Managing the state of the DOM as the user is adding, removing, updating items can be a very involved task. Especially if we are trying to avoid removing/adding elements as much as possible.

This is the pain that drove me to explore tooling for handling html updates in web components. I came across [lit-html](https://lit-html.polymer-project.org/guide) while trying to find a solution for better handling DOM diffing that didn't involve having to keep track of every element myself. For 17 kb gzipped I now have all of the power a traditional framework would provide me, while limiting it's scope of influence purely to my markup!

## Quick introduction to lit-html

Ok, so what the heck IS lit-html?

> "lit-html lets you write HTML templates in JavaScript using template literals with embedded JavaScript expressions. lit-html identifies the static and dynamic parts of your templates so it can efficiently update just the changed portions." - from the [lit-html site](https://lit-html.polymer-project.org/guide)

This means that we can write templates similar to Angular and React, and get the benefits of only changing the parts of the DOM affected by a re-render.


