---
title: "Web Components Part 5 - Styling the shadow DOM, including slotted content"
comments: true
category: WebComponents
cover: web-components-part-5-cover.jpg
author: Andy Desmarais
---

Cover photo credit: [George Pagan III](https://unsplash.com/@gpthree)

## Before we get started

This article requires a prior knowledge of Web Components. If you are new to web components, please check out [Part 1](/web-components-part-1) of this series.

## CSS and the Shadow DOM

<img class="right" src="webcomponents.svg" title="Web Components" width="200" style="background-color: #FFF; float: right;">

Using the shadow DOM introduces a new way of thinking about styling content. The isolation of styles is both a blessing and a curse. We will have much simpler styles to achieve our desired look, but we will lose a lot of control over any slotted content. In this post, I'll do my best to give some guidance on how to best use the new psuedo selectors, and where the dark alleys are.

Major topics covered:

- What does style isolation really mean?
- CSS variables break the boundary
- Re-using styles
- :host psuedo selector
- ::slotted psuedo seector
- The dark alley (styling slotted content)

## What does style isolation really mean?

When we use the shadow DOM we are creating a separate DOM from the main DOM. This means the style tags from the main DOM will not affect elements in the shadow DOM. This, in turn, means we need to have our style tags inside the shadow DOM for them to affect our tags.

```javascript
export class StyledHeader extends HTMLElement {
    constructor() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            h1 {
                color: blue;
            }
        </style>
        <h1>I am styled from the shadow DOM</h1>
        `;
    }
}
```

The example above is all it takes to create a simple component with isolated styles. The `color: blue` will not affect any other **h1** tags in light DOM because we have isolated the style tag inside the shadow DOM.

### Ok. So what about styles from the light DOM?

Styles in the light DOM do not make it into the shadow DOM because it is a completely separate DOM. The shadow DOM is isolated from the main DOMs styles with a few small exceptions we'll get into next.

Look at the example below using our StyledHeader from earlier:

```html
<style>
    h1 {
        color: red;
    }
</style>
<styled-header></styled-header>
```

What color is the **h1** tag from the `<styled-header>`? Think about it before scrolling down.

.

..

...

....

.....

...... Got it?

It's still blue! The style from the light DOM will not make it into the isolated shadow DOM!
