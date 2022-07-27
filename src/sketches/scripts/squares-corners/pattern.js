function setup() {
	createCanvas(800, 200)
	noLoop()
}

function draw() {
	noFill()
	clear()
	background(240)

	doStep(50, 50, 100, 0)
	writeText('0', 50, 20)

	doStep(200, 50, 100, 0.25)
	writeText('0.25', 200, 20)

	doStep(350, 50, 100, 0.5)
	writeText('0.5', 350, 20)

	doStep(500, 50, 100, 0.75)
	writeText('0.75', 500, 20)

	doStep(650, 50, 100, 1)
	writeText('1', 650, 20)
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

function shapeShape(size, p, inclCorners) {
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

	if (inclCorners) {
		// corners(cx1, cx2, cy1, cy2, ts, r)
	}
}
