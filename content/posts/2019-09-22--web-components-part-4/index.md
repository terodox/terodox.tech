---
title: "Web Components Part 4 - Best practices for the sane front-ender"
comments: true
category: WebComponents
cover: web-components-part-4-cover.jpg
author: Andy Desmarais
---

Cover photo credit: [Christian Wiediger](https://unsplash.com/@christianw)

## Before we get started

This article requires a prior knowledge of Web Components. If you are new to web components, please check out [Part 1](/web-components-part-1) of this series.

## Keep it simple

<img class="right" src="webcomponents.svg" title="Web Components" width="200" style="background-color: #FFF; float: right;">

The goal with web components is to keep things simple. However, working with web components in the real world can get messy if we don't take some precautions. Things like available attributes and tag names are manageable when there's only a handful of tags, but gets much more complex at the enterprise level with 100s of potential tags and 1000s of potential attributes.

The goal of this article is to set out some best practices that have made my time working with web components a much more manageable experience. Specifically we'll focus on:

- [Class static getter for tag Name](#class-static-getter-for-tag-name)
- [Class getter for attributes](#class-getter-for-attributes)
- [Using string literals for templates](#string-literals-for-templates)

### Class static getter for tag name

Web components are, by requirement, a class. We can take advantage of that fact to create a `tagName` static getter. This will allow consumers to have programmatic access to the tag's name when building templates.

```javascript
export class StyledList extends HTMLElement {
    static get tagName() {
        return 'styled-list';
    }
    //...
}
```

The `tagName` static property has two immediate benefits. First, we can use it when defining the custom element:

```javascript
customElements.define(StyleList.tagName, StyledList);
```

The second advantage is for the tag's consumers. When they are building out their markup, they can now take advantage of the `tagName`:

```javascript
import { StyledList } from '../styled-list';

class App extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <${StyledList.tagName}></${StyledList.tagName}>
        `;
    }
}
```

This seems like a very small win. It is until you find a tag name collision and need to change a components tag name. Then it can be a bit of a nightmare. Especially in the case where you are shipping a reusable web component intended for outside usage. If this practice is followed by both producers and consumers of web components then a tag name change becomes a non-event!

### Class getter for attributes

A tag can only be minimally useful without the ability to pass it information. Attributes are the only way to pass information to a component in HTML. This makes them a critical part of working with web components.

The critical nature of attributes makes it equally critical to provide a simple way to work with them. The approach I've found to be most helpful is to have a static property defining all of the properties.

```javascript
export class StyledList extends HTMLElement {
    static get attributes() {
        return {
            enabled: 'enabled',
            maxItemCount: 'maxItemCount',
        };
    }
    //...
}
```

This practice also yields a few immediate benefits. The first is that it works well with setting up our `observedAttributes` getter:

```javascript
export class StyledList extends HTMLElement {
    static get attributes() {
        return {
            enabled: 'enabled',
            maxItemCount: 'maxItemCount',
        };
    }

    get observedAttributes() {
        return Object.values(StyledList.attributes);
    }
    //...
}
```

Wondering why I choose camel case for attributes? [Check this out.](https://github.com/GoogleWebComponents/style-guide#attributes)

It also helps a lot when setting up `attributeChangedCallback`:

```javascript
export class StyledList extends HTMLElement {
    static get attributes() {
        return {
            enabled: 'enabled',
            maxItemCount: 'maxItemCount',
        };
    }

    get observedAttributes() {
        return Object.values(StyledList.attributes);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === StyledList.attributes.enabled) {
            // Do some work
        } else if(name === StyledList.attributes.maxItemCount) {
            // Do some work
        }
    }
    //...
}
```

Let's not minimize the beauty in our ability to stay in sync between our `observedAttributes` and the `attributeChangedCallback`. We no longer have to worry about potential drift in magic strings that couple these two items together!

But we're not done yet! Another advantage is that consumers now have access to them when creating their markup:

```javascript
import { StyledList } from '../styled-list';

class App extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <${StyledList.tagName}
                ${StyledList.attributes.enabled}
                ${StyledList.attributes.maxItemCount}="10"
            ></${StyledList.tagName}>
        `;
    }
}
```

## String literals for templates

This one can be considered controversial. I prefer use of string literals over the use of the &lt;template&gt; element. I base this decision on [some performance testing](https://jsperf.com/template-element-vs-string-literal/1) I did comparing use of template strings to the &lt;template&gt; for initial load. The performance is either so similar it wouldn't matter, or so fast it would matter.

The biggest reason I find using string literals beneficial is updating elements with runtime values. I don't have to run any query selectors to find the element I'm looking for.

The basics of this idea are to simply avoid using the template element in favor of an inline string template that interpolates in the necessary values. This was demonstrated in the examples above when building the `App` component.

**NOTE:** This is a best practice for initial loads only! DO NOT REPLACE THE ENTIRE HTML WITH EVERY UPDATE! You will find yourself in performance pain if you are updating the entire html element with each update.
