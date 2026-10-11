"use client";
import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import {SKILL_FAMILIES,SKILL_GROUPS,SKILL_LINES,type SkillFamily} from '@/lib/data';
import {createPortal} from 'react-dom';
import {lockScroll} from '@/lib/scroll';
import SkillIcon from '../ui/SkillIcon';
const SHORT:Record<string,string>={'Roadmapping':'Roadmap','Account Segmentation':'Segments','Cloud Architecture (AWS)':'AWS','Go-to-Market Strategy':'Go-to-market','Requirements Gathering':'Discovery','Structured Problem-Solving':'Problem solving','Agile (Scrum/Kanban)':'Agile','Business Case Development':'Business cases','Market & Competitive Research':'Market research','Financial Statement Analysis':'Statements','Data Governance / MDM':'Governance','Time Series Forecasting':'Forecasting','Stakeholder Management':'Stakeholders','Financial Modeling':'Fin. modeling','ROI & NPV Analysis':'ROI & NPV','Variance Analysis':'Variance','KPI Development':'KPIs','Prompt Engineering':'Prompting','Machine Learning':'ML','Google TimesFM':'TimesFM','CRM Management':'CRM','Advanced Excel':'Excel'};
// Open on Python: the first key with a real brand mark.
const START=Math.max(0,SKILL_GROUPS.findIndex(s=>s.name==='Python'));
const PHONE='(max-width: 760px)';
const subscribePhone=(cb:()=>void)=>{const m=window.matchMedia(PHONE);m.addEventListener('change',cb);return()=>m.removeEventListener('change',cb);};

