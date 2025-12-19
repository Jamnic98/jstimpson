'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { Loader } from 'components'

const modelPath = '/3d-models/dice_model.glb'

export const DiceModelViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const diceRef = useRef<THREE.Group | null>(null)
  const [grabbing, setGrabbing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 10)
    camera.position.z = 5

    // Ambient Light (soft light to fill in shadows)
    const ambientLight = new THREE.AmbientLight(0x404040, 6) // Subtle ambient light for general illumination
    scene.add(ambientLight)

    // Main Directional Light (Key light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 4)
    directionalLight.position.set(5, 5, 5) // Position the light at a specific angle
    directionalLight.castShadow = true
    directionalLight.shadow.bias = -0.01 // Slight adjustment to reduce shadow artifacts
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    // Add some softness to the shadows
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 10
    directionalLight.shadow.camera.left = -5
    directionalLight.shadow.camera.right = 5
    directionalLight.shadow.camera.top = 5
    directionalLight.shadow.camera.bottom = -5
    scene.add(directionalLight)

    // Add a secondary directional light (opposite side of the first key light)
    const backDirectionalLight = new THREE.DirectionalLight(0xffffff, 3)
    backDirectionalLight.position.set(-5, 5, -5) // Place it behind the model to illuminate the back
    backDirectionalLight.castShadow = true
    scene.add(backDirectionalLight)

    // Add a fill light (secondary light) for softening the shadows
    const pointLight = new THREE.PointLight(0xffffff, 3, 100)
    pointLight.position.set(-3, -3, -3) // Position it opposite to the main light
    scene.add(pointLight)

    // Add Rim Light (Back light for separation from background)
    const rimLight = new THREE.PointLight(0xffffff, 2, 100)
    rimLight.position.set(3, 3, -3) // Behind the object for a rim effect
    scene.add(rimLight)

    // Set the background colour of the scene
    scene.background = new THREE.Color(0xeeeeee)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)

    // OrbitControls for mouse interaction
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = false
    controls.dampingFactor = 0.25
    controls.enablePan = false
    controls.screenSpacePanning = false

    controls.maxPolarAngle = Math.PI / 2

    // Load the 3D model (dice)
    const loader = new GLTFLoader()
    loader.load(
      modelPath,
      (gltf) => {
        gltf.scene.scale.set(1, 1, 1) // Scale the model
        diceRef.current = gltf.scene
        scene.add(gltf.scene)
        setLoading(false)
      },
      undefined,
      (error) => {
        console.error(error)
        setLoading(false)
      }
    )

    // Animate the scene
    const animate = () => {
      if (diceRef.current) {
        diceRef.current.rotation.x += 0.001
        diceRef.current.rotation.y += 0.001
        diceRef.current.rotation.z += 0.0005
      }

      controls.update()
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(animate)

    // Handle resizing of the window
    const handleResize = () => {
      if (!mountRef.current) return
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      renderer.dispose()
      window.removeEventListener('resize', handleResize)
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  const handleMouse = (down: boolean) => (event: React.MouseEvent) => {
    event.preventDefault()
    setGrabbing(down)
  }

  return (
    <div
      onMouseDown={handleMouse(true)}
      onMouseUp={handleMouse(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        cursor: grabbing ? 'grabbing' : 'grab',
      }}
      ref={mountRef}
    >
      {loading && <Loader />}
    </div>
  )
}
