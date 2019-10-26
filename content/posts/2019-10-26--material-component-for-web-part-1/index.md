---
title: "Material Components for Web - Part 1 - The basics"
comments: true
category: Rant
cover: blocks.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Iker Urteaga](https://unsplash.com/@iurte)

If you working with design on the web, then chances are very high you've heard of [Google's Material Design System](https://material.io/). This design system has evolved over the years, and gone through at least two major iterations. There are libraries available for all of the major framework. [Vue](https://vuematerial.io/). [React](https://material-ui.com/). Of course [Angular](https://material.angular.io/). But what about just html, css and javascript?

[Material components for web](https://material.io/develop/web/) are the answer to a native approach to build components based on the material design system. They provide the necessary building blocks to build custom components that look, feel and act like material components without requiring a framework.

## Minimal build tooling

Now I wish it were possible to use them without any build tooling at all, but unfortunately that's not the case.

Material components for web rely on Sass for all of their styles, and es6 style imports for their Javascript. This means you will need a Sass and Js compiler at minimum to work with them.

## The basics

Bringing up [the docs for a button](https://material.io/develop/web/components/buttons/) you'll immediately notice that they've done a pretty good job of breaking down the standard use case.

```html
<button class="mdc-button">
  <span class="mdc-button__label">Button</span>
</button>
```

```sass
@import "@material/button/mdc-button";
```

The html is semantically driven with a button tag being the root of our work. The css classes are intuitively named for the tags required to make our button.

There are a handful of additional styles we can apply to change the look and feel of the button.  Want a button with some elevation? Add the `mdc-button--raised` class to the button element. An outlined button is good for some scenarios, so add the `mdc-button--outlined` class for that.

Ok, but what about the iconic ripple the material design buttons are known for? This is where we need to bring in a sprinkling of javascript.

```js
import {MDCRipple} from '@material/ripple';

const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
```

The basics here are that we grab the button element using `document.querySelector` so that we can decorate it with the MDCRipple class. This will result in the mouse following ripple showing up on mouse click.

## More advanced usage

This has been a really simple example of how to work with the material components for web. In future posts I plan to cover more advanced topics like setting up build tools, theming, advanced styling, and building web components to wrap them.
