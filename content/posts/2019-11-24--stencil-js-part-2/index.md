---
title: "StencilJs - Part 2 - @Component decorator deep dive"
comments: true
category: WebComponents
cover: component.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Robin Glauser](https://unsplash.com/@nahakiole)

This article assumes you have a working knowledge of web components. If you don't, please check out my earlier series on [web components](/web-components-part-1).

It's also building on a [previous article](/stencil-js-part-1), so please check that out too.

## @Component decorator

Stencil, like almost all modern front-end frameworks, revolves around creating components. The syntax for creating a component in Stencil is:

```tsx
@Component({
  tag: 'my-custom-element'
})
export class MyCustomElement {}
```

This is the simplest version of a component that can be created with Stencil.

But we're not here for simple. Today we're going to talk about the more complex use cases Stencil's @Component decorator helps us solve.

We'll cover:

- [Scoped Styles](#scoped-styles)
- [Shadow DOM flag](#shadow-dom-flag)
- [StyleUrl](#styleurl)
- [StyleUrls](#styleurls)
- [Styles](#styles)
- [AssetsUrls](#asseturls)

## Scoped styles

This will only be pertinent if you are NOT using the shadow DOM. This flag will cause Stencil to scope styles for you. With scoped styles you can still write simple selectors like `h1 {}` without having to worry about affecting the whole document.

Here's an example usage:

```tsx
@Component({
  tag: 'my-custom-element',
  scoped: true // Defaults to false
})
export class MyCustomElement {}
```

## Shadow DOM flag

There's a simple flag for enabling the shadow DOM on a Stencil component. Not a whole lot of explanation needed for this one.

Here's an example usage:

```tsx
@Component({
  tag: 'my-custom-element',
  shadow: true // Defaults to false
})
export class MyCustomElement {}
```

## StyleUrl

This is a property that allows you to load an external style sheet from a relative path into the dom/shadow DOM depending on the `shadow` property. Typically this process is a bit more tricky. Stencil makes it really easy to load any `.css` files style. They also offer a plugin to load sass (`[@stencil/sass](https://www.npmjs.com/package/@stencil/sass)`).

Here's an example usage:

```tsx
@Component({
  tag: 'my-custom-element',
  styleUrl: 'my-custom-element.css'
})
export class MyCustomElement {}
```

## StyleUrls

This one took some digging to figure out. The information in the Stencil docs says:

> Similar as `styleUrl` but allows to specify different stylesheets for different modes.

That really didn't give me enough information to understand what the heck was going on. So, after consulting The Oracle (aka Google Search), I found that this is meant for developing components for non-web cross platform use.

Ionic is a platform for developing applications that work on Android, IOS, and the Windows. This property is meant to give a CSS target for each of those build targets.

**NOTE:** You should still provide a `styleUrl` property to handle the web. The `styleUrls` property is meant for non-web build targets.

Here's an example usage:

```tsx
@Component({
  tag: 'my-custom-element',
  styleUrls: {
    ios: 'my-custom-element.ios.css', // Obvious :-p
    md: 'my-custom-element.md.css', // Android
    wp: 'my-custom-element.wp.css' // Windows
  }
})
export class MyCustomElement {}
```

## Styles

This is meant to allow inline styling. It cannot support Sass or Less, it must be native CSS. In my opinion this is a property that requires a balancing act. Using it for everything can make component files HUGE and unruly. In general I have found that keeping a project consistent is important. For that reason I generally choose to avoid using this property, and instead use the `styleUrl` property with a separate file.

However, my opinion is not for everyone! So here's an example usage:

```tsx
@Component({
  tag: 'my-custom-element',
  styles: `
  h1 {
    color: green;
  }
  `
})
export class MyCustomElement {
  render() {
    return <h1>Super Green!</h1>;
  }
}
```

## AssetsDirs

When you need to load a local asset in a component it can complicate the build. Stencil tries to keep this a bit more seamless with the use of `assetsDirs`. This property allows you to specify local folder that can will contain assets needed for this specific component.

The path can be any relative path to a directory from the component file.

In your component you will use the `getAssetPath()` function to resolve the run time location of the static asset you're trying to load.

Here's an example usage:

```tsx
@Component({
  tag: 'my-custom-element',
  assetsDirs: [
      '../../assets'
  ]
})
export class MyCustomElement {
  render() {
    return <img src={getAssetPath('../../assets/things.jpg')} />;
  }
}
```
