---
title: "My challenges with functional programming in Javascript"
comments: true
category: JavaScript
cover: frustration.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Christian Erfurt](https://unsplash.com/@christnerfurt)

WARNING: This is a rant. I am semi-new to functional programming, and my opinion is bound to change as I learn more. Who knows if it will get better, or worse...

## WTF IS THIS!?

I was looking at a new codebase I needed to familiarize myself with when I came across this block of code (The names and faces of this code have been changed to protect the innocent):

```javascript
export const createWidgetFactory = ({
  parser
}) => ({
  configurationRequests,
  widgetMaker
}) => async (event, context) => {
  const ctx = createCtx(event, context)
  const config = await getConfig(configurationRequests, ctx)
  return widgetMaker(event, context)
}
```

I read this over a few times, and began to immediately question my sanity. It's a function that returns a function which creates a function that does some work.

![wat](wat.gif)

Now after looking through the code where this is used I can find a reasonably logical separation of concerns. The first portion of the function chain is grabbing "pure functions". The function returned is then passed other functions that have side effects. The third function is then doing the work based on the closure provided by the first two functions. That was a mouthful.

I can reason about how the function works now, but it becomes a but of a slog to figure out where in the code base each of these layers of function are used.

There is no uniquely identifiable way to understand where each layer of this function factory is used, and this is the crux of my current frustration with Function Programming.

## Code discoverability and maintainability

I read an interesting article by [Jamie Wong call _"The Grep Test"_](http://jamie-wong.com/2013/07/12/grep-test/) (link is insecure 🤷). The article discusses the dynamic creation of code and how it leads to the inability to grep a codebase and find the uses of a given function/class/construct.

This concept echoed in my brain as I was reading/trying to understand the code above. How can I logically find all of the uses of the third tier of function in this codebase?

The only methodology I could think of is to effectively walk the code base from where the initial function is being invoked, and find where/how the returned functions are being used.

To me this is extremely challenging and, for a newcomer to the codebase, frustrating.

## Code readability

The idea of code readability is paramount to the long term maintainability of any code base. Programming is a social activity. We should always write code intending for it to be read by someone else without the context we have while writing it.

I struggled with the factory function of factory function for this reason. I couldn't rapidly understand where and how this code was being used within the code base.

## Solutions

Honestly I'm still struggling here. How can this be boiled down into a more maintainable set of functionality?

Here's a list of my _"bad ideas"_:

- Take all of the parameters in the second function to eliminate the first.
  - Pro: At minimum eliminates one of the nested functions
  - Con: Ultimately doesn't solve the problem of how to find the inner functions uses.

```javascript
export const createWidget => ({
  parser
  configurationRequests,
  widgetMaker
}) => async (event, context) => {
  const ctx = createCtx(event, context)
  const config = await getConfig(configurationRequests, ctx)
  return widgetMaker(event, context)
}
```

- Move to a class based system.
  - Pro: Code is now fully discoverable based on the name of the method in the class. I can grep for `createWidet` and find it everywhere it's used
  - Con: I've introduced state into the code. In general can cause some headaches with making sure we clean up after ourselves.

```javascript
export class WidgetMaker {
  constructor ({
    parser
    configurationRequests,
    widgetMaker
  }) {
    this.parser = parser
    this.configurationRequests = configurationRequests
    this.widgetMaker = widgetMaker
  }

  async createWidet(event, context) {
    const ctx = createCtx(event, context)
    const config = await getConfig(configurationRequests, ctx)
    return widgetMaker(event, context)
  }
}
```

## Wrapping up

As a developer I want to have code I can read whenever I enter a code base. The goal for me is to gain a rapid understanding of the code base as quickly as possible so I can begin contributing.

I'm still not positive the best way to unravel this, but what I do know is that I need to figure it out 😜. Look for a follow up.
