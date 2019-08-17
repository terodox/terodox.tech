---
title: "Testing MomentJs with Jest"
comments: true
category: Testing
cover: moment-cover.png
author: Andy Desmarais
---

# Testing MomentJs with Jest

The date/time library MomentJs is among the most powerful date/time libraries available in javascript. It handles dates, times, and timezone which allow almost any developer to breath a pretty big sigh of relief. But, and you saw this coming, it is incredibly challenging to test. The composition of the moment object is such that it is both a function and an object which creates significant challenges when it comes to testing.

## TL;DR Use jest.mock

The quick and dirty is that we can spy on any method returned from the moment function by creating a fake version that has the methods we need spied, then mapping all of the real properties back onto our fake method. The nuance to this is interesting and discusses in depth below.

```javascript
jest.mock('moment', () => {
    const moment = require.requireActual('moment');
    const momentInstance = moment();
    jest.spyOn(momentInstance, 'format');

    function fakeMoment() {
        return momentInstance;
    }

    Object.assign(fakeMoment, moment);

    return fakeMoment;
});
```

## moment is a function and an object. Uh oh

The current implementation of moment is very challenging. The method we get access to as consumers is more than just a method, it also has a bunch of properties. This usually doesn't matter unless we are using moment-timezone which has an immediate safety check on the version property of the object! This safety means that we can't simply spy on the moment function or we get an all too familiar error:

```bash
TypeError: Cannot read property 'split' of undefined
```

Wait, what? Why am I getting cannot read property `split`?

This is where moment being a method with properties really hurts. Moment-timezone does a quick check of the version of moment to guarantee it is compatible before monkey patching methods on for timezone use. This means that directly mocking or spying on the moment method will break moment-timezone.

## So what do I have to do!?

The solution is not complex, but it is nuanced. The basic idea is to get an actual instance of the moment object first using the "require.requireActual" jest.mock helper. Then we can spyOn an of the moment methods we need to, including tz() if necessary!

Once we have our instance with the spied methods, we create a fake function. This will be our stand-in moment method. Keeping in mind that moment is a method with properties, we then apply all of the properties from our real instance onto our fake method allowing moment-timezone to work again.

Here's our full example:

```javascript
jest.mock('moment', () => {
    const moment = require.requireActual('moment');
    const momentInstance = moment();
    jest.spyOn(momentInstance, 'format');

    function fakeMoment() {
        return momentInstance;
    }

    Object.assign(fakeMoment, moment);

    return fakeMoment;
});
```

I hope this will save you the several hours it cost me while troubleshooting this issue. Do you have a better way to handle this? Leave it in the comments!
