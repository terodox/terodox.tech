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


