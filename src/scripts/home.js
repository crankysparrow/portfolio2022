const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
let still = mediaQuery.matches ? true : false

let turquoise, shape1, m
let addNoise = 0
let seed = 1

function setup() {
	m = min(window.innerWidth, window.innerHeight)
	colorMode(HSL)

	turquoise = color(171, 66, 50)
	turquoise.setAlpha(0.5)

	let canvas = createCanvas(window.innerWidth, window.innerHeight)
	canvas.parent('#sketch')

	shape1 = new LinesCircle(m * 0.7, 0.8)

	if (still) {
		noLoop()
	}
}

function draw() {
	addNoise += 0.005

	clear()
	strokeWeight(2)
	stroke(turquoise)

	let w = mouseX / width
	let h = mouseY / height

	shape1.noiseOffset += 0.005

	let ms = map(mouseX, 0, width, m * 0.6, m * 1.1)
	shape1.magScale = lerp(shape1.magScale, ms, 0.1)
	shape1.rotate = lerp(shape1.rotate, h * (PI / 6), 0.01)

	shape1.translateX = lerp(shape1.translateX, map(h, 0, 1, -30, 30), 0.01)
	shape1.translateY = lerp(shape1.translateY, map(w, 0, 1, -30, 30), 0.01)

	noFill()
	push()
	translate(width * 0.7, height * 0.5)
	shape1.drawShape()

	pop()
}

class LinesCircle {
	constructor(magScale, noiseOffset, rotation = 0) {
		this.magScale = magScale
		this.mag = this.magScale
		this.noiseOffset = noiseOffset
		this.a = 0
		this.rotate = rotation
		this.translateX = 0
		this.translateY = 0

		this.inc = PI / 97
	}

	drawLine(a) {
		let noiseFactor = abs(sin(a * 2)) + this.noiseOffset
		let mValue = noise(noiseFactor)
		this.mag = mValue * this.magScale

		let v = p5.Vector.fromAngle(a, this.mag)
		line(0, 0, v.x, v.y)
	}

	drawShape() {
		push()
		rotate(this.rotate)
		translate(this.translateX, this.translateY)
		let a = 0
		let i = 0
		while (a < PI * 2) {
			stroke(turquoise)
			this.drawLine(a)
			a += this.inc
			i++
		}
		pop()
	}
}

const btn = document.querySelector('#animate-toggle')
if (still) btn.innerHTML = 'play<br/>animation'

function mousePressed(e) {
	if (e.target.matches('#animate-toggle')) {
		if (still) {
			still = false
			btn.innerHTML = 'pause<br />animation'
			loop()
		} else {
			still = true
			noLoop()
			btn.innerHTML = 'play <br/>animation'
		}

		return
	} else {
		seed++
		noiseSeed(seed)
		if (still) {
			redraw()
		}
	}
}

function windowResized() {
	m = min(window.innerWidth, window.innerHeight)
	resizeCanvas(window.innerWidth, window.innerHeight)
}
