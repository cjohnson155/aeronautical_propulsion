// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Turbojet Engines — Animated Lecture Deck
//
//  WHAT CHANGED FROM THE STATIC VERSION
//  ────────────────────────────────────
//  • A live CFD-style flow engine (Canvas): particles are advected through the
//    real duct geometry, COLORED by local temperature and STREAKED by local
//    velocity. This is the signature visual and is reused on every station slide
//    with a `focus` prop that spotlights one station at a time.
//  • A shock-formation animation straight from the handwritten notes: subsonic
//    flow steps around a body; supersonic flow gets "slammed" into a bow shock.
//  • A property-vs-station summary strip (T, p, V across stations 0→9).
//  • No external math dependency — equations render with light inline helpers,
//    so the file previews live and drops into your project with zero imports
//    beyond React. (Swap your <K> KaTeX component back in if you prefer.)
//
//  TUNING THE PHYSICS (all qualitative / schematic — see notes in copy)
//  ────────────────────────────────────────────────────────────────────
//  The flow is driven by four piecewise tracks keyed on normalized axial
//  position x ∈ [0,1]. Edit the stop lists below to reshape the story:
//    VEL   – particle speed (slow in core, fast at nozzle exit → thrust)
//    TEMP  – 0..1 → color map (peaks in the combustor)
//    PRES  – 0..1 → line weight / density (peaks at compressor exit)
//    GEO_R – flow-path half-height (casing);  GEO_C – centerbody/hub half-height
//
//  HOW TO ADD A SLIDE
//  ──────────────────
//  Push an object into `slides`. Kinds: 'title' | 'concept' | 'engine' |
//  'shock' | 'station' | 'summary'. See examples at the bottom.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Design tokens (kept from your deck) ─────────────────────────────────── */
const C = {
  bg:     "#010409",
  panel:  "#0d1117",
  panel2: "#161b22",
  line:   "#21262d",
  line2:  "#30363d",
  text:   "#f0f6fc",
  mute:   "#8b949e",
  accent: "#f97316", // orange
  cyan:   "#22d3ee",
  indigo: "#6366f1",
  violet: "#a78bfa",
  green:  "#10b981",
  red:    "#ef4444",
  amber:  "#f59e0b",
};
const SERIF = "'Playfair Display', Georgia, serif";
const MONO  = "'DM Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

/* ─── Physics tracks (normalized x ∈ [0,1]) ──────────────────────────────── */
const VEL = [[0,0.55],[0.20,0.32],[0.40,0.40],[0.50,0.52],[0.58,0.56],[0.72,0.50],[0.86,0.72],[1.0,1.70]];
const TEMP= [[0,0.14],[0.20,0.20],[0.40,0.46],[0.46,0.70],[0.52,1.00],[0.58,0.96],[0.72,0.62],[0.86,0.50],[1.0,0.42]];
const PRES= [[0,0.18],[0.20,0.34],[0.40,0.95],[0.52,0.90],[0.58,0.82],[0.72,0.42],[0.86,0.30],[1.0,0.20]];
const GEO_R=[[0,0.96],[0.06,0.80],[0.20,0.66],[0.40,0.50],[0.44,0.92],[0.52,0.90],[0.58,0.80],[0.72,0.60],[0.84,0.62],[1.0,0.34]];
const GEO_C=[[0,0.00],[0.05,0.10],[0.20,0.24],[0.40,0.34],[0.46,0.26],[0.52,0.24],[0.58,0.26],[0.72,0.24],[0.86,0.12],[1.0,0.00]];

// temperature → color (cold blue → cyan → yellow → orange → red → white-hot)
const TMAP=[[0,"#0b2a6b"],[0.25,"#1f7ae0"],[0.45,"#22d3ee"],[0.62,"#fde047"],[0.80,"#fb923c"],[0.92,"#ef4444"],[1,"#fff7ed"]];

const STATIONS=[
  {x:0.02,label:"0",name:"Freestream"},
  {x:0.20,label:"2",name:"Inlet exit"},
  {x:0.40,label:"3",name:"Comp. exit"},
  {x:0.58,label:"4",name:"Burner exit"},
  {x:0.72,label:"5",name:"Turb. exit"},
  {x:0.985,label:"9",name:"Nozzle exit"},
];
const BANDS={
  inlet:     {a:0.02,b:0.20,c:C.cyan,   label:"Inlet · 0 → 2"},
  compressor:{a:0.20,b:0.40,c:C.indigo, label:"Compressor · 2 → 3"},
  combustor: {a:0.40,b:0.58,c:C.accent, label:"Combustor · 3 → 4"},
  turbine:   {a:0.58,b:0.72,c:C.violet, label:"Turbine · 4 → 5"},
  nozzle:    {a:0.72,b:0.99,c:C.green,  label:"Nozzle · 5 → 9"},
};

/* ─── Math helpers ───────────────────────────────────────────────────────── */
function track(stops,x){
  if(x<=stops[0][0])return stops[0][1];
  const n=stops.length;
  if(x>=stops[n-1][0])return stops[n-1][1];
  for(let i=1;i<n;i++){
    if(x<=stops[i][0]){
      const[xa,va]=stops[i-1],[xb,vb]=stops[i];
      const t=(x-xa)/((xb-xa)||1);
      const s=t*t*(3-2*t);
      return va+(vb-va)*s;
    }
  }
  return stops[n-1][1];
}
function hx(c){c=c.replace("#","");return[parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)];}
function cmap(stops,x){
  x=Math.max(0,Math.min(1,x));
  for(let i=1;i<stops.length;i++){
    if(x<=stops[i][0]){
      const a=hx(stops[i-1][1]),b=hx(stops[i][1]);
      const t=(x-stops[i-1][0])/((stops[i][0]-stops[i-1][0])||1);
      return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
    }
  }
  const l=hx(stops[stops.length-1][1]);return `rgb(${l[0]},${l[1]},${l[2]})`;
}

