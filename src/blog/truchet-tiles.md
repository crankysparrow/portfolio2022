---
title: generating symmetry
date: 2021-09-19
layout: post.njk
tags: ['generative art', 'javascript', 'p5js']
excerpt: 'exploring principles of symmetry with truchet tile patterns'
img: '/images/truchet/truchet-01.jpeg'
---

I recently learned about [truchet tiles](https://en.wikipedia.org/wiki/Truchet_tiles) and decided to play around with creating patterns with them. I wanted to use some degree of randomness, but just looping through an array and setting all the tiles at random doesn't create the most elegant results. I wanted to create symmetry out of the randomness in some way.

After playing awhile with I wanted to try creating symmetry out of the randomness in some way. I also just discovered p5's [`createGraphics`](https://p5js.org/reference/#/p5/createGraphics) function, so this seemed like a good use for that as well!

## The process:

Build an image of a large tile, made up of `n` rows of `n` smaller tiles. So if `n = 3`, you have a large square tile made up of 9 smaller tiles.

Then, print your large tile in 2 rows of 2...applying transformations to create symmetry.

About symmetry: This is another concept I just stumbled across recently. There is more than one type of symmetry! (I suppose that's obvious, but I'd never thought much about it) With these tiles, we can create designs that have either [reflection symmetry](https://en.wikipedia.org/wiki/Reflection_symmetry) or [rotational symmetry](https://en.wikipedia.org/wiki/Rotational_symmetry).

Here are two patterns built from the same 2x2 tile. The first uses reflection, the second uses rotation:

<div style="display: flex;">

![reflection](/images/truchet/truchet-04.jpg)

![rotation](/images/truchet/truchet-05.jpg)

</div>

I spent a few hours one Sunday morning writing code in p5.js to lay out the tiles, and setting up a few controls to adjust the number of tiles in the inner grid, to switch between rotation & reflection options, and to come up with random complementary color combinations.

## Some results

![](/images/truchet/truchet-01.jpeg)

![](/images/truchet/truchet-02.jpeg)

![](/images/truchet/truchet-03.jpeg)

![](/images/truchet/truchet-06.jpeg)

![](/images/truchet/truchet-07.jpeg)

![](/images/truchet/truchet-08.jpeg)

![](/images/truchet/truchet-09.jpeg)

![](/images/truchet/truchet-10.jpeg)

![](/images/truchet/truchet-11.jpeg)

![](/images/truchet/truchet-12.jpeg)

## Truchet Tile Resources

-   [pattern generator tool](https://dmackinnon1.github.io/truchet/)
-   [what are truchet tiles?](https://questionsindataviz.com/2021/03/03/what-are-truchet-tiles/)
-   [the curse of truchet's tiles](http://arearugscarpet.blogspot.com/2014/04/the-curse-of-truchets-tiles.html)
-   [comp form: tile maps](https://compform.net/tiles/)
