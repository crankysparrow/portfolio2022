let p

function setup() {
	createCanvas(min(window.innerWidth, 500), min(window.innerHeight, 500))
	createLoop({ duration: 5 })
}

function draw() {
	seven()
	let n = easeInOutSine(animLoop.progress)
}

function windowResized() {
	resizeCanvas(min(window.innerWidth, 500), min(window.innerHeight, 500))
}

function easeInOutSine(x) {
	return -(cos(Math.PI * x) - 1) / 2
}

function seven() {
	background(0)
	noFill()
	stroke(255)

	let sizeMult = 0.9

	let m = width * 0.65

	let n = 5
	let step = m / n

	let size = (m / n) * sizeMult
	//    translate((width - m) / 2, (height - m) / 2)
	translate(width / 2, height / 2)
	rotate(PI / 4)
	translate(-m / 2, -m / 2)

	for (let x = 0; x < n; x++) {
		for (let y = 0; y < n; y++) {
			push()
			translate(x * step, y * step)
			translate((step - size) / 2, (step - size) / 2)

			fill(100, 200, 240)
			noStroke()
			circle(size / 2, size / 2, 5)

			let t, currentSize
			if ((x % 2 == 0 && y % 2 == 1) || (x % 2 == 1 && y % 2 == 0)) {
				t = easeInOutSine(animLoop.progress * 2)
				// t = sin(animLoop.theta)
				stroke(t * 255, 180 - t * 180, 240)
				strokeWeight(2)
				currentSize = size * 1.5
				translate((size - currentSize) / 2, (size - currentSize) / 2)
			} else {
				t = easeInOutSine(animLoop.progress * 2 - 0.5)
				// t = sin(animLoop.theta - PI * x)
				stroke(250 * t, 100, 200 - t * 200)
				strokeWeight(2)
				currentSize = size
				translate(currentSize / 2, currentSize / 2)
				rotate(PI / 4)
				translate(-currentSize / 2, -currentSize / 2)
			}
			// t = sin(animLoop.theta - PI * ((x + y) / (n * n)))

			noFill()

			let p = map(t, 0, 1, 0, size)

			shapeShape(p, currentSize)
			pop()
		}
	}
}

function shapeShape(p, size) {
	let pi = size - p
	let a = size * 0.25
	let b = size * 0.75

	beginShape()

	vertex(p, b)
	vertex(p, a)
	vertex(a, a)
	vertex(a, p)
	vertex(b, p)
	vertex(b, a)
	vertex(pi, a)
	vertex(pi, b)
	vertex(b, b)
	vertex(b, pi)
	vertex(a, pi)
	vertex(a, b)
	vertex(p, b)

	endShape()
}
