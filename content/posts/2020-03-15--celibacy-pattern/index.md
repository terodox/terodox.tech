---
title: "The Celibacy Pattern"
comments: true
category: Javascript
cover: alone.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Austin Mabe](https://unsplash.com/@mabe12)

No this isn't a discussion about personal relationship practices, but it is about a promise to remain a singleton.

The basic idea is we need a singleton class in javascript that depends on some asynchronous process returning first. In order to guarantee the class will be a singleton, and not instantiated multiple times, we'll need to put some safeties in place.

## What's a singleton?

> In software engineering, the singleton pattern is a software design pattern that restricts the instantiation of a class to one "single" instance. This is useful when exactly one object is needed to coordinate actions across the system. The term comes from the mathematical concept of a singleton. - [Wikipedia](https://en.wikipedia.org/wiki/Singleton_pattern)

How does this help in the real world?

If you've ever worked with AngularJs or Angular, both of these framework use singletons for their services.

In a pure javascript frame of mind, singletons are one way to have a guaranteed caching layer around an API.

## The Celibacy Pattern

I have to give all of the credit for the name of this pattern to Joseph Theriault ([@JosephTheriault](https://twitter.com/JosephTheriault)) who coined the term after we had used it several times.

The basic idea is we need to guarantee that everyone getting the same instance of a class, even when an asynchronous request is required to instantiate it.

A real world example of this would be a class that requires a user id, but one is not available at page load time. We'll need to a fire a network request to get the required id before a consumer can use any class methods.

## Show me the code

The pattern begins with a variable that is scoped to the classes module, but not exported. The class exposes a `getInstance` method that should be used in place of a constructor for consumers.

```javascript
let _instance;
let _instancePromise = null;
export class TheCelibateSingleton {
  constructor(theNeededResponse) {
    this._theNeededResponse = theNeededResponse;
  }

  async getInstance() {
    if(!_instancePromise === null) {
      _instancePromise = someAsynchronousRequest()
        .then(theNeededResponse => {
          _instance = new TheCelibateSingleton(theNeededResponse);
          return _instance;
        });
    }
    return _instancePromise;
  }
  //... More class implemented here ...
}
```

This unfortunately doesn't handle the case of the async request failing though. For that we need a simple catch block to reset our instance promise.

```javascript
let _instance;
let _instancePromise = null;
export class TheCelibateSingleton {
  constructor(theNeededResponse) {
    this._theNeededResponse = theNeededResponse;
  }

  async getInstance() {
    if(!_instancePromise === null) {
      _instancePromise = someAsynchronousRequest()
        .then(theNeededResponse => {
          _instance = new TheCelibateSingleton(theNeededResponse);
          return _instance;
        })
        .catch(error => {
          // Log error somewhere
          _instancePromise = null;
          throw error;
        });
    }
    return _instancePromise;
  }
  //... More class implemented here ...
}
```

The next thing we need to do is make sure you can't actually call the constructor. We do this using the `Symbol` class which guarantees each constructed version to be unique. Using symbol we can lock down the constructor to only be used internally.

```javascript
let _instance;
const PRIVATE_CONSTRUCTOR_VALIDATION = new Symbol('private constructor validation');
export class TheCelibateSingleton {
  constructor(validation, theNeededResponse) {
    if(validation !== PRIVATE_CONSTRUCTOR_VALIDATION) {
      throw new Error('This is a private constructor, please user `getInstance` instead');
    }
    this._theNeededResponse = theNeededResponse;
  }

  async getInstance() {
    if(!_instancePromise === null) {
      _instancePromise = someAsynchronousRequest()
        .then(theNeededResponse => {
          _instance = new TheCelibateSingleton(PRIVATE_CONSTRUCTOR_VALIDATION, theNeededResponse);
          return _instance;
        })
        .catch(error => {
          // Log error somewhere
          _instancePromise = null;
          throw error;
        });
    }
    return _instancePromise;
  }
  //... More class implemented here ...
}
```

We can now get a promise that will either resolve to an instance of the class, or reject if creating the class fails. As many different entry points as needed can request an instance and they will all receive the same promise. This can save a lot of network traffic for a service that is used regularly.

# Wrapping up

So a promise to be a singleton is know as _The Celibacy Patter_. A clever name for a very useful pattern.
