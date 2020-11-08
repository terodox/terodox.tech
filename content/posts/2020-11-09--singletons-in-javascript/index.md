---
title: "Singletons in javascript"
comments: true
category: JavaScript
cover: singleton.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Stanislav Ivanitskiy](https://unsplash.com/@ztanizlaff)

In a [tweet I sent out](https://twitter.com/terodox/status/1314536111537090560) recently I discussed the use of singletons in Javascript. I got a reply from a wonderful gentlemen named [Maxi Conieri](https://twitter.com/mcsee1) giving a laundry list of reasons singletons are considered an anti-pattern.

He made some good points in [his article](https://codeburst.io/singleton-the-root-of-all-evil-8e59ca966243), but I don't think a lot of them hold up when we talk about javascript. Especially when we talk about javascript in the browser. This article is a pure rebuttal to Maxi's thoughts.

## Singleton definition

Before we dive into refuting the use of singletons, let's first define them.

> In software engineering, the singleton pattern is a software design pattern that restricts the instantiation of a class to one "single" instance. This is useful when exactly one object is needed to coordinate actions across the system. The term comes from the mathematical concept of a singleton.
> [Wikipedia](https://en.wikipedia.org/wiki/Singleton_pattern)

To expand a bit, a singleton guarantees that there will only ever be a single instance of a given object or class available in the system.

## Singleton uses in javascript

In javascript we use singletons to handle jobs like:

- State management
- Caching

Each of these benefit from only allowing a single copy of the class/object to exist. We gain certainty about the state of our system by only having a single location that manages a specific job.

## My rebuttal to singletons as an anti-pattern

### 1. The bijection principal (also 5. testing)

[This principal](https://codeburst.io/the-one-and-only-software-design-principle-5328420712af) is a great way to consider how to maintain and develop models. It helps us ensure single responsibility to each of the models we create.

Singletons can fit very cleanly into the bijection principal.

Let's examine the caching layer. For our example we'll say we have a weather service that fetches the weather for the next 10 days. This data is perfect for a caching layer because it changes infrequently. In our pretend system we choose to decorate our weather service with a caching layer that will check to see if we already have weather data and return it from the cache if it has already been fetched.

The cache needs to be a singleton. If it were not then many places in our system could be calling through to the API potentially causing rate limiting issues for the application.

This singleton still serves a single purpose, and can be cleanly mapped to a real world object. Think of this as the weather man. He gathers the weather for you and keeps that knowledge himself disseminating to anyone who asks him.

## 2. Generates coupling

Singletons inherently create a problem of coupling. It's a simple truth that I cannot refute.

However, in javascript this is much less of an issue. The testability of a singleton is much higher in the javascript world. We can easily spy on the `getInstance` method during a test scenario and provide an appropriate mock or fake as a return value.

Moreover, testing the singleton itself is equally straight forward taking into account the appropriate tooling. Jest provides a nice helper [`jest.isolateModules()`](https://jestjs.io/docs/en/jest-object#jestisolatemodulesfn) which allows us to reload the module for each test invocation. There is also [`mock-require`](https://www.npmjs.com/package/mock-require) which gives us a nice helper called [`mock.reRequire()`](https://www.npmjs.com/package/mock-require#mockrerequirepath) for the same purpose.

Coupling of code is something to be managed and can never be eliminated. Using a singleton in a javascript context can introduce some additional coupling, but that coupling can be easily managed in a testing context.

## 3. Accidental implementations

> By focusing early on implementation issues (the Singleton is an implementation pattern) we orient ourselves according to accidentality (how) and underestimate the most important thing of an object: the responsibilities it has (what). - [#3](https://codeburst.io/singleton-the-root-of-all-evil-8e59ca966243)

This is a challenging one to refute. Early focus on implementation is something every software engineer needs to be cognizant of and work to manage. However to say that singletons somehow exacerbate this issue on their own is a bit presumptuous.

## 5. Memory space

The javascript memory system is a bit of a different beast from your traditional Java Virtual Machine or dot Net runtime. It's a completely reference based system that can be overburdened by a large number of small objects being created and forgotten.

I would argue that a singleton does help to reduce the overall load being placed on the garbage collector be maintaining a single set of working memory.

## 6. It prevent us from using dependency injection

Ummmm. Nope. You can just as easily have the `getInstance()` method be invoked by a dependency injection mechanism as you can have a class that is "newed" up each time.

This argument seems flawed.

## 7. It violates the instantiation contract

This is another spot that fall into the "if you do it poorly then it's bad" mindset. If we allow the constructor of a singleton to be exposed without a safety guaranteeing that it was invoked from the `getInstance` method of its class then we're not implementing singletons properly.

## I'm exhausted

I can't continue to rebut all of the reasons provided in Maxi's article.

I will end on this note, Javascript is a unique language that has many pros and cons. Singletons are easier to manage and maintain in Javascript due to the loose nature in which classes/objects are handled.

We do not fall victim to the inability to test, nor the coupling that is burdened by a closed object system.

Singletons are great, for the right use case.
