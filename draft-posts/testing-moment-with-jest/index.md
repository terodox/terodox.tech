---
title: "Testing MomentJs with Jest"
comments: true
category: Testing
cover: moment-cover.png
author: Andy Desmarais
---

# Testing MomentJs with Jest

## moment is a function and an object. Uh oh.

The moment js library is incredibly powerful.

The current implementation is unfortunately challenging due to a mix of both method and object properties.

## Spying would be nice, but it's not enough

Trying to spy on moment doesn't work in a lot of cases because the object needs to still have a lot of properties in order to function. Especially if you're using moment-timezone!

## So what do I have to do!?

Use jest.mock to handle the basics. You can even play the game of mocking out the method, but maintining the properties.

example: https://github.com/meltwater/brand-app-assets/blob/a61b2cc73b8ee2745fb7196aa3dadd526012ec23/src/applet-host/index.spec.js#L9

## Testing moment is incredibly challenging at times, but it's doable