/* Adapted from HeyGen HyperFrames, packages/shader-transitions/src/shaders/{common,registry}.ts.
 * Copyright 2026 HeyGen, Inc. Apache-2.0; see hyperframes-LICENSE.txt and NOTICE.txt.
 * Changes: selected two shaders, plain ESM export, defined iris smoothstep ordering.
 */
export const vertexSource='attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*.5+.5;v_uv.y=1.-v_uv.y;gl_Position=vec4(a_pos,0.,1.);}';
const header='precision mediump float;varying vec2 v_uv;uniform sampler2D u_from,u_to;uniform float u_progress;uniform vec2 u_resolution;uniform vec3 u_accent_bright;';
export const shaderSources={
 iris:header+`void main(){vec4 A=texture2D(u_from,v_uv),B=texture2D(u_to,v_uv);
 vec2 uv=(v_uv-.5)*vec2(u_resolution.x/u_resolution.y,1.);
 float d=length(uv);float radius=u_progress*1.2;float fw=.003;
 float edge=1.-smoothstep(radius-fw,radius+fw,d);
 float ring1=exp(-abs(d-radius)*25.);
 float ring2=exp(-abs(d-radius+.04)*20.)*.5;
 float ring3=exp(-abs(d-radius+.08)*15.)*.25;
 float glow=(ring1+ring2+ring3)*u_progress*(1.-u_progress)*4.;
 gl_FragColor=vec4(mix(A,B,edge).rgb+u_accent_bright*glow*.6,1.);}`,
 ripple:header+`void main(){vec2 uv=v_uv-.5;float dist=length(uv);vec2 dir=normalize(uv+.001);
 float fromAmp=u_progress*.04;
 float fw1=exp(sin(dist*25.-u_progress*12.)-1.);
 float fw2=exp(sin(dist*50.-u_progress*18.)-1.)*.5;
 vec2 fromUv=clamp(v_uv+dir*(fw1+fw2)*fromAmp,0.,1.);
 float toAmp=(1.-u_progress)*.04;
 float tw1=exp(sin(dist*25.+u_progress*12.)-1.);
 float tw2=exp(sin(dist*50.+u_progress*18.)-1.)*.5;
 vec2 toUv=clamp(v_uv-dir*(tw1+tw2)*toAmp,0.,1.);
 vec4 A=texture2D(u_from,fromUv);vec4 B=texture2D(u_to,toUv);
 float peak=fw1*u_progress;vec3 tint=u_accent_bright*peak*.1;
 gl_FragColor=vec4(mix(A.rgb+tint,B.rgb,u_progress),1.);}`
};
