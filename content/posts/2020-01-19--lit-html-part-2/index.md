---
title: "lit-html Part 2 - Working with properties and attributes"
comments: true
category: WebComponents
cover: books.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Patrick Tomasso](https://unsplash.com/@impatrickt)

[In my last post](/handling-web-component-markup-with-lit-html/) I covered the basics of lit-html. If you haven't read it yet, some of this post will probably not make sense.

In this post I want to cover handling attributes and properties with lit-html. They are both a critical part of working with web components, and html in general.

## Attributes

Binding to attributes with lit-html is reasonably straight forward. It's very similar to how you would do it with a simple template string literal. The only real difference is that you drop the `"`s from around the value.

Here's a quick comparison:

```javascript
const { html } from 'lit-html';

const value = 'The greatest value ever';
const simpleTemplateLiteral = `<input type="text" value="${value}" />`;

const boundWithLitHtml = html`<input type="text" value=${value} />`;
```

It really is that simple. Because all attributes must be strings, the value we're binding to the attribute must be able to convert to a string. The only exception here are boolean type attributes.

Boolean values are are a little trickier. There are occasions where we need to add or omit an empty attribute. A simple example of this would be disabling a button.

```html
<button disabled>Disabled Button</button>
<button>Enabled Button</button>
```

We don't want to bind a value of the string `true` or `false`, but we do need to indicate that this attribute should be omitted or added.

lit-html uses a `?` to indicate a boolean attribute. This syntax will allow lit-html to treat the attribute properly and omit it when it's not needed.

```javascript
const { html } from 'lit-html';

const templateFunction = (disabled) => html`<button ?disabled=${disabled}>Super Button</button>`;
```

If you pass in true and render, you'll get:

```html
<button disabled>Super Button</button>
```

Pass in false:

```html
<button>Super Button</button>
```

Now we can handle all values that convert to either strings or booleans, but what about complex types that can't be handled by an attribute? That's where we need to start using properties.

## Properties
