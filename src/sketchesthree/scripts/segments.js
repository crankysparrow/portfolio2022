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
// const ambLight = makeAmbientLight(scene, { color: 0x222222 })

const geometry = new THREE.BoxGeometry(5, 5, 5, 2, 2, 2)
const material = new THREE.MeshPhongMaterial({ color: 0xaaffbb })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

function animate() {
	cube.rotation.x += 0.01
	cube.rotation.y += 0.01
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}
requestAnimationFrame(animate)
