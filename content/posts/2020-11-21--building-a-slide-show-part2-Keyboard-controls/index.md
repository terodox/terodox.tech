---
title: "Building a slideshow part 2 - Keyboard controls"
comments: true
category: JavaScript
cover: smooth.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Madhu Shesharam](https://unsplash.com/@madhu_shesharam)

In the [last article](/building-a-slide-show-part1-scroll-snap/) we covered the how to keep a single full slide visible as the user is scrolling. Now we need to bring in some basic slide controls.

## Let's start with the basics

To move logically between slides, we first need to establish some semantic markup to make styling this a bit easier.

```html
<main class="slide-container">
  <section class="slide">
    Slide 1
  </section>
  <!-- More slides -->
</main>
```

With this basic html styling our slides in a _snap_.

```css
body {
  margin: 0;
  padding: 0
}

main {
  padding: 0;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

section {
  height: 100vh;
  scroll-snap-align: start;
}
```

This establishes out basic scrolling setup. Now we need to allow some basic user controls for scrolling. We'll be utilizing [`scrollTo()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo), but unfortunately there's no IE11 support for it 😢.

## element.scrollTo()

We need to establish a an event listener to listen to keyboard events in javascript.

```javascript
document.addEventListener('keydown', (event) => {
  /* More to come */
})
```

This listener will be fired every time a key is pressed while the browser is in focus. We want to focus specifically on the arrow keys, and thanks to modern browsers, this is trivial.

```javascript
document.addEventListener('keydown', (event) => {
  if(event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
    /* Previous slide */
  }
  if(event.code === 'ArrowRight' || event.code === 'ArrowDown') {
    /* Next slide */
  }
})
```

Scrolling is the last piece to introduce. Our slide show is occupying the entirety of the users viewport which makes scrolling straight forward. Things we need:

- Current screen height
- Current scroll position of our `main` element

```javascript
const windowHeight = window.innerHeight
const mainElement = document.querySelector('main');
const scrollTop = mainElement.scrollTop;
```

We now have all of the information we need to scroll the browser.

```javascript
document.addEventListener('keydown', (event) => {
  const windowHeight = window.innerHeight
  const mainElement = document.querySelector('main');
  const scrollTop = mainElement.scrollTop;

  if(event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
    mainElement.scrollTo({
      top: scrollTop - windowHeight,
      behavior: 'smooth'
    })
  }
  if(event.code === 'ArrowRight' || event.code === 'ArrowDown') {
    mainElement.scrollTo({
      top: scrollTop + windowHeight,
      behavior: 'smooth'
    })
  }
})
```

The last thing we need to do is make sure we are preventing the browser from scrolling when these keys are pressed, but not for any other keys! It would be bad to prevent a user from zooming because we're trying to control scroll behavior!

```javascript
document.addEventListener('keydown', (event) => {
  const windowHeight = window.innerHeight
  const mainElement = document.querySelector('main');
  const scrollTop = mainElement.scrollTop;

  if(event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
    event.preventDefault()
    event.stopPropagation()
    mainElement.scrollTo({
      top: scrollTop - windowHeight,
      behavior: 'smooth'
    })
  }
  if(event.code === 'ArrowRight' || event.code === 'ArrowDown') {
    event.preventDefault()
    event.stopPropagation()
    mainElement.scrollTo({
      top: scrollTop + windowHeight,
      behavior: 'smooth'
    })
  }
})
```

## Oh no! IE isn't working!!!!!1!11!

IE doesn't have the `.scrollTo()` method available. The simplest answer is to bring in the '.scrollTo()' polyfill. [polyfill.io](https://polyfill.io/v3/) is my goto for making sure even the most legacy of browsers is compatible with the modern web. It will detect the browser based on the user agent and only return the polyfills required for that specific browser. Using the latest chrome? You get an empty function!

## Codepen

All of the code in this post are available in [codepen](https://codepen.io/terodox/pen/yLJdzZK)! Fork it and play around with it!

## Wrapping up

Keyboard controls bring our slide system up to the most basic form of functionality. In the next article of this series, we'll bring in some navigation controls that will let our customers rapidly jump to different slides!
