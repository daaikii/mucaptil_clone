attribute vec2 textureIndex;
attribute vec2 instanceUV;
attribute float noiseProg;
attribute vec3 circlePos;

uniform sampler2D uAlphaTexture;
uniform float uTime;
uniform float uProgress;
uniform vec3 uMouse;
uniform sampler2D uCircle;

flat varying int vRandomIndex;
varying float vPointSize;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float noise (){
    float amplitude = 1.3;
    float frequency = 6.5;
    float x = noiseProg*noiseProg;
    float y = sin( x+frequency);
    float t = 0.005 * (-uTime*130.0);
    y += sin(x+frequency*2.1 + t) * 4.5;
    y += sin(x+frequency*1.72 + t * 1.121) * 4.0;
    y += sin(x+frequency*2.221 + t * 0.437) * 5.0;
    y += sin(x+frequency*3.1122+ t * 4.269) * 2.5;
    y *= amplitude* 0.06;
    return y;
}



void main() {
    float newProg = uProgress*2.0;
    vec3 pos =  position;
    // vec3 newCirclePos = texture2D(uCircle,uv).rgb;

    //マウス操作でのオブジェクト変化
    float r = 0.8;
    float lengthCursor=length(pos-uMouse)+r;
    vec3 normCursor=normalize(pos-uMouse);
    pos += normCursor*lengthCursor*0.2*(1.0-smoothstep(0.0,1.0,newProg));
    //球状態での変化
    float l=length(circlePos-uMouse)+r;
    vec3 n=normalize(circlePos-uMouse);
    pos += n*l*smoothstep(1.0,2.0,newProg);


    //progressに応じて円形へ移動させる
    vec3 circleDir = normalize(circlePos-position); //正規化
    pos +=circleDir*smoothstep(0.0,1.0,newProg)*length(circlePos-position);
    //球の半径が増加
    vec3 bigCircleDir = normalize(circlePos)*0.1;//正規化
    pos +=bigCircleDir*smoothstep(1.1,2.0,newProg);
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);





    
    //stepはalpha.rでアルファ画像の白部分を表示、非表示部分はuProgressに従って表示に。
    vec4 alpha =texture2D(uAlphaTexture,instanceUV);
    //アルファ値が1(初めから表示された部分はdelayが効かないようにする。
    float delay = (1.0-alpha.r)*rand(position.xy);
    //１番目の10はポイントのサイズ調整、二番目はprogressが大きくなると数値が小さくなりすぎる為
    //アルファ値が1の場合、初めから表示され、0の場合progressに伴いディレイを入れてランダムなタイミングで表示される。
    gl_PointSize = 10.0*smoothstep(0.0,1.0,(alpha.r+uProgress-delay)*10.0);

    //noiseを使用してポイントを動かす。
    gl_PointSize *= (1.5+noise())*6.0;

    //カメラとポイントの距離を取得しサイズを変更
    float dist = length(cameraPosition - pos);
    gl_PointSize /= dist;

    //uProgressで表示 => 0.3～0.4小さく => 0.4非表示 。
    //alpha.rを掛けることでランダムにポイントを消していく。
    gl_PointSize *= 1.0-smoothstep(0.3,0.4,alpha.r*uProgress);

        //ランダムな数値を作成
    float randomFloat = floor(rand(textureIndex)*12.0);
    int randomInt = int(randomFloat);


    vRandomIndex = randomInt;
    vPointSize = gl_PointSize;
}