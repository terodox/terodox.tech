---
title: "How to tell if an element is in the DOM (Including the Shadow DOM)"
comments: true
category: JavaScript
cover: random-html.jpg
author: Andy Desmarais
---

Cover picture credit: [Sai Kiran Anagani](https://unsplash.com/@_imkiran)

## What element lurks in hearts of documents... The shadow DOM doesn't know

So I ran into a scenario where I need to know if a dom element was still attached to the DOM.  This seems like a trivial problem at first, but then I needed it to be IE11 compatible AND handle elements in the shadow DOM (with the shady dom polyfill). EEEEEEEEEEEK!

## TL;DR Iterate up the node tree!

The basic solution is to iterate up the through each parentNode. The caveat is the shadow DOM.  If we discover that a parent node is actually a DocumentFragment, then we'll need to look to the host property to continue our traversal. The _scary_ details are below if you're interested!

```javascript
function isInDocument(element) {
    var currentElement = element;
    while(currentElement && currentElement.parentNode) {
        if(currentElement.parentNode === document) {
            return true;
        } else if(DocumentFragment && currentElement.parentNode instanceof DocumentFragment) {
            currentElement = currentElement.parentNode.host;
        } else {
            currentElement = currentElement.parentNode;
        }
    }
    return false;
}
```

## parentNode not parentElement

This same technique can't be accomplished with parentElement because the shadow DOM host is not an element. That means we traverse using the very similar, but not the same, parentNode.

## What the heck is a DocumentFragment?

The shadowRoot host uses a DocumentFragment to hold its children. There are several reasons for this. Checkout the description of from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment):

>The DocumentFragment interface represents a minimal document object that has no parent. It is used as a light-weight version of Document to store a segment of a document structure comprised of nodes just like a standard document. The key difference is that because the document fragment isn't part of the actual DOM's structure, changes made to the fragment don't affect the document, cause reflow, or incur any performance impact that can occur when changes are made.

The shadowRoot takes advantage of the fact that it's not _actually_ in the DOM to completely encapsulate itself. This allows for scoping of style rules and events.

## Ok, but I can't use this if it's not fast...

You can check out the [JS Perf](https://jsperf.com/isindocument/4) I put together to validate this.

Even at its slowest (1,064,226 ops/sec) it's only taking about .9µs (microseconds) to complete a run for a very shallow element.  This performs plenty fast for my needs!
