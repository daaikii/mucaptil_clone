flat varying int vRandomIndex; 
varying float vPointSize;

uniform sampler2D uTexture[15];
uniform float uShadow;


void main() {

    vec4 color = vec4(0.0);

    if (vRandomIndex == 0) {
        color = texture2D(uTexture[0], gl_PointCoord);
    } else if (vRandomIndex == 1) {
        color = texture2D(uTexture[1], gl_PointCoord);
    } else if (vRandomIndex == 2) {
        color = texture2D(uTexture[2], gl_PointCoord);
    } else if (vRandomIndex == 3) {
        color = texture2D(uTexture[3], gl_PointCoord);
    } else if (vRandomIndex == 4) {
        color = texture2D(uTexture[4], gl_PointCoord);
    } else if (vRandomIndex == 5) {
        color = texture2D(uTexture[5], gl_PointCoord);
    } else if (vRandomIndex == 6) {
        color = texture2D(uTexture[6], gl_PointCoord);
    } else if (vRandomIndex == 7) {
        color = texture2D(uTexture[7], gl_PointCoord);
    } else if (vRandomIndex == 8) {
        color = texture2D(uTexture[8], gl_PointCoord);
    } else if (vRandomIndex == 9) {
        color = texture2D(uTexture[9], gl_PointCoord);
    } else {
        color = texture2D(uTexture[10], gl_PointCoord);
    } 

    if(uShadow==1.0){
    if (vRandomIndex <4) {
        color = texture2D(uTexture[11], gl_PointCoord);
    } else if (vRandomIndex < 8) {
        color = texture2D(uTexture[12], gl_PointCoord);
    } else {
        color = texture2D(uTexture[13], gl_PointCoord);
    }
    }
    
    if(vPointSize<0.1){
        discard;
    }

    gl_FragColor=color;
}
