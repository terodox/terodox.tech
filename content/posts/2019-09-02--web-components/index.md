---
title: "Web Components Part 1 - What and why"
comments: true
category: WebComponents
cover: webcomponents-cover.jpg
author: Andy Desmarais
---

Cover picture credit: [Pankaj Patel](https://unsplash.com/@pankajpatel)

## What are they?

<img class="right" src="webcomponents.svg" title="Web Components" width="200" style="background-color: #FFF;">

Web Components are a browser native set of technologies designed to bring component level encapsulation of functionality to the web.

That was a long winded way of saying, "the ability to create components without needing a framework."

There are three main pieces that combine to create a WebComponent:

1. Custom Elements
2. Shadow DOM
3. Templates

### Custom Elements

Custom Elements are the way we create new DOM elements. The first requirement is an ES6 class the extends the HTMLElement class.

```javascript
class HelloWorld extend HTMLElement {}
```

Then we need to tell the DOM about this new element class.  This is done using define method on the window.customElements registry.

```javascript
window.customElements.define('hello-word', HelloWorld)
```

In the snippet above, the first parameter is the tag name used in the DOM. There is a requirement that the tag name has '-' in it.  This is to differentiate custom elements from DOM native ones. The second parameter is our class the extends HTMLElement.

Once you've defined that class you can simply put that tag in the DOM and it will work!

```html
<hello-world></hello-world>
```

### Shadow DOM

The Shadow DOM provides us with encapsulation of both our elements and our styles. It provides a sandbox that is not affected by the documents styles. This allows us to style our elements in a very simple manner without having to use tricks like BEM (block-element-modifier) on our CSS to avoid conflicts.

Attaching a shadow DOM to a custom element is very simple. Call the attachShadow method and the element will gain a new property: shadowRoot.

```javascript
class HelloWorld extend HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
}
```

#### Wait a minute. What the heck is "{mode: 'open'}"?

The shadow DOM has two modes.

- open:
  - This allows the newly created shadow root to be accessible from the main document with the javascript API.
  - The shadowRoot property will be populated on the DOM node.
- closed:
  - The shadowRoot property will return null.
  - This is an advanced use case that should be avoided unless you deeply understand the nuances of the shadow DOM.

### Templates

The &lt;template&gt; element is the only element in the DOM that will not be immediately rendered. This means we can store HTML we are intending to use in the future without paying the cost of rendering that markup!  The days of using a &lt;script&gt; tag to hold templates for javascript are gone!

This tag allows us to have a rapid way to clone HTML for populating a new copy of a custom element.

Here's what that looks like in practice:

```javascript
const helloWorldTemplate = document.createElement('template');
helloWorldTemplate.innerHTML = `<h1>Hello World!</h1>`;
document.appendChild(helloWorldTemplate);

class HelloWorld extend HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const templateCopy = document.importNode(helloWorldTemplate, true);
        this.shadowRoot.appendChild(templateCopy);
    }
}
```

The document.importNode method allows us to get a cloned version of the nodes in the template. The second parameter to importNode is a shallow vs deep flag.

- `true` will yield a deep clone of all the nodes in the node tree.
- `false` will only clone the root level of the external node. No child nodes are cloned!

## Why do I care? (WARNING: Opinions ahead)

Web Components are built to be universal. The work across all frameworks, all modern browsers (and even IE11 with polyfills), and won't suffer from the constant churn of a framework.

### Benefits over frameworks

It's just javascript! If you don't need IE11 compatibility you can write native JS again without needing anything on top of it. This beckons back to the early days of the web before massive build pipelines were required to launch a site.

It's stable. The API for web components is not going to change with the next release of Chrome, Firefox, or Safari. The stability of the API means less time spent updating your code just to maintain current functionality.

### Browser native means something

When a new piece of functionality is introduced as a standard to the browser it will not be removed very quickly. This matters a lot when we're writing new code, because it means we won't be writing code that is obsolete in a short period of time. Moreover, we will not have to deal with changes to the API happening at a pace that will force us to refactor existing code to maintain functionality.

Browsers can't just change or removed functionality, because they would risk "breaking the web."

## Part 2 - Lifecycle Callbacks (Coming Soon!)