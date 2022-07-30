let sz, textStepY, textFontSize, yPos1, yPos2
let positions = []
let count = 0

function setup() {
	let w = min(window.innerWidth, 800)
	let h = w * 0.5
	createCanvas(w, h)
	createLoop({ duration: 7 })

	sz = width * 0.25
	// ty1 = hd2 * (1 / 9)
	// textStepY = hd2 * (1 / 9)
	textSize(width / 70)
	yPos1 = 0
	yPos2 = height * 0.5

	let xStep = width * 0.23
	let xStart = width * 0.1

	//prettier-ignore
	positions = [
		[xStart, yPos1], [xStart + xStep, yPos1], [xStart + (xStep * 2), yPos1], [xStart + xStep * 3, yPos1], 
		[xStart, yPos2], [xStart + xStep, yPos2], [xStart + (xStep * 2), yPos2], [xStart + xStep * 3, yPos2], 
	]
}

function windowResized() {
	let w = min(window.innerWidth, 800)
	let h = w * 0.5
	resizeCanvas(w, h)

	sz = width * 0.25

	textSize(width / 70)
	yPos1 = 0
	yPos2 = height * 0.5

	let xStep = width * 0.23
	let xStart = width * 0.1

	//prettier-ignore
	positions = [
		[xStart, yPos1], [xStart + xStep, yPos1], [xStart + (xStep * 2), yPos1], [xStart + xStep * 3, yPos1], 
		[xStart, yPos2], [xStart + xStep, yPos2], [xStart + (xStep * 2), yPos2], [xStart + xStep * 3, yPos2], 
	]
}

function draw() {
	background(240)

	noFill()
	stroke(255, 20, 80, 100)

	let p = map(sin(animLoop.theta), -1, 1, 0, 1)
	count = 0
	// push()
	// translate(50, height * 0.3)
	// shape(sz, p, 1 - p)
	// pop()

	// textSize(textFontSize)
	// textLeading(textFontSize * 1.4)
	// noStroke()
	// fill(100, 0, 255)
	// text('corner = p', 40, textStepY / 2, sz + 20)
	// fill(250, 30, 200)
	// text('edge = p', 40, textStepY * 1.5, sz + 20)

	showEx(p, sz, { cornerp: 1, edgep: 1, cornerTimesP: true, edgeTimesP: true })
	// showEx(p, sz, { cornerp: 0.5, edgep: 0.5, cornerTimesP: true, edgeTimesP: true })
	showEx(p, sz, { cornerp: 0.25, edgep: 0.25, cornerTimesP: true, edgeTimesP: true })

	showEx(p, sz, { cornerp: 0.25, edgep: 0.25, cornerTimesP: false, edgeTimesP: true })
	showEx(p, sz, { cornerp: 0.25, edgep: 0.25, cornerTimesP: true, edgeTimesP: false })

	showEx(p, sz, { cornerp: 0.45, edgep: 0.25, cornerTimesP: true, edgeTimesP: false })

	showEx(p, sz, { cornerp: 0.45, edgep: 0.15, cornerTimesP: true, edgeTimesP: true })

	showEx(p, sz, {
		cornerp: 0.45 * p,
		edgep: map(p, 0, 1, 0.2, 0.35),
		cornerText: '0.45 * p',
		edgeText: 'map(p, 0, 1, 0.2, 0.35)',
	})

	showEx(p, sz, {
		cornerp: map(p, 0, 1, 0.7, 0.15),
		edgep: map(p, 0, 1, 0.2, 0.35),
		cornerText: 'map(p, 0, 1, 0.7, 0.15)',
		edgeText: 'map(p, 0, 1, 0.2, 0.35)',
	})

	// showEx(p, sz, { cornerp: 0.75, edgep: 0.5, cornerTimesP: true, edgeTimesP: true })
	// showEx(sz, p, 1, 'corner = p', 'edge = 1')

	// showEx(sz, p * 0.5, p, 'corner = p * 0.5', 'edge = p')

	// showEx(sz, p, 0.25, 'corner = p', 'edge = 0.25')
	// showEx(sz, 0.25, p, 'corner = 0.25', 'edge = p')
}

function showEx(
	p,
	sz,
	{ cornerp, edgep, cornerTimesP, edgeTimesP, cornerText, edgeText }
) {
	let tx = positions[count][0]
	let ty = positions[count][1]

	let shapeSize = sz * (4 / 9)
	let txY1 = sz * (1 / 9)
	let txY2 = sz * (1.7 / 9)

	noFill()
	push()
	translate(tx, ty + sz * (3 / 9))
	let ep = edgeTimesP ? edgep * p : edgep
	let cp = cornerTimesP ? cornerp * p : cornerp
	shape(shapeSize, ep, cp)
	pop()

	let line1 = cornerText
		? `corner = ${cornerText}`
		: `corner = ${cornerp}${cornerTimesP ? ' * p' : ''}`
	let line2 = edgeText
		? `edge = ${edgeText}`
		: `edge = ${edgep}${edgeTimesP ? ' * p' : ''}`

	noStroke()
	fill(100, 0, 255)
	text(line1, tx - shapeSize * 0.5, ty + txY1, shapeSize * 2)
	fill(250, 30, 200)
	text(line2, tx - shapeSize * 0.5, ty + txY2, shapeSize * 2)

	if (edgep == cornerp && cornerTimesP && edgeTimesP) {
		describeElement(count + ': square', 'a square expanding and contracting')
	} else {
		describeElement(
			count + ': square and plus sign',
			'moving between a plus sign shape and a square, and a square with smaller squares coming out of each corner'
		)
	}
	describeElement(`animation ${count} values`, line1 + ', ' + line2)
	count++
}

function shape(size, progress, cornerProgress) {
	let c1 = size * cornerProgress
	let c2 = size - c1
	let e1 = size * progress
	let e2 = size - e1

	stroke(255, 20, 80, 100)
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
	fill(100, 0, 255, 100)
	circle(c1, c1, 5)
	circle(c2, c1, 5)
	circle(c2, c2, 5)
	circle(c1, c2, 5)

	fill(250, 30, 200, 100)
	circle(e1, c1, 5)
	circle(c1, e1, 5)
	circle(c2, e1, 5)
	circle(e2, c1, 5)
	circle(e2, c2, 5)
	circle(c2, e2, 5)
	circle(c1, e2, 5)
	circle(e1, c2, 5)

	fill(255, 0, 0, 150)
	circle(e1, e1, 5)
	circle(e1, e2, 5)
	circle(e2, e2, 5)
	circle(e2, e1, 5)
}
