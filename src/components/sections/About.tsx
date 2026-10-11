"use client";
import {useEffect, useRef, useState} from 'react';
import {useScrollProgress, useReducedMotion, useStill} from '@/lib/hooks';
import Badge from './Badge';
const LAYERS=[
  {label:'The base',name:'A strong foundation.',body:'Finished my undergraduate degree at Kelley in just three years, building a base in business, information systems, and analytics.',top:'#c4a076',front:'#a9845c',side:'#99734d',pore:'#6f4c2c'},
  {label:'The middle',name:'Curiosity that kept going.',body:'Stayed at Kelley to pursue a Master’s in Information Systems, exploring how AI, data, and technology can solve real business problems.',top:'#ffefd0',front:'#e3d2ad',side:'#ccbb94',pore:'#ffffff'},
  {label:'The flavor',name:'Real-world experience.',body:'From strategy to analytics to assurance, I’ve worked across teams and industries that taught me how to turn complexity into clear decisions.',top:'#bd9161',front:'#a2794e',side:'#8f663f',pore:'#6a4728'},
  {label:'The finish',name:'The personal touch.',body:'I’m a huge foodie. I love discovering great food, but even more, I love making it myself. Tiramisu just happens to be a favorite.',top:'#775034',front:'#f0dfbc',side:'#d8c7a1',pore:'#ffffff'},
];
// Layers land over the first part of the scroll; past DONE_AT the cocoa goes on.
const DONE_AT=.78;
// SVG viewBox, cropped tight to the plate and the floating layers.
const VB={x:40,y:-80,w:560,h:640};
const pct=(v:number)=>`${((v-VB.y)/VB.h)*100}%`;
// Integer hash → [0,1): identical on server and client (Math.sin can differ in the last digits and break hydration).
const rnd=(n:number)=>{let h=Math.imul(Math.round(n*1000)^0x9e3779b9,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return (h>>>0)/4294967296;};
const r2=(v:number)=>Math.round(v*100)/100;
// Air pockets on each layer's front and side faces (layer-local coordinates).
const PORES=LAYERS.map((_,i)=>Array.from({length:14},(_,k)=>{const t=.06+rnd(i*31+k)*.88,s=.25+rnd(i*57+k*3)*.5,side=k%2===1;
  return side?{x:r2(178+170*t),y:r2(169-92*t+s*34),r:r2(1+rnd(k*7+i)*1.5)}:{x:r2(178*t),y:r2(82+87*t+s*34),r:r2(1+rnd(k*11+i)*1.5)};}));
// Cocoa dust for the top layer's top face.
const COCOA=Array.from({length:46},(_,k)=>{const u=.08+rnd(k*3.1)*.82,v=.08+rnd(k*7.7)*.82;
  return {x:r2(169*u+178*v),y:r2(82-82*u+87*v),r:r2(1.4+rnd(k*1.3)*1.4),d:r2(rnd(k*5.3)*.4)};});
// Settled layers stack 31 apart; the ones still to come hover 44 apart above them.
const GAP=74; // extra space between layers that haven't landed yet
const layerY=(i:number,settled:number)=>260-i*31-Math.max(0,i-settled)*GAP;
// Same as layerY but with a fractional "settled" amount, so layers glide down with the scroll
// instead of snapping from one step to the next.
const layerTf=(i:number,s:number)=>`translate(137px, ${(260-i*31-Math.max(0,i-s)*GAP).toFixed(2)}px)`;

export default function About(){
  // Scroll position only re-renders when the landed layer or the finished state changes;
  // the in-between glide is written straight to the layers, so scrolling stays smooth.
  const [scrollStep,setScrollStep]=useState(0); const [scrollDone,setScrollDone]=useState(false);
  const [pick,setPick]=useState<number|null>(null);
  const reduced=useReducedMotion();const still=useStill();const previous=useRef(0);
  const sRef=useRef(0); const layerRefs=useRef<(SVGGElement|null)[]>([]);
  const applyLayers=(s:number)=>{sRef.current=s;layerRefs.current.forEach((g,i)=>{if(g)g.style.transform=layerTf(i,s);});};
  const ref=useScrollProgress<HTMLElement>((r,vh)=>-r.top/Math.max(1,r.height-vh),(p)=>{
    const moved=Math.abs(p-previous.current)>.006;
    if(moved){setPick(null);previous.current=p;}
    const s=Math.min(3,Math.max(0,(p/(DONE_AT*.8))*4));
    if(moved||pick===null){layerRefs.current.forEach(g=>g?.classList.remove('is-jump'));applyLayers(s);}
    setScrollStep(Math.min(3,Math.floor(s)));setScrollDone(p>=DONE_AT);
  });
  // Clicking a numbered step jumps the cake there with a spring.
  useEffect(()=>{if(pick===null)return;layerRefs.current.forEach(g=>g?.classList.add('is-jump'));applyLayers(pick);},[pick]);
  // Which layer has just landed (0 = base … 3 = top), and whether the cocoa is on.
  const step=pick??(reduced?3:scrollStep);
  const done=pick===null&&(reduced||scrollDone);
  const sNow=reduced?3:pick??sRef.current;
  const ax=137+348+6, ay=layerY(step,step)+94; // callout anchor: the landed layer's right corner
  return <section id="about" ref={ref} data-card className={`deck-card tone-paper about-story${still?' is-still':''}${done?' is-done':''}`} aria-labelledby="about-title">
    <div className="tiramisu-sticky wrap">
      <div className="small-badge"><Badge/></div>
      <div className="recipe-copy">
        <h2 id="about-title" className="h-section">Good things<br/>come in <span className="accent">layers.</span></h2>
        <p className="lede recipe-intro">Business brain. Builder&apos;s curiosity.<br/>And a soft spot for making tiramisu.</p>
      </div>
      <div className="cake-special">
        <span className="mono">My house special</span>
        <p className="cake-special-title">Tiramisu.</p>
        <p className="cake-special-sub">Made from scratch, one layer at a time.</p>
      </div>
      <div className="dessert-stage">
        <div className="cake-rail" role="group" aria-label="Tiramisu story layers" style={{'--fill':step/3} as React.CSSProperties}>
          {LAYERS.map((l,i)=><button key={l.name} aria-label={l.name} aria-pressed={step===i} className={i<=step?'is-on':''} onClick={()=>setPick(i)}>{String(i+1).padStart(2,'0')}</button>)}
        </div>
        <div className="cake-wrap">
          <div className="cake-figure">
            <svg viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`} role="img" aria-label="Four layers of tiramisu stack up as you scroll down">
              <defs>
                <pattern id="cake-grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.8" r=".8" fill="#000" opacity=".07"/><circle cx="5" cy="4.6" r=".7" fill="#fff" opacity=".1"/><circle cx="3.6" cy="6.2" r=".5" fill="#000" opacity=".05"/></pattern>
                <filter id="cake-shadow"><feGaussianBlur stdDeviation="14"/></filter>
                <linearGradient id="plate" x2="0" y2="1"><stop stopColor="#fffdf6"/><stop offset="1" stopColor="#ddd3bf"/></linearGradient>
                <linearGradient id="sheen" x2="1"><stop stopColor="#fff" stopOpacity="0"/><stop offset=".5" stopColor="#fff" stopOpacity=".55"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
                <clipPath id="cake-top-clip"><path d="M0 82L169 0 348 77 178 169Z"/></clipPath>
              </defs>
              <ellipse cx="310" cy="448" rx="230" ry="60" fill="#473b24" opacity=".14" filter="url(#cake-shadow)"/>
              <path d="M50 358L307 226 580 364 322 506Z" fill="#c6bda7"/><path d="M50 348L307 216 580 354 322 496Z" fill="url(#plate)"/>
              <path d="M80 349L307 234 550 354 321 477Z" fill="none" stroke="#d9d0bc" strokeWidth="2"/>
              {LAYERS.map((l,i)=>{const floating=i>step;return <g key={l.name} ref={el=>{layerRefs.current[i]=el;}} className="cake-layer" style={{transform:layerTf(i,sNow)}}>
                <g className={`cake-float${floating?' is-floating':''}`} style={{animationDelay:`${-i*.9}s`}}>
                  <path d="M0 82L178 169 178 203 0 116Z" fill={l.front}/><path d="M178 169L348 77 348 111 178 203Z" fill={l.side}/>
                  {PORES[i].map((b,k)=><circle key={k} cx={b.x} cy={b.y} r={b.r} fill={l.pore} opacity={l.pore==='#ffffff'?.45:.28}/>)}
                  <path d="M0 82L169 0 348 77 178 169Z" fill={l.top}/><path d="M0 82L169 0 348 77 178 169Z" fill="url(#cake-grain)"/>
                  <path d="M1 83L178 170 347 78" fill="none" stroke={i===3?'#5c3929':'#fff5d9'} strokeOpacity=".35" strokeWidth="2"/>
                  {(i===step||(done&&i===3))&&<g clipPath="url(#cake-top-clip)" key={`sheen-${step}-${done}`}><rect className="cake-sheen" x="-160" y="-10" width="140" height="190" fill="url(#sheen)"/></g>}
                  {i===3&&<g className="cake-cocoa" aria-hidden="true">{COCOA.map((c,k)=><circle key={k} cx={c.x} cy={c.y} r={c.r} fill="#4a2f1f" style={{animationDelay:`${c.d}s`}}/>)}</g>}
                  {i===3&&<g transform="translate(175 79) rotate(-25)"><ellipse rx="14" ry="7" fill="#3d3225"/><path d="M-10 0Q0-4 10 1" fill="none" stroke="#796347" strokeWidth="2"/></g>}
                </g>
              </g>})}
              <g className="cake-leader" key={`leader-${step}`} aria-hidden="true">
                <circle className="cake-ping" cx={ax} cy={ay} r="6"/>
                <circle className="cake-dot" cx={ax} cy={ay} r="5"/>
                <path d={`M${ax+6} ${ay}H${VB.x+VB.w}`} pathLength={1}/>
              </g>
            </svg>
          </div>
          <div className="cake-notes">
            <div className="cake-callout" key={`callout-${step}`} aria-live="polite" style={{top:pct(ay)}}>
              <span className="mono">{String(step+1).padStart(2,'0')} · {LAYERS[step].label}</span><h3>{LAYERS[step].name}</h3><p>{LAYERS[step].body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <style href="tiramisu-v2" precedence="default">{`
      .about-story{height:210svh;min-height:1500px;background:#ebe7d9!important;}
      .tiramisu-sticky{position:sticky;top:0;min-height:100svh;display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1.5fr);align-items:center;gap:40px;padding-block:120px 40px;}
      .recipe-copy{max-width:480px;}.recipe-copy .h-section{font-size:clamp(2.5rem,3.9vw,4.5rem);}.recipe-intro{margin-top:24px;}

      /* Stage: step rail on the side, the cake, then a column for the callout card. */
      .dessert-stage{min-width:0;display:flex;align-items:center;gap:18px;}
      .cake-wrap{flex:1;min-width:0;display:flex;align-items:stretch;}
      .cake-figure{position:relative;flex:none;width:min(calc(100% - 300px),calc((100svh - 200px) * ${VB.w} / ${VB.h}));aspect-ratio:${VB.w}/${VB.h};}
      .cake-figure svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}
      /* The card overlaps the plate's empty right corner so the cake can take more of the width. */
      .cake-notes{position:relative;z-index:2;flex:1 1 360px;min-width:340px;max-width:460px;margin-left:-44px;}
      .cake-rail{position:relative;flex:none;display:flex;flex-direction:column;gap:16px;align-items:center;}
      .cake-rail::before,.cake-rail::after{content:"";position:absolute;left:50%;top:22px;bottom:22px;width:2px;margin-left:-1px;background:#193e3222;border-radius:2px;}
      .cake-rail::after{background:var(--green);bottom:auto;height:calc((100% - 44px) * var(--fill));transition:height .3s var(--ease);}
      .cake-rail button{position:relative;z-index:1;width:44px;height:44px;border-radius:50%;border:1px solid #193e3233;background:#ebe7d9;font-size:13px;font-variant-numeric:tabular-nums;transition:background .2s,color .2s,transform .3s cubic-bezier(.34,1.56,.64,1),box-shadow .2s;}
      .cake-rail button.is-on{background:var(--green);border-color:var(--green);color:#fff;}
      .cake-rail button[aria-pressed=true]{transform:scale(1.12);box-shadow:0 0 0 5px #193e321f;}
      .cake-rail button:hover{transform:scale(1.08);}
      .cake-rail button:focus-visible{outline:2px solid var(--ink);outline-offset:3px;}

      /* Layers snap onto the stack with a quick spring; the ones still to come float. */
      .cake-layer{transition:transform .14s ease-out;}.cake-layer.is-jump{transition:transform .5s cubic-bezier(.34,1.45,.55,1);}
      .cake-float.is-floating{animation:cake-float 3.2s ease-in-out infinite;}
      @keyframes cake-float{50%{transform:translateY(-7px)}}
      .cake-sheen{animation:cake-sheen .75s cubic-bezier(.3,.6,.3,1) .12s both;}
      @keyframes cake-sheen{from{transform:translateX(0)}to{transform:translateX(560px)}}
      .cake-cocoa circle{opacity:0;}
      .is-done .cake-cocoa circle{opacity:.7;animation:cocoa-fall .5s cubic-bezier(.3,1.3,.5,1) both;}
      @keyframes cocoa-fall{from{opacity:0;transform:translateY(-30px) scale(.4)}}

      /* Callout: the dot pops on the landed layer, the line shoots out, the card springs in. */
      .cake-leader path{fill:none;stroke:var(--ink);stroke-width:1.5;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:leader-draw .22s ease-out .1s forwards;}
      .cake-dot{fill:var(--ink);transform-box:fill-box;transform-origin:center;animation:dot-pop .3s cubic-bezier(.34,1.56,.64,1) both;}
      .cake-ping{fill:none;stroke:var(--ink);stroke-width:1.5;transform-box:fill-box;transform-origin:center;animation:ping 1.8s ease-out .35s infinite;}
      @keyframes leader-draw{to{stroke-dashoffset:0}}
      @keyframes dot-pop{from{transform:scale(0)}}
      @keyframes ping{0%{opacity:.6;transform:scale(1)}80%,100%{opacity:0;transform:scale(3.2)}}
      .cake-callout{position:absolute;left:0;right:0;transform:translateY(-50%);padding:22px 28px 24px;border-radius:12px;background:#f8f5ee;box-shadow:0 0 0 1px #193e3214,0 24px 48px -22px #2a201266;animation:callout-in .38s cubic-bezier(.34,1.45,.6,1) .12s both;}
      .cake-callout>.mono{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);}
      .cake-callout h3{font-size:clamp(1.375rem,1.9vw,1.75rem);font-weight:650;letter-spacing:-.03em;margin:8px 0 8px;line-height:1.15;}
      .cake-callout p{font-size:16px;line-height:1.5;color:var(--ink-2);margin:0;}
      @keyframes callout-in{from{opacity:0;transform:translate(-14px,-50%) scale(.92)}}

      /* House special: always on, top right under the nav bar. */
      .cake-special{position:absolute;right:var(--gutter);top:96px;z-index:1;text-align:right;pointer-events:none;}
      .cake-special>.mono{font-size:14px;letter-spacing:.24em;text-transform:uppercase;color:var(--mute);}
      .cake-special-title{margin:2px 0 0;font-family:var(--font-instrument-serif),Georgia,serif;font-style:italic;font-size:clamp(3.25rem,5vw,5.5rem);line-height:1;letter-spacing:-.02em;color:var(--green);transform-origin:100% 50%;}
      .cake-special-sub{margin:4px 0 0;font-size:17px;color:var(--ink-2);}
      .is-done .cake-special-title{animation:special-pop .5s cubic-bezier(.34,1.56,.64,1);}
      @keyframes special-pop{40%{transform:scale(1.06)}}

      .is-still .cake-float.is-floating,.is-still .cake-ping{animation:none;}

      /* ID badge hangs top-left and swings gently; hovering (or tapping to flip) pulls it closer so the back is readable. */
      .small-badge{position:absolute;left:calc(var(--gutter) + 72px);top:0;width:130px;height:250px;z-index:3;}.small-badge .ly{left:0;top:-28px;transform:scale(.43);transform-origin:0 0;}.small-badge .ly-strap{height:110px;}.small-badge .idc{transform-origin:50% 0;transition:transform .7s var(--ease);}.small-badge .idc:hover,.small-badge .idc.is-flipped{transform:scale(1.9);}
      @media(min-width:1500px){.small-badge{left:72px;}}
      @media(max-width:1100px){.tiramisu-sticky{grid-template-columns:minmax(0,.62fr) minmax(0,1.6fr);gap:24px;}.cake-figure{width:min(calc(100% - 270px),calc((100svh - 200px) * ${VB.w} / ${VB.h}));}.cake-notes{min-width:300px;}.cake-callout{padding:18px 22px;}.cake-callout p{font-size:15px;}}
      /* Phone: the whole scene fits one screen. The cake takes whatever height is left,
         so the step card and the 01-04 buttons are always visible. */
      @media(max-width:760px){
        .about-story{height:270svh;min-height:1800px;}
        .tiramisu-sticky{display:flex;flex-direction:column;height:100svh;min-height:0;padding-top:88px;padding-bottom:12px;gap:0;}
        .recipe-copy{flex:none;padding-top:0;}.recipe-copy .h-section{font-size:clamp(1.9rem,8.6vw,2.4rem);}.recipe-intro{font-size:14px;margin-top:8px;line-height:1.45;}
        .cake-special{position:static;flex:none;display:flex;align-items:baseline;justify-content:center;gap:10px;margin-top:10px;text-align:center;}
        .cake-special>.mono{font-size:10.5px;letter-spacing:.18em;}.cake-special-title{font-size:2.1rem;margin:0;transform-origin:50% 50%;}.cake-special-sub{display:none;}
        .dessert-stage{flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;margin-top:2px;}
        .cake-wrap{flex:1;min-height:0;display:flex;flex-direction:column;align-items:stretch;width:100%;}
        .cake-figure{flex:1 1 0;min-height:150px;width:100%;aspect-ratio:auto;}
        .cake-leader{display:none;}
        .cake-notes{flex:none;width:100%;min-width:0;max-width:none;margin:0;}
        .cake-callout{position:relative;top:auto!important;transform:none;text-align:center;min-height:104px;padding:10px 14px 12px;border-radius:14px;animation-name:callout-in-m;}
        .cake-callout>.mono{font-size:10.5px;}.cake-callout h3{font-size:17px;margin:3px 0 3px;}.cake-callout p{font-size:13px;line-height:1.4;}
        @keyframes callout-in-m{from{opacity:0;transform:translateY(10px) scale(.96)}}
        .cake-rail{flex:none;flex-direction:row;justify-content:center;gap:18px;order:2;}
        .cake-rail button{width:42px;height:42px;}
        .cake-rail::before,.cake-rail::after{left:calc(50% - 90px);right:calc(50% - 90px);top:50%;bottom:auto;width:auto;height:2px;margin:-1px 0 0;}
        .cake-rail::after{right:auto;width:calc(180px * var(--fill));height:2px;transition:width .3s var(--ease);}
        .small-badge{left:auto;right:44px;width:90px;height:220px;}.small-badge .ly{left:auto;right:0;transform:scale(.3);transform-origin:100% 0;}.small-badge .ly-strap{height:360px;}.small-badge .idc:hover,.small-badge .idc.is-flipped{transform:scale(2);}
      }
      @media(prefers-reduced-motion:reduce){
        .about-story{height:auto;min-height:100svh;}.tiramisu-sticky{position:relative;}
        .cake-layer,.cake-rail::after{transition:none;}
        .cake-float.is-floating,.cake-sheen,.cake-ping,.is-done .cake-cocoa circle,.cake-leader path,.cake-dot,.cake-callout,.is-done .cake-special-title{animation:none;}
        .cake-leader path{stroke-dashoffset:0;}
      }
    `}</style>
  </section>
}
