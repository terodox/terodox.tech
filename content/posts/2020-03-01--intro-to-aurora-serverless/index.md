---
title: "Into to Aurora Serverless"
comments: true
category: AWS
cover: aurora.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Lightscape](https://unsplash.com/@lightscape)

This article will work with the AWS CDK as a means of creating an aurora serverless database cluster. If you're not yet familiar with the AWS CDK, checkout out my [quick intro article](/aws-cdk/) first.

## Aurora Serverless

AWS Relational Database Service (RDS) has a lot of different offerings. Everything from managed Postgres or MySql to Managed Document DB - a mongo db compatible database. They even offer a naturally globally distributed database in Aurora. The major problem I have is that these all require you to manage scaling yourself, and I'm not a huge fan of setting up CPU and memory monitoring.

The only RDS offering that doesn't require you to manage scaling is [Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/). Aurora serverless comes in two flavors, Postgres and MySql. For this article I'm going to focus on the MySql flavor. Many of the concepts will apply to Postgres.

## It's still a cluster

Setting up an Aurora Serverless Cluster is very similar to how you create a non-serverless one. There's a lot of settings here, but most of them are pretty straight forward.

- databaseName: Name of the database to be created on cluster initialization
- dbClusterIdentifier: Name of the cluster
- engine: For us it will only ever be 'aurora'
- engineMode: For us it will only ever be 'serverless'
- masterUsername: Exactly as it says
- masterUserPassword: Exactly as it says
- dbSubnetGroupName: This will be referenced in the CDK stack (More on this below). It's the subnet in our newly created VPC for the cluster
- storageEncrypted: Strongly recommend this to be set to true so your database is encrypted at rest
- scalingConfiguration: Settings specific to how aurora serverless should scale (More to come on this topic)

These settings are the basics we need to get our cluster up and running. So let's look at a full CDK stack implementation for standing up an Aurora Serverless Cluster!

```javascript

```
