---
title: 'squares, corners'
date: 2022-07-26
dateUpdated: 2022-09-21
tags: ['generative art']
excerpt: 'loops & patterns based on modifying a square plus-sign shape & obsessing over little variations'
order: 2
---

I was going through some generative art experiments from earlier this year, and found a bunch that are all riffing off this same concept of animating points on a square plus-sign shape.

basic pattern goes like this...

{% include './views/partials/frame.njk' frame: "/sketches/pattern", size: "wide" %}

The 4 corners of the square (in purple above) are always the same, then the 8 points around that move in & out depending on the animation's progress. In motion:

<div class="code-img width-sm" style="--height: 280px; --img-col: 250px;">

{% highlight js %}
function shapeShape(size, p) {
	let c1 = size * 0.25
	let c2 = size - c1
	let e1 = size * p
	let e2 = size - e1

	beginShape()

	vertex(e1, c1)
	vertex(c1, c1)
	vertex(c1, e1)
	vertex(c2, e1)
	vertex(c2, c1)
	vertex(e2, c1)
	vertex(e2, c2)
	vertex(c2, c2)
	vertex(c2, e2)
	vertex(c1, e2)
	vertex(c1, c2)
	vertex(e1, c2)
	vertex(e1, c1)

	endShape()
}
{% endhighlight %}

<div class='img-col'>

{% include './views/partials/frame.njk' frame: "/sketches/basic-cross", size: "sm" %}

</div>
</div>

`p` is the progress of the animation loop, between 0 and 1. Using `animLoop.theta` via [p5.createLoop](https://github.com/mrchantey/p5.createLoop):

```js
let p = map(sin(animLoop.theta), -1, 1, 0, 1)
```



Super simple... but makes cool stuff like this: 

<div class='flex'>

{% include './views/partials/frame.njk' frame: "/sketches/coolexample1" %}

{% include './views/partials/frame.njk' frame: "/sketches/coolexample2" %}

</div>

All of these though are still based on the corners of the inner square (the purple dots in the depiction above) being in the same place throughout - they're placed at 0.25 and 0.75 (out of a square of size 1). But what if we vary the edge points instead? What if we vary both? 

In the simple example above: \
	`corner = 0.25`\
	`edge = p` \
	(both then multiplied by the size of the square container)

The values of `corner` and `edge` are included in the p5 sketch below:

{% include './views/partials/frame.njk' frame: "/sketches/basic-cross-corners" size: "wide" style:"--padBottom: 50%" %}

<style type='text/css'>
	@media (min-width: 630px) {
	.flex {
		display: flex;
	}
	.flex .frame-wrap {
		margin-right: 1rem;
	}
	}
    pre[class*=language-], pre, code[class*=language-] {
        font-size: 0.75rem;
    }
</style>