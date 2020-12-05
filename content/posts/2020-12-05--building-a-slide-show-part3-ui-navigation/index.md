---
title: "Building a slideshow part 3 - UI Navigation"
comments: true
category: JavaScript
cover: uicontrols.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Ethan Eddins](https://unsplash.com/@ethaneddins)

In [this series](https://terodox.tech/building-a-slide-show-part1-scroll-snap/) we're looking at how to create a slideshow on the modern web. So far we've covered [snapping slides](https://terodox.tech/building-a-slide-show-part1-scroll-snap/) and keyboard controls. In this article we're going to bring in some navigation controls!

## Unobtrusive UI

The goal with any user interface in a slideshow is to get out of the way. We want the focus to be on the slide and not the UI to move between slides.

With this in mind, here's our goal:

<iframe height="265" style="width: 100%;" scrolling="no" title="Slide Show W/ UI" src="https://codepen.io/terodox/embed/preview/KKgzMpr?height=265&theme-id=dark&default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/terodox/pen/KKgzMpr'>Slide Show W/ UI</a> by Andy Desmarais
  (<a href='https://codepen.io/terodox'>@terodox</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

That's it, a very simple next and previous setup.

So how're we going to accomplish this?

## Let's start with the UI

Semantic HTML is important. So for today's use case we're going to use the `<nav>` element. This will have benefits for our consumers using screen readers. The nav will be automatically skipped when the screen reader does it's first pass.

Here's our basic markup:

```html
<nav>
  <span id="prev-slide">&lt;</span>
  <span id="next-slide">&gt;</span>
</nav>
```

This gives use a left arrow and a right arrow. If you're adding this to our work from the last article you'll notice that you can't see anything yet. That's because our nav is at the bottom of all of our slide!

## Static content

We want this nav to be at the bottom no matter which slide we're on.  This is accomplished by using the css property and value: `position: fixed`. This tells the browser that we want the content to be in the position we dictate no matter where we have scrolled in the page.

We'll need a few other properties set to make it work properly:

```css
nav {
  /* Set nav to be fixed at bottom of page */
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;

  /* Center Content */
  display: flex;
  justify-content: center;
}

nav span {
  /* A little whitespace to please the eye */
  padding: 8px;
  /* Give a clear indication that these can be clicked */
  cursor: pointer;
}
```

With these updates we should now have a couple of small unobtrusive arrows at the bottom center of our slide, but now we need to wire them up!

## Building on our previous success

In the last article we built some keyboard controls that allowed us to move to the next and previous slides. Here's that code:

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

Let's refactor this into something more reusable!

## Refactoring

Our goal with this refactor is to have two functions: one for next slide and one for previous slide.

Let's start by moving the shared code to its own function.

```javascript
const getCurrentState() {
  const windowHeight = window.innerHeight
  const mainElement = document.querySelector('main');
  const scrollTop = mainElement.scrollTop;

  return { mainElement, scrollTop, windowHeight };
}
```

Now we can move the `ArrowUp` and `ArrowLeft` code to a function called `prevSlide()`.

```javascript
function prevSlide(event) {
  const { mainElement, scrollTop, windowHeight } = getCurrentState();

  event.preventDefault()
  event.stopPropagation()
  mainElement.scrollTo({
    top: scrollTop - windowHeight,
    behavior: 'smooth'
  })
}
```

And do the same for `ArrowDown` and `ArrowRight`, but call it `nextSlide()`.

```javascript
function nextSlide(event) {
  const { mainElement, scrollTop, windowHeight } = getCurrentState();

  event.preventDefault()
  event.stopPropagation()
  mainElement.scrollTo({
    top: scrollTop + windowHeight,
    behavior: 'smooth'
  })
}
```

This leaves our previous code refactored to look like this:

```javascript
function getCurrentState() {
    const windowHeight = window.innerHeight
  const mainElement = document.querySelector('main');
  const scrollTop = mainElement.scrollTop;

  return { mainElement, scrollTop, windowHeight };
}

function nextSlide(event) {
  const { mainElement, scrollTop, windowHeight } = getCurrentState();
  event.preventDefault()
  event.stopPropagation()
  mainElement.scrollTo({
    top: scrollTop + windowHeight,
    behavior: 'smooth'
  })
}

function prevSlide(event) {
  const { mainElement, scrollTop, windowHeight } = getCurrentState();
  event.preventDefault()
  event.stopPropagation()
  mainElement.scrollTo({
    top: scrollTop - windowHeight,
    behavior: 'smooth'
  })
}

document.addEventListener('keydown', (event) => {
  if(event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
    prevSlide(event);
  }
  if(event.code === 'ArrowRight' || event.code === 'ArrowDown') {
    nextSlide(event);
  }
})
```

The event listener function is now very simple. Depending on the arrow key pushed, we either go to the previous slide or the next slide.

This sets us up nicely to wire up our new navigation controls!

## Navigate

Since we've setup our navigation to have ids, the process of wiring them up is now very straight forward.

```javascript
document.getElementById('prev-slide').addEventListener('click', prevSlide)
document.getElementById('next-slide').addEventListener('click', nextSlide)
```

That's it! All of the code we refactored for reusability gave us exactly what we needed to have a very simple event listener!

## Wrapping up

We've covered a fair amount of ground in these three articles. Scroll snap, `scrollTo`, and some good ol' refactoring!

I hope you enjoyed this small series, and feel free to hit me up on social media if you have any questions! I'm `@terodox` pretty much everywhere.
