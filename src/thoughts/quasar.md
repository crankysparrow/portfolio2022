---
title: notes on Quasar UI framework for Vue
date: 2022-05-15
layout: post.njk
tags: ['vue', 'quasar', 'accessibility']
excerpt: 'notes from building a splitwise app with quasar'
# img: ''
# permalink: false
# eleventyExcludeFromCollections: true
---

## how the heck do you start? 

The only major annoyance I came across was that there wasn't a simple option to add Quasar to an existing Vue project. The [Getting Started](https://quasar.dev/start/pick-quasar-flavour) page lists 4 "flavours" aka 4 ways to use Quasar. Three of them don't require starting a project from scratch - but those 3 all have big **warning** messages attached. The page for the [Vite plugin](https://quasar.dev/start/vite-plugin) basically says, "Are you sure this is what you want?!" 🤣 

I was going back to an old & messy project with several outdated dependencies and was already considering starting over with a fresh install, so I ended up just going the [Quasar CLI](https://quasar.dev/start/quasar-cli) route to create a new app with Vite. Admittedly, once I made the decision to start fresh, the whole thing was pretty easy. 

## pro: thorough documentation with lots of examples 

I do not read documentation. It doesn't work for my brain. I skip ahead to the examples, copy them, edit & break & fix them, and that's how I figure out how things work. The Quasar documentation has LOADS of examples, hence, I am happy! 

## semantic html 

I have a list of number inputs, each one part of a 100% split. I want to enclose all 3 in a fieldset, but Quasar does not offer this option. 

![screenshot of 3 text inputs with numbers which all add up to 100](/images/quasar-notes/splits.png)

This [git request](https://github.com/quasarframework/quasar/issues/2787) from 2019 states: "Due to performance constraints this will not get implemented." This seems not a great reason to me, particularly considering that fieldset aids in accessibility. 

## form input validation 

[validation](https://quasar.dev/vue-components/input#validation) is fairly simple to set up and performant, but it runs the check each time you tab or click out of an input. Sometimes I simply want to tab through fields without filling them out, either because I'm not filling the fields out in order or I'm simply using the tab key to navigate around the page and not actually to fill out the form at that moment. So an immediate error message as soon as I tab out of the field always seems jarring to me. I tried it with VoiceOver, which made it even more jarring, since those error messages are inside `aria-live` regions and you actually have VoiceOver yelling at you every time one of those validation checks runs. This may very well be a personal pet peeve,though, and not anything particularly universal. 