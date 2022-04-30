let space, blue, mint, turquoise
let shape1, shape2
let m
let tileSize, stepSize
let numTiles = 10
let shapeSize = 1
let alphaVal = 100

function setup() {
	m = min(window.innerWidth, window.innerHeight)
	colorMode(HSL)

	space = color(248, 32, 24)
	blue = color(203, 99, 48)
	// turquoise = color(171, 66, 76)
	turquoise = color(171, 66, 50)
	// turquoise.setAlpha(0.5)

	let canvas = createCanvas(window.innerWidth, window.innerHeight)
	canvas.parent('#sketch')

	rectMode(CENTER)

	m = min(width, height)
	stepSize = m / numTiles
	tileSize = stepSize * 0.8
}

function draw() {
	clear()
	strokeWeight(2)
	stroke(turquoise)
	noFill()

	// translate(width / 2, height / 2)
	let mousePointX = map(mouseX - (width - m) / 2, 0, m, -m / 2, m / 2)
	let mousePointY = map(mouseY - (height - m) / 2, 0, m, -m / 2, m / 2)

	let x = 0

	while (x < width + stepSize) {
		let y = 0
		while (y < height + stepSize) {
			let d = dist(mouseX, mouseY, x, y)
			let s = map(d, 0, m, tileSize, tileSize * 0.6)

			let r = map(d, 0, m, -PI / 2, PI / 2)

			let xOff = ((mouseX - x) / m) * tileSize
			let yOff = ((mouseY - y) / m) * tileSize

			strokeWeight(3)
			stroke(turquoise)
			push()
			translate(x, y)
			rotate(r)
			translate(xOff, yOff)
			rect(0, 0, s)
			pop()
			y += stepSize
		}
		x += stepSize
	}

	// for (let yStep = -numTiles / 2; yStep <= numTiles / 2; yStep++) {
	// 	for (let xStep = -numTiles / 2; xStep <= numTiles / 2; xStep++) {
	// 		let x = tileSize * xStep
	// 		let y = tileSize * yStep
	// 		let d = dist(mousePointX, mousePointY, x, y)
	// 		let dx = mousePointX - x
	// 		let dy = mousePointY - y
	// 		let xOff = (dx / m) * tileSize
	// 		let yOff = (dy / m) * tileSize

	// 		push()
	// 		translate(x, y)

	// 		let s = map(d, 0, m, tileSize * 1.5, tileSize * 0.5) * shapeSize
	// 		// rotate(map(d, -m / 2, m / 2, 0, PI))
	// 		// translate(xOff, yOff)
	// 		var col = lerpColor(turquoise, blue, d / m)
	// 		col.setAlpha(alphaVal)
	// 		noFill()
	// 		stroke(col)
	// 		strokeWeight(3)
	// 		rect(0, 0, tileSize)

	// 		pop()
	// 	}
	// }
}
