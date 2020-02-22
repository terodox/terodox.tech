---
title: "AWS CDK - Gotchas, Tips, and Tricks"
comments: true
category: Javascript
cover: spread.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Jessy Smith](https://unsplash.com/@jessysmith)

The ever progressing ECAM Script standard has brought a lot of awesome new syntax to Javascript. Today I want to focus on a specific part, the `...` operator. This is called the "Rest/Spread" operator. It's hugely powerful, and make both writing and reading code a lot easier for its use cases.

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


