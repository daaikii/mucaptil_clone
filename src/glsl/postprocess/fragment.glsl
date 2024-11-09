
varying vec2 vUv;
uniform sampler2D uCurrent;
uniform sampler2D uPrev;

void main(){
  vec4 current = texture2D(uCurrent,vUv);
  vec4 prev = texture2D(uPrev,vUv);
  vec4 color = vec4(mix(current.rgb,prev.rgb,.3),1.0);
  gl_FragColor=color;
}