import * as THREE from "three"

import Points from "./modules/points"
import Postprocessing from "./modules/postprocessing";
import NumberGen from "./modules/number";

export default class Canvas {
  private static _instance: Canvas
  //BASE SETTINGS
  private canvas: HTMLCanvasElement
  private scene: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private time: number;
  //cameraSetting
  private camera!: THREE.PerspectiveCamera;
  private orthCamera!: THREE.OrthographicCamera;
  private perspective: number;
  private fov: 50;
  private size: { width: number, height: number };
  private aspectRatio: number;
  // RT
  private sourceRT!: THREE.WebGLRenderTarget
  //OBJ
  private number!: NumberGen
  private points!: Points;
  private points2!: Points;
  private ps!: Postprocessing;
  private finalQuad!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  // RAY CASTER
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  constructor() {
    // BASE SETTINGS
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement
    this.scene = new THREE.Scene()
    this.time = 0;
    //CAMERA SETTINGS
    this.perspective = 2;
    this.fov = 50;
    this.size = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.aspectRatio = this.size.width / this.size.height;
    // RAY CASTER
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    // FUNCTIONS
    this.setUpRenderer()
    this.resize()
    this.setUpRenderTarget()
    this.setUpObj()
    this.setUpEvents()
    this.animate()

    setTimeout(() => {
      this.number.animate()
    }, 3000)
  }



  static get instance() {
    if (!this._instance) {
      this._instance = new Canvas()
    }
    return this._instance;
  }


  //RENDERER
  private setUpRenderer(): void {
    // PerspectiveCamera
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, 0.1, 1000);
    this.camera.position.z = this.perspective;
    // OrthographicCamera (2×2Plane fullScreen camera)
    this.orthCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.orthCamera.position.z = 1;

    this.scene.background = new THREE.Color(0xffefeb);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  //RESIZE
  private resize(): void {
    window.addEventListener("resize", () => {
      this.size = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      this.aspectRatio = this.size.width / this.size.height;
      this.camera.aspect = this.aspectRatio;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.size.width, this.size.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }


  private setUpRenderTarget() {
    this.sourceRT = new THREE.WebGLRenderTarget(this.size.width, this.size.height)
  }


  private setUpObj() {
    this.number = new NumberGen(this.orthCamera)

    this.points = new Points()
    this.points2 = new Points({ position: { x: 0.05, y: 0.05, z: -0.01 }, isShadow: true },)
    this.scene.add(this.points.points, this.points2.points)
    // this.scene.add(this.points2.points)

    this.ps = new Postprocessing({
      size: this.size,
      camera: this.orthCamera
    })

    this.finalQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({ map: null })
    )
  }





  private onPointerMove(e: MouseEvent) {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.orthCamera);
    const  intersects = this.raycaster.intersectObject(this.ps.mesh);
    if (intersects.length > 0) {
      const  { x, y } = intersects[0].point;
      if (!this.points.material?.uniforms) return
      this.points.material.uniforms.uMouse.value.set(x * 0.5, y * 0.5, 0.1);
      this.points2.material.uniforms.uMouse.value.set(x * 0.5, y * 0.5, 0.1);
    }
  }

  private onWheelScroll() {
    this.targetScroll = window.scrollY;
  }

  private setUpEvents() {
    document.addEventListener("pointermove", this.onPointerMove.bind(this))
    document.addEventListener("wheel", this.onWheelScroll.bind(this))
  }



  private targetScroll = 0;
  private currentScroll = 0;
  private scrollSpeed = 0.1; // 慣性の強さを調整

  private animate() {
    requestAnimationFrame(this.animate.bind(this));

    // 慣性効果のために線形補間 (lerp) を使用
    this.currentScroll += (this.targetScroll - this.currentScroll) * this.scrollSpeed;
    // ドキュメントの高さと現在のスクロール位置に基づいて進行度を計算
    const docHeight = document.documentElement.scrollHeight - this.size.height;
    const scrollPercent = this.currentScroll / docHeight;
    // シェーダーのuProgressを更新
    this.points.material.uniforms.uProgress.value = scrollPercent;
    this.points2.material.uniforms.uProgress.value = scrollPercent;

    this.renderer.setRenderTarget(this.number.renderTarget)
    this.renderer.render(this.number.scene, this.orthCamera);

    this.renderer.setRenderTarget(this.sourceRT)
    this.points.material.uniforms.uAlphaTexture.value = this.number.renderTarget.texture
    this.points.material.uniforms.uTime.value = this.time;
    this.points2.material.uniforms.uAlphaTexture.value = this.number.renderTarget.texture
    this.points2.material.uniforms.uTime.value = this.time;
    this.renderer.render(this.scene, this.camera);

    this.renderer.setRenderTarget(this.ps.renderTargetA);
    if(this.ps.mesh.material instanceof  THREE.ShaderMaterial){
      this.ps.mesh.material.uniforms.uCurrent.value = this.sourceRT.texture;
      this.ps.mesh.material.uniforms.uPrev.value = this.ps.renderTargetB.texture;
    }else{throw new Error("material is not THREE.ShaderMaterial");}
    this.renderer.render(this.ps.mesh, this.orthCamera)

    this.renderer.setRenderTarget(null)
    this.finalQuad.material.map = this.ps.renderTargetB.texture
    this.renderer.render(this.finalQuad, this.orthCamera)



    const temp = this.ps.renderTargetA;
    this.ps.renderTargetA = this.ps.renderTargetB;
    this.ps.renderTargetB = temp;

    this.time += 0.01
  }
}