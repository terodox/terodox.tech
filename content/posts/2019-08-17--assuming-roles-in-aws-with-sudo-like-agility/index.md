---
title: "Assuming roles in AWS with sudo-like agility"
comments: true
category: AWS
cover: aws-iam.png
author: Andy Desmarais
---

<img class="right" src="/images/own/2018-01-16-awsudo/aws-iam.png" title="AWS IAM" width="300" style="background-color: #FFF;">

Meltwater just released awsudo, an npm package designed to make assuming AWS IAM roles on the command line trivial.

Assuming an AWS IAM role on the command line is not a simple process, and we wanted it to be a human-readable one-liner. Meltwater’s awsudo achieves this with a straightforward command that you can put in front of any [awscli](https://aws.amazon.com/cli/) operation.

There are other packages out there that accomplish similar goals, but in this post we will discuss why we chose to roll our own.

## Introducing awsudo

Meltwater [awsudo](https://github.com/meltwater/awsudo) is an npm package that simplifies managing the challenges of cross-account role management. The goal of this project is to provide a very simple command line tool allowing other commands to be executed as a different role without having to juggle all of the variables introduced during this process.

Assuming a role is not complex, but provides a lot of opportunity for potential mis-steps or misuse. Awsudo keeps it to a very straightforward single step:

```bash
awsudo arn:aws:iam::123456789012:role/S3Access aws s3 ls
```

This example allows the user with credentials that are already on the environment to assume the *S3Access role* before executing the *aws s3 ls* command. No need to parse any JSON, set any environment variables, or clean up when your done.

Here an example of a traditional use of STS assume role to list s3 buckets:

```bash
# 1) Assume role for running cloud formation
CREDENTIALS=`aws sts assume-role --role-arn ${ROLE_ARN} --role-session-name RoleSession --duration-seconds 900 --output=json`
# 2) Capture current credentials to reset after executing command
export ORIGINAL_AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export ORIGINAL_AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
# 3) Set AWS Assumed Role Credentials on ENV
export AWS_DEFAULT_REGION=eu-west-1
export AWS_ACCESS_KEY_ID=`echo ${CREDENTIALS} | jq -r '.Credentials.AccessKeyId'`
export AWS_SECRET_ACCESS_KEY=`echo ${CREDENTIALS} | jq -r '.Credentials.SecretAccessKey'`
export AWS_SESSION_TOKEN=`echo ${CREDENTIALS} | jq -r '.Credentials.SessionToken'`
export AWS_EXPIRATION=`echo ${CREDENTIALS} | jq -r '.Credentials.Expiration'`
# 4) Execute command as assumed role
aws s3 ls
# 5) Clean up assume role environment variables
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
unset AWS_SESSION_TOKEN
unset AWS_EXPIRATION
# 6) Reset to original credentials
export AWS_ACCESS_KEY_ID=${ORIGINAL_AWS_ACCESS_KEY_ID}
export AWS_SECRET_ACCESS_KEY=${ORIGINAL_AWS_SECRET_ACCESS_KEY}
# 7) Clean up temporary storage
unset ORIGINAL_AWS_ACCESS_KEY_ID
unset ORIGINAL_AWS_SECRET_ACCESS_KEY
```

The difference is very apparent.  Meltwater’s awsudo just makes life easier!

## Why we rolled our own

We did a lot of digging before choosing to create our own project. We needed a solution that did not require any awscli profiles to be created, did not require any custom installs for an npm based environment, was simple to read, simple to understand, and did not require us to maintain or clean up any new environment variables. There are several other packages out there, but none of them fit this description. Meltwater’s awsudo gave us the ease of use, flexibility, readability, and maintainability we were looking for.

## Other Similar Packages

[electronicarts/awsudo](https://github.com/electronicarts/awsudo) - Automated AWS API access using a SAML compliant identity provider

[makethunder/awsudo](https://github.com/makethunder/awsudo) - sudo-like utility to manage AWS credentials

[pmuller/awsudo](https://github.com/pmuller/awsudo) - sudo for AWS roles

[ingenieux/awsudo](https://github.com/ingenieux/awsudo) - a sudo-like method written in GO

### electonicarts/awsudo

This is the most starred of the comparable projects. It is designed as a way to use a SAML provider to interface with awscli’s access management. From the [README](https://github.com/electronicarts/awsudo/blob/master/README.md):

> awsudo enables users to execute commands that make API calls to AWS under the security context of an IAM role. The IAM role is assumed only upon successful authentication against a SAML compliant federation service.
The first major hurdle for us with this package was that it is a ruby gem. Our builds live in an NPM world, and the necessity of downloading a gem to stay up to date was a slowdown we did not want to take on.

The second hurdle is that this package is more than we were looking for, because SAML is not a concern we wanted to bring into our deployments. However, if you are using a SAML integrated environment, this may be the right tool for you!

### makethunder/awsudo

Taking a very different approach this package will set your environment variables based on the awscli profiles that have been configured on a given system. It also provides an awsrotate command for actively rotating keys for a given profile. This will also handle MFA if needed by making sure your awscli profile includes your MFA arn.

This is a great tool for a long living system that is going to have multiple awscli profiles or needs to actively rotate their aws credentials. We were looking for a solid tool to use during our build with an automated CI system.

### pmuller/awsudo

Similar to the makethunder/awsudo this project is intended for managing environment variables based on awscli profiles. It provides many similar utilities to makethunder’s version, but does not include the awsrotate command.

### ingenieux/awsudo

The last entry in our comparison was (at the time of writing this) lacking in documentation. Having little to no experience in development with the [go programming language](https://golang.org/) we felt that we would not be able to actively contribute to this project in a meaningful way.

## Wrapping Up

[github.com/meltwater/awsudo](https://github.com/meltwater/awsudo) provides a simple command for assuming another role without the hassle of needing to manage environment variables. Our team has found it to be a clean and simple way to execute actions across accounts. Npm provides a straightforward way to install and use the command within the context of an npm project or as a global utility.

Thanks for reading and checking out this new open source project! Pull requests welcome, please check out our [contributing guidelines](https://github.com/meltwater/awsudo/blob/master/CONTRIBUTING.md)!