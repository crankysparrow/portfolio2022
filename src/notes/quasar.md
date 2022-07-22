---
title: 'scratchpad: Quasar'
date: 2022-05-15
dateUpdated: 2022-07-21
layout: post.njk
tags: ['vue', 'quasar', 'ui']
order: 1
excerpt: 'quasar is an open-source UI framework based on vue. I used it to build an app and kept some notes here.'
# img: ''
# permalink: false
# eleventyExcludeFromCollections: true
---

I used [Quasar](https://quasar.dev/) for [a Splitwise app I created](https://github.com/crankysparrow/splitwise-group-expenses) to make it easier for my partners and I to input expenses with uneven splits, which is annoyingly difficult on splitwise.com itself. 

It wasn't the most common or popular framework I found, but when I started this in April or May 2022 there weren't a lot of frameworks supporting Vue3 yet, I was searching for one that did and stumbled across this one. I haven't used a whole lot of these UI frameworks so I don't have much of a framework (ha!) for comparison, but [other people](https://www.smashingmagazine.com/2021/10/introduction-quasar-framework-cross-platform-applications/) [on the internet](https://www.reddit.com/r/vuejs/comments/gnrv0y/quasar_framework_seriously_whats_the_catch/) seem to appreciate this one.

![character Q from Star Trek TNG saying "How about a big hug?"](/images/quasar-notes/q.gif)
Q from *Star Trek: The Next Generation*, because literally everything Quasar is prefixed with a Q {caption}

## reminders & gotchas 

* start dev server: `quasar dev` 
* ensure # doesn't show up in URL: set `vueRouterMode: 'history'` in `quasar.config.js`
* here's the [list of default scss variables](https://quasar.dev/style/sass-scss-variables#customizing). Customize them by creating `src/css/quasar.variables.scss` (or `.sass`)
* and here's the [list of CSS helper classes for positioning](https://quasar.dev/style/spacing#table-of-permutations) - basically it's bootstrap with "q-" in the front 
* routing is defined in `src/router/routes.js` and is pretty straightforward
* command to add pinia store: `quasar new store <store_name>`

## pros + cons

| Pros {tablefixed}                  |  Cons {tablefixed}                | 
| --------------------- | --------------------- |
| CLI is easy to set up & use | Integrating it into an existing project seems unnecessarily complex  | 
| has a component for everything | has a component for _everything_ |
| thorough docs with lots of examples | seemed a bit tough to find support online, not sure how many people are actually using this |
| the site includes this [layout builder](https://quasar.dev/layout-builder) to generate a boilerplate layout | layout structure is kinda confusing: My main layout has this attribute: `view="hHh lpR fFf"` ...no clue what this means |
| easily supports a bunch of [icon libraries](https://quasar.dev/vue-components/icon) | not particularly cute (really material looking) |
| includes Vue3, vite, pinia, and other up-to-date gadgets | .. |

## notes/observations

### semantic html pls

I have a list of number inputs, each one part of a 100% split. I want to enclose all 3 in a fieldset, but Quasar does not offer this option. 

![screenshot of 3 text inputs with numbers which all add up to 100](/images/quasar-notes/splits.png)

This [git request](https://github.com/quasarframework/quasar/issues/2787) from 2019 states: "Due to performance constraints this will not get implemented." This seems not a great reason to me. 

Brings me to a more general point of __accessibility__ is probably not great. Focus styles are barely noticeable where they exist at all. Buttons are divs. Etc. 

### form input validation 

By default form fields show an immediate error if you focus on them and then focus out of them without filling them out all the way. Despite being a common-ish pattern, this always seems jarring to me - sometimes I just want to tab through fields without filling them out, either because I'm not filling the fields out in order or I'm simply using the tab key to navigate around the page. 

I did figure out eventually that I could turn this off by adding `lazy-rules="ondemand"` to the `q-input` component. 

<!-- [validation](https://quasar.dev/vue-components/input#validation) is fairly simple to set up and performant, but it runs the check each time you tab or click out of an input. Sometimes I simply want to tab through fields without filling them out, either because I'm not filling the fields out in order or I'm simply using the tab key to navigate around the page and not actually to fill out the form at that moment. So an immediate error message as soon as I tab out of the field always seems jarring to me. I tried it with VoiceOver, which made it even more jarring, since those error messages are inside `aria-live` regions and you actually have VoiceOver yelling at you every time one of those validation checks runs. This may very well be a personal pet peeve,though, and not anything particularly universal.  -->