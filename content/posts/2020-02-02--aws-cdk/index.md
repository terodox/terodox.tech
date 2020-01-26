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

Let's start with the lambda function. Inside the constructor of our `MyFirstCdkAppStack`. We'll need to install the dependencies that allow us to create lambda functions.

```bash
npm i --save-dev @aws-cdk/aws-lambda
```

This is a good time to mention how all of the CDK packages are organized. The [`@aws-cdk`](https://www.npmjs.com/search?q=%40aws-cdk) namespace will have all of the different modules you'll need to compile any resource currently supported by the CDK.

With the CDK we can define the lambda function in the same project as the infrastructure. This helps ensure out infrastructure and code are in sync with one another.

The recommended approach is to put the files for your lambda into a `resources` folder. This will be the location we reference from our CDK script.

Let's create a quick hello world:

```javascript
// FILE: resources/hello.js
exports.handler = async function(event, context) {
    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify({
        message: 'Hello World!'
      });
    };
}
```

This is an extremely over simplified example. We'll get into more advanced use cases in a bit.

Now that have a handler for our lambda let's define it in the `MyFirstCdkAppStack` constructor:

```javascript
const cdk = require('@aws-cdk/core');
const lambda = require("@aws-cdk/aws-lambda");

class MyFirstCdkAppStack extends cdk.Stack {
  /** JSDoc removed for brevity */
  constructor(scope, id, props) {
    super(scope, id, props);

    new lambda.Function(this, "WidgetHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("resources"),
      handler: "hello.handler",
    });
  }
}

module.exports = { MyFirstCdkAppStack };
```

If you are familiar with the CloudFormation definition of a lambda this will look pretty familiar. This will automatically bring in the code in the resources directory as the code for the lambda. Then we tell it the handler using `[FILE_NAME].[EXPORT_NAME]`. This is an extremely simplified example. You can add other properties to be more specific in your setup.

Other properties include (but are not limited to):

- deadLetterQueue - The dead letter queue for execution failures
- deadLetterQueueEnabled
- functionName
- initialPolicy - An array of PolicyStatement for the created lambda role
- logRetention - The number of days logs for the lambda should be retained
- memorySize
- reservedConcurrentExecutions - The maximum of concurrent executions you want to reserve for the function
- roles - The role that will be assumed by the function during execution
- timeout
- tracing - Enable X-Ray tracing
- vpc

There's a lot that can be configured on a lambda, and this is definitely NOT an exhaustive list.

## Adding in API Gateway

We have a lambda to say hello to everyone, but we need a way to expose it to the world. Let's create an API gateway.


