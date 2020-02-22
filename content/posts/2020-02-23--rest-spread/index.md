---
title: "ES6 Syntax - Array and Object Rest/Spread"
comments: true
category: Javascript
cover: spread.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Jessy Smith](https://unsplash.com/@jessysmith)

The ever progressing ECMA Script standard has brought a lot of awesome new syntax to Javascript. Today I want to focus on a specific part, the `...` operator. This is called the "Rest/Spread" operator. It's hugely powerful, and makes both writing and reading code a lot easier for its use cases.

## Array Composition

The "Spread" portion of the Rest/Spread operator can help us here. Very similar to how `.concat` functions you can use `...` to spread each array into a new array.

```javascript
const array1 = [ 1, 2, 3 ];
const array2 = [ 4, 5, 6 ];
const array3 = [ 7, 8, 9 ];

const spreadArray = [
  ...array1,
  ...array2,
  ...array3
];

const concatArray = array1.concat(array2, array3);

console.log(spreadArray);
// Will log [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
console.log(concatArray);
// Will also log [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
```

## Array - Get First Elements

Let's say you need tp pull the first three elements of an array off. We could use the `.shift()` operator to pull the first element from the array three times, but it's a bit verbose. Instead we can use array [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) and "Rest" to pull only the elements we want from the front of the array.

```javascript
const array = [ 'first', 'second', 'third', 'more', 'things'];

const [ first, second, third, ...moreThings ] = array;

console.log(first);
// 'first'
console.log(second);
// 'second'
console.log(third);
// 'third'
console.log(moreThings);
// [ 'more', 'things' ]
```

## Object Composition

Very similar to how we combined arrays, we can also compose objects. Object composition use "Spread" comes with some important difference compared to the Array version, but let's start with the basics.

```javascript
const object1 = {
  a: 1,
  b: 2
};
const object2 = {
  c: 3,
  d: 4
};

const composedObject = {
  ...object1,
  ...object2
};

console.log(composedObject);
// { a: 1, b: 2, c: 3, d: 4 }
```

This is extremely powerful. Manually mapping objects is tedious and error prone, but now we have a great way to avoid that.

Now for our first difference from Array "Spread": Objects cannot have the same property twice, so the last object with a given property to be spread will have their property represented in the final object. It's a tough thing to explain with words, so let's see some code.

```javascript
const object1 = {
  a: 1,
  b: 2
};
const object2 = {
  a: 3,
  c: 4
};

const composedObject = {
  ...object1,
  ...object2
};

console.log(composedObject);
// { a: 3, b: 2, c: 4 }
```

Note that the value from the `a` property from object2 is present in the final object, and NOT `a` from object1. This is an important feature, because it allows us to patch properties in an object.

### Patching object properties

Let's say we had an API for songs. The GET endpoint returns us a song object, and the PUT endpoint expects that same shape of object back. We see that there is a mistake in a song, and we need to update the title and the date. We want to follow [immutable](https://en.wikipedia.org/wiki/Immutable_object) practices, so we need to create a new object instead of modifying the one returned from the API.

Using "Spread" and object composition we can accomplish this very quickly without even needing to know all of the other properties on the object.

```javascript
const songObject = await api.getSongById('zx24fngidlpo');

const updatedSong = {
  ...songObject,
  title: 'Fixed title',
  date: '2004-10-31'
};

await api.putSong(updatedSong);
```

As long as we know the `title` and `date` properties are correct we don't have to worry about any other properties. This saves us from tedious object mapping that can also be very error prone. Our tests are simplified because we only need to worry about `title` and `date` now.

## Gotchas

This is an incredibly powerful tool to have, BUT if you are not able to use native code and must babel down for older browsers it can cause bloat. Unfortunately there isn't a simple polyfill for "Rest/Spread", and because of that every time you use it in babeled code, it adds a huge chunk of logic in line. It's unpleasant, but it is reality.

## Wrapping up

"Rest/Spread" is a powerful new big of syntax that take somewhat complex tasks and makes then trivial. The power it provides is as much about readability as it is about write-ability. I encourage you to learn it, and understand it.
