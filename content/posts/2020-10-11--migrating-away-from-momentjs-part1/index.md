---
title: "Mirgating away from momentjs - Part 1 - Deciding the successor"
comments: true
category: JavaScript
cover: migration.jpg
author: Andy Desmarais
---

###### Cover photo credit: [Christian Erfurt](https://unsplash.com/@christnerfurt)

MomentJs recently announced that [the library is now deprecated](https://momentjs.com/docs/#/-project-status/). This is a big deal for the javascript community who actively downloads moment almost 15 million times a week. With that I began a journey during a Hackathon to replace moment in a core library at my company.

## The old king is dead, but who's the new king?

The start of any journey to replace a deprecated library has to begin with finding a replacement. In the case of moment, this is no trivial task. Moment offers a lot of functionality, and when combined with moment-timezone, the challenge is even greater.

Let's talk about my particular use case. My team chooses to deploy our web apps following the [Immutable Web Apps](https://immutablewebapps.org/) philosophy. The TL;DR here is that we deliver fully qualified versions of dependencies and built assets. This helps ensure the only changes between staging and production are basic configuration values. Read more about it [here](https://immutablewebapps.org/).

The other major consideration is that I work for an international company with clients in 13 different languages, and countless timezones. Localization, timezone, and offset support are all critical.

With that in mind let's check out the contenders.

## And in this corner...

We started with recommendations from the moment deprecation guide and tossed in some fan favorites to make sure we made the best choice we could. Keep in mind that there was a time constraint, so we couldn't examine every option. Here's the list we compiled:

- [date-fns](https://github.com/date-fns/date-fns#readme)
- [day.js](https://day.js.org/)
- [spacetime](https://github.com/spencermountain/spacetime#readme)
- [luxon](https://moment.github.io/luxon/)

## How to decide a winner

Once we compiled our list of options, we got the bundle size for each of the packages including all required plugins/addons to support timezones and locales. Here's how they stacked up:

- moment - 327KB, but also needs moment-timezone (185KB)
  - Total: 513KB 😮
- date-fns - 37.3 KB, but also needs date-fns-timezone (2KB), and all locales (26 KB)
  - Total: ~64KB
  - Eliminated due to lack of pre-built bundle. We need a single source of truth for IWA, and did not want to have to maintain a build process.
- day.js - 2KB, but also needs the utc and timezone plugins (4KB), and all locales (26 KB)
  - Total: ~32KB
- spacetime - Eliminate early due to this DST [comment in the readme](https://github.com/spencermountain/spacetime#-dst-changes-within-1-hour).
- luxon - 71KB, Everything is included, and it relies on the INTL api for locales.

The next step is to vet the remaining two libraries for the functionality we need. The best way we could come up with to accomplish this is to write a test suite to exercise moment's features, then run each library through that gauntlet.

What we tested: ([It's open sourced!](https://github.com/terodox/mirgrating-away-from-momentjs#readme))

- basics
  - Parsing dates
  - formatting dates (with offsets)
- Date math (with timezones and offsets)
  - Adding (minutes, hours, days, weeks, months, years)
  - Subtracting (minutes, hours, days, weeks, months, years)
- Assistive functions
  - startOf (day, week, month, quarter)
  - endOf (day, week, month, quarter)
- Localization
  - For each of the 13 locales
- Timezones
  - Change timezone
  - Apply same timezone (time shouldn't change)
  - Test for valid [IANA timezone string](https://www.iana.org/time-zones)
- Daylight savings time
  - Crossing into daylight savings time
  - Crossing out of daylight savings time
  - Starting in DST and adding time to end up in DST
  - Starting outside DST and adding time to end up outside DST

Well. That was exhausting...

![exhausted](exhausted.gif)

We first started by writing the test suite against moment to have a "static" source of truth for values we trusted. This yielded a set of function names that we then needed to fulfill with day.js and luxon.

## Ding! Ding! Ding! We have a winner!

This test suite proved invaluable. We were able to learn how both libraries worked for our use cases as well as finding a critical failure in day.js.

It turns out the day.js does not support daylight savings time very well, and there are [numerous open issues](https://github.com/iamkun/dayjs/issues?q=is%3Aissue+is%3Aopen+DST+OR+%22daylight%22) around it on the repo. The most critical of which does not calculate offset properly when entering or leaving DST.

So we have our winner: **luxon**

## Wrapping up

It was not a very long journey to arrive here honestly. A little more than a day of effort allowed us to have full confidence in our choice of **luxon** as our library moving forward. It has all of the utilities, timezone support and locale support that we need. It's bundle size is not the smallest, but compared to the 513KB of moment + moment-timezone, it's still a huge improvement.

Check out Part 2 (coming soon) for how we migrated the actual library.
