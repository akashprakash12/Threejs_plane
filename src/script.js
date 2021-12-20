import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from "dat.gui";
import * as GridHelper from "three/src/helpers/GridHelper.js";
import {ColorGUIHelper} from './colorhelper.js'
import gsap from 'gsap'

var  model,mixer
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereGeometry(15, 32, 16);

//texture loded
const texture = new THREE.TextureLoader().load("img/earth.png");
const normalmaptexture = new THREE.TextureLoader().load("img/earth_normalmap.png");
//model loder

model=new GLTFLoader();
model.load('model/scene.gltf',function (gltf){
    model=gltf.scene 
    model.scale.set(7, 7, 7);
    let fileAnimations=gltf.animations
    let idleAnim = THREE.AnimationClip.findByName(fileAnimations, 'Take 01');
    mixer = new THREE.AnimationMixer(model)
    mixer.clipAction(idleAnim).play()
    mixer.clipAction(idleAnim).setDuration(50)
gsap.fromTo(model.position,{y:0,z:0},{y:50,z:50,duration:10})
    const modelfolder=gui.addFolder("modle")
    modelfolder.add(model.position,'x',0,100)
    scene.add(model)
})



// Materials
const material = new THREE.MeshPhongMaterial();
material.map = texture;

// normal map added
material.normalMap = normalmaptexture;
material.normalScale.x;
const normalmapfolder = gui.addFolder("normalmap");
normalmapfolder.add(material.normalScale, "x", 0, 20);
normalmapfolder.add(material.normalScale, "y", 0, 20);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);
// scene.addEventListener("click")

//mesh gui
const spherFolder = gui.addFolder("Spher");
spherFolder.add(sphere.position, "x", 0, Math.PI * 2);
spherFolder.add(sphere.position, "z", -10, Math.PI * 2);
spherFolder.add(sphere.position, "y", -10, Math.PI * 2);


//floor
let flooGeometry=new THREE.PlaneGeometry(1000,1000,1,1)
let flooreMeterial=new THREE.MeshPhongMaterial({color:0xafafaf,shininess:true})
let floor=new THREE.Mesh(flooGeometry,flooreMeterial)
floor.rotation.x = -0.5 * Math.PI
floor.castShadow=true
floor.position.set(0,-12,0)
scene.add(floor)

// Lights

const directionalLight =new THREE.DirectionalLight(new THREE.Color(0xffffff),100)
directionalLight.position.set(12, 64, 27)
directionalLight.castShadow=true
const directionalLighthelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
scene.add(directionalLight,directionalLighthelper)

const directionalLightfolder=gui.addFolder('directionalLight')
gui.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('color');
directionalLightfolder.add(directionalLight.position,'x',1,100)
directionalLightfolder.add(directionalLight.position,'y',1,100)
directionalLightfolder.add(directionalLight.position,'z',1,100)
directionalLightfolder.add(directionalLight,'intensity',1,100)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 50;
camera.position.z = 79;
scene.add(camera);
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", 0, 100);
cameraFolder.add(camera.position, "z", 0, 100);
cameraFolder.add(camera.position, "y", 0, 100);
// gsap.fromTo(camera.position,{x:10,y:0,z:0},{x:100,y:100,z:100,duration:10})

// gui camera
const camerahelper = new THREE.CameraHelper(camera);
scene.add(camerahelper);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});
renderer.setClearColor(0x000000, true);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights=true
renderer.shadowMap.enabled=true

/*  helper 
grid gui */
const size = 50;
const divisions = 100;
const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);

//x,y,z axis gui helper
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
    if (mixer) {
        mixer.update(clock.getDelta())
    }
   
    const elapsedTime = clock.getElapsedTime();

    // Update objects
    sphere.rotation.y = 0.5 * elapsedTime;
    

    // Update Orbital Controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
