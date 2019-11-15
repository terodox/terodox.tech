---
title: "StencilJs - Part 1 - Quick Intoruction"
comments: true
category: StencilJs
cover: stencil.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Marija Zaric](https://unsplash.com/@simplicity)

I've covered building native web components [in a past series](/web-components-part-1). There's a lot of boilerplate that can creep in as you write many web components. This is increasingly true if you're planning to build an entire design system worth of components. [Stencil Js](https://stenciljs.com/) (or just Stencil for short) aims to solve the problem of building and maintaining a large number of web components.

I'm not going to dig into what a design system is here. That's a book unto itself. For the purposes of this article, I'll focus primarily on getting started with StencilJs.

## Why does Stencil exist

Stencil is built by the Ionic team. They had an issue trying to build they component sets in a way that allowed the creation of PWAs (progressive web apps). They attempted and failed to build a PWAS using Angular as the core of the component set. When they took a step back and looked at the problem wholistically they found that picking any framework was not going to be tenable.

This challenge and the requirement for cross framework functionality drove them to pick Web Components.

There's an [entire talk](https://www.youtube.com/watch?v=UfD-k7aHkQE) digging into more detail if you're interested.

## What is Stencil

> Stencil is a compiler that generates Web Components (more specifically, Custom Elements).

###### [Reference(https://stenciljs.com/docs/introduction)]

Stencil's main goal is to simplify the process of building web components. They have a unique mix of Angular like decorators and React like JSX. This provides a straight-forward way to solve some of the more detail oriented problems that make the native APIs painful.

They start by abstracting away the Custom Element entirely. This give them the ability to highly optimize the resulting web component. They are also using a virtual DOM to manage change detection. They worked hard to have an asynchronous rendering engine that was inspired by React Fiber.

That's enough of the what and why. Let's get started!

## Getting started

Stencil has a [whole section](https://stenciljs.com/docs/getting-started) of their site dedicated to getting started. I'm going to be a bit more high level than their walk through.

First let's init a new project. Head to your favorite folder of choice and run:

```bash
npm init stencil
```

You'll be presented with three options, each of which will change the way the project is built.

- ionic-pwa - Bootstrap an entire application based on Stencil that is PWA ready
- app - The smallest footprint needed to create a basic application (not a PWA)
- component - Use this for creating a package of reusable components

For the remainder of this article, let's focus on the component type of project.

## Project Structure

The project is structured to focus on component creation. There's a `src/` folder that contains a `components/` folder with a basic "hello world" style of component.

They also spin up a `utils/' folder. For my taste, a folder named utils shouldn't live long.

If you look at the `package.json` you'll notice that all of the scripts are powered by the Stencil CLI. This abstracts a lot of the "who is doing what, and how" from you as a consumer. I personally believe that stuff is worth knowing, so here's a quick list:

- `stencil build` is powered by Rollup under the hood.
  - The `stencil.config.ts` exposed a custom configuration that does not allow ALL Rollup functionality
  - This can be pretty frustrating depending on what you need.
- `stencil test` is powered by jest. Both the unit and e2e tests are run using jest.
- `stencil generate` is a custom tool similar to `ng generate` allowing the quick creation of new components.

### Typescript or die

You probably also noticed that there are no js files in this project. Stencil is very heavily bought into the Typescript eco-system. It's a part of what makes things like decorators more straight forward.

The project is typescript all the way down to their configuration file.

## First component

If you open `src/components/my-component/my-component.tsx` you'll see a small amount of cade designed display a persons name.

- First component
  - Decorators
    - @Component
    - @Prop
    - @Element
  - Shadow or not to shadow
  - Scoped styling
  - jsx to render
- Component interaction
  - @Event
  - @Listen
