---
title: "Resize Observer"
comments: true
category: JavaScript
cover: tomatoes.jpg
author: Andy Desmarais
---

###### Cover photo credit: [amirali mirhashemian](https://unsplash.com/@amir_v_ali)

In general I like to keep all of my layout control in CSS. It's where stylistic controls belong. As with every rule, once we understand the reasons for it, we can begin to understand when to break it. This definitely applies to layout controls in CSS. Occasionally we will run into situations where the controls CSS provide simply aren't enough, and when that happens we need to look for new tools.

My hope with this article is to give a general overview of the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver), and how to use it most effectively.

## Controlling the uncontrollable

Responsive design is a fundamental building block of any web application these days. We need to handle a wide variety of screen sizes, especially mobile. With that in mind we need to have similar controls to those offered by `@media` queries in CSS, but at the element level. Moreover we need to control elements that may not be easily styled by CSS, a chart for example. Rendering the same chart on a mobile device and on an ultra wide screen 4k+ monitor will require much different settings for things like labels and legends.

## The basics

The [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) is a browser API that offers the ability to watch one or more elements and take an action when their container changes size.

The constructor takes a single parameter of a `callback` that will be invoked with an array of [ResizeObserverEntries](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry) each time any observed element's container changes size. This means if we have are observing 3 elements and only 1 changes dimensions, the array will only contain the 1 element that changed. Each entry has information about the element that is being observed:

- borderBoxSize
- contentBoxSize
- devicePixelContentBoxSize
- contentRect
- target

Each of the `size` properties are represented as a [ResizeObserverSize](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverSize). The two properties on this object are `blockSize` and `inlineSize`. There's some nuance to what these properties mean, but for the vast majority of use cases `blockSize` will correspond to the elements height, and `inlineSize` will correspond to the elements width.

You can read more about each of the ResizeObserverEntry properties through [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry).

## Performance

One of the biggest concerns we have when executing any javascript with a browser event is ensuring that we maintain a high level of performance. We don't want a lot of jitter being introduced simply because we are resizing an element.

The nice part of the ResizeObserver is that its execution is directly tied to the paint cycle.

> Implementations should, if they follow the specification, invoke resize events before paint and after layout. - [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)

Knowing that it will fire between the layout and paint steps in the redraw flow tells us that the maximum number of times our ResizeObserver callback can be invoked it 60 times per second, as that is the maximum redraw rate for current browsers. This means that any javascript in our ResizeObserver needs to be able execute and complete in less than 16.7 milliseconds. If we are exceeding that time, we'll begin to drop frames as the browser compensates for our codes execution.

We can handle code that takes longer than 16.7ms in a few different ways.

### Classic debounce

```javascript
const DEBOUNCE_TIME_IN_MS = 100;
let timerId;
new ResizeObserver(entries => {
  clearTimeout(timerId);
  timerId = setTimeout(
    () => { /* Some code to execute */},
    DEBOUNCE_TIME_IN_MS);
});
```

The code above will ensure that we are not running our code on every frame and instead wait for there to be a 100ms gap in changes before redrawing. This is somewhat less than ideal though because it means our content isn't appropriately adjust as the container is changing size.

### Execution skips

We can also force our system to skip executions if they are happening too close together. This allows our redraw rate to stay higher even if out execution is taking longer than 16.7ms.

```javascript
const functionToExecute = (entries) => { /* Some code to execute */ };

let startTime = 0;
let timerId;
const resizeObserver = new ResizeObserver(entries => {
  currentTime = (new Date()).valueOf();
  console.log(startTime, currentTime);
  if(currentTime - startTime > 100) {
    startTime = currentTime;
    functionToExecute(entries);
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => functionToExecute(entries), 101); // Ensure we execute after the last call even if it was too close to the previous invocation
});
```

This technique allows our code to execute even if the browser is calling it more often than we would like. We can execute every 100ms, and ensure that we do a final execution 100ms after the last resize occurs. This gives some level of responsiveness to the browser while ensuring we are not causing too much jitter.

### Long updates mean ghosting

When we have an update that can take much longer (a full second 😱), then we should consider ghosting the element that is changing instead of attempting to redraw it as the element is changing size. This can give a much smoother transition for the user, and avoid jitter altogether. Here's an example of how we can accomplish that:

<iframe height="350" style="width: 100%;" scrolling="no" title="ResizeObserver - Ghosting" src="https://codepen.io/terodox/embed/preview/NWwqQgb?default-tab=result&theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/terodox/pen/NWwqQgb">
  ResizeObserver - Ghosting</a> by Andy Desmarais (<a href="https://codepen.io/terodox">@terodox</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Here's the code just in case:

```javascript
let timerId;
let isFirst = true;
const elementToObserve = document.querySelector('.changing-size');
const resizeObserver = new ResizeObserver(entries => {
  if(isFirst) {
    isFirst = false;
    elementToObserve.classList.add('resizing');
  }
  clearTimeout(timerId);
  timerId = setTimeout(() => {
    isFirst = true;
    elementToObserve.classList.remove('resizing');
  }, 200);
});
resizeObserver.observe(elementToObserve);
```

The `resizing` class will hide all child elements and set the background to a flat color while the element resizes. This means we'll add the `resizing` class on our first sign of resizing and remove it 200ms after our last resize callback.

## Wrapping up

I hope this has helped give a quick understanding of the resize observer and a handful of different techniques for handling performance concerns. It's a really useful tool to have available when resizing is not something that is easily handled through CSS.
