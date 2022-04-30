console.log('hi')

function setup() {
	let canvas = createCanvas(window.innerWidth, window.innerHeight)
	canvas.parent('#sketch')
}

function draw() {
	clear()
	circle(mouseX, mouseY, 10)
}
