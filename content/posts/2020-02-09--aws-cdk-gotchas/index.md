---
title: "AWS CDK - Gotchas, Tips, and Tricks"
comments: true
category: AWS
cover: warning.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Anna Gru](https://unsplash.com/@gruu)

Before we get started you should know this is all drawn from personal experience working with the CDK. I love this AWS CDK and the power it provides me. I am thrilled with how well I've been able to pick it up. That being said, nothing is perfect and I want to help my fellow DevOpsians be a bit more successful with these tips and tricks.

## It all started with bootstrapping my account

The first time you try to deploy a lambda that relies on assets (a build, or third part dependency of some kind), you'll get prompted to "bootstrap" the account you are deploying into. You'll do that by running:

```bash
cdk bootstrap aws://${ACCOUNT_ID}/${AWS_REGION}
```

Currently this simply puts an s3 bucket in the account with a prefix of `cdktoolkit-stagingbucket`. This is great! Now I can deploy my lambda function right!? Wrong.

If you're following the recommended best practices from AWS then you will have restricted the role doing your deployment to the tightest possible permissions.

What you'll get now is this beauty of an error message:

```bash
lambda-stack: deploying...

 ❌  lambda-stack failed: Forbidden: null
```

What? What is that!? It's a terrible error message that already has [an open issue](https://github.com/aws/aws-cdk/issues/4039). This is a result of not having permissions to work with the CDK S3 bucket that was created during the bootstrap command.

The issue also gives an example policy that will give the required permissions:

```javascript
new PolicyStatement({
    resources: [
        'arn:aws:s3:::cdktoolkit-stagingbucket-*',
    ],
    actions: ['s3:*'],
})
```

Now this policy is probably a little too lenient, and we could go as far as listing everything in the S3 permission set, but excluding `s3:DeleteBucket`. That's completely up to you. The CDK will actively be putting and removing items to/from the bucket so you can tune and tweak these permissions further if you desire.

## Catching mistakes with the `synth` command


