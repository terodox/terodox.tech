---
title: "Introduction to the AWS Cloud Development Kit (CDK)"
comments: true
category: AWS
cover: books.jpg
author: Andy Desmarais
---

###### Cover photo credit: [EJ Yao](https://unsplash.com/@hojipago)

Before we get started, this post is not meant to be an introduction to AWS infrastructure in general. It has the assumption that you are familiar with the basics of AWS.

## What the heck is a CDK?

The [AWS Cloud Development Kit](https://aws.amazon.com/cdk/) is an open source development framework designed to help you provision AWS resources using familiar programming languages.

Ummmmm... What?

Right, so it's basically a set of tools that are designed to describe a [CloudFormation Stack](https://aws.amazon.com/cloudformation/). The stack can then be deployed, updated, and destroyed using the cdk cli.

I can hear you out there thinking about serverless.io, terraform, and other infrastructure as code solutions. The main differentiator with the AWS CDK is that it's designed with your language in mind. The challenge with serverless.io, terraform, etc is you have to learn a new syntax in order to get anything done. This increases the learning curve for picking up new tooling.

Currently the supported languages are:

- Javascript
- Typescript
- Python
- Java
- C# (both .NET Core and .NET Framework)

For the rest of this post I'm going to focus on Javascript because it is my language of choice, but all of the example should translate to other languages easily.

## Let's init a project

The CDK cli has the ability to initialize a project. If you're like me, I like to avoid installing npm dependencies globally. To run the CDK cli without installing globally you can run

```bash
mkdir my-first-cdk-app
cd my-first-cdk-app
npx aws-cdk init --language javascript
```

This set of commands with create a new directory for our project, move us into the directory, and initialize a CDK project including all of the necessary files and dependencies needed to get running.

You'll see a set of commands output for using the CDK cli, but we'll come back to those in a bit.

## It starts with a stack

Because the CDK is just spitting out CloudFormation, we have to start with defining a CloudFormation Stack. The stack will be the container that holds all of the AWS resources we want to create.

The `init` command set up two files: `bin/my-first-cdk-app.js` and `lib/my-first-cdk-app-stack.js`. The file in the `bin` directory is the entry point the CDK will use when running. It's not magic though, there is a `cdk.json` file in the root that identifies the app you are going to be working with.

Let's look at `bin/my-first-cdk-app.js` first:

```javascript
#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { MyFirstCdkAppStack } = require('../lib/my-first-cdk-app-stack');

const app = new cdk.App();
new MyFirstCdkAppStack(app, 'MyFirstCdkAppStack');
```

As you can see, it's pretty thin. It defines a new `cdk.App()` and passes that as the `scope` for a new stack called `MyFirstCdkAppStack`. The `MyFirstCdkAppStack` is defined in `lib/my-first-cdk-app-stack.js` so let's look at that next.

```javascript
const cdk = require('@aws-cdk/core');

class MyFirstCdkAppStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here
  }
}

module.exports = { MyFirstCdkAppStack }
```

My first thought looking at this file was "AHHHHHHHHHHH! INHERITANCE!" However, this is one of the parts of the CDK that provides its power. The inheritance model of functionality adoption allow the CDK to hide a lot of the wiring needed to bring together resources within the stack.

Now that we have our stack we can start adding resources to it. Let's start with a fairly common model at this point: serverless.

## Creating a serverless application

The basic building blocks we're going to create will be an API Gateway with a Lambda Function defined as its handler.

With the CDK we can define the lambda function in the same project as the 
