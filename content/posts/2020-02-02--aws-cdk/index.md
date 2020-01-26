---
title: "Introduction to the AWS Cloud Development Kit (CDK)"
comments: true
category: AWS
cover: books.jpg
author: Andy Desmarais
---

###### Cover photo credit: [EJ Yao](https://unsplash.com/@hojipago)

Before we get started, this post is not meant to be an introduction to AWS infrastructure in general. It has the assumption that you are familiar with the basics of AWS.

## Origin story

This post originated from the large amount of traffic I got on a post to twitter:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I&#39;ve been working a lot with the AWS CDK recently. I was a cloudformation lover before, but I&#39;m a definite convert to the CDK. The best thing about it at the end of the day (for me) is that I can just write javscript! <a href="https://twitter.com/hashtag/aws?src=hash&amp;ref_src=twsrc%5Etfw">#aws</a> <a href="https://twitter.com/hashtag/cdk?src=hash&amp;ref_src=twsrc%5Etfw">#cdk</a> <a href="https://twitter.com/hashtag/webdev?src=hash&amp;ref_src=twsrc%5Etfw">#webdev</a> <a href="https://twitter.com/hashtag/devops?src=hash&amp;ref_src=twsrc%5Etfw">#devops</a> <a href="https://twitter.com/hashtag/javascript?src=hash&amp;ref_src=twsrc%5Etfw">#javascript</a> <a href="https://twitter.com/hashtag/Cloud?src=hash&amp;ref_src=twsrc%5Etfw">#Cloud</a> <a href="https://twitter.com/hashtag/webdevelopment?src=hash&amp;ref_src=twsrc%5Etfw">#webdevelopment</a></p>&mdash; Andy Desmarais (@terodox) <a href="https://twitter.com/terodox/status/1219967955573903361?ref_src=twsrc%5Etfw">January 22, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

With all of that attention, I felt like it was definitely time to do a post introducing the CDK. With that let's dive in!

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

I want to point out that we don't have to keep a reference to the lambda we've just created. This is because we are passing `this` into the functions constructor which give the stack all of the reference it needs to keep track of the function. This goes against what we traditionally need to do in javascript, so it's important to know.

If you are familiar with the CloudFormation definition of a lambda this example will look pretty familiar. This will automatically bring in the code from the resources directory as the code for the lambda. Then we tell it how to locate the handler using `[FILE_NAME].[EXPORT_NAME]`. This is an extremely simplified example. You can add other properties to be more specific in your setup.

Other properties include (but are not limited to):

- deadLetterQueue - The dead letter queue for execution failures
- deadLetterQueueEnabled
- functionName
- initialPolicy - An array of PolicyStatement for the created lambda role
- logRetention - The number of days logs for the lambda should be retained
- memorySize - The amount of memory to be allocated to the lambda (See [docs](https://docs.aws.amazon.com/lambda/latest/dg/limits.html) for more info)
- reservedConcurrentExecutions - The maximum of concurrent executions you want to reserve for the function
- roles - The role that will be assumed by the function during execution
- timeout - The maximum run time of the lambda in seconds
- tracing - Enable X-Ray tracing

There's a lot that can be configured on a lambda, and this is definitely NOT an exhaustive list.

## Adding in API Gateway

We have a lambda to say hello to everyone, but we need a way to expose it to the world. Let's create an API gateway.

Just like with lambda we'll need to start by installing the api gateway node dependency:

```bash
npm i --save-dev @aws-cdk/aws-apigateway"
```

Now that we have the classes we need installed, let's create an api gateway that will use our lambda as a handler.

```javascript
const cdk = require('@aws-cdk/core');
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");

class MyFirstCdkAppStack extends cdk.Stack {
  /** JSDoc removed for brevity */
  constructor(scope, id, props) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.asset("resources"),
      handler: "hello.handler",
    });

    const api = new apigateway.RestApi(this, "hello-api", {
      restApiName: "Hello World Service",
      description: "This service says hello world"
    });

    const lambdaIntegration = new apigateway.LambdaIntegration(lambdaFunction, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", lambdaIntegration); // GET /
  }
}

module.exports = { MyFirstCdkAppStack };
```

Unlike in the previous example we need to maintain a reference to the lambda in order to set and api gateway integration properly. The CDK uses references as inputs to other classes as a way to convey all the needed references for CloudFormation to function properly.

Api gateway is a much more complex resource than lambda, and because of this it takes more moving parts to get it completely wired. We first create the api gateway with a name and description (These are only used for the console and reporting purposes). The we have top create the lambda integration which will allow api gateway to wire our lambda to respond to requests. Last we wire the lambda integration to the `GET` method at the root route (the `/` route).

And with that we have a stack we can deploy!

## Synthesizing

Before we deploy the stack it's a good idea to make sure the CloudFormation it's producing is what we want. We can do this by running the cdk command:

```bash
npm run cdk synth
```

The will output all of the CloudFormation the CDK generates to the console. Then we can do a quick review to make sure we're getting everything we were expecting.

## Deploying

Once we're confident we're getting the resources we're expecting, we can deploy with a single CDK command as well!

```bash
npm run cdk deploy
```

This will first spit out a table based diff to show us what will actually be created. This is a good time to validate our checks from the synth step. The CDK will pause and wait for us to confirm that we're happy with all of the resources being created.

Once we confirm, it will create a CloudFormation stack with the name designated in `
new MyFirstCdkAppStack(app, 'MyFirstCdkAppStack');`. In this case it will be `MyFirstCdkAppStack`.

## Wrapping up

This was just a first glimpse into the capabilities of the AWS CDK. You can create almost any resource AWS has to offer. The power here will come from the ability to re-use and encapsulate code using design paradigms we're already familiar with in our own language of choice.
