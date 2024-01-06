import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

export default class Sketch {
  constructor(options) {
    this.time = 0;
    this.container = options.dom;
    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(70, this.width/this.height, 0.01, 10);
    this.camera.position.z = 1;

    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.resize();
    this.setupResize();
    this.addObjects();
    this.render();
  }

  setupResize(){
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize(){
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width/this.height;
    this.camera.updateProjectionMatrix();
  }
  
  addObjects(){
    this.geometry = new THREE.PlaneBufferGeometry( 0.5, 0.5, 10, 5 );
    this.material = new THREE.MeshNormalMaterial();
  

    // Shaders
    this.material = new THREE.ShaderMaterial({

      side: THREE.DoubleSide,
      wireframe: true,

      // shader responsible for colors
      fragmentShader: `
      void main()	{
        gl_FragColor = vec4(1.,0.0,1., 1.);
      }
      `,

      // shader responsible for positions of the elements on the screen
      vertexShader: `
      void main() {
        vec3 newposition = position;
        newposition.y += 0.1*sin(newposition.x*20.);

        gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
      }
      `,
    });

    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.scene.add( this.mesh );
  }
  
  render(){
    this.time+=0.05;
    
    
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({
  dom: document.getElementById('container')
});