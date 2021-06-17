import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect.js'
import * as dat from 'dat.gui'

let windowHalfX = window.innerWidth / 2
let windowHalfY = window.innerHeight / 2

let mouseX = 0
let mouseY = 0

const materials = []

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x000000, 0.0008)

// sound
const sound = new Audio('/sounds/mountains.mp3')
window.addEventListener('click', (playSound) =>
{
    sound.play()
})

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture1 = textureLoader.load('/textures/particles/4.png')
const particleTexture2 = textureLoader.load('/textures/particles/1.png')
// const particleTexture3 = textureLoader.load('/textures/particles/17.png')

/**
 * Fonts
 */
// const fontLoader = new THREE.FontLoader()
// fontLoader.load(
//     '/fonts/helvetiker_regular.typeface.json',
//     (font) => 
//     {
//         const textGeometry = new THREE.TextBufferGeometry(
//              'Fatima',
//             {
//                 font: font,
//                 size: 0.5,
//                 height: 0.2,
//                 curveSegments: 5,
//                 bevelEnabled: true,
//                 bevelThickness: 0.03,
//                 bevelSize: 0.02,
//                 bevelOffset: 0,
//                 bevelSegments: 4
//             }
//         )
//         // textGeometry.computeBoundingBox()
//         // textGeometry.translate(
//         //    - (textGeometry.boundingBox.max.x - 0.1) * 0.5,
//         //    - (textGeometry.boundingBox.max.y - 0.1) * 0.5,
//         //    - (textGeometry.boundingBox.max.z - 0.1) * 0.5
//         // )
//         textGeometry.center()
//         const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
//         const text = new THREE.Mesh(textGeometry, material)
//         scene.add(text)

//         }
//  )

/*
 * Particles
 */
//Geometry
const particlesGeometry = new THREE.BufferGeometry()
const vertices = []
for(let i = 0; i < 10000; i++)
{
    const x = Math.random() * 2000 - 1000;
	const y = Math.random() * 2000 - 1000;
	const z = Math.random() * 2000 - 1000;

	vertices.push( x, y, z );
}
particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

const parameters = [
    [[ 1.0, 0.2, 0.5 ], particleTexture1, 20 ],
    [[ 0.95, 0.2, 0.5 ], particleTexture2, 10 ],
    [[ 0.90, 0.05, 0.5 ], particleTexture1, 10 ],
    [[ 0.85, 0, 0.5 ], particleTexture2, 8 ],
    [[ 0.80, 0, 0.5 ], particleTexture1, 5 ]
]

for ( let i = 0; i < parameters.length; i ++ )
{
    const color = parameters[ i ][ 0 ]
	const sprite = parameters[ i ][ 1 ]
	const size = parameters[ i ][ 2 ]

    materials[i] = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        // depthTest: false,
        transparent: true
    })
    materials[i].color.setHSL(color[0], color[1], color[2])

    // Points
    const particles = new THREE.Points(particlesGeometry, materials[i])
    particles.rotation.x = Math.random() * 6;
	particles.rotation.y = Math.random() * 6;
	particles.rotation.z = Math.random() * 6;
    scene.add(particles)
}

// Material
// const particlesMaterial = new THREE.PointsMaterial({
//     color: '#ff88cc',
//     alphaMap: particleTexture,
//     size: 0.2,
//     sizeAttenuation: true,
//     transparent: true,
//     // alphaTest: 0.001,
//     // depthTest: false,
//     depthWrite: false,
//     // blending: THREE.AdditiveBlending,
//     vertexColors: false
// })


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

document.addEventListener('mousemove', (event) =>
{
    mouseX = (event.clientX - windowHalfX) / 100
    mouseY = (event.clientY - windowHalfY) / 100
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 2000)
camera.position.z = 1000

scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

window.addEventListener('dblclick', () => 
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement)
  {
      if (canvas.requestFullscreen)
      {
          canvas.requestFullscreen()
      }
      else if (canvas.webkitrequestFullscreen)
      {
        canvas.webkitrequestFullscreen()
      }
      
  }
  else
  {
      if (document.exitFullscreen)
      {
         document.exitFullscreen() 
      }
      else if (document.webkitExitFullscreen)
      {
        document.webkitEnpmxitFullscreen()
      }
      
  }  
})
 

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
const effect = new AnaglyphEffect(renderer)
effect.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime() * 0.15

    //Update Particles
    // particles.rotation.y = Math.sin(elapsedTime) * 0.3
    // particles.rotation.x = Math.tan(Math.cos(elapsedTime)) * 0.3
    // particles.rotation.x = elapsedTime * 0.03
    // for( let i = 0; i < count; i++)
    // {
    //     const i3 = i * 3

    //     const x = particlesGeometry.attributes.position.array[i3]
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    // }

    // particlesGeometry.attributes.position.needsUpdate = true

    for(let i = 0; i < scene.children.length; i++)
    {
        const object = scene.children[i];

        if (object instanceof THREE.Points)
        {
            object.rotation.y = elapsedTime * (i < 4 ? i + 1 : - (i + 1))
        }
    }

    for (let i = 0; i < materials.length; i++)
    {
        const color = parameters[i][0]

        const h = (360 * (color[0] + elapsedTime) % 360) / 360
        materials[i].color.setHSL(h, color[1], color[2])
    }

    // Update camera
    camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()