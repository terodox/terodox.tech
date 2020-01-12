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

Unlike Angular and React, we are deeply in control of WHEN we re-render. This has both pros and cons, but it's definitely something to keep in mind as we dive deeper.

## Templates vs TemplateResults vs Rendering

Lit-html functions in three basic steps.  The first is to define a Template or TemplateFunction.  This is the markup we want rendered to the DOM with some variables in place, or being passed into the function. This is similar to Angular templates or JSX in React.

## Templates and Template Functions

Templates are based on string literals using the backtick (`) character. The templates are then prefixed with lit-html's html tag. Tagged template literals are widely supported in modern browsers, but Edge is lagging behind. This can be overcome using babel (more on that later).

Here's an example of a simple template:

```javascript
import { html } from 'lit-html';

const name = 'Andy';
const templateResult = html`Hello ${name}`;
```

Templates can also be written as functions. This allows them to be more composable and portable. Template functions are a nice way of encapsulating the functionality for rendering into a single call.

Here's the equivalent template written as a template function:

```javascript
import { html } from 'lit-html';

const name = 'Andy';
const templateFunction = (name) => html`Hello ${name}`;
const templateResult = templateFunction(name);
```

## TemplateResult

A template result is what is returned from the tagged string literal. This is a combination of the template to render as well as the data needed to render it. They are VERY cheap to create and no real work happens until we call the render function.

This means we can have a lot of different templates come together quickly to create a single template result without having a lot of load put on the browser.

## Rendering

This is the work horse of lit-html. The render function takes the TemplateResult and performs the work of rendering everything that has changed to the DOM. This makes the process of updating markup to match state changes trivial.

The actual function take two parameters: the TemplateResult and the DOM element to render into.

Here's a simple example:

```javascript
import { html, render } from 'lit-html';

const templateFunction = (name) => html`<h1>Hello ${name}</h1>`;

render(templateFunction('Andy'), document.body);

render(templateFunction('Joe'), document.body);
```

The resulting markup would flow like this:

```html
<h1>Hello Andy</h1>
```

Then

```html
<h1>Hello Joe</h1>
```

The critical part of this is that the `h1` tag is not removed and re-added. The text of the element is updated and nothing else. This is the power the lit-html is providing us. Diff checking made easy!

## So much more

The power of lit-html doesn't stop with simple DOM diff checks. It can do attribute and property binding, event listener management, and some handy built in functions.

I wanted to keep this intro short, so please check out follow on posts as they're written!

- Attribute and Property Binding
- Event Listeners
- Asynchronous data handling
- Styling with classMap and styleMap
