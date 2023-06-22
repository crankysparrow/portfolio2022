import * as THREE from 'https://unpkg.com/three@0.141.0/build/three.module.js'

export function makeAmbientLight(scene, { color = 0x222222 }) {
	const light = new THREE.AmbientLight(color)
	scene.add(light)
	return light
}

export function makeDirectionalLight(
	scene,
	{ position = [-5, 5, 5], color = 0xffffff, intensity = 1 }
) {
	const light = new THREE.DirectionalLight(color)
	light.intensity = intensity
	light.position.set(...position)
	scene.add(light)
	return light
}
