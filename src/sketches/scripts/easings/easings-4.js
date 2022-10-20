function easeInQuad(x) {
	return x * x
}

function easeInQuadCyc(p) {
	if (p < 0.5) {
		return easeInQuad(p * 2)
	} else {
		return 1 - easeInQuad((p - 0.5) * 2)
	}
}

function setup() {
	createCanvas(250, 250)
	createLoop({ duration: 2 })
}

function draw() {
	clear()
	fill(255, 20, 80)
	noStroke()

	let p = animLoop.progress
	let val = easeInQuadCyc(p)

	let pos = map(val, 0, 1, height * 0.2, height * 0.8)
	let r = map(val, 0, 1, height * 0.2, height * 0.4)

	translate(width / 2, pos)
	circle(0, 0, r)
}