/* ─── Reduced-motion hook ────────────────────────────────────────────────── */
function usePrefersReducedMotion(){
  const[r,setR]=useState(false);
  useEffect(()=>{
    if(typeof window==="undefined"||!window.matchMedia)return;
    const m=window.matchMedia("(prefers-reduced-motion: reduce)");
    const on=()=>setR(m.matches); on();
    m.addEventListener?.("change",on);
    return()=>m.removeEventListener?.("change",on);
  },[]);
  return r;
}

/* ─── Inline equation atoms (no KaTeX) ───────────────────────────────────── */
const Sub=({children})=><sub style={{fontSize:"0.7em"}}>{children}</sub>;
const Sqrt=({children})=>(
  <span style={{whiteSpace:"nowrap"}}>√<span style={{borderTop:"1px solid currentColor",padding:"0 3px"}}>{children}</span></span>
);
const EqBox=({children,color=C.accent})=>(
  <div style={{background:C.panel2,borderRadius:8,padding:"14px 16px",border:`1px solid ${color}33`,
    textAlign:"center",fontFamily:MONO,fontSize:18,color,letterSpacing:0.5}}>{children}</div>
);
const Card=({children,accent=C.accent,style})=>(
  <div style={{background:C.panel,borderRadius:12,padding:"16px 18px",border:`1px solid ${accent}22`,...style}}>{children}</div>
);
const Label=({children,color=C.accent})=>(
  <div style={{color,fontFamily:MONO,fontSize:10,letterSpacing:2,textTransform:"uppercase",marginBottom:10}}>{children}</div>
);

/* ════════════════════════════════════════════════════════════════════════════
   ENGINE CANVAS — the live CFD-style flow
   ════════════════════════════════════════════════════════════════════════════ */
