---
title: sort pixels by color
date: 2022-11-06
dateUpdated: 2022-11-07
layout: post.njk
tags: ['generative art', 'colors', 'p5js']
excerpt: "accessing, analyzing, and manipulating the pixels array in p5.js"
img: '/images/sort-paint-lightness.png'
imgAlt: 'pixelated colors'
order: 40
---

How to grab a big list of all the pixels in an image, and then do some manipulation to them (like sorting them by hue/brightness/etc). This is all in p5.js for now but I would be curious to try something like it using the native canvas API. 

## Load an image

```js 
let img 

function preload() {
    img = loadImage(imgUrl) 
}

function setup() {
	createCanvas(200, 200)
	noLoop()
}

function draw() {
    // if you just want to draw the image on the canvas: 
    // image(img, 0, 0)

    // but we want to actually examine the pixels: 
    img.loadPixels() 
}
```

Now we have access to `img.pixels`, which is an array holding data for literally every individual pixel in the image. We're going to iterate through them, sort them somehow, and then spit them back out onto the canvas. 

## Tangent: How the `pixels` array works

Pixels are stored as rgba colors; each pixel has a value for red, green, blue, and alpha. Meaning each pixel gets four elements in the array. If our image is 200 pixels wide and 200 pixels tall, that's `200 * 200 = 40,000` pixels. Since each pixel is actually 4 array elements, our total array length is `40,000 * 4 = 160,000`.

Here's a crude illustration, if you have a tiny 3x3 image (this image has a really silly mistake, the first i should be a 0! don't mind me!): 

{% image src="src/imgs/sort-colors/pixels-and-array.jpg", alt="checkerboard type drawing representing pixels in an image that is 3 pixels wide and 3 pixels tall. an array above it with r, g, b, and a repeating. Lines indicate that each pixel corresponds with one sequence of r, g, b, and a in the array." %}

Note that in many cases we are using retina or high density displays which have MORE pixels. The pixel density value is accessible through p5's `pixelDensity()` function, or in the variable `window.devicePixelRatio`. On my screen, pixel density is 2. That means each pixel is actually a tiny 2x2 square of pixels... so actually that 200x200 image on my screen might be represented in an array not with a length of 160,000 but `160,000 * 4 = 640,000`. ANYWAY, p5 doesn't seem to factor this in when you just load the image without actually displaying it, so I'm going to mostly ignore that for now. 

If we want to find the data for the pixel at a given point `x` and `y`, we can use the formula  
`i = (y * img.width + x)  * 4`. The variable `i` is just the first index where data for that pixel is held (the red value).

{% image src="src/imgs/sort-colors/findpixel2.jpg", alt="Demonstration of finding the first index in the pixels array for the pixel at x=0 and y=1. Using the formula index = (y * width + x) * 4" %}

## Loop over pixels 

So for a demo I'm going to use this image of street art in Rio de Janeiro, from a recent trip this summer: 

{% image src="src/imgs/sort-colors/rio-art.jpg", alt="Street art representation of a femous Brazilian art piece I forget the name of.", sizes="300w", widths=[300, 600], style='max-width: 300px' %}

I'm using [parcel](https://parceljs.org/) to load the images and size them down a bunch, because a larger image means exponentially more pixels to cycle through which means the program gets slower & slower. I'm starting with a 400x400 image. That's still a lot of looping. 

Initialize a colors array and loop through each pixel: 

```js
img.loadPixels()
let colors = []

for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
        let i = (y * img.width + x) * 4
        let c = color(img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3])
        colors.push(c)
    }
}
```
## sort pixels & draw them on the canvas

Use native `array.sort()` to sort the colors. For now we're going to sort by hue, using p5's `hue()`. 

```js
colors.sort((a, b) => hue(a) - hue(b))
```

Loop through the width & height of the image again, adding one point for each sorted pixel: 

<div class='code-img width-sm'>

```js 
let i = 0
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        stroke(colors[i])
        point(x, y)
        i++
    }
}
```

{% image src="src/imgs/sort-colors/rio-sorted.jpg", alt="mostly just lines and specks, not looking like anything significant.", sizes="300w", widths=[300, 600], style='max-width: 300px' %}

</div>

Okay... cool I guess, but maybe this would work better with an image with more bright, distinct colors. Let's try this one I just grabbed free from pexels: 

<div class='flex'>

{% image src="src/imgs/sort-colors/pexels-steve-johnson-sq.jpg", alt="colorful paint splatters.", sizes="300w", widths=[300, 600], style='max-width: 300px' %}

{% image src="src/imgs/sort-colors/paint-splatter-sort.jpg", alt="sorted pixels by hue from red to yellow to blue to pink", sizes="300w", widths=[300, 600], style='max-width: 300px' %}

</div>

## skip some pixels

We probably don't need to iterate over *every single pixel* though... we can get the same idea from grabbing every 2 or 3 pixels.

