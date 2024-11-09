varying vec2 vUv;

uniform sampler2D uTextures[10];
uniform float uProgress;
uniform float uPlace;

void main(){
  vec2 newUV = vUv;
  float newProg=uProgress*uPlace;
  int index = int(mod(floor(newProg),10.0));

if(uPlace==1.0)  newUV.y += -1. + fract(newProg+0.5) * 2.0;
  // newUV.y += 1. - fract(0.2) * 2.0;



  vec4 color = vec4(0.0);
  if(index==0){color = texture2D(uTextures[0],newUV);
  }else if(index==1){color = texture2D(uTextures[1],newUV);
  }else if(index==2){color = texture2D(uTextures[2],newUV);
  }else if(index==3){color = texture2D(uTextures[3],newUV);
  }else if(index==4){color = texture2D(uTextures[4],newUV);
  }else if(index==5){color = texture2D(uTextures[5],newUV);
  }else if(index==6){color = texture2D(uTextures[6],newUV);
  }else if(index==7){color = texture2D(uTextures[7],newUV);
  }else if(index==8){color = texture2D(uTextures[8],newUV);
  }else if(index==9){color = texture2D(uTextures[9],newUV);
  }
  gl_FragColor=color;
}