import * as THREE from 'https://unpkg.com/three@0.141.0/build/three.module.js'
import { makeAmbientLight, makeDirectionalLight } from './lights.js'
import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js'

let renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setClearColor(0x000000, 1)
document.body.appendChild(renderer.domElement)

let scene = new THREE.Scene()

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.update()

makeDirectionalLight(scene, { position: [-5, 5, 15] })
makeDirectionalLight(scene, { position: [20, -13, -10], intensity: 0.5 })
makeDirectionalLight(scene, { position: [-10, -10, -40], intensity: 0.5 })

const shape = wonkyShape()

scene.add(shape)

function animate() {
	shape.rotation.x += 0.01
	shape.rotation.y += 0.01
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

function wonkyShape(radius = 5, vary = 2.2, color = 0xaaffbb) {
	const geometry = new THREE.BoxGeometry(radius, radius, radius, 2, 2, 2)
	// last 3 params are number of segments ... like how many triangles is the side divided into
	// more segments = more triangles = more vertices = funkier shapes (but also more processing)
	// with just 1 segment on each, it looks like a cube that's been wiggled a bit
	// with more segments, it's less & less like a cube
	// try other geometries too:
	// const geometry = new THREE.OctahedronGeometry(radius, 1)

	const positions = geometry.getAttribute('position')
	// positions are all the vertices on the shape.
	const count = positions.count
	// let point = new THREE.Vector3()
	let verticesMap = {}

	for (let i = 0; i < count; i++) {
		let point = new THREE.Vector3()
		point = point.fromBufferAttribute(positions, i)
		// let key = [point.x, point.y, point.z].join(',')

		// if (!verticesMap[key]) {
		// 	verticesMap[key] = {
		// 		x: point.x + Math.random() * vary,
		// 		y: point.y + Math.random() * vary,
		// 		z: point.z + Math.random() * vary,
		// 	}
		// }

		// let { x, y, z } = verticesMap[key]
		let x = point.x * Math.random()
		let y = point.y * Math.random()
		let z = point.z * Math.random()
		positions.setXYZ(i, x, y, z)
	}

	geometry.computeVertexNormals() // updates colors/shading of the object with new vertices

	const material = new THREE.MeshPhongMaterial({
		color,
		flatShading: false,
	})

	const mesh = new THREE.Mesh(geometry, material)
	return mesh
}
