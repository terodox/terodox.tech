---
title: "`npm hook` a webhook for package changes"
comments: true
category: NPM
cover: package.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Kira auf der Heide](https://unsplash.com/@kadh)

Webhooks have become a part of our everyday lives as developers. Whether it's Github kicking off a CI job or Slack being updated when a build finishes. We use webhooks to help us automate tasks that we want to avoid doing by hand.

The npm registry has the ability to wire hooks that can follow either a specific package or an entire namespace. The value here is having a way to automate tasks based on any package changes. A simple example could be notifying slack when a new package is published. A more complex task would be to host a custom CDN for an entire namespace.

## `npm hook`

The [full documenation](https://docs.npmjs.com/cli/hook.html) covers the basics of how to use it, but there's definitely some nuance missing.

## Initial setup

We can start by registering a new endpoint to be hit when a package gets updated. The shape of the command is:

```bash
npm hook add <entity> <url> <secret>
```

As an example, this command will monitor for changes to the `awsudo` package. The `https://my.webhook.endpoint` will be hit with the POST payload. The payload can be validated using the secret: `THE_MOST_SECRET_THING_ONE_CAN_IMAGINE`. We'll talk more about validating the request later.

```bash
npm hook add awsudo https://my.webhook.endpoint THE_MOST_SECRET_THING_ONE_CAN_IMAGINE
```

You can register for changes on a package, a user, or even an entire namespace (eg. @babel).

## The webhook body

The endpoint wired to npm hook will need to receive a POST request. The body of the post request is extremely verbose.

```json
{
    "event": "package:publish",
    "name": "awsudo",
    "type": "package",
    "version": "1.0.0",
    "hookOwner": {
        "username": "your-npm-username"
    },
    "payload": {...},
    "change": {
        "dist-tag": "latest",
        "version": "1.2.3"
    },
    "time": 1569628044903
}
```

The outer portion (payload envelope) of the request contains the event type, which can be any of the following:

- `package:publish` -- A package was published
- `package:unpublish` -- A package version was unpublished
- `package:dist-tag` -- Dist tag added
- `package:dist-tag-rm` -- Dist tag removed
- `package:deprecated` -- A version was deprecated
- `package:undeprecated` -- A version was undeprecared
- `package:owner` -- Added an owner (maintainer)
- `package:owner-rm` -- Removed an owner
- `package:star` -- A package was starred
- `package:unstar` -- A pckage was unstarred
- `package:change` -- **SPECIAL:** This is a catchall event. if for some reason im unable to identify the change type this type will be served

###### Pulled from [this documentation](https://github.com/npm/registry/blob/master/docs/hooks/hooks-payload.md#events)

The other fields in the payload envelop are:

- `name` -- The package being the event occurred on. Ex. `awsudo`
- `type` -- The only currently supported type is `package` (As of the time this article was written)
- `version` -- This is NOT the version of the package, but rather the version of the payload envelope. This version will change if any of the fields change.
- `hookOwner` -- An object with a username property. The username who created/owns the hook.
- `payload` -- The same data as curling the registry directly https://registry.npmjs.com/[PACKAGE_NAME] ** More below
- `change` -- Not always available! When it is available it will contain the attributes that were modified and used to identify the change type. The keys in this object will change depending on the event type.
- `time` -- Unix timestamp in ms. More importantly it's a nonce that can be used to prevent replay attacks.

Holy cow there was a lot there. These fields provide us almost all of the information we need to know to take action based on whatever type of change occurs.

### The payload

The payload of the hook is where the true verbosity comes into play. This payload will contain ALL of the information for ALL of the version of a package that have EVER BEEN RELEASED.

This doesn't seem like a big deal until you look at a package like [lodash](https://www.npmjs.com/package/lodash) which has 108 versions. The payload size alone is 190 kb (24.7 kb gzipped).

The key piece here is the payload size can get very large, so plan accordingly.

## Validating the hook

An important part of receiving a webhook is knowing that it's coming from a legitimate source. The body from an npm hook can be validated by using the `x-npm-signature` header as a checksum.

This header can be used to validate the payload was created by npm.  The `x-npm-signature` is created using the secret provided when setting up the hook.

Validation can be done using the crypto lib built into node.

```javascript
const crypto  = require('crypto');
const expectedSignature = crypto
    .createHmac('sha256', npmHookSecret)
    .update(requestBody)
    .digest('hex');

if (xNpmSignatureHeader !== `sha256=${expectedSignature}`) {
    throw new Error('Bad signature received. Rejecting hook.');
}
```

## Other `npm hook` commands

There are three other commands available for managing npm hooks.

### npm hook ls [entity]

This allows you to see all of the hooks you have setup using just `npm hook ls`, or just hooks for a specific entity using `npm hook ls awsudo`, as an example.

### npm hook update <id> <url> [secret]

The logic follows the name on this one. Update an existing hook by its `id`. It does not require you to update the secret, but you can if needed.

*More on getting the hook id below.*

### npm hook rm <id>

This one also reads as it acts, and will remove an existing webhook by its `id`.

## Getting a hook id

The frustrating thing is that you don't get the hook id back when you add it. The best way to get the id is to run `npm hook ls` and look through the table for the endpoint you need the id for.

Example output:

```bash
┌──────────┬─────────────────────┬─────────────────────────────┐
│ id       │ target              │ endpoint                    │
├──────────┼─────────────────────┼─────────────────────────────┤
│ hookidxx │ awsudo              │ https://my.webhook.endpoint │
│          ├─────────────────────┼─────────────────────────────┤
│          │ triggered yesterday │ 204                         │
└──────────┴─────────────────────┴─────────────────────────────┘
```

The id provided above is obviously fake, but you get the idea. Once you've gotten the id, then you can update or remove the hook as needed.

## Limits

A given user is only allowed to have 100 hooks at a tim (as of the writing of this article). So keep track of dead hooks and kill them if you don't need them.

## Let your imagination run wile

There are so many different uses for a webhook that watches for package changes. Simple things like slack updates, to managing release workflows based on published, to raising publishing release notes. The only limit will be your imagination!