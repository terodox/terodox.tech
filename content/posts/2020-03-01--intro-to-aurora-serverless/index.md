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

## VPC is required

We need a VPC for the cluster to be started in. This gives us the ability to isolate the network from public traffic.

Let's walk through the different parts of the CDK stack we need.

We start with creating a Virtual Private Cloud (VPC). This will be the network that our cluster lives in.

```javascript
const vpc = new Vpc(this, 'Vpc', {
    cidr: '10.0.0.0/16',
    natGateways: 0,
    subnetConfiguration: [
        {
            name: 'aurora-isolated-',
            subnetType: SubnetType.ISOLATED
        }
    ]
});
```

Once that's in, we'll need to get all of the subnet ids in order to create a subnet group. This group allows Aurora Serverless to spin up instances in any of our subnets. This is a part of what provides cross availability zone redundancy.

```javascript
const subnetIds = [];
vpc.isolatedSubnets.forEach(subnet => {
    subnetIds.push(subnet.subnetId);
});

const dbSubnetGroup = new CfnDBSubnetGroup(this, 'AuroraSubnetGroup', {
    dbSubnetGroupDescription: 'Subnet group to access aurora',
    dbSubnetGroupName: 'aurora-db-subnet-group',
    subnetIds
});
```

That's it for supporting infrastructure. Now we can create the cluster itself.

```javascript
const aurora = new CfnDBCluster(this, 'AuroraServerless', {
    databaseName: 'AuroraExample',
    dbClusterIdentifier: 'aurora-example',
    engine: 'aurora',
    engineMode: 'serverless',
    masterUsername: 'auroraMaster',
    // This should be set to a SUPER HIGH entropy secret
    masterUserPassword: '[Some high entropy password]',
    // This is out subnet group from above
    dbSubnetGroupName: dbSubnetGroup.dbSubnetGroupName,
    backupRetentionPeriod: 35, // 35 days is the current minimum
    scalingConfiguration: {
        // Full write up on aurora serverless auto scaling:
        // https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.how-it-works.html#aurora-serverless.how-it-works.auto-scaling
        autoPause: true, // Allow the db cluster to go offline after being idle
        secondsUntilAutoPause: 300, // 300 seconds of idle time will then pause the cluster
        maxCapacity: 256, // Maximum as of writing this (2/29/2020)
        minCapacity: 1, // This is the smallest it can be
    },
    storageEncrypted: true
});
```

And last but certainly not least, we need to put a dependency on the subnet group existing before the aurora cluster can be spun up.

```javascript
// Subnets need to be available before Cluster can be created
aurora.addDependsOn(dbSubnetGroup);
```

We can add some stack outputs to make it a little easier to see the resources we've created. Check out the complete CDK example below for those.

## Let's talk about auto scaling

There are a handful of options available to handle auto scaling with Aurora Serverless. The first and most logical is the `minCapacity` and `maxCapacity` which are measured in ACUs (Aurora Capacity Units).

These units are a combination of processing and memory capacity. They scale on a fixed system from 1 to 256 where 1 is 2Gb of RAM and 64 is 488Gb of RAM. When you set your min and max capacity you will be allowing Aurora to scale as it sees need for CPU, memory, or connections. It will scale up as quickly as it can to handle the load it is experiencing.

Aurora will not begin scaling down for a minimum of 15 minutes. After that it will continue to scale down every 310 seconds. This should help prevent any "over cooling" and avoid potential unexpected fluctuation.

There are two main scenarios that can prevent scaling from occurring:

- Long running queries or transactions
- Temp Tables
- Table locks

## Auto pause

If you are not under a production workload you may want to use the auto pause feature. This will allow Aurora to "go to sleep" after a specific waiting period with no activity. The period of time is specified by `secondsUntilAutoPause`.

**NOTE:** Resuming from being paused takes a while! This can take upwards of 30+ seconds in some cases. This is the biggest reason auto pause should be avoided for production workloads.

## It's worth a look

I hope this has given you a quick intro into Aurora Serverless. There's some gotchas to be aware of, but that will have to wait for my next article!

Below you'll find a collapsed section containing the full CDK code for deploying an Aurora Serverless cluster. I hope this helps you get started with Aurora Serverless today!

<details>
  <summary>Full CDK Example. Click to expand!</summary>

Complete CDK example:

```javascript
const cdk = require('@aws-cdk/core');
const { CfnDBCluster, CfnDBSubnetGroup } = require('@aws-cdk/aws-rds');
const { Vpc, SubnetType } = require('@aws-cdk/aws-ec2');

class AuroraDatabaseStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const vpc = new Vpc(this, 'Vpc', {
            cidr: '10.0.0.0/16',
            natGateways: 0,
            subnetConfiguration: [
                { name: 'aurora-isolated-', subnetType: SubnetType.ISOLATED }
            ]
        });

        const subnetIds = [];
        vpc.isolatedSubnets.forEach(subnet => {
            subnetIds.push(subnet.subnetId);
        });

        const dbSubnetGroup = new CfnDBSubnetGroup(this, 'AuroraSubnetGroup', {
            dbSubnetGroupDescription: 'Subnet group to access aurora',
            dbSubnetGroupName: 'aurora-db-subnet-group',
            subnetIds
        });

        const aurora = new CfnDBCluster(this, 'AuroraServerless', {
            databaseName: 'AuroraExample',
            dbClusterIdentifier: 'aurora-example',
            engine: 'aurora',
            engineMode: 'serverless',
            masterUsername: 'auroraMaster',
            // This should be set to a SUPER HIGH entropy secret
            masterUserPassword: '[Some high entropy password]',
            dbSubnetGroupName: dbSubnetGroup.dbSubnetGroupName,
            backupRetentionPeriod: 35, // 35 days is the current minimum
            scalingConfiguration: {
                // Full write up on aurora serverless autoscaling:
                // https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.how-it-works.html#aurora-serverless.how-it-works.auto-scaling
                autoPause: true, // Allow the db cluster to go offline after being idle
                secondsUntilAutoPause: 300, // 300 seconds of idle time will then pause the cluster
                maxCapacity: 256, // Maximum as of writing this (2/29/2020)
                minCapacity: 1, // This is the smallest it can be
            },
            storageEncrypted: true
        });

        // Subnets need to be available before Cluster can be created
        aurora.addDependsOn(dbSubnetGroup);

        new cdk.CfnOutput(this, 'VpcSubnetIds', {
            value: JSON.stringify(subnetIds)
        });

        new cdk.CfnOutput(this, 'VpcDefaultSecurityGroup', {
            value: vpc.vpcDefaultSecurityGroup
        });

        new cdk.CfnOutput(this, 'AuroraClusterArn', {
            value: `arn:aws:rds:${this.region}:${this.account}:cluster:${aurora.dbClusterIdentifier}`
        });

        new cdk.CfnOutput(this, 'AuroraEndpoint', {
            value: aurora.attrEndpointAddress
        });

        new cdk.CfnOutput(this, 'AuroraPort', {
            value: aurora.attrEndpointPort
        });
    }
}

const app = new cdk.App();
new AuroraDatabaseStack(app, 'aurora-serverless');
```

</details>
