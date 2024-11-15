import * as THREE from "three"

import vertex from "../glsl/postprocess/vertex.glsl"
import fragment from "../glsl/postprocess/fragment.glsl"

type Args = {
  size: { width: number, height: number },
  camera: THREE.OrthographicCamera
}


export default class Postprocessing {
  // BASE
  private size: { width: number, height: number }
  // RENDER TARGET
  public renderTargetA!: THREE.WebGLRenderTarget
  public renderTargetB!: THREE.WebGLRenderTarget
  // OBJ
  public mesh!: THREE.Mesh
  public mat!: THREE.ShaderMaterial
  constructor({ size }: Args) {
    // BASE
    this.size = size

    this.setUpRenderTarget()
    this.setUpObj()
  }

  private setUpRenderTarget() {
    this.renderTargetA = new THREE.WebGLRenderTarget(this.size.width, this.size.height)
    this.renderTargetB = new THREE.WebGLRenderTarget(this.size.width, this.size.height)
  }

  private setUpObj() {
    const geo = new THREE.PlaneGeometry(2, 2)
    this.mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uCurrent: { value: this.renderTargetA },
        uPrev: { value: null }
      }
    })
    this.mesh = new THREE.Mesh(geo, this.mat)
  }
}