export default function Skills(){
 const [selected,setSelected]=useState(START);const [filter,setFilter]=useState<SkillFamily|'All'>('All');
 // Phones get a different layout: one family at a time, chosen from swipeable tabs.
 const phone=useSyncExternalStore(subscribePhone,()=>window.matchMedia(PHONE).matches,()=>false);
 const gridRef=useRef<HTMLDivElement>(null);
 // Phone only: pressing a key opens a bottom sheet with the one-liner.
 const [sheet,setSheet]=useState(false);const sheetRef=useRef<HTMLDivElement>(null);const closeRef=useRef<HTMLButtonElement>(null);
 const opener=useRef<HTMLElement|null>(null);const drag=useRef<{y:number,dy:number}|null>(null);
 const open=sheet&&phone;
 useEffect(()=>{
  if(!open)return;
  lockScroll(true);closeRef.current?.focus();
  const onEsc=(e:KeyboardEvent)=>{if(e.key==='Escape')setSheet(false);};
  window.addEventListener('keydown',onEsc);
  return()=>{window.removeEventListener('keydown',onEsc);lockScroll(false);opener.current?.focus({preventScroll:true});};
 },[open]);
 const skill=SKILL_GROUPS[selected];
 const tab:SkillFamily=filter==='All'?skill.family:filter;
 const keys=SKILL_GROUPS.map((s,i)=>({s,i})).filter(({s})=>!phone||s.family===tab);
 const chips=phone?SKILL_FAMILIES:(['All',...SKILL_FAMILIES] as const);
 function pick(f:SkillFamily|'All'){setFilter(f);if(f!=='All'&&skill.family!==f)setSelected(SKILL_GROUPS.findIndex(s=>s.family===f));}
 function onKey(e:React.KeyboardEvent,pos:number){
  const cols=gridRef.current?getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length:8;
  const step=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:e.key==='ArrowDown'?cols:e.key==='ArrowUp'?-cols:0;
  if(!step)return;e.preventDefault();const next=(pos+step+keys.length)%keys.length;
  setSelected(keys[next].i);(gridRef.current?.children[next] as HTMLElement|undefined)?.focus();
 }
 return <section id="skills" data-card className="deck-card skills" aria-labelledby="skills-title"><div className="wrap section kb">
  <h2 id="skills-title" className="h-section rv">A few keys.<br/>A lot of <span className="accent">possibilities.</span></h2>
  <div className="kb-filters" role="group" aria-label="Filter skills">{chips.map(f=>{const on=phone?f===tab:filter===f;return <button key={f} aria-pressed={on} onClick={()=>pick(f)}>{f}</button>;})}</div>
  <div className="kb-body">
   <div className="kb-case">
    <div className="kb-top"><div className="kb-screen" aria-hidden="true"><i/><span key={skill.name}>{skill.name}</span></div></div>
    <div className="kb-grid" ref={gridRef} role="group" aria-label="Skill keyboard">{keys.map(({s,i},pos)=><button key={s.name} className={`kb-key${selected===i?' is-sel':''}${!phone&&filter!=='All'&&s.family!==filter?' is-dim':''}`} aria-pressed={selected===i} aria-label={s.name} aria-controls="skill-detail" onClick={e=>{setSelected(i);if(phone){opener.current=e.currentTarget;setSheet(true);}}} onKeyDown={e=>onKey(e,pos)}>
      <span className="kb-cap"><span>{SHORT[s.name]||s.name}</span></span>
     </button>)}</div>
   </div>
   <div className="kb-side">
    <p className="kb-prompt">Pick a key. See what I can do with it.</p>
    <aside id="skill-detail" className="kb-insp" aria-live="polite" aria-atomic="true"><div key={skill.name} className="kb-insp-inner">
     <div className="kb-logo"><SkillIcon skill={skill} size={96}/></div>
     <h3>{skill.name}</h3>
     <p className="kb-line">{SKILL_LINES[skill.name]}</p>
    </div></aside>
   </div>
  </div>
  {/* Portalled to <body>: the deck transforms each card, which would trap position:fixed inside it. */}
  {open&&createPortal(<div className="kb-sheet-wrap" onClick={()=>setSheet(false)}>
   <div className="kb-sheet" ref={sheetRef} role="dialog" aria-modal="true" aria-labelledby="kb-sheet-title" onClick={e=>e.stopPropagation()}
    onPointerDown={e=>{drag.current={y:e.clientY,dy:0};}}
    onPointerMove={e=>{const d=drag.current;if(!d||!sheetRef.current)return;d.dy=Math.max(0,e.clientY-d.y);sheetRef.current.style.transform=`translateY(${d.dy}px)`;}}
    onPointerUp={()=>{const d=drag.current;drag.current=null;if(!sheetRef.current)return;if(d&&d.dy>90)setSheet(false);else sheetRef.current.style.transform='';}}
    onPointerCancel={()=>{drag.current=null;if(sheetRef.current)sheetRef.current.style.transform='';}}>
    <span className="kb-grabber" aria-hidden="true"/>
    <button ref={closeRef} className="kb-close" aria-label="Close" onClick={()=>setSheet(false)}>×</button>
    <div className="kb-sheet-logo"><SkillIcon skill={skill} size={64}/></div>
    <h3 id="kb-sheet-title">{skill.name}</h3>
    <p className="kb-line">{SKILL_LINES[skill.name]}</p>
   </div>
  </div>,document.body)}
 </div><style href="keyboard-v3" precedence="default">{`
 .skills .kb{padding-block:clamp(64px,9vh,112px) clamp(56px,8vh,96px);}
 .kb>.h-section{font-size:clamp(2.5rem,4.6vw,4.25rem)}
 .kb-filters{display:flex;flex-wrap:wrap;gap:7px;margin-top:22px}
 .kb-filters button{flex:none;min-height:40px;border:1px solid var(--line);border-radius:30px;padding:0 16px;font-size:14px;color:var(--ink-2);transition:background .25s,color .25s,border-color .25s}
 .kb-filters button:hover{border-color:var(--ink);color:var(--ink)}
 .kb-filters button[aria-pressed=true]{background:var(--green);border-color:var(--green);color:#fff}

 .kb-body{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:clamp(24px,3vw,48px);margin-top:22px;align-items:start}
 .kb-case{padding:12px 12px 14px;background:#2a2c2a;border:2px solid #1d1f1d;border-radius:28px;box-shadow:0 3px 0 #8a8a82,0 7px 0 #cfccc2,0 24px 28px -10px #1c201850,0 45px 50px -24px #1c20183d}
 .kb-top{display:flex;padding:2px 2px 12px}
 .kb-screen{flex:1;display:flex;align-items:center;gap:14px;min-height:60px;border:4px solid #c4c4b9;outline:1px solid #e8e7dd;border-radius:14px;padding:10px 20px;background:repeating-linear-gradient(0deg,#292c2a 0 2px,#303330 2px 4px);box-shadow:inset 0 0 0 3px #101511,inset 0 4px 12px #000a;color:#f7f5e9;overflow:hidden}
 .kb-screen i{flex:none;width:9px;height:9px;border-radius:50%;background:#f5a06a;box-shadow:0 0 10px #ef7a33}
 .kb-screen span{font-family:var(--font-jetbrains-mono),ui-monospace,monospace;font-size:clamp(17px,1.7vw,22px);letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;animation:screen-in .35s steps(8,end)}
 @keyframes screen-in{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}

 /* Keys: clean off-white caps on a dark case; the pressed key turns orange. */
 .kb-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:7px}
 .kb-key{position:relative;aspect-ratio:1/.62;border-radius:14px;background:linear-gradient(160deg,#e9e6dd,#c9c5b9);box-shadow:inset 0 1px 1px #fff,0 2px 0 #00000060,0 3px 5px #0006;transition:opacity .3s,filter .3s}
 .kb-cap{position:absolute;inset:5px 6px 11px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:4px 3px;border-radius:11px;background:linear-gradient(160deg,#fbfaf6,#efece4);box-shadow:inset 0 1px 0 #fff,inset 0 -2px 3px #0000000d,0 1px 2px #00000026;transition:transform .14s,box-shadow .14s,background .2s}
 .kb-cap>span{font-size:clamp(11px,.95vw,13.5px);line-height:1.15;font-weight:600;color:#24291f;text-align:center;letter-spacing:-.015em}
 .kb-key:hover .kb-cap{transform:translateY(2px)}
 .kb-key:active .kb-cap{transform:translateY(5px);box-shadow:inset 0 1px 3px #0002}
 .kb-key.is-sel{background:linear-gradient(160deg,#e0712e,#9a3f09);box-shadow:inset 0 1px 1px #ffc49a,0 2px 0 #7a2a06,0 3px 8px #e8641b66}
 .kb-key.is-sel .kb-cap{background:linear-gradient(160deg,#c2540f,#a8460a);transform:translateY(3px);box-shadow:inset 0 1px 0 #ffbf8f,inset 0 -2px 4px #b6460c55}
 .kb-key.is-sel .kb-cap>span{color:#fff}
 .kb-key.is-dim{opacity:.28;filter:saturate(.2)}
 .kb-key:focus-visible{outline:3px solid #e97831;outline-offset:3px}

 /* Side: the prompt, then a card that simply names the key. */
 .kb-side{padding-top:clamp(8px,3vh,36px)}
 .kb-prompt{margin:0 0 18px;font-size:clamp(1.25rem,1.6vw,1.6rem);line-height:1.3;letter-spacing:-.02em;color:var(--ink-2);text-wrap:balance}
 .kb-insp{position:sticky;top:96px;padding:18px;border-radius:24px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line),0 18px 40px -28px #1c201860}
 .kb-insp-inner{animation:insp-in .35s var(--ease)}
 @keyframes insp-in{from{opacity:0;transform:translateY(6px)}}
 .kb-logo{display:grid;place-items:center;height:clamp(140px,20vh,200px);border-radius:16px;background:radial-gradient(closest-side,#f2701f14,transparent),#fff;box-shadow:inset 0 0 0 1px var(--line)}
 .kb-logo svg{animation:logo-pop .45s cubic-bezier(.34,1.56,.64,1)}
 @keyframes logo-pop{from{opacity:0;transform:scale(.7) rotate(-6deg)}}
 .kb-insp h3{margin:18px 4px 4px;font-size:clamp(1.5rem,2vw,2rem);font-weight:700;letter-spacing:-.035em;line-height:1.1;text-align:center}
 .kb-line{margin:10px 4px 2px;font-size:15px;line-height:1.5;color:var(--ink-2);text-align:center;text-wrap:pretty}

 /* Phone pop-up: a bottom sheet with a grabber; swipe down, tap outside, × or Esc to close. */
 .kb-sheet-wrap{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-end;background:#10140f66;animation:sheet-fade .25s ease both}
 .kb-sheet{position:relative;width:100%;padding:12px 22px calc(26px + env(safe-area-inset-bottom));border-radius:26px 26px 0 0;background:var(--paper);box-shadow:0 -20px 50px -20px #0006;text-align:center;touch-action:none;animation:sheet-up .38s cubic-bezier(.32,1.25,.5,1) both;transition:transform .2s}
 .kb-grabber{display:block;width:40px;height:5px;margin:0 auto 10px;border-radius:5px;background:#193e3233}
 .kb-close{position:absolute;right:14px;top:12px;width:44px;height:44px;border-radius:50%;font-size:24px;line-height:1;color:var(--ink-2);background:#193e320d}
 .kb-sheet-logo{display:grid;place-items:center;width:96px;height:96px;margin:6px auto 0;border-radius:24px;background:#fff;box-shadow:inset 0 0 0 1px var(--line)}
 .kb-sheet h3{margin:16px 0 0;font-size:1.6rem;font-weight:700;letter-spacing:-.035em;line-height:1.1}
 .kb-sheet .kb-line{font-size:16px;margin:10px auto 4px;max-width:34ch}
 @keyframes sheet-fade{from{opacity:0}}
 @keyframes sheet-up{from{transform:translateY(100%)}}
 @media(prefers-reduced-motion:reduce){.kb-sheet,.kb-sheet-wrap{animation-name:sheet-fade}}

 @media(max-width:1100px){
  .kb-body{grid-template-columns:1fr}
  .kb-side{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:center;padding-top:0}
  .kb-prompt{margin:0}
  .kb-insp{position:relative;top:0}
  .kb-insp-inner{display:grid;grid-template-columns:120px 1fr;column-gap:18px;align-items:center}
  .kb-logo{grid-row:span 2;width:120px;height:120px}.kb-logo svg{width:72px;height:72px}
  .kb-insp h3{margin:0;text-align:left;align-self:end}
  .kb-insp .kb-line{margin:6px 0 0;text-align:left;align-self:start;font-size:15px}
 }
 /* Phone: swipeable family tabs, one family at a time on a 3-across keyboard of big keys. */
 @media(max-width:760px){
  .kb>.h-section{font-size:2.4rem}
  .kb-filters{flex-wrap:nowrap;overflow-x:auto;scroll-snap-type:x proximity;scroll-padding-inline:var(--gutter);margin:18px calc(var(--gutter) * -1) 0;padding:0 var(--gutter) 4px;scrollbar-width:none}
  .kb-filters::-webkit-scrollbar{display:none}
  .kb-filters button{scroll-snap-align:start;min-height:40px;font-size:14px}
  .kb-body{display:flex;flex-direction:column;align-items:stretch;gap:14px;margin-top:16px}
  .kb-side{order:-1;display:block}
  .kb-prompt{font-size:1.125rem}
  .kb-insp{display:none}
  .kb-case{padding:10px 10px 12px;border-radius:24px}
  .kb-screen{min-height:56px;padding:8px 16px}.kb-screen span{font-size:19px}
  .kb-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .kb-key{aspect-ratio:1/.68;border-radius:15px}
  .kb-cap{inset:5px 6px 11px;border-radius:11px}
  .kb-cap>span{font-size:14px}
 }
 `}</style></section>
}
