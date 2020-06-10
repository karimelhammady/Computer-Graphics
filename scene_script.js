
import {GLTFLoader} from './jsm/loaders/GLTFLoader.js';
import {OrbitControls} from './jsm/controls/OrbitControls.js';
import {Water} from './jsm/objects/Water.js';
import {Sky} from './jsm/objects/Sky.js';
import * as THREE from './build/three.module.js';

var loader = new GLTFLoader();

let shipsArray = [];
let shipsDisplacements = [];

function errorHandle(error) {
    console.error(error)
}
function onLoadShipGLTF(gltf) {
    gltf.scene.scale.set(0.05, 0.05, 0.05)
    gltf.scene.position.y -= 15
    gltf.scene.position.z += 100 * shipsArray.length
    shipsArray.push(gltf);
    shipsDisplacements.push((Math.random() % 10) + 1)
    scene.add(gltf.scene);
}
loader.load('./models/ship/scene.gltf', onLoadShipGLTF, undefined, errorHandle);
loader.load('./models/ship/scene.gltf', onLoadShipGLTF, undefined, errorHandle);
loader.load('./models/ship/scene.gltf', onLoadShipGLTF, undefined, errorHandle);
loader.load('./models/ship/scene.gltf', onLoadShipGLTF, undefined, errorHandle);

function onLoadIcebergGLTF(gltf) {
    gltf.scene.scale.set(20, 20, 20)
    gltf.scene.position.x -= 1000
    gltf.scene.rotation.y += Math.PI * (15 / 4)
    gltf.scene.position.z += 125
    scene.add(gltf.scene);
}
loader.load('./models/iceberg/scene.gltf', onLoadIcebergGLTF, undefined, errorHandle);

function onLoadFlagGLTF(gltf) {
    gltf.scene.scale.set(20, 20, 1)
    gltf.scene.rotation.y += Math.PI * (5 / 2)
    gltf.scene.position.x -= 2500
    gltf.scene.position.y -= 300
    gltf.scene.position.z += 300
    scene.add(gltf.scene);
}
loader.load('./models/flag/scene.gltf', onLoadFlagGLTF, undefined, errorHandle);


function onLoadCityGLTF(gltf) {
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.rotation.y += Math.PI * (5 / 2)
    gltf.scene.position.x -= 2800
    gltf.scene.position.y -= 380
    gltf.scene.position.z += 600
    scene.add(gltf.scene);
}
loader.load('./models/persian_city/scene.gltf', onLoadCityGLTF, undefined, errorHandle);

function onLoadCity2GLTF(gltf) {
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.rotation.y += Math.PI * (5 / 2)
    gltf.scene.position.x -= 3900
    gltf.scene.position.y -= 100
    gltf.scene.position.z += 600
    scene.add(gltf.scene);
}
loader.load('./models/persian_city/scene.gltf', onLoadCity2GLTF, undefined, errorHandle);


function onLoadDockGLTF(gltf) {
    gltf.scene.scale.set(22, 22,22)
    gltf.scene.rotation.y -= Math.PI * (12 / 5)
    gltf.scene.position.x += 40
    gltf.scene.position.y -= 720
    gltf.scene.position.z -= 20
    scene.add(gltf.scene);
}
loader.load('./models/puente_del_general_serrador_tenerife/scene.gltf', onLoadDockGLTF, undefined, errorHandle);

var container;
var camera, scene, renderer, light;
var controls, water, sphere;
init();
animate();
function init() {
    container = document.getElementById('container');
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 2000000);
    camera.position.set(-400, 250, -300);
    console.log(camera.position.set)
    // Ambient Light
    light = new THREE.DirectionalLight(0xffffff, 2);
    scene.add(light);
    // Water Size
    var waterGeometry = new THREE.PlaneBufferGeometry(100000, 100000);

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            alpha: 1,
            sunDirection: light.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 8,
            fog: scene.fog !== undefined
        }
    );
    water.rotation.x = - Math.PI / 2;
    scene.add(water);
    // Skybox
    var sky = new Sky();
    var uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = 7;
    uniforms['rayleigh'].value = 4;
    var parameters = {
        distance: 200,
        inclination: 0.45,
        azimuth: 0.205
    };

    var cubeCamera = new THREE.CubeCamera(0.1, 1, 512);
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
    scene.background = cubeCamera.renderTarget;



    var theta = Math.PI * (parameters.inclination - 0.5);
    var phi = 2 * Math.PI * (parameters.azimuth - 0.5);
    light.position.x = parameters.distance * Math.cos(phi);
    light.position.y = parameters.distance * Math.sin(phi) * Math.sin(theta);
    light.position.z = parameters.distance * Math.sin(phi) * Math.cos(theta);
    sky.material.uniforms['sunPosition'].value = light.position.copy(light.position);
    water.material.uniforms['sunDirection'].value.copy(light.position).normalize();
    cubeCamera.update(renderer, sky);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    // controls.maxDistance = 200.0;
    controls.update();


    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
    requestAnimationFrame(animate);
    render();
}
let intervalReference = undefined;
let removingRefrence = undefined;
let counter = 0
let pauseAnime = false
let rotationDifference = (Math.PI / 2) * (3 / 4) * 0.001;
function rotate3alHady() {
    intervalReference = setInterval(() => {
        if (counter > 999) {
            counter = 0
            console.log("done")
            clearInterval(intervalReference)
            e8ra23lHady()
        }
        counter++
        removingRefrence.scene.rotation.z -= rotationDifference
    }, 1)
}
function e8ra23lHady() {
    intervalReference = setInterval(() => {
        if (counter > 99) {
            console.log("done")
            clearInterval(intervalReference)
        }
        counter++
        removingRefrence.scene.position.y -= 0.5
    }, 1)
}


function animations() {
    var time = performance.now() * 0.001;
    water.material.uniforms.time.value += 1.0 / 60.0;
    if (shipsArray.length > 2 && !(pauseAnime)) {
        if (shipsArray[0].scene.position.x < -900 && shipsArray.length == 4) {
            removingRefrence = shipsArray[0]
            shipsArray.splice(0, 1)
            shipsDisplacements.splice(0, 1)
            rotate3alHady()
        }
        let max = 1;
        shipsArray.forEach((oneShip, index) => {
            oneShip.scene.position.x -= shipsDisplacements[index] * time * 0.1
            if (oneShip.scene.position.x < max)
                max = oneShip.scene.position.x
        })
        camera.position.x = -400 + max
        controls.target.x = max;
        controls.update();
        if (max < -2500) {
            pauseAnime = true
            alert("You WON")
        }
    }
}
function render() {
    animations()
    renderer.render(scene, camera);
}