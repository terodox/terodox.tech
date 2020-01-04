---
title: "CSS - position: sticky"
comments: true
category: CSS
cover: sticky.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Mae Mu](https://unsplash.com/@picoftasty)

At some point in your career as a web developer you will be asked to "just make it stay at the top while they scroll." This has been something javascript has solved for us in past, but no more! `position: sticky` to the rescue!

# Just make it stay at the top

`position: sticky` is the answer to solving this problem, but how does it work?

Basically, an element with `position: sticky` is treated like `position: relative` until the block that contains it crosses a specific threshold. This is usually done by setting either `top` or `left` to a specific value at which point it "sticks" in that position.

That might look something like this:

<style>
.stick-header-example {
  width: 200px;
  height: 200px;
  overflow-y: auto;
  border: 1px solid #333;
}
.sticky-header {
  position: sticky;
  background-color: #EEE;
  padding: 4px;
  top: 0;
}
</style>
<div class="stick-header-example">
  <p> This paragraph will disappear before the sticky header below "sticks" to the top! </p>
  <div class="sticky-header">
    This is a sticky header
  </div>
  <p> This paragraph will continue to scroll underneath the header, because stick headers are AMAZING! </p>
  <p> Another paragraph just to have content to scroll underneath our header, </p>
</div>

If you scroll the container you'll notice that the header sticks to the top as soon as it hits.

Here's what the code looks like:

```html
<style>
.stick-header-example {
  width: 200px;
  height: 200px;
  overflow-y: auto;
  border: 1px solid #333;
}
.sticky-header {
  position: sticky;
  background-color: #EEE;
  padding: 4px;
  top: 0;
}
</style>
<div class="stick-header-example">
  <p> This paragraph will disappear before the sticky header below "sticks" to the top! </p>
  <div class="sticky-header">
    This is a sticky header
  </div>
  <p> This paragraph will continue to scroll underneath the header, because stick headers are AMAZING! </p>
  <p> Another paragraph just to have content to scroll underneath our header, </p>
</div>
```

Just settings `position: sticky` and `top: 0` create the behavior you're seeing. That's it!

# Stacking sticky headers

Let's look at a more complex example now.