<details>
<summary>extra tangential stuff under here</summary>

<div class="code-img width-sm">

```js 
let colors = []
let step = 2

for (let x = 0; x < img.width; x += step) {
    for (let y = 0; y < img.height; y += step) {
        let i = (y * img.width + x) * 4
        let c = [img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3]]
        colors.push(c)
    }
}

sortColors(colors, 'hue')
let i = 0
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        stroke(colors[i])
        point(x, y)
        i++
    }
}
```

<div class='img-col'>
<em>result:</em>

{% image src="src/imgs/sort-colors/sort-colors-step.jpg", alt="sorted pixels again, but this time only filling a quarter of the image size", sizes="300w", widths=[300, 600], style='max-width: 300px' %}
</div>

</div>

Sooo that only filled a quarter of the space in the image because I didn't update the loop that actually draws the pixels. Here's another oops - stepping by the correct amount this time, but still only drawing a point at each step so that it doesn't fill the entire space. 

<div class="code-img width-sm">

```js
let i = 0
for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
        stroke(colors[i])
        point(x, y)
        i++
    }
}
```
<div class='img-col'>
<em>result:</em>

{% image src="src/imgs/sort-colors/also-oops.jpg", alt="square filled with dots, but the dots have gaps in between them", sizes="300w", widths=[300, 600], style="max-width: 300px" %}
</div>

</div>

I feel like this mistake looks kinda neat though, especially if you zoom in with a darker background: 

<div class='flex cols-2'>

{% image src="src/imgs/sort-colors/zoom-squares.png", alt="zoom in on lots of little colored squares with black background", sizes="100vw", widths=[500, 1000, null], quality=100, formats=['webp', 'png'], classNames='col' %}

{% image src="src/imgs/sort-colors/zoom-p5.png", alt="zoom in on lots of little colored circles with black background", sizes="100vw", widths=[500, 1000, null], quality=100, formats=['webp', 'png'], classNames='col' %}

</div>

As a side note, I'm not sure why the points show up as circles when scaled up in p5 (the left image), but squares if I save the canvas and then zoom in (the right image).

</details>

```js 
let colors = []
let step = 2

for (let x = 0; x < img.width; x += step) {
    for (let y = 0; y < img.height; y += step) {
        let i = (y * img.width + x) * 4
        let c = [img.pixels[i], img.pixels[i + 1], img.pixels[i + 2], img.pixels[i + 3]]
        colors.push(c)
    }
}

sortColors()
let i = 0
for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
        fill(colors[i])
        rect(x, y, step, step)
        i++
    }
}
```

{% image src="src/imgs/sort-colors/paint-sorted.png", alt="final result, rainbow colored squares arranged from red to yellow to blue and pink", sizes="100vw", widths=[500, 1000, null], quality=100, formats=['png'] %}

## sort by different values

We can also sort by different values, which p5 makes super easy. I made a `sortColors()` function: 

```js
function sortColors(colors, mode) {
	switch (mode) {
		case 'hue':
			colors.sort((a, b) => hue(a) - hue(b))
			break
		case 'red':
			colors.sort((a, b) => red(a) - red(b))
			break
		case 'green':
			colors.sort((a, b) => green(a) - green(b))
			break
		case 'blue':
			colors.sort((a, b) => blue(a) - blue(b))
			break
		case 'saturation':
			colors.sort((a, b) => saturation(a) - saturation(b))
			break
		case 'brightness':
			colors.sort((a, b) => brightness(a) - brightness(b))
			break
		case 'lightness':
			colors.sort((a, b) => lightness(a) - lightness(b))
			break
		default:
			break
	}
}
```

## more examples: 

### sort by saturation (left), lightness (right)

<div class='flex cols-2'>

{% image src="src/imgs/sort-colors/sort-paint-saturation.png", alt="", sizes="350w", widths=[350, 700, null], classNames='col', format=['png'] %}

{% image src="src/imgs/sort-colors/sort-paint-lightness.png", alt="", sizes="350w", widths=[350, 700, null], classNames='col', format=['png'] %}

</div>

### sort by two factors 

<div class='code-img width-sm'>

```js
colors.sort((a, b) => {
    if (abs(hue(a) - hue(b)) < 10) {
        return lightness(a) - lightness(b)
    } else {
        return hue(a) - hue(b)
    }
})
```
{% image src="src/imgs/sort-colors/sort-hue-lightness.png", alt="", sizes="350w", widths=[350, 700, null], classNames='img-col', format=['png'] %}

</div>

### different image - sort by saturation

<div class='flex cols-2'>

{% image src="src/imgs/sort-colors/umbrellas.jpg", alt="rainbow colored umbrellas between two roofs, against a blue sky", sizes="350w", widths=[350, 700, null], classNames='col' %}

{% image src="src/imgs/sort-colors/umbrellas-sorted.png", alt="", sizes="350w", widths=[350, 700, null], classNames='col' %}

</div>