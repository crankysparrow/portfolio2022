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

## semantic html 

I have a list of number inputs, each one part of a 100% split. I want to enclose all 3 in a fieldset, but Quasar does not offer this option. 

![screenshot of 3 text inputs with numbers which all add up to 100](/images/quasar-notes/splits.png)

This [git request](https://github.com/quasarframework/quasar/issues/2787) from 2019 states: "Due to performance constraints this will not get implemented." This seems not a great reason to me, particularly considering that fieldset aids in accessibility. 