---
title: "Using npm-link for package development"
comments: true
category: NPM
cover: chain.jpg
author: Andy Desmarais
---

###### Cover photo credit: [JJ Ying](https://unsplash.com/@jjying)

While writing a fair amount of API calls in javascript, I was getting frustrated with the process of validating the payload of each call. Working with my team we came up with a simple little method that would allow us to write a class for each API response and then `coerce` the response into that class.

This code has a lot of universality and having copied it to a few projects we knew it was time for an npm package.

All of these uses were being shipped to production so we needed a safe way to extract this small function into a package, and validate it was working properly before shipping to production again.

## `npm-link` to the rescue

`npm link` provides the tooling needed to both develop and consume an npm package locally.

We started by creating a new npm module called [`@meltwater/coerce`](https://www.npmjs.com/package/@meltwater/coerce). This module contained the simple 10 line method we were using for class based type coercion.

## Local npm package

We need to make the module available for install locally.

```bash
cd local/git/folder/coerce
npm link
```

The output of this helps us understand what's actually happening here.

```bash
/path/to/global/node/modules/node_modules/@meltwater/coerce -> /local/git/folder/coerce
```

A [symlink](https://en.wikipedia.org/wiki/Symbolic_link) was created in our global `node_modules` folder that points to our local version of coerce. Notice that the package name is used in the `node_modules` folder.  This will correspond to the `name` field in your package.json.

## Consuming a local npm package

Now we need to reference the newly created reference from the project we are removing this code from.

```bash
cd local/git/folder/main-project
npm link @meltwater/coerce
```

Notice that we are referencing the package name, and not the folder name! Checking the output again we'll see a symlink chain occurring:

```bash
/local/git/folder/main-project/node_modules/@meltwater/coerce -> /path/to/global/node/modules/node_modules/@meltwater/coerce -> /local/git/folder/coerce
```

Now that we've created a reference in the main project, testing it locally is as simple as replacing the references in our files from:

```javascript
import coerce from '../coerce';
```

To

```javascript
import coerce from '@meltwater/coerce';
```

Now all of our tests should be passing, and we can have the confidence that our code extraction was successful.

## Cleaning up when we're done

Now that we've tested and everything is looking good, we should cleanup our local environment. Similar to `npm link` there is an `npm unlink` command, and it works exactly as you would expect.

```bash
cd local/git/folder/coerce
npm unlink
```

In the main project we need to unlink, but we also need to reference the newly published package:

```bash
cd local/git/folder/main-project
npm un`link @meltwater/coerce
npm i @meltwater/coerce
```

## Quick summary

`npm link` gives us the tooling we need to both write and validate npm packages locally. It's a very simple tool that gives us a great way to validate any new or updated package before publishing.
