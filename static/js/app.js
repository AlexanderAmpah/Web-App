import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 5;
camera.position.set(1, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let model;
let textMesh;
let textMesh2;

const planetloader = new GLTFLoader();
planetloader.load(
    '/models/Planet_2.1.glb', // Make sure the path is correct
    (gltf) => {
        model = gltf.scene;
        model.scale.set(1, 1, 1); // Adjust scale if needed
        model.position.set(0, 0, 0);
        scene.add(model);
        attachTextToModel(model, textLabels);
        
    },
    (xhr) => {
        console.log(`Model ${xhr.loaded / xhr.total * 100}% loaded`);
    },
    (error) => {
        console.error('Error loading model:', error);
    }
);

const textLabels = [
    { position: new THREE.Vector3(0.1, 0.25, 0.95), look: new THREE.Vector3(0.8, 1, 4), text: "About" , url: "www.example.com" },
    { position: new THREE.Vector3(0.97, -0.29, 0.1), look: new THREE.Vector3(2, -0.5, 0), text: "Projects", url: "https://github.com/AlexanderAmpah" },
    { position: new THREE.Vector3(-0.58, -0.7, 0.5), look: new THREE.Vector3(-13, -25, 25), text: "Contact", url: "www.example.com" }
];

const clickableText = [];

function attachTextToModel(model, labels) {
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


            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            textMesh = new THREE.Mesh(textGeometry, textMaterial);

            // Adjust position
            textMesh.position.copy(position); // Stick text to the model at a specific point
            textMesh.lookAt(look); // Make text face the camera
            
            textMesh.userData.url = url;
            clickableText.push(textMesh);
            model.add(textMesh);

        });

    });
}
const light = new THREE.AmbientLight( 0x404040, 17); // soft white light
scene.add( light );

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
    // if (model) { // Ensure the model is loaded before rotating
    //     model.rotation.y += 0.002; // Adjust speed here
    // }
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
