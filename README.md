# terodox.tech

[![Netlify Status](https://api.netlify.com/api/v1/badges/b1e77f0c-371a-4d6e-8d6b-a1e4a2922f88/deploy-status)](https://app.netlify.com/sites/terodox-tech/deploys)

The source code for the terodox.tech website.

Original starter from [HeroBlog](https://github.com/greglobinski/gatsby-starter-hero-blog)

# HeroBlog

A [GatsbyJS](https://www.gatsbyjs.org/) blog starter. <br /><br />

[![GitHub tag](https://img.shields.io/github/tag/greglobinski/gatsby-starter-hero-blog.svg)](https://github.com/greglobinski/gatsby-starter-personal-blog)
[![GitHub stars](https://img.shields.io/github/stars/greglobinski/gatsby-starter-hero-blog.svg)](https://github.com/greglobinski/gatsby-starter-personal-blog/stargazers)
[![GitHub license](https://img.shields.io/github/license/greglobinski/gatsby-starter-hero-blog.svg)](https://github.com/greglobinski/gatsby-starter-personal-blog/blob/master/LICENSE)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![GitHub contributors](https://img.shields.io/github/contributors/greglobinski/gatsby-starter-hero-blog.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/greglobinski/gatsby-starter-hero-blog.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fgreglobinski%2Fgatsby-starter-hero-blog)

  <br />

![](static/screens/gatsby-starter-hero-blog.gif) <br />

  <br />

See the starter in action » [demo website](https://gatsby-starter-hero-blog.greglobinski.com/) <br />For more information visit » [dev.greglobinski.com/gatsby-starter-hero-blog](https://dev.greglobinski.com/gatsby-starter-hero-blog/)

## Description

A ready to use, easy to customize 'like theme' starter with a 'Hero' section on the home page.

The starter was initially built for Gatsby v1. Now, thanks to [@mohsenkhanpour](https://github.com/mohsenkhanpour) it's [upgraded](https://github.com/greglobinski/gatsby-starter-hero-blog/issues/32) to Gatsby v2. Thank you Mohsen :)

The original version of the starter is preserved as the branch `gatsby-v1`.

## Features:

- Easy editable content in **Markdown** files (posts, pages and parts)
- **CSS** with `styled-jsx` and `PostCSS`
- **SEO** (sitemap generation, robot.txt, meta and OpenGraph Tags)
- **Social** sharing (Twitter, Facebook, LinkedIn)
- **Comments** (Facebook)
- **Images** lazy loading and `webp` support (gatsby-image)
- Post **categories** (category based post list)
- Full text **searching** (Algolia)
- **Contact** form (Netlify form handling)
- Form elements and validation with `ant-design`
- **RSS** feed
- 100% **PWA** (manifest.webmanifest, offline support, favicons)
- Google **Analytics**
- App **favicons** generator (node script)
- Easy customizable base **styles** via `theme` object generated from `yaml` file (fonts, colors, sizes)
- React **v.16.3** (gatsby-plugin-react-next)
- **Components** lazy loading (social sharing)
- **ESLint** (google config)
- **Prettier** code styling
- Webpack `BundleAnalyzerPlugin`
- **Gravatar** image (optional) instead local Avatar/Logo image

## Prerequisites

If you do not have Gatsby Cli installed yet, do it first.

```text
npm install --global gatsby-cli
```

More information on [GatsbyJS.org](https://www.gatsbyjs.org/tutorial/part-one)

## Getting started

Install the starter using Gatsby Cli `gatsby new` command.

```text
gatsby new [NEW_SITE_DIRECTORY_FOR_YOUR_BLOG] https://github.com/greglobinski/gatsby-starter-hero-blog.git
```

Go into the newly created directory and run

```text
gatsby develop
```

to hot-serve your website on http://localhost:8000 or

```text
gatsby build
```

to create static site ready to host (/public).