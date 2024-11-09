// import * as THREE from "three"

// import vertex from "../glsl/simulator/vertex.glsl"
// import fragment from "../glsl/simulator/fragment.glsl"

// type Args = {
//   camera: THREE.OrthographicCamera
// }


// export default class Simulator {
//   // BASE SETTINGS
//   private fboTexture: THREE.DataTexture
//   // RT SETTINGS
//   public simulatorRT: THREE.WebGLRenderTarget
//   public fboCamera: THREE.OrthographicCamera
//   // OBJ SETTINGS
//   private size: number;
//   private count: number;
//   public mesh: THREE.Mesh
//   constructor({ camera }: Args) {
//     // BASE SETTINGS
//     this.fboCamera = camera;
//     // OBJ SETTINGS
//     this.size = 40;
//     this.count = this.size ** 2;
//     // FUNCTIONS
//     this.setRenderTarget()
//     this.setMesh()
//   }


//   private setRenderTarget() {
//     this.simulatorRT = new THREE.WebGLRenderTarget(1024, 1024, {
//       minFilter: THREE.LinearFilter,
//       magFilter: THREE.LinearFilter,
//       format: THREE.RGBAFormat,
//       type: THREE.FloatType,
//     });
//   }

//   private setMesh() {
//     // dataTexture
//     const data = new Float32Array(this.count * 4);
//     for (let i = 0; i < this.size; i++) {
//       for (let j = 0; j < this.size; j++) {
//         const index = i + j * this.size
//         data[index * 4 + 0] = (i / this.size - 0.5) * 20;
//         data[index * 4 + 1] = (j / this.size - 0.5) * 20;
//         data[index * 4 + 2] = 1;
//         data[index * 4 + 3] = 1;
//       }
//     }
//     this.fboTexture = new THREE.DataTexture(data, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
//     this.fboTexture.minFilter = THREE.LinearFilter;
//     this.fboTexture.magFilter = THREE.LinearFilter;
//     this.fboTexture.needsUpdate = true;

//     // geometry
//     const fboGeometry = new THREE.PlaneGeometry(2, 2);
//     //fboMaterial
//     const fboMaterial = new THREE.ShaderMaterial({
//       fragmentShader: fragment,
//       vertexShader: vertex,
//       uniforms: {
//         uTexture: { value: this.fboTexture }
//       }
//     })
//     // points
//     this.mesh = new THREE.Mesh(fboGeometry, fboMaterial)
//   }
// }