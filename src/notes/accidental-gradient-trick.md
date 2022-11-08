---
title: accidental gradient canvas trick
date: 2022-11-06
dateUpdated: 2022-11-06
layout: post.njk
tags: ['generative art', 'colors']
excerpt: ''
img: '/images/accidental-gradient/gradient.jpg'
imgAlt: 'red, magenta, cyan & blue gradient'
order: 20
---

I was using p5's `createImage` function to create a teeny tiny image, 2 pixels by 2 pixels, in order to test out a function to sort colors of each pixel. 

```js 
function setup() {
	createCanvas(400, 400)
	noLoop()
}

function draw() {
	let img = createImage(2, 2)
	img.loadPixels()

	img.set(0, 0, color(255, 0, 0, 255))
	img.set(1, 0, color(255, 0, 255, 255))
	img.set(0, 1, color(0, 255, 255, 255))
	img.set(1, 1, color(0, 0, 255, 255))

	img.updatePixels()

    image(img, 0, 0, width, height)
}

```

What I expected with the last call to `image` was that the image would be drawn (zoomed in) with clear delineations between each pixel, like this: 



{% imgStyle "/images/accidental-gradient/expectation.png", "image divided into four even quadrants colored red, magenta, cyan, and blue", "width: 50%; margin: 0 auto 1rem; display: block;" %}

In reality it ended up looking like this: 

{% imgStyle "/images/accidental-gradient/grad.jpg", "image divided into four quadrants colored red, magenta, cyan, blue; the colors blend into each other forming a gradient effect", "width: 50%; margin: 0 auto 1rem; display: block;" %}


This behavior is pretty simple to turn off by simply adding a `noSmooth()` in the setup function, but it was a sort of neat surprise to see the image appear this way at first! 

I'm curious if something similar would happen using the Canvas API without the layer of p5 over it. This might be a good place to start - [pixel manipulation with canvas on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas).