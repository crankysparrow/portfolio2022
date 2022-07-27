function setup() {
	createCanvas(250, 250)
	createLoop({ duration: 7 })
}

function draw() {
	background(240)
	stroke(255, 20, 80, 100)
	strokeWeight(2)
	noFill()

	let progress = map(sin(animLoop.theta), -1, 1, 0, 1)
	push()
	translate(50, 50)
	shape(150, progress)
	pop()

	noStroke()
	fill(0)
	let rounded = Math.round(progress * 1000) / 1000
	text(rounded, 10, 20)
}

function shape(size, progress) {
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
}
