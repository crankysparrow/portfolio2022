let settings = {}

function setup() {
	createCanvas(min(window.innerWidth, 500), min(window.innerHeight, 500))
	createLoop({ duration: 3 })
}

function draw() {
	three({
		imageSize: 0.7,
		nCells: 5,
		weight: 1,
		cellsOne: { sizeA: 1.3, sizeB: 1.7 },
		cellsTwo: { sizeA: 1.3, sizeB: 1.7 },
		timeOffset: 0.75,
		imageSize: 0.7,
		color1: '#ffa200',
		color2: '#f2029a',
	})
}

function windowResized() {
	resizeCanvas(min(window.innerWidth, 500), min(window.innerHeight, 500))
}

function three({
	imageSize = 0.65,
	sizeToStep = 1.5,
	nCells = 3,
	weight = 3,
	color1 = '#fff',
	color2 = '#f0f',
	check1 = true,
	check2 = true,
	cellsOne,
	cellsTwo,
	// cellsOne = { sizeA: 1, sizeB: 0.5 },
	// cellsTwo = { sizeA: 0.5, sizeB: 1 },
	timeOffset = 0.75,
} = {}) {
	background(0)
	strokeWeight(weight)
	noFill()

	imageSize = imageSize * width
	let step = imageSize / nCells
	let base = step * sizeToStep

	translate((width - imageSize) / 2, (height - imageSize) / 2)

	let loopSine = map(sin(animLoop.theta), -1, 1, 0, 1)

	// let cells1Col = lerpColorByHue(color1, color2, cos(animLoop.theta) / 2 + 1)
	let cells1Col = lerpColor(color(color1), color(color2), cos(animLoop.theta) / 2 + 1)
	let c1Sz = map(loopSine, 0, 1, base * cellsOne.sizeA, base * cellsOne.sizeB)
	let cellSet1Progress = fract(animLoop.progress + timeOffset)

	let cells2Col = lerpColor(color(color1), color(color2), loopSine)
	let c2Sz = map(loopSine, 0, 1, base * cellsTwo.sizeA, base * cellsTwo.sizeB)

	const drawCell = (x, y, col, progress, size) => {
		push()
		stroke(col)
		// map between 0.25 and 0.75 because at those points the animation lands on a square
		// (so it's smooth to transition between them)
		let amt = map(progress, 0, 1, size * 0.25, size * 0.75)
		translate(x * step, y * step)
		translate((step - size) / 2, (step - size) / 2)
		shapeShape(amt, size)
		pop()
	}

	if (check1) {
		for (let y = 0; y < nCells; y += 1) {
			for (let x = y % 2 === 1 ? 0 : 1; x < nCells; x += 2) {
				drawCell(x, y, cells1Col, cellSet1Progress, c1Sz)
			}
		}
	}
	if (check2) {
		for (let x = 0; x < nCells; x += 1) {
			for (let y = x % 2 === 0 ? 0 : 1; y < nCells; y += 2) {
				drawCell(x, y, cells2Col, animLoop.progress, c2Sz)
			}
		}
	}
}

function shapeShape(p, size) {
	let a = size * 0.25
	let b = size - a

	beginShape()

	vertex(p, b)
	vertex(p, a)
	vertex(a, a)
	vertex(a, p)
	vertex(b, p)
	vertex(b, a)
	vertex(size - p, a)
	vertex(size - p, b)
	vertex(b, b)
	vertex(b, size - p)
	vertex(a, size - p)
	vertex(a, b)
	vertex(p, b)

	endShape()
}
