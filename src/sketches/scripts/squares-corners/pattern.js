function setup() {
	// createCanvas(800, 200)
	let w = min(window.innerWidth, 800)
	let h = w * 0.25
	createCanvas(w, h)

	noLoop()
}

function windowResized() {
	let w = min(window.innerWidth, 800)
	let h = w * 0.25
	resizeCanvas(w, h)
	redraw()
}

function draw() {
	noFill()
	clear()
	background(240)

	let stepDist = width * 0.1875
	let stepStart = width * 0.0625
	let sqSize = height / 2
	let i = 0

	while (i < 5) {
		let progress = 0.25 * i
		let pos = stepStart + stepDist * i
		doStep(pos, sqSize / 2, sqSize, progress)
		writeText(progress, pos, 20)
		i++
	}
}

function writeText(content, x, y) {
	push()
	fill(0)
	noStroke()
	text(content, x, y)
	pop()
}

function doStep(x, y, size, p) {
	push()
	translate(x, y)
	noFill()
	stroke(255, 200, 150, 70)
	rect(0, 0, size, size)
	stroke(255, 20, 80, 100)
	shapeShape(size, p, true)
	pop()
}

function shapeShape(size, progress) {
	let c1 = size * 0.25
	let c2 = size - c1
	let e1 = size * progress
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

	noStroke()
	fill(100, 0, 255)
	circle(c1, c1, 5)
	circle(c2, c1, 5)
	circle(c2, c2, 5)
	circle(c1, c2, 5)
}
