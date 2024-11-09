import * as THREE from "three";
import GUI from "lil-gui";

import vertex from "../glsl/points/vertex.glsl";
import fragment from "../glsl/points/fragment.glsl";

import obj1 from "/public/icons/obj13.png"
import obj2 from "/public/icons/obj2.png"
import obj3 from "/public/icons/obj3.png"
import obj4 from "/public/icons/obj14.png"
import obj5 from "/public/icons/obj5.png"
import obj6 from "/public/icons/obj6.png"
import obj7 from "/public/icons/obj15.png"
import obj8 from "/public/icons/obj8.png"
import obj9 from "/public/icons/obj9.png"
import obj10 from "/public/icons/obj10.png"
import obj11 from "/public/icons/obj11.png"
import obj12 from "/public/icons/obj12.png"
import obj13 from "/public/icons/shadow1.png"
import obj14 from "/public/icons/shadow2.png"
import obj15 from "/public/icons/shadow3.png"

type Args = {
  position: { x: number, y: number, z: number },
  isShadow: boolean
}


export default class Points {
  private position: { x: number, y: number, z: number }
  private isShadow: number;
  // GUI
  private settings: {};
  private gui: GUI
  // TEXTURES
  private images: string[];
  private textures: THREE.Texture[]
  //  OBJ SETTINGS
  private size: number;
  private count: number;
  public material: THREE.ShaderMaterial;
  public points: THREE.Points;

  constructor(args?: Args) {
    this.position = args && args.position || { x: 0, y: 0, z: 0 }
    this.isShadow = args && args.isShadow ? 1 : 0
    console.log(this.isShadow)
    // TEXTURE IMAGES
    this.images = [obj1, obj2, obj3, obj4, obj5, obj6, obj7, obj8, obj9, obj10, obj11, obj12, obj13, obj14, obj15];
    // OBJ SETTINGS
    this.size = 40;
    this.count = this.size ** 2;
    // FUNCTIONS
    // this.setUpGUI()
    this.setUpTexture();
    this.setUpObj();
  }



  // private setUpGUI() {
  //   this.settings = {
  //     progress: 0
  //   }
  //   this.gui = new GUI()
  //   this.gui.add(this.settings, 'progress', 0, 2, 0.01).onChange((val: number) => {
  //     if (!this.material?.uniforms.uProgress) return
  //     this.material.uniforms.uProgress.value = val
  //   })
  // }








  private setUpTexture() {
    this.textures = [];
    const loader = new THREE.TextureLoader();
    for (let i = 1; i <= this.images.length; i++) {
      const texture = loader.load(this.images[i])
      texture.flipY = false
      this.textures.push(texture);
    }
  }




  private setUpObj() {
    // geometry 
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.count * 3);
    const textureIndices = new Float32Array(this.count * 2);
    const instanceUV = new Float32Array(this.count * 2);
    const circlePos = new Float32Array(this.count * 3);
    const noiseProg = new Float32Array(this.count);

    let prog = 0.0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const index = j + i * this.size
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 0.5 + 0.2 * Math.random();
        positions[index * 3 + 0] = (i / this.size - 0.5) * 2;
        positions[index * 3 + 1] = (j / this.size - 0.5) * 2;
        positions[index * 3 + 2] = 0;

        textureIndices[index * 2 + 0] = (i + i);
        textureIndices[index * 2 + 1] = (i + j);

        instanceUV[index * 2 + 0] = i / this.size;
        instanceUV[index * 2 + 1] = j / this.size;

        circlePos[index * 3 + 0] = r * Math.sin(theta) * Math.cos(phi);
        circlePos[index * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        circlePos[index * 3 + 2] = r * Math.cos(theta);

        noiseProg[index] = prog;
        prog += 0.3;
      }
    }

    const positionAttribute = new THREE.BufferAttribute(positions, 3)
    const textureIndicesAttribute = new THREE.BufferAttribute(textureIndices, 2)
    const instanceUVAttribute = new THREE.BufferAttribute(instanceUV, 2)
    const circlePosAttribute = new THREE.BufferAttribute(circlePos, 3)
    const noiseProgAttribute = new THREE.BufferAttribute(noiseProg, 1);

    geometry.setAttribute("position", positionAttribute)
    geometry.setAttribute("textureIndex", textureIndicesAttribute)
    geometry.setAttribute("instanceUV", instanceUVAttribute)
    geometry.setAttribute("circlePos", circlePosAttribute)
    geometry.setAttribute("noiseProg", noiseProgAttribute)

    if (!this.textures) return
    // material
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTexture: { value: this.textures },
        uAlphaTexture: { value: null },
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uCircle: { value: null },
        uShadow: { value: this.isShadow }
      },
      transparent: true,
      alphaTest: 1.0,
      depthWrite: false,
      depthTest: false
    })
    // mesh
    this.points = new THREE.Points(geometry, this.material)
    const { x, y, z } = this.position
    this.position && this.points.position.set(x, y, z)
  }

}
