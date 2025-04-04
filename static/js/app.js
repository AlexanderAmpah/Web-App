import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 5;
camera.position.set(-1, 1, -3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let model_1;
let model_2;
let textMesh;
let angle = 0;

const loader = new GLTFLoader();

Promise.all([
    loader.loadAsync('/models/Planet_3.glb'),
    loader.loadAsync('/models/moon_3.glb')
])
.then(([gltf1, gltf2]) => {
    model_2 = gltf2.scene;
    model_1 = gltf1.scene;
    model_1.scale.set(1, 1, 1);
    model_1.position.set(0, 0, 0); 
    
    scene.add(model_1);
    attachTextToModel(model_1, textLabels);

    model_2.scale.set(0.2, 0.2, 0.2);
    model_2.position.set(-2, 0, 0); 
    scene.add(model_2);

    console.log("Both models loaded successfully!");
})
.catch(error => console.error('Error loading models:', error));

const textLabels = [
    { position: new THREE.Vector3(-0.85, -0.15, -0.5), look: new THREE.Vector3(-17, -0.5, -7), text: "About" , url: "https://okos-dynasite.webflow.io" },
    { position: new THREE.Vector3(0.6, -0.15, -0.84), look: new THREE.Vector3(1, -0.2, -2), text: "GitHub", url: "https://github.com/AlexanderAmpah" },
    { position: new THREE.Vector3(0.35, 0.65, -0.65), look: new THREE.Vector3(0.5, 1.5, -2), text: "Contact", url: "https://www.linkedin.com/in/alexander-ampah-26a30a181/" }
];

const clickableText = [];

function attachTextToModel(model_1, labels) {
    const fontloader = new FontLoader();
    fontloader.load('/static/fonts/helvetiker_regular.typeface.json', (font) => {
        labels.forEach(({ position, look, text, url }) => {
            const textGeometry = new TextGeometry(text, {
                font: font,
                size: 0.1, 
                depth: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.001,
                bevelSize: 0.001,
                bevelSegments: 5
            });


            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0000 }); //0xff0000
            textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Adjust position
            textMesh.position.copy(position); // Stick text to the model at a specific point
            textMesh.lookAt(look); // Make text face the camera
            
            textMesh.userData.url = url;
            clickableText.push(textMesh);
            model_1.add(textMesh);

        });

    });
}
const light = new THREE.AmbientLight( 0x404040, 50); // soft white light
scene.add( light );

// Atmosphere Sphere (Slightly larger than the planet)
const atmosphereGeometry = new THREE.SphereGeometry(1.15, 132, 132); // Slightly larger than the main sphere
const atmosphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x66aaff,   // Light blue atmosphere color
    transparent: true,
    opacity: 0.3,      // Adjust transparency
    side: THREE.BackSide // Render inside out for a glow effect
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    
    for (let i = 0; i < 5000; i++) {  // the number of stars
        const x = (Math.random() - 0.5) * 2000; // Spread stars across space
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5, // size of stars
        sizeAttenuation: true,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    starField.material.depthWrite = false;
    scene.add(starField);
}

createStars();

// const canvas = document.createElement('canvas');
// const context = canvas.getContext('2d');
// canvas.width = 512;
// canvas.height = 256;

// // Draw text on canvas
// context.fillStyle = 'white';
// context.font = '50px Arial';
// context.fillText('Planet Oko:', 50, 150);

// // Convert canvas to texture
// const texture = new THREE.CanvasTexture(canvas);
// const textMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

// // Create a plane to display the texture
// const textPlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), textMaterial);
// textPlane.position.set(-2, 1, -3);
// textPlane.lookAt(1, 0.5, 1);
// scene.add(textPlane);


// Handle Click Event
window.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableText);
    

    if (intersects.length > 0) {
        const clickedText = intersects[0].object;
        if (clickedText.userData.url) {
            console.log('Text clicked!');
            window.open(clickedText.userData.url, "_blank"); // Open URL in new tab
        }
    }
});

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    if (model_1) { // Ensure the model is loaded before rotating
        model_1.rotation.y -= 0.001;
    }
    if (model_2) {
        angle += 0.005; // Adjust speed of orbit
        model_2.position.x = 2 * Math.cos(angle);
        model_2.position.z = 2 * Math.sin(angle);
    }
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