function EngineCanvas({focus=null,running=true,height=300}){
  const wrapRef=useRef(null);
  const canRef=useRef(null);
  const partsRef=useRef(null);
  const dimRef=useRef({w:600,h:height});
  const rafRef=useRef(0);
  const lastRef=useRef(0);
  const focusRef=useRef(focus); focusRef.current=focus;

  const draw=useCallback((tms,advance,dt)=>{
    const can=canRef.current; if(!can)return;
    const ctx=can.getContext("2d");
    const {w:W,h:H}=dimRef.current;
    const parts=partsRef.current||[];
    const f=focusRef.current?BANDS[focusRef.current]:null;
    const margin=Math.max(16,W*0.03);
    const cw=W-2*margin, cyC=H*0.45, Href=H*0.33;
    const X=(x)=>margin+x*cw;
    const top=(x)=>track(GEO_R,x)*Href;
    const hub=(x)=>track(GEO_C,x)*Href;
    const yOf=(x,s)=>{const sgn=s<0?-1:1;const r=hub(x)+Math.abs(s)*(top(x)-hub(x));return cyC+sgn*r;};
    const bandA=(x)=>!f?1:((x>=f.a-0.012&&x<=f.b+0.012)?1:0.14);

    ctx.clearRect(0,0,W,H);

    // flow-path fill + clip
    ctx.save();
    ctx.beginPath();
    for(let i=0;i<=90;i++){const x=i/90,y=cyC-top(x);i===0?ctx.moveTo(X(x),y):ctx.lineTo(X(x),y);}
    for(let i=90;i>=0;i--){const x=i/90;ctx.lineTo(X(x),cyC+top(x));}
    ctx.closePath();
    ctx.fillStyle="#0a0e13"; ctx.fill(); ctx.clip();

    // station guide lines
    ctx.lineWidth=1; ctx.setLineDash([3,4]);
    for(const st of STATIONS){
      ctx.strokeStyle="rgba(139,148,158,0.18)";
      ctx.beginPath();ctx.moveTo(X(st.x),cyC-top(st.x));ctx.lineTo(X(st.x),cyC+top(st.x));ctx.stroke();
    }
    ctx.setLineDash([]);

    // advance particles
    if(advance){
      for(const p of parts){
        p.x+=track(VEL,p.x)*0.00027*dt;
        if(p.x>1.03){p.x=-0.03+Math.random()*0.03;p.s=Math.random()*2-1;p.px=null;p.py=null;}
      }
    }
    // particles as velocity streaks, colored by temperature
    ctx.globalCompositeOperation="lighter";
    for(const p of parts){
      const x=Math.max(0,Math.min(1,p.x));
      const px=X(x),py=yOf(x,p.s);
      if(p.px==null){p.px=px;p.py=py;}
      const u=track(VEL,x);
      ctx.strokeStyle=cmap(TMAP,track(TEMP,x));
      ctx.globalAlpha=(0.30+0.55*Math.min(1,u))*bandA(x);
      ctx.lineWidth=1+track(PRES,x)*1.3;
      ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(px,py);ctx.stroke();
      p.px=px;p.py=py;
    }
    ctx.globalAlpha=1; ctx.globalCompositeOperation="source-over";

    // combustor flame glow (additive)
    const flick=advance?(0.78+0.22*Math.sin(tms/90)+0.1*Math.sin(tms/37)):0.85;
    ctx.globalCompositeOperation="lighter";
    for(let k=0;k<3;k++){
      const fx=0.44+k*0.045, fy=cyC;
      const rad=Math.max(4,top(fx)*1.5);
      const g=ctx.createRadialGradient(X(fx),fy,2,X(fx),fy,rad);
      g.addColorStop(0,`rgba(255,224,150,${0.5*flick})`);
      g.addColorStop(0.4,`rgba(251,146,60,${0.32*flick})`);
      g.addColorStop(1,"rgba(239,68,68,0)");
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(X(fx),fy,rad,0,7); ctx.fill();
    }
    // fuel injector streaks at burner face
    ctx.strokeStyle=`rgba(255,196,120,${0.5*flick})`; ctx.lineWidth=1.4;
    for(let j=-2;j<=2;j++){
      const yy=cyC+j*top(0.42)*0.32;
      ctx.beginPath();ctx.moveTo(X(0.405),yy);ctx.lineTo(X(0.45),cyC+ (yy-cyC)*0.3);ctx.stroke();
    }
    ctx.globalCompositeOperation="source-over";
    ctx.restore(); // drop clip

    // centerbody / hub
    ctx.beginPath();
    for(let i=0;i<=90;i++){const x=i/90,h=hub(x);i===0?ctx.moveTo(X(x),cyC-h):ctx.lineTo(X(x),cyC-h);}
    for(let i=90;i>=0;i--){const x=i/90;ctx.lineTo(X(x),cyC+hub(x));}
    ctx.closePath(); ctx.fillStyle="#1b2129"; ctx.fill();
    ctx.strokeStyle="#2b333d"; ctx.lineWidth=1; ctx.stroke();

    // blade rows (compressor + turbine), suggested rotation via phase
    const phase=advance?tms/140:0;
    const rows=(x0,x1,n,col)=>{
      for(let i=0;i<n;i++){
        const x=x0+(x1-x0)*(i/(n-1));
        const off=Math.sin(phase+i)*0.10;
        const yT=cyC-top(x)*0.96, yB=cyC-hub(x)-2;
        const yT2=cyC+hub(x)+2, yB2=cyC+top(x)*0.96;
        ctx.strokeStyle=col; ctx.globalAlpha=focusRef.current&&!((x>=BANDS[focusRef.current].a)&&(x<=BANDS[focusRef.current].b))?0.25:0.85;
        ctx.lineWidth=2.2;
        ctx.beginPath();ctx.moveTo(X(x)-3,yT);ctx.lineTo(X(x)+3*off+3,yB);ctx.stroke();
        ctx.beginPath();ctx.moveTo(X(x)-3,yT2);ctx.lineTo(X(x)+3*off+3,yB2);ctx.stroke();
      }
      ctx.globalAlpha=1;
    };
    rows(0.225,0.385,7,C.indigo);
    rows(0.60,0.70,4,C.violet);

    // casing outline
    ctx.strokeStyle="#3a4350"; ctx.lineWidth=1.6;
    ctx.beginPath();
    for(let i=0;i<=90;i++){const x=i/90,y=cyC-top(x);i===0?ctx.moveTo(X(x),y):ctx.lineTo(X(x),y);}
    ctx.stroke();
    ctx.beginPath();
    for(let i=0;i<=90;i++){const x=i/90,y=cyC+top(x);i===0?ctx.moveTo(X(x),y):ctx.lineTo(X(x),y);}
    ctx.stroke();

    // station ticks + labels (above casing)
    ctx.font=`600 12px ${MONO}`; ctx.textAlign="center";
    for(const st of STATIONS){
      const yTop=cyC-top(st.x);
      ctx.fillStyle="#6b7480"; ctx.fillRect(X(st.x)-0.5,yTop-10,1,8);
      ctx.fillStyle=C.text; ctx.fillText(st.label,X(st.x),yTop-14);
    }
    // thermal strip (mirrors particle coloring)
    const sy=H-16, sh=8;
    for(let i=0;i<cw;i+=2){const x=i/cw;ctx.fillStyle=cmap(TMAP,track(TEMP,x));ctx.fillRect(margin+i,sy,2,sh);}
    ctx.font=`500 9px ${MONO}`; ctx.textAlign="left"; ctx.fillStyle=C.mute;
    ctx.fillText("T  cool",margin,sy-3);
    ctx.textAlign="right"; ctx.fillText("hot",margin+cw,sy-3);

    // focus bracket + label
    if(f){
      ctx.strokeStyle=f.c; ctx.lineWidth=2;
      const yb=cyC+Href*1.06;
      ctx.beginPath();ctx.moveTo(X(f.a),yb-5);ctx.lineTo(X(f.a),yb);ctx.lineTo(X(f.b),yb);ctx.lineTo(X(f.b),yb-5);ctx.stroke();
      ctx.fillStyle=f.c; ctx.font=`600 12px ${MONO}`; ctx.textAlign="center";
      ctx.fillText(f.label,X((f.a+f.b)/2),yb+16);
    }
  },[]);

  const resize=useCallback(()=>{
    const wrap=wrapRef.current,can=canRef.current; if(!wrap||!can)return;
    const w=wrap.clientWidth||600;
    const dpr=Math.min(2,window.devicePixelRatio||1);
    can.width=w*dpr; can.height=height*dpr;
    can.style.width=w+"px"; can.style.height=height+"px";
    can.getContext("2d").setTransform(dpr,0,0,dpr,0,0);
    dimRef.current={w,h:height};
  },[height]);

  useEffect(()=>{
    const arr=[];
    const n=Math.round(360*Math.min(1,(wrapRef.current?.clientWidth||600)/640));
    for(let i=0;i<n;i++)arr.push({x:Math.random(),s:Math.random()*2-1,px:null,py:null});
    partsRef.current=arr;
    resize(); draw(0,false,16);
    const onR=()=>{resize();draw(performance.now(),false,16);};
    window.addEventListener("resize",onR);
    return()=>window.removeEventListener("resize",onR);
  },[resize,draw]);

  useEffect(()=>{
    if(!running){draw(performance.now(),false,16);return;}
    lastRef.current=performance.now();
    const loop=(t)=>{const dt=Math.max(0,Math.min(50,t-lastRef.current));lastRef.current=t;draw(t,true,dt);rafRef.current=requestAnimationFrame(loop);};
    rafRef.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(rafRef.current);
  },[running,draw]);

  return(
    <div ref={wrapRef} style={{width:"100%"}}>
      <canvas ref={canRef} style={{width:"100%",display:"block",borderRadius:8}}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SHOCK CANVAS — subsonic vs supersonic (from the handwritten notes)
   ════════════════════════════════════════════════════════════════════════════ */
function ShockCanvas({running=true,height=260}){
  const wrapRef=useRef(null);
  const canRef=useRef(null);
  const dotsRef=useRef(null);
  const dimRef=useRef({w:600,h:height});
  const rafRef=useRef(0);
  const lastRef=useRef(0);
  const machRef=useRef(0.6);
  const tRef=useRef(0);
  const[label,setLabel]=useState({m:0.6});

  const draw=useCallback((dt,advance)=>{
    const can=canRef.current; if(!can)return;
    const ctx=can.getContext("2d");
    const {w:W,h:H}=dimRef.current;
    const dots=dotsRef.current||[];
    const cy=H*0.5;
    // sweep Mach 0.45 → 1.75, dwell at the ends
    if(advance){tRef.current+=dt/1000;}
    const ph=(Math.sin(tRef.current*0.5)+1)/2;            // 0..1
    const M=0.45+1.30*(ph<0.5?2*ph*ph:1-2*(1-ph)*(1-ph)); // ease, dwell at ends
    machRef.current=M;
    const sup=M>=1;
    const bodyX=W*0.66, noseR=H*0.16;
    const U=(0.55+0.42*M)*W;                              // px/s, faster when faster
    const standoff=sup?Math.max(noseR*0.5,noseR*(1.05/(M-0.05)) ):0; // shrinks with M
    const shockVx=bodyX-noseR-standoff;
    const shockX=(y)=>shockVx+0.0016*(y-cy)*(y-cy);        // parabola opening downstream

    ctx.clearRect(0,0,W,H);

    // body silhouette (ogive nose facing the oncoming flow on the left)
    const drawBody=()=>{
      ctx.beginPath();
      ctx.moveTo(bodyX-noseR,cy);
      ctx.quadraticCurveTo(bodyX-noseR*0.4,cy-noseR,bodyX+noseR*0.3,cy-noseR);
      ctx.lineTo(W,cy-noseR);ctx.lineTo(W,cy+noseR);
      ctx.lineTo(bodyX+noseR*0.3,cy+noseR);
      ctx.quadraticCurveTo(bodyX-noseR*0.4,cy+noseR,bodyX-noseR,cy);
      ctx.closePath();
    };

    // shock line (supersonic only)
    if(sup){
      ctx.strokeStyle="rgba(34,211,238,0.9)"; ctx.lineWidth=2.4;
      ctx.beginPath();
      for(let y=4;y<=H-4;y+=4){const x=shockX(y);y===4?ctx.moveTo(x,y):ctx.lineTo(x,y);}
      ctx.stroke();
      ctx.shadowColor="rgba(34,211,238,0.6)";ctx.shadowBlur=10;ctx.stroke();ctx.shadowBlur=0;
    }

    // dots
    for(const d of dots){
      if(advance){
        // does this dot "know" the body is coming?
        const ahead=d.x<bodyX;
        let vy=0;
        if(sup){
          if(d.x>=shockX(d.y)){ // post-shock: compress + steer around body
            d.vx=Math.max(d.vx*0.985,U*0.45);
            vy=(d.y-cy)*2.4*Math.exp(-Math.abs(d.x-bodyX)/(noseR*2));
            d.hot=Math.min(1,Math.max(0,d.hot+dt*0.9));
          }else{d.vx=U;d.hot=Math.max(0,d.hot-dt*0.5);}
        }else{
          // subsonic: smooth potential-like deflection begins well upstream
          d.vx=U; d.hot=Math.max(0,d.hot-dt*0.6);
          if(ahead){const prox=Math.exp(-(bodyX-d.x)/(noseR*3.2));vy=(d.y-cy)*2.6*prox;}
        }
        d.x+=d.vx*dt/1000;
        d.y+=vy*dt/1000;
        // keep clear of body
        if(d.x>bodyX-noseR && Math.abs(d.y-cy)<noseR+3){d.y+=(d.y>=cy?1:-1)*60*dt/1000;}
        if(d.x>W+6){d.x=-6;d.y=8+Math.random()*(H-16);d.vx=U;d.hot=0;}
        if(d.y<4)d.y=4; if(d.y>H-4)d.y=H-4;
      }
      const col=d.hot>0.05?cmap([[0,"#22d3ee"],[0.5,"#fb923c"],[1,"#ef4444"]],d.hot):"#7fb2ff";
      ctx.fillStyle=col; ctx.globalAlpha=0.9;
      const r=Math.max(0.5,1.7+(Number.isFinite(d.hot)?d.hot:0)*1.2);
      ctx.beginPath();ctx.arc(d.x,d.y,r,0,7);ctx.fill();
    }
    ctx.globalAlpha=1;

    drawBody();
    ctx.fillStyle="#11161d";ctx.fill();
    ctx.strokeStyle="#3a4350";ctx.lineWidth=1.4;ctx.stroke();

    // Mach gauge
    ctx.font=`600 13px ${MONO}`; ctx.textAlign="left";
    ctx.fillStyle=sup?C.red:C.cyan;
    ctx.fillText(`M = ${M.toFixed(2)}`,14,24);
    ctx.font=`500 11px ${MONO}`; ctx.fillStyle=C.mute;
    ctx.fillText(sup?"supersonic — molecules can't clear out → SHOCK":"subsonic — molecules step aside smoothly",14,42);
  },[]);

  const resize=useCallback(()=>{
    const wrap=wrapRef.current,can=canRef.current; if(!wrap||!can)return;
    const w=wrap.clientWidth||600;
    const dpr=Math.min(2,window.devicePixelRatio||1);
    can.width=w*dpr;can.height=height*dpr;
    can.style.width=w+"px";can.style.height=height+"px";
    can.getContext("2d").setTransform(dpr,0,0,dpr,0,0);
    dimRef.current={w,h:height};
  },[height]);

  useEffect(()=>{
    const w=wrapRef.current?.clientWidth||600;
    const arr=[];
    const n=Math.round((w*height)/2600);
    for(let i=0;i<n;i++)arr.push({x:Math.random()*w,y:8+Math.random()*(height-16),vx:0,hot:0});
    dotsRef.current=arr;
    resize();draw(16,false);
    const onR=()=>{resize();draw(16,false);};
    window.addEventListener("resize",onR);
    const id=setInterval(()=>setLabel({m:machRef.current}),200);
    return()=>{window.removeEventListener("resize",onR);clearInterval(id);};
  },[resize,draw,height]);

  useEffect(()=>{
    if(!running){draw(16,false);return;}
    lastRef.current=performance.now();
    const loop=(t)=>{const dt=Math.max(0,Math.min(50,t-lastRef.current));lastRef.current=t;draw(dt,true);rafRef.current=requestAnimationFrame(loop);};
    rafRef.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(rafRef.current);
  },[running,draw]);

  return(
    <div ref={wrapRef} style={{width:"100%"}}>
      <canvas ref={canRef} style={{width:"100%",display:"block",borderRadius:8}}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PROPERTY STRIP — T, p, V across stations 0 → 9
   ════════════════════════════════════════════════════════════════════════════ */
function PropertyStrip({running}){
  const W=620,H=210,m={l:40,r:16,t:16,b:34};
  const iw=W-m.l-m.r, ih=H-m.t-m.b;
  const X=(x)=>m.l+x*iw, Y=(v)=>m.t+(1-v)*ih;
  const line=(stops)=>{let d="";for(let i=0;i<=80;i++){const x=i/80;d+=(i?"L":"M")+X(x).toFixed(1)+" "+Y(track(stops,x)).toFixed(1)+" ";}return d;};
  const[on,setOn]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setOn(true),80);return()=>clearTimeout(t);},[]);
  const series=[["Temperature",TEMP,C.red],["Pressure",PRES,C.cyan],["Velocity",VEL.map(([a,b])=>[a,Math.min(1,b/1.7)]),C.green]];
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",display:"block"}}>
      {STATIONS.map(st=>(
        <g key={st.label}>
          <line x1={X(st.x)} y1={m.t} x2={X(st.x)} y2={m.t+ih} stroke={C.line2} strokeDasharray="3 4" strokeWidth="1"/>
          <text x={X(st.x)} y={H-16} fill={C.text} fontFamily={MONO} fontSize="11" textAnchor="middle">{st.label}</text>
        </g>
      ))}
      <text x={W/2} y={H-3} fill={C.mute} fontFamily={MONO} fontSize="9" textAnchor="middle" letterSpacing="1">STATION</text>
      {series.map(([name,stops,col],i)=>(
        <path key={name} d={line(stops)} fill="none" stroke={col} strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round"
          style={{strokeDasharray:1400,strokeDashoffset:on?0:1400,
            transition:`stroke-dashoffset 1.1s ${0.15*i}s ease`}}/>
      ))}
      {series.map(([name,,col],i)=>(
        <g key={name} transform={`translate(${m.l+8},${m.t+8+i*16})`}>
          <rect width="14" height="3" y="-3" rx="1.5" fill={col}/>
          <text x="20" y="0" fill={C.mute} fontFamily={MONO} fontSize="10">{name}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─── Station data panel ─────────────────────────────────────────────────── */
function Arrow({dir,color}){
  const ch=dir==="up"?"▲":dir==="down"?"▼":"≈";
  return <span style={{color,fontSize:dir==="flat"?15:11}}>{ch}</span>;
}
function StationPanel({color,rows,why}){
  return(
    <Card accent={color}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {rows.map(r=>(
          <div key={r.sym} style={{background:C.panel2,borderRadius:8,padding:"10px 12px",borderTop:`2px solid ${color}`}}>
            <div style={{display:"flex",alignItems:"baseline",gap:8}}>
              <span style={{fontFamily:MONO,fontSize:18,color:C.text}}>{r.sym}</span>
              <Arrow dir={r.dir} color={color}/>
            </div>
            <div style={{color:C.mute,fontSize:11,marginTop:4}}>{r.note}</div>
          </div>
        ))}
      </div>
      <p style={{color:C.text,fontSize:13,lineHeight:1.55,margin:"14px 0 0"}}>{why}</p>
    </Card>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   SLIDES
   ════════════════════════════════════════════════════════════════════════════ */
function buildSlides(running){
  return[
  /* 0 ── title ─────────────────────────────────────────────────────────── */
  {kind:"title",title:"Turbojet\nEngines",subtitle:"ME 3470 · Lecture 1.3",
   tag:"Follow one parcel of air from freestream to exhaust"},

  /* 1 ── hero: the living engine ───────────────────────────────────────── */
  {kind:"engine",focus:null,heading:"One machine, one job",sub:"Watch air become thrust",
   note:(<>Color is <strong style={{color:C.text}}>temperature</strong>; streak length is <strong style={{color:C.text}}>velocity</strong>; line weight tracks <strong style={{color:C.text}}>pressure</strong>. The air enters cool and quick, is squeezed and heated to white-hot in the burner, gives up work to the turbine, then is flung out fast and cooling through the nozzle. Everything else this lecture is just naming the steps.</>)},

  /* 2 ── thrust = momentum trade ───────────────────────────────────────── */
  {kind:"concept",heading:"Thrust is a momentum trade",sub:"Newton, applied to a control volume",accent:C.green,
   body:(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <EqBox color={C.green}>F = ṁ(V<Sub>9</Sub> − V<Sub>0</Sub>) + (p<Sub>9</Sub> − p<Sub>0</Sub>)A<Sub>9</Sub></EqBox>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card accent={C.green}>
          <Label color={C.green}>Momentum thrust</Label>
          <p style={{color:C.mute,fontSize:13,margin:0,lineHeight:1.55}}>The engine grabs air at V<Sub>0</Sub> and throws it back at V<Sub>9</Sub>. The reaction on the engine is forward. This term dominates.</p>
        </Card>
        <Card accent={C.cyan}>
          <Label color={C.cyan}>Pressure thrust</Label>
          <p style={{color:C.mute,fontSize:13,margin:0,lineHeight:1.55}}>Matters only when the nozzle is under-expanded (p<Sub>9</Sub> ≠ p<Sub>0</Sub>). Vanishes for a perfectly expanded nozzle — our usual ideal case.</p>
        </Card>
      </div>
      <Card accent={C.accent} style={{borderLeft:`3px solid ${C.accent}`}}>
        <p style={{color:C.mute,fontSize:13,margin:0,lineHeight:1.6}}>This drops straight out of the momentum equation you derived from the control-volume form: <span style={{fontFamily:MONO,color:C.text}}>d/dt ∫ρV dV + ∮ρV(V·n̂)dS = F</span>. The whole rest of the engine exists to make V<Sub>9</Sub> large.</p>
      </Card>
    </div>)},

  /* 3 ── speed of sound / Mach ─────────────────────────────────────────── */
  {kind:"concept",heading:"When does air act \u201Cstiff\u201D?",sub:"The speed of sound sets the rules",accent:C.cyan,
   body:(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card accent={C.cyan}><Label color={C.cyan}>Speed of sound</Label><EqBox color={C.cyan}>a = <Sqrt>γRT</Sqrt></EqBox></Card>
        <Card accent={C.cyan}><Label color={C.cyan}>Mach number</Label><EqBox color={C.cyan}>M = V / a</EqBox></Card>
      </div>
      <Card accent={C.violet}>
        <Label color={C.violet}>What a actually measures</Label>
        <p style={{color:C.mute,fontSize:13,margin:0,lineHeight:1.6}}>a is how fast a pressure signal — a collision pattern — travels through the gas. Below the rate that molecules collide, the flow can be "told to get out of the way." <span style={{color:C.text}}>T</span> sets how fast the random motions are; <span style={{color:C.text}}>R</span> and <span style={{color:C.text}}>γ</span> encode molecule size and how energy hides in rotation vs. translation.</p>
      </Card>
      <Card accent={C.accent} style={{borderLeft:`3px solid ${C.accent}`}}>
        <p style={{color:C.mute,fontSize:13,margin:0,lineHeight:1.6}}>Below <span style={{fontFamily:MONO,color:C.text}}>M ≈ 0.3</span> density barely changes and we can pretend the air is incompressible. Above it, density is in play — and that is the entire reason an engine has converging and diverging passages. Next: what happens when the flow outruns its own signals.</p>
      </Card>
    </div>)},

  /* 4 ── shocks animation ──────────────────────────────────────────────── */
  {kind:"shock",heading:"Outrunning your own signals",sub:"Subsonic vs. supersonic, live",
   note:(<>When the flow is slower than its collisions, molecules feel the body coming and stream around it. When it's faster, the warning never propagates upstream — the air piles up all at once into a <strong style={{color:C.text}}>shock</strong>: an almost-discontinuous jump in pressure, temperature, and density. Across it, T<Sub>0</Sub> is preserved but p<Sub>0</Sub> is lost — which is exactly why supersonic inlets are built around shocks.</>)},

  /* 5 ── flow path roadmap ─────────────────────────────────────────────── */
  {kind:"engine",focus:null,heading:"The flow path: six stations",sub:"Station numbering you'll use all term",
   legend:true,
   note:(<>We tag the flow at six places. Station <strong style={{color:C.text}}>0</strong> is freestream; <strong style={{color:C.text}}>2</strong> the compressor face; <strong style={{color:C.text}}>3</strong> compressor exit; <strong style={{color:C.text}}>4</strong> burner exit / turbine inlet; <strong style={{color:C.text}}>5</strong> turbine exit; <strong style={{color:C.text}}>9</strong> nozzle exit. Every cycle problem is bookkeeping between these numbers. We'll now walk them one at a time.</>)},

  /* 6 ── inlet ─────────────────────────────────────────────────────────── */
  {kind:"station",focus:"inlet",heading:"Inlet / Diffuser",sub:"Station 0 → 2",color:C.cyan,
   panel:{color:C.cyan,
     rows:[{sym:"V",dir:"down",note:"flow decelerates"},{sym:"p",dir:"up",note:"static pressure recovers"},{sym:"T",dir:"up",note:"slight ram heating"}],
     why:"A diffuser trades velocity for pressure with no moving parts. Subsonic: a smooth duct does it. Supersonic: you stage shocks to do the decelerating — and you pay in p₀, the loss you just saw. A good inlet hands the compressor high, uniform total pressure."}},

  /* 7 ── compressor ────────────────────────────────────────────────────── */
  {kind:"station",focus:"compressor",heading:"Compressor",sub:"Station 2 → 3",color:C.indigo,
   panel:{color:C.indigo,
     rows:[{sym:"V",dir:"flat",note:"axial ~ steady"},{sym:"p",dir:"up",note:"large rise (π_c)"},{sym:"T",dir:"up",note:"heats as it's squeezed"}],
     why:"Shaft work goes in here. The pressure ratio π_c is the single biggest cycle knob — it sets how much of the fuel's energy you can eventually convert. The temperature rise is a side effect of compression, and it's why later stages run hot."}},

  /* 8 ── combustor ─────────────────────────────────────────────────────── */
  {kind:"station",focus:"combustor",heading:"Combustor",sub:"Station 3 → 4",color:C.accent,
   panel:{color:C.accent,
     rows:[{sym:"T",dir:"up",note:"to T₀₄ — the peak"},{sym:"p",dir:"flat",note:"~constant (small loss)"},{sym:"V",dir:"up",note:"flow speeds up"}],
     why:"Heat added at roughly constant pressure — this is your Rayleigh-flow case made real. The ceiling on T₀₄ is what the turbine blades can survive, not chemistry. Add too much heat in a constant-area duct and you thermally choke: Rayleigh's M→1 limit, live."}},

  /* 9 ── turbine ───────────────────────────────────────────────────────── */
  {kind:"station",focus:"turbine",heading:"Turbine",sub:"Station 4 → 5",color:C.violet,
   panel:{color:C.violet,
     rows:[{sym:"V",dir:"flat",note:"axial ~ steady"},{sym:"p",dir:"down",note:"expands, drives shaft"},{sym:"T",dir:"down",note:"gives up energy"}],
     why:"The turbine extracts just enough work to spin the compressor (and the fan, on a turbofan): turbine work = compressor work. It deliberately leaves pressure and temperature on the table — that leftover energy is the nozzle's raw material."}},

  /* 10 ── nozzle ───────────────────────────────────────────────────────── */
  {kind:"station",focus:"nozzle",heading:"Nozzle",sub:"Station 5 → 9",color:C.green,
   panel:{color:C.green,
     rows:[{sym:"V",dir:"up",note:"the exhaust jet"},{sym:"p",dir:"down",note:"falls toward ambient"},{sym:"T",dir:"down",note:"expansion cools it"}],
     why:"The payoff stage: remaining pressure and thermal energy convert to kinetic energy. The exit velocity V₉ is the term that makes thrust. Match p₉ to p₀ and the pressure-thrust term vanishes — the nozzle is perfectly expanded."}},

  /* 11 ── summary ──────────────────────────────────────────────────────── */
  {kind:"summary",heading:"Reading the whole engine",sub:"Properties across the stations",
   body:(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Card accent={C.accent}><Label color={C.accent}>T, p, V vs. station (schematic)</Label><PropertyStrip running={running}/></Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card accent={C.cyan}>
          <Label color={C.cyan}>The shape of it</Label>
          <p style={{color:C.mute,fontSize:13,margin:0,lineHeight:1.6}}>Pressure climbs to the compressor exit, plateaus across the burner, then falls through turbine and nozzle. Temperature spikes in the burner. Velocity bottoms out in the core and peaks at the exit.</p>
        </Card>
        <Card accent={C.green}>
          <Label color={C.green}>And it all reduces to</Label>
          <EqBox color={C.green}>F ≈ ṁ(V<Sub>9</Sub> − V<Sub>0</Sub>)</EqBox>
          <p style={{color:C.mute,fontSize:12,margin:"10px 0 0",lineHeight:1.55}}>Every station exists to raise V₉ for a given fuel burn. That ratio is the cycle's whole game.</p>
        </Card>
      </div>
    </div>)},
  ];
}

/* ════════════════════════════════════════════════════════════════════════════
   APP
   ════════════════════════════════════════════════════════════════════════════ */
export default function TurbojetPresentation(){
  const reduce=usePrefersReducedMotion();
  const[running,setRunning]=useState(true);
  useEffect(()=>{setRunning(!reduce);},[reduce]);
  const[current,setCurrent]=useState(0);
  const[visible,setVisible]=useState(true);
  const slides=buildSlides(running);
  const total=slides.length;
  const s=slides[current];

  const goTo=useCallback((idx)=>{
    if(idx<0||idx>=total)return;
    setVisible(false);
    setTimeout(()=>{setCurrent(idx);setVisible(true);},150);
  },[total]);

  useEffect(()=>{
    const h=(e)=>{
      if(e.key==="ArrowRight"||e.key==="ArrowDown"){e.preventDefault();goTo(current+1);}
      if(e.key==="ArrowLeft"||e.key==="ArrowUp"){e.preventDefault();goTo(current-1);}
      if(e.key===" "){e.preventDefault();setRunning(r=>!r);}
    };
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[current,goTo]);

  const animated=s.kind==="engine"||s.kind==="shock";

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:"20px 16px",color:C.text,
      backgroundImage:`radial-gradient(ellipse at 15% 8%, ${C.accent}15 0%, transparent 55%)`}}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap"/>

      <div style={{width:"100%",maxWidth:860,
        background:`linear-gradient(135deg, ${C.panel} 0%, ${C.panel2} 100%)`,
        border:`1px solid ${C.line}`,borderRadius:16,padding:"30px 34px",minHeight:560,
        display:"flex",flexDirection:"column",
        boxShadow:"0 24px 80px rgba(0,0,0,0.5)",position:"relative",overflow:"hidden",
        opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(10px)",
        transition:"opacity .15s ease, transform .15s ease"}}>

        <div style={{position:"absolute",inset:0,opacity:0.025,pointerEvents:"none",
          backgroundImage:`linear-gradient(${C.text} 1px,transparent 1px),linear-gradient(90deg,${C.text} 1px,transparent 1px)`,
          backgroundSize:"40px 40px"}}/>

        {s.kind==="title"?(
          <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
            flex:1,textAlign:"center",gap:18}}>
            <h1 style={{fontFamily:SERIF,fontSize:56,margin:0,whiteSpace:"pre-line",lineHeight:1.05}}>{s.title}</h1>
            <div style={{width:70,height:2,background:C.accent,opacity:0.7}}/>
            <p style={{fontFamily:MONO,fontSize:12,color:C.accent,letterSpacing:2,textTransform:"uppercase",margin:0}}>{s.subtitle}</p>
            <p style={{fontFamily:MONO,fontSize:11,color:C.mute,letterSpacing:1,margin:0}}>{s.tag}</p>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:18,position:"relative",zIndex:1}}>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:12}}>
              <div>
                <h2 style={{fontFamily:SERIF,fontSize:28,margin:"0 0 4px"}}>{s.heading}</h2>
                <p style={{fontFamily:MONO,fontSize:11,color:s.color||C.accent,letterSpacing:2,textTransform:"uppercase",margin:0}}>{s.sub}</p>
              </div>
              {animated&&(
                <span style={{fontFamily:MONO,fontSize:9,letterSpacing:1.5,color:running?C.green:C.mute,
                  border:`1px solid ${running?C.green+"55":C.line2}`,borderRadius:20,padding:"3px 9px",whiteSpace:"nowrap"}}>
                  {running?"● LIVE FLOW":"❚❚ PAUSED"}
                </span>
              )}
            </div>

            {(s.kind==="engine")&&(
              <>
                <Card accent={C.accent} style={{padding:12}}>
                  <EngineCanvas key={"eng-"+current} focus={s.focus} running={running} height={300}/>
                </Card>
                {s.legend&&(
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
                    {Object.entries(BANDS).map(([k,b])=>(
                      <div key={k} style={{background:C.panel2,borderRadius:8,padding:"8px 6px",textAlign:"center",borderTop:`2px solid ${b.c}`}}>
                        <div style={{color:b.c,fontFamily:MONO,fontSize:10}}>{b.label.split(" · ")[0]}</div>
                        <div style={{color:C.mute,fontFamily:MONO,fontSize:9,marginTop:2}}>{b.label.split(" · ")[1]}</div>
                      </div>
                    ))}
                  </div>
                )}
                <Card accent={C.accent} style={{borderLeft:`3px solid ${C.accent}`}}>
                  <p style={{color:C.mute,fontSize:13,margin:0,lineHeight:1.6}}>{s.note}</p>
                </Card>
              </>
            )}

            {s.kind==="shock"&&(
              <>
                <Card accent={C.cyan} style={{padding:12}}>
                  <ShockCanvas key={"shock-"+current} running={running} height={260}/>
                </Card>
                <Card accent={C.cyan} style={{borderLeft:`3px solid ${C.cyan}`}}>
                  <p style={{color:C.mute,fontSize:13,margin:0,lineHeight:1.6}}>{s.note}</p>
                </Card>
              </>
            )}

            {s.kind==="station"&&(
              <>
                <Card accent={s.color} style={{padding:12}}>
                  <EngineCanvas key={"st-"+current} focus={s.focus} running={running} height={290}/>
                </Card>
                <StationPanel {...s.panel}/>
              </>
            )}

            {(s.kind==="concept"||s.kind==="summary")&&s.body}
          </div>
        )}
      </div>

      {/* nav */}
      <div style={{display:"flex",alignItems:"center",gap:18,marginTop:18}}>
        <button onClick={()=>goTo(current-1)} disabled={current===0} aria-label="Previous slide"
          style={navBtn(current===0)}>←</button>
        <div style={{display:"flex",gap:6}}>
          {slides.map((_,i)=>(
            <button key={i} onClick={()=>goTo(i)} aria-label={`Slide ${i+1}`}
              style={{width:i===current?20:8,height:8,borderRadius:4,border:"none",padding:0,cursor:"pointer",
                background:i===current?C.accent:C.line2,transition:"all .3s"}}/>
          ))}
        </div>
        <button onClick={()=>goTo(current+1)} disabled={current===total-1} aria-label="Next slide"
          style={navBtn(current===total-1)}>→</button>
        <div style={{width:1,height:22,background:C.line2}}/>
        <button onClick={()=>setRunning(r=>!r)} aria-label="Play or pause animation"
          style={{...navBtn(false),width:"auto",borderRadius:20,padding:"0 14px",fontSize:11,fontFamily:MONO,letterSpacing:1}}>
          {running?"❚❚ Pause":"▶ Play"}
        </button>
      </div>
      <p style={{fontFamily:MONO,fontSize:11,color:C.line2,marginTop:10,letterSpacing:1}}>
        {current+1} / {total} · ← → navigate · space toggles motion
      </p>
    </div>
  );
}

function navBtn(disabled){
  return{background:"transparent",border:`1px solid ${C.line2}`,color:disabled?C.line2:C.mute,
    width:40,height:40,borderRadius:"50%",cursor:disabled?"default":"pointer",fontSize:15,
    display:"flex",alignItems:"center",justifyContent:"center"};
}
