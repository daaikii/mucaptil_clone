import * as THREE from "three"
import gsap from "gsap"

import alpha0 from "/alpha/0.jpg"
import alpha1 from "/alpha/1.jpg"
import alpha2 from "/alpha/2.jpg"
import alpha3 from "/alpha/3.jpg"
import alpha4 from "/alpha/4.jpg"
import alpha5 from "/alpha/5.jpg"
import alpha6 from "/alpha/6.jpg"
import alpha7 from "/alpha/7.jpg"
import alpha8 from "/alpha/8.jpg"
import alpha9 from "/alpha/9.jpg"

import vertex from "../glsl/numberGen/vertex.glsl"
import fragment from "../glsl/numberGen/fragment.glsl"


export default class NumberGen {
  // BASE
  public scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  // TEXTURE
  private images: string[]
  private textures: THREE.Texture[]
  // RT
  public renderTarget: THREE.WebGLRenderTarget
  // OBJ
  public mesh1: THREE.Mesh | null
  public mesh2: THREE.Mesh | null

  constructor(camera: THREE.OrthographicCamera) {
    // BASE
    this.scene = new THREE.Scene()
    this.camera = camera
    this.scene.add(camera)
    // TEXTURE
    this.images = [alpha0, alpha1, alpha2, alpha3, alpha4, alpha5, alpha6, alpha7, alpha8, alpha9]
    this.textures = []
    // OBJ
    this.mesh1 = null
    this.mesh2 = null
    // FUNCTIONS
    this.setUpTexture()
    this.setRenderTarget()
    this.setUpObj()
  }

  private setUpTexture() {
    const loader = new THREE.TextureLoader()
    this.textures = this.images.map((img) => loader.load(img))
  }

  private setRenderTarget() {
    this.renderTarget = new THREE.WebGLRenderTarget(1024, 1024)
  }

  private setUpObj() {
    const geo = new THREE.PlaneGeometry(1, 2, 100, 200)
    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTextures: { value: this.textures },
        uProgress: { value: 0 },
        uPlace: { value: 0 }
      }
    })

    this.mesh1 = new THREE.Mesh(geo, mat.clone())
    this.mesh1.position.set(-0.5, 0, 0)
    this.mesh1.material.uniforms.uPlace.value = 0.1;

    this.mesh2 = new THREE.Mesh(geo, mat.clone())
    this.mesh2.position.set(0.5, 0, 0)
    this.mesh2.material.uniforms.uPlace.value = 1;

    this.scene.add(this.mesh1, this.mesh2)
  }

  public animate() {
    const obj = { value: 0 }
    gsap.to(obj, {
      value: 50,
      duration: 5,
      onUpdate: () => {
        this.mesh1.material.uniforms.uProgress.value = obj.value;
        this.mesh2.material.uniforms.uProgress.value = obj.value;
        console.log(this)
      }
    })
  }
}