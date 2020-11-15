---
title: "Building a slideshow part 1 - scroll-snap"
comments: true
category: JavaScript
cover: presentation.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Teemu Paananen](https://unsplash.com/@xteemu)

One of the things I've been wanting to do for a while is to play with [CSS scroll-snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap). There are a lot of practical applications for using scroll-snap. Image carousel, sectioning out a blog, and our focus for today, slideshows!

## How exactly does one snap a scroll?

Scroll-snap is designed to create a set of scroll positions within a scroll container. This really means that within a scrollable container we can control how the internal elements land while the user is scrolling.

An example is usually the quickest way to demonstrate this behavior.

<iframe height="345" style="width: 100%;" scrolling="no" title="Basic Scroll Snap" src="https://codepen.io/terodox/embed/preview/YzWBYJy?height=345&theme-id=dark&default-tab=css,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/terodox/pen/YzWBYJy'>Basic Scroll Snap</a> by Andy Desmarais
  (<a href='https://codepen.io/terodox'>@terodox</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

There are 3 important CSS rules to notice:

- overflow-y: scroll;
- scroll-snap-type: y mandatory;
- scroll-snap-align: start;

The `ul` is given a fixed height with an `overflow-y` of `scroll`. This basically sets up a scrollable container for all of the `li` tags within. Then we tell the scrollable container to set `scroll-snap-type` to `y mandatory`, dictating that we want the children to snap as the container is scrolled in the `y` direction. The last step is to tell the child elements how to snap. `scroll-snap-align` is the rule that tells the `li` tags to align the `start` of their elements with the top of container.

## scroll-snap-type

There are a few different snapping behaviors we can achieve. The first we already demonstrated: `mandatory`. Using `mandatory` forces the child elements to snap no matter where the user is in their scrolling process. The other option here is `proximity` which allows scrolling to happen normally, and only if the user stops scrolling _near_ the snap point will it snap to the top.

Here's a side by side to play around with:

<iframe height="344" style="width: 100%;" scrolling="no" title="Scroll Snap - Proximity vs Mandatory" src="https://codepen.io/terodox/embed/preview/yLJZpwq?height=344&theme-id=dark&default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/terodox/pen/yLJZpwq'>Scroll Snap - Proximity vs Mandatory</a> by Andy Desmarais
  (<a href='https://codepen.io/terodox'>@terodox</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## scroll-snap-align

Controlling which part of the child items aligns with the container is an important part of using scroll-snap. [`scroll-snap-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align) has only 4 values, and they are reasonably self explanatory:

- none
- start
- end
- center

The basic idea is that you are choosing which part of the child element is going to be aligned to the container.

## What's next?

Now that we can create a scrollable container to hold all of our slide that will snap to show a whole slide at a time, in the next article we can look at how to scroll it programmatically using just a small amount of javascript.
