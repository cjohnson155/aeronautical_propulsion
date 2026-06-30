// ME 3470 . Unit 2 - presentation stylesheet (single source of truth)
export const CSS = `
:root{
  --bg:#0d1b2a; --panel:#13243a; --ink:#eaf1f8; --muted:#8da4be;
  --accent:#5ec8d8; --accent-2:#f0a93b; --rule:#27405e;
  --display:'Georgia','Times New Roman',serif;
  --body:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
}
*{box-sizing:border-box}
html,body,#root{height:100%;margin:0}
.app{height:100vh;height:100dvh;width:100%;display:flex;flex-direction:column;
  background:radial-gradient(1200px 700px at 70% -10%,#163152 0%,var(--bg) 55%);
  color:var(--ink);font-family:var(--body)}
.top-bar{display:flex;align-items:center;gap:12px;padding:14px 26px;
  border-bottom:1px solid var(--rule);font-size:13px;letter-spacing:.04em}
.course-id{color:var(--accent);font-weight:600}
.top-bar-divider{width:1px;height:14px;background:var(--rule)}
.deck-title{color:var(--muted)}
.top-bar-spacer{flex:1}
.slide-counter{color:var(--muted);font-variant-numeric:tabular-nums}
.stage{flex:1;min-height:0;display:flex;align-items:flex-start;justify-content:center;
  padding:30px 40px;cursor:pointer;overflow:auto}
.slide-wrapper{margin:auto;position:relative;width:100%;max-width:1100px}
.slide{width:100%}
.slide.exit .slide-inner{opacity:0;transform:translateY(-10px);transition:.24s ease}
.slide-inner{width:100%}
.anim-in{animation:fadeUp .5s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

.compress-slide{max-height:100%}
.section-number{font-family:var(--display);color:var(--accent);
  font-size:15px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px}
.slide-heading{font-family:var(--display);font-size:34px;margin:2px 0 0}
.slide-heading sub{font-size:.62em}
.heading-rule{width:70px;height:3px;background:var(--accent);margin:14px 0 16px}
.reveal-block{opacity:0;transform:translateY(10px);transition:.45s ease;margin-bottom:12px}
.reveal-block.revealed{opacity:1;transform:none}
.cf-note{font-size:15px;line-height:1.55;color:var(--muted);max-width:980px;margin:0}
.cf-note strong{color:var(--accent-2)}
.cf-note--lead{color:var(--ink);font-size:16px}
.cf-note--lead em{color:var(--accent)}
.cf-bridge{font-size:15px;line-height:1.55;color:var(--ink);max-width:980px;margin:0;
  border-left:3px solid var(--accent-2);padding-left:14px}
.cf-bridge strong{color:var(--accent)}
.cf-bridge em{color:var(--accent-2);font-style:italic}

/* equation rows */
.eq-row{display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin:16px 0}
.eq-box{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:8px;padding:14px 26px;font-size:20px}
.eq-aside{color:var(--muted);font-size:15px;display:flex;align-items:center;gap:8px}

/* idg case cards */
.case-row{display:flex;gap:18px;flex-wrap:wrap;margin:6px 0 4px}
.case-card{background:var(--panel);border:1px solid var(--rule);border-radius:10px;
  padding:14px 18px;min-width:280px;flex:1}
.case-label{font-family:var(--display);font-size:14px;font-weight:700;letter-spacing:.04em;
  color:var(--accent-2);margin-bottom:10px}
.case-givens{font-size:14px;color:var(--muted);margin-bottom:8px}
.case-result{font-size:17px;color:var(--ink);border-top:1px solid var(--rule);padding-top:8px}

/* energy-modes grid */
.em-row{display:flex;gap:16px;flex-wrap:wrap;margin:16px 0 18px}
.em-fig{margin:0;background:var(--panel);border:1px solid var(--rule);border-radius:10px;
  padding:12px 14px 14px;width:230px;flex:1;min-width:200px;display:flex;flex-direction:column;
  align-items:center;opacity:0;transform:translateY(10px);transition:.42s ease}
.em-fig.revealed{opacity:1;transform:none}
.em-mode-title{align-self:flex-start;font-family:var(--display);font-size:15px;font-weight:700;
  color:var(--accent);margin-bottom:6px}
.em-svg{width:100%;height:auto;cursor:pointer}
.em-formula{font-size:16px;margin:8px 0 6px;color:var(--ink)}
.em-fig figcaption{font-size:12.5px;line-height:1.45;color:var(--muted);text-align:left}

/* molecule primitives */
.em-atom{fill:rgba(94,200,216,.18);stroke:var(--accent);stroke-width:1.6}
.em-bond{stroke:var(--ink);stroke-width:2}
.em-spring{fill:none;stroke:var(--ink);stroke-width:1.8}
.em-orbit{fill:none;stroke:var(--accent-2);stroke-width:1;stroke-dasharray:3 4;opacity:.55}
.em-orbit--outer{opacity:.4}

/* mode animations */
.em-translational .em-body{animation:emDrift 2.2s ease-in-out both}
@keyframes emDrift{0%{transform:translateX(-26px)}100%{transform:translateX(20px)}}
.em-rotational .em-spin{transform-box:view-box;transform-origin:100px 60px;
  animation:emSpin 2.4s linear infinite}
@keyframes emSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.em-vibrational .em-left{transform-box:view-box;animation:emVibL 1.2s ease-in-out infinite}
.em-vibrational .em-right{transform-box:view-box;animation:emVibR 1.2s ease-in-out infinite}
.em-vibrational .em-coil{transform-box:view-box;transform-origin:114.5px 60px;
  animation:emCoil 1.2s ease-in-out infinite}
@keyframes emVibL{0%,100%{transform:translateX(0)}50%{transform:translateX(20px)}}
@keyframes emVibR{0%,100%{transform:translateX(0)}50%{transform:translateX(-20px)}}
@keyframes emCoil{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.42)}}
.em-electronic .em-electron{animation:emHop 2.6s ease-in-out infinite}
@keyframes emHop{
  0%,15%{transform:translate(130px,60px)}
  35%,50%{transform:translate(152px,60px)}
  70%,85%{transform:translate(48px,60px)}
  100%{transform:translate(70px,60px)}
}

/* monatomic payoff */
.em-payoff{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.em-mono{width:120px;height:auto;flex-shrink:0}

/* DOF slide */
.dof-layout{display:flex;gap:26px;flex-wrap:wrap;align-items:flex-start;margin:8px 0 12px}
.dof-graph-wrap{flex:1 1 420px;min-width:340px;background:var(--panel);
  border:1px solid var(--rule);border-radius:12px;padding:14px 16px 8px}
.dof-svg{width:100%;height:auto}
.mol-svg{width:100%;height:auto;max-width:230px;margin:12px auto 6px;display:block}
.dof-axis{fill:var(--muted);font-size:11px;font-family:var(--display);font-style:italic}
.dof-ymark{fill:var(--accent-2);font-size:11px;font-family:var(--display);font-style:italic;
  font-variant-numeric:tabular-nums}
.dof-tick{fill:var(--muted);font-size:10px}
.dof-curve{transition:stroke-dashoffset 1.4s ease}
.dof-band{opacity:0;transition:opacity .5s ease}
.dof-band.on{opacity:.14}

.dof-side{flex:1 1 300px;min-width:260px}
.dof-def{display:flex;align-items:baseline;gap:12px;margin-bottom:8px}
.dof-def-eq{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:7px;padding:6px 14px;font-size:16px}
.dof-def-note{color:var(--muted);font-size:13px}
.dof-band-key{list-style:none;padding:0;margin:14px 0 0;display:flex;flex-direction:column;gap:8px}
.dof-band-item{display:flex;align-items:center;gap:10px;font-size:14px;
  opacity:0;transform:translateX(-6px);transition:.4s ease}
.dof-band-item.revealed{opacity:1;transform:none}
.dof-chip{width:14px;height:14px;border-radius:4px;flex-shrink:0}
.dof-chip--trans{background:rgba(94,200,216,.6)}
.dof-chip--rot{background:rgba(94,200,216,.4)}
.dof-chip--flat{background:rgba(240,169,59,.5)}
.dof-chip--vib{background:rgba(94,200,216,.25)}
.dof-band-name{color:var(--ink);font-weight:600;min-width:96px}
.dof-band-sub{color:var(--muted);font-size:12.5px}

/* cp vs cv slide */
.cpcv-slide .slide-heading{font-size:34px}
.cpcv-slide .reveal-block:not(.revealed){display:none}
.cpcv-slide .cf-note{font-size:18px;line-height:1.46;color:var(--ink)}
.cpcv-slide .cf-note--lead{font-size:20px;line-height:1.42}
.cpcv-layout{display:flex;gap:22px;flex-wrap:nowrap;align-items:flex-start;margin:6px 0 12px}
.cpcv-fig{flex:1.35 1 530px;min-width:500px;background:var(--panel);border:1px solid var(--rule);
  border-radius:12px;padding:10px 12px}
.cpcv-svg{width:100%;height:auto;cursor:pointer;display:block}
.cpcv-explain-stack{flex:1 1 360px;min-width:320px;display:flex;flex-direction:column;gap:10px}
.cpcv-concept,.cpcv-work{background:rgba(255,255,255,.035);border:1px solid var(--rule);border-radius:12px;padding:12px 14px;margin-bottom:0}
.cpcv-cap{fill:var(--ink);font-size:12.5px;font-weight:700;font-family:var(--display)}
.cpcv-subcap{fill:var(--muted);font-size:10.5px;font-family:var(--display)}
.cpcv-small{fill:var(--muted);font-size:11px;font-family:var(--display)}
.cpcv-flame{font-size:20px}
.cpcv-q{fill:var(--accent);font-size:12px}

.cp-piston{animation:pistonLift 2.6s ease-in-out both}
.cp-gas{transform-box:fill-box;transform-origin:50% 100%;animation:gasExpand 2.6s ease-in-out both}
@keyframes pistonLift{0%{transform:translateY(36px)}55%{transform:translateY(36px)}100%{transform:translateY(0)}}
@keyframes gasExpand{0%{transform:scaleY(.55)}55%{transform:scaleY(.55)}100%{transform:scaleY(1)}}
.cv-shimmer circle,.temp-molecules circle{animation:shimmer 1.4s ease-in-out infinite alternate}
.temp-molecules path{animation:thermalArrows 1.4s ease-in-out infinite alternate}
.cv-shimmer circle:nth-child(2),.temp-molecules circle:nth-child(2){animation-delay:.3s}
.cv-shimmer circle:nth-child(3),.temp-molecules circle:nth-child(3){animation-delay:.6s}
.temp-molecules circle:nth-child(4){animation-delay:.9s}
@keyframes shimmer{from{opacity:.35;transform:translateY(2px)}to{opacity:1;transform:translateY(-2px)}}
@keyframes thermalArrows{from{opacity:.45}to{opacity:1}}

.rel-row{display:flex;gap:18px;flex-wrap:wrap;margin:4px 0 12px}
.rel-card{flex:1 1 300px;min-width:280px;background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:12px 16px;opacity:0;transform:translateY(8px);transition:.42s ease}
.rel-card.revealed{opacity:1;transform:none}
.rel-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.rel-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 9px}
.rel-tag--pg{background:var(--accent)}
.rel-tag--cpg{background:var(--accent-2)}
.rel-label{color:var(--muted);font-size:13px}
.rel-eqs{display:flex;flex-wrap:wrap;gap:8px 18px}
.rel-eq{font-size:16px;color:var(--ink)}

/* nav */
.nav-bar{display:flex;align-items:center;gap:16px;padding:14px 26px;border-top:1px solid var(--rule)}
.nav-btn{background:var(--panel);color:var(--ink);border:1px solid var(--rule);
  border-radius:7px;padding:8px 16px;font-size:14px;cursor:pointer;transition:.2s}
.nav-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.nav-btn:disabled{opacity:.35;cursor:default}
.nav-dots{flex:1;display:flex;gap:8px;justify-content:center}
.nav-dot{width:9px;height:9px;border-radius:50%;background:var(--rule);cursor:pointer;transition:.2s}
.nav-dot.active{background:var(--accent);transform:scale(1.25)}
.nav-hint{color:var(--muted);font-size:12px}
.progress-bar{position:absolute;left:0;bottom:-12px;height:2px;background:var(--accent);transition:width .3s ease}

/* ── Section 1: outline ─────────────────────────────────────────────────── */
.section-slide{max-height:100%}
.section-title{font-family:var(--display);font-size:54px;line-height:1.02;margin:0}
.section-divider-line{width:80px;height:3px;background:var(--accent);margin:18px 0 14px}
.section-sub{color:var(--muted);font-size:17px;max-width:640px;margin:0 0 22px}
.outline-list{list-style:none;padding:0;margin:0;display:grid;
  grid-template-columns:1fr 1fr;gap:12px 30px;max-width:880px}
.outline-item{display:flex;align-items:baseline;gap:14px;font-size:18px;
  opacity:0;transform:translateY(8px);transition:.4s ease}
.outline-item.revealed{opacity:1;transform:none}
.outline-num{font-family:var(--display);color:var(--accent-2);font-size:15px;
  font-variant-numeric:tabular-nums;min-width:18px}
.outline-text{color:var(--ink)}

/* ── Section 1: compress + thrust ───────────────────────────────────────── */
.cf-tag{display:inline-block;font-family:var(--display);font-size:12px;font-weight:700;
  color:var(--bg);background:var(--accent);border-radius:5px;padding:2px 9px;flex-shrink:0}
.cf-tag--def{background:var(--accent-2)}
.cf-question,.cf-def{display:flex;gap:10px;font-size:18px;line-height:1.5;
  color:var(--ink);max-width:920px;margin:0}
.cf-question strong{color:var(--accent)}
.cf-question em,.cf-def em{color:var(--accent-2);font-style:italic}
.eq-aside--hidden{color:var(--accent-2)}
.thrust-list{list-style:none;padding:0;margin:18px 0 0;display:flex;flex-direction:column;gap:12px;max-width:940px}
.thrust-item{display:flex;gap:12px;align-items:baseline;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.thrust-item.revealed{opacity:1;transform:none}
.thrust-marker{color:var(--accent);font-size:11px;line-height:1.6;flex-shrink:0}
.thrust-text{display:flex;flex-direction:column;gap:3px}
.thrust-text strong{font-size:17px;color:var(--ink)}
.thrust-sub{font-size:15px;line-height:1.5;color:var(--muted)}
.thrust-sub strong{color:var(--accent-2)}

/* ── Section 1: SVG diagrams ────────────────────────────────────────────── */
.diagram-row{display:flex;gap:18px;flex-wrap:wrap;margin-top:20px}
.diagram{margin:0;background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:10px 12px 8px;display:flex;flex-direction:column;
  align-items:center;width:170px}
.cv-svg{width:130px;height:auto}
.cv-box{stroke:var(--ink);stroke-width:1.4;fill:rgba(94,200,216,.05)}
.cv-text{fill:var(--ink);font-family:var(--body);font-size:11px}
.cv-text--lg{font-size:14px;font-style:italic}
.cv-text--sm{font-size:9px;fill:var(--muted)}
.diagram figcaption{font-size:11px;color:var(--muted);text-align:center;margin-top:6px;line-height:1.3}
.piston-svg{cursor:pointer}
.cyl-wall path{stroke:var(--ink);stroke-width:1.4;fill:none}
.ins-outline{stroke:var(--accent-2);stroke-width:1}
.ins-hatch{stroke:var(--accent-2);stroke-width:.8}
.press-arrow{stroke:var(--accent);stroke-width:1.4;marker-end:none}
.piston-head{fill:var(--muted);stroke:var(--ink);stroke-width:1}
.piston-rod{stroke:var(--ink);stroke-width:2}
.gas{fill:rgba(94,200,216,.14);stroke:var(--accent);stroke-width:.8}
.gas-label{fill:var(--ink);font-size:11px}
.piston-anim .piston{animation:pistonDrop 2.2s ease-in-out both}
.piston-anim .gas{animation:gasCompress 2.2s ease-in-out both;transform-box:fill-box;transform-origin:50% 100%}
.piston-anim .gas-label{animation:labelSettle 2.2s ease-in-out both}
.piston-anim .heat-out{animation:heatPulse 2.2s ease-in-out both}
@keyframes pistonDrop{0%{transform:translateY(0)}100%{transform:translateY(58px)}}
@keyframes gasCompress{0%{transform:scaleY(1)}100%{transform:scaleY(0.52)}}
@keyframes labelSettle{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(14px);opacity:1}}
@keyframes heatPulse{
  0%,30%{opacity:0;transform:translate(0,0)}
  55%{opacity:1;transform:translate(-3px,3px)}
  80%{opacity:1;transform:translate(-5px,5px)}
  100%{opacity:.4;transform:translate(-6px,6px)}}

/* ── NEW card styles (Sections 4 & 5) ───────────────────────────────────── */
.cmp-row{display:flex;gap:18px;flex-wrap:wrap;margin:16px 0 18px}
.cmp-row--tight{margin:10px 0 14px}
.cmp-card{flex:1 1 320px;min-width:300px;background:var(--panel);border:1px solid var(--rule);
  border-top:3px solid var(--accent);border-radius:10px;padding:14px 18px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.cmp-card.revealed{opacity:1;transform:none}
.cmp-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.cmp-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 9px}
.cmp-label{font-family:var(--display);font-size:18px;font-weight:700;color:var(--ink)}
.cmp-item{display:flex;flex-direction:column;gap:2px;margin-bottom:10px}
.cmp-item strong{font-size:14.5px}
.cmp-item span{font-size:13.5px;line-height:1.5;color:var(--muted)}
.cmp-item span strong{color:var(--accent-2)}

.law-col{display:flex;flex-direction:column;gap:12px;margin:14px 0 16px;max-width:980px}
.law-card{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:10px;padding:12px 18px;display:flex;flex-direction:column;gap:6px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.law-card.revealed{opacity:1;transform:none}
.law-head{display:flex;align-items:center;gap:10px}
.law-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 10px}
.law-eq{font-size:17px;overflow-x:auto;padding:2px 0}
.law-note{font-size:13.5px;line-height:1.5;color:var(--muted);margin:0}
.law-note strong{color:var(--accent-2)}

.term-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 26px;margin:6px 0 12px;max-width:920px}
.term-item{display:flex;align-items:baseline;gap:10px}
.term-sym{color:var(--accent);min-width:54px}
.term-def{font-size:13.5px;color:var(--muted);line-height:1.45}

.mini-card{flex:1 1 320px;min-width:300px;background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:12px 16px;display:flex;flex-direction:column;gap:4px}
.mini-card strong{font-size:14.5px;color:var(--accent)}
.mini-card span{font-size:13.5px;line-height:1.5;color:var(--muted)}

.regime-card{flex:1 1 320px;min-width:300px;background:var(--panel);border:1px solid var(--rule);
  border-top:3px solid var(--accent);border-radius:10px;padding:14px 18px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.regime-card.revealed{opacity:1;transform:none}
.regime-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.regime-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 9px;font-variant-numeric:tabular-nums}
.regime-label{font-family:var(--display);font-size:17px;font-weight:700;color:var(--ink)}
.regime-headline{display:block;font-size:15px;margin-bottom:6px}
.regime-body{font-size:13.5px;line-height:1.55;color:var(--muted);margin:0}
.regime-body strong{color:var(--accent-2)}

@media (max-width:720px){
  .outline-list,.term-grid{grid-template-columns:1fr}
  .section-title{font-size:38px}
  .diagram{width:140px}
  .cmp-row,.law-col{flex-direction:column}
}

/* ── Activity badges ─────────────────────────────────────────────────────── */
.activity-badge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.12em;
  text-transform:uppercase;padding:3px 10px;border-radius:3px;margin-bottom:2px}
.activity-badge--poll{background:rgba(94,200,216,.15);color:var(--accent);border:1px solid var(--accent)}
.activity-badge--tps{background:rgba(167,139,250,.15);color:#a78bfa;border:1px solid #a78bfa}

/* ── Poll choices ────────────────────────────────────────────────────────── */
.poll-choices{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}
.poll-choice{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:6px;
  cursor:pointer;text-align:left;font-size:13.5px;transition:background .2s,border-color .2s;
  background:var(--panel);border:1.5px solid var(--rule);color:var(--ink)}
.poll-choice:hover:not(:disabled){border-color:var(--accent);background:rgba(94,200,216,.07)}
.poll-choice-label{flex-shrink:0;width:22px;height:22px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-weight:700;font-size:12px;background:var(--rule);color:var(--muted)}
.poll-choice-text{flex:1;line-height:1.35}
.poll-tick{margin-left:auto;font-size:16px;color:#4ade80}
.poll-choice--selected{border-color:var(--accent);background:rgba(94,200,216,.12)}
.poll-choice--selected .poll-choice-label{background:var(--accent);color:#000}
.poll-choice--correct{border-color:#4ade80;background:rgba(74,222,128,.1);cursor:default}
.poll-choice--correct .poll-choice-label{background:#4ade80;color:#000}
.poll-choice--wrong{border-color:#f87171;background:rgba(248,113,113,.08);opacity:.7;cursor:default}
.poll-choice--dim{opacity:.4;cursor:default}
.poll-reveal-btn{margin-top:4px;padding:7px 20px;border-radius:5px;font-size:12px;font-weight:600;
  letter-spacing:.06em;cursor:pointer;border:1.5px solid var(--accent);
  background:rgba(94,200,216,.1);color:var(--accent);transition:background .2s}
.poll-reveal-btn:hover:not(:disabled){background:rgba(94,200,216,.2)}
.poll-reveal-btn:disabled{opacity:.5;cursor:default}
.poll-explanation{margin-top:10px;padding:10px 14px;border-left:3px solid var(--accent);
  border-radius:0 6px 6px 0;background:rgba(94,200,216,.06);
  font-size:13px;color:var(--muted);line-height:1.5}

/* ── TPS layout ──────────────────────────────────────────────────────────── */
.tps-question{font-size:16px;font-weight:600;color:var(--ink);line-height:1.45;margin:6px 0 2px}
.tps-phases{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px}
.tps-phase{padding:12px 14px;border-radius:8px;border:1.5px solid var(--rule);
  background:var(--panel);display:flex;flex-direction:column;gap:6px;transition:border-color .3s}
.tps-phase--active{border-color:var(--accent);background:rgba(94,200,216,.05)}
.tps-phase--done{opacity:.55}
.tps-phase-hd{display:flex;align-items:center;gap:8px}
.tps-num{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:11px;font-weight:700;color:#000;flex-shrink:0}
.tps-phase-name{font-weight:700;font-size:13px;color:var(--ink)}
.tps-duration{margin-left:auto;font-size:11px;color:var(--muted);font-family:monospace}
.tps-prompt{font-size:12px;color:var(--muted);line-height:1.45;margin:0;flex:1}
.tps-timer{display:flex;flex-direction:column;gap:5px;margin-top:4px}
.tps-time{font-size:26px;font-weight:700;font-family:monospace;line-height:1}
.tps-bar{height:4px;background:var(--rule);border-radius:2px;overflow:hidden}
.tps-bar-fill{height:100%;border-radius:2px;transition:width .9s linear}
.tps-answer{padding:10px 12px;border-radius:6px;background:var(--panel);
  border:1px solid var(--rule)}
.tps-btn{margin-top:auto;padding:6px 14px;border-radius:5px;font-size:11px;font-weight:600;
  letter-spacing:.06em;cursor:pointer;border:1.5px solid var(--accent);
  background:rgba(94,200,216,.1);color:var(--accent);width:100%;transition:background .2s}
.tps-btn:hover{background:rgba(94,200,216,.2)}
.tps-btn--amber{border-color:var(--accent-2);background:rgba(240,169,59,.1);color:var(--accent-2)}
.tps-btn--amber:hover{background:rgba(240,169,59,.2)}
.tps-btn--purple{border-color:#a78bfa;background:rgba(167,139,250,.1);color:#a78bfa}
.tps-btn--purple:hover{background:rgba(167,139,250,.2)}
.tps-btn--sm{padding:4px 10px;font-size:10px;width:auto;align-self:flex-end}
@media (prefers-reduced-motion:reduce){
  .outline-item,.thrust-item,.cmp-card,.law-card,.regime-card{animation:none;transition:none}
  .piston-anim .piston,.piston-anim .gas,.piston-anim .gas-label,.piston-anim .heat-out{animation:none}
  .piston-anim .heat-out{opacity:1}
}

@media (max-width:720px){
  .slide-heading{font-size:26px}
  .em-fig{width:100%}
  .dof-layout,.cpcv-layout{flex-direction:column}
}
/* ── Hook slide ─────────────────────────────────────────────────────────── */
.hook-q-wrap{margin:18px 0 6px}
.hook-q{display:flex;align-items:center;gap:14px;background:var(--panel);
  border:1px solid var(--rule);border-left:3px solid var(--accent-2);
  border-radius:10px;padding:16px 22px}
.hook-q-mark{font-size:32px;color:var(--accent-2);font-weight:700;line-height:1;flex-shrink:0}
.hook-q-text{font-size:20px;font-family:var(--display);color:var(--ink);line-height:1.3}

/* ── Merged from ThermodynamicsPresentation ────────────────────────────── */
.eq-label{font-size:12px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
.eq-terms{display:flex;flex-wrap:wrap;gap:5px 20px;margin-bottom:12px}
.eq-term{font-size:13px}
.sym{color:var(--accent);font-weight:700;font-style:italic}
.def{color:var(--muted)}
.bullet-list{list-style:none;display:flex;flex-direction:column;gap:8px}
.bullet-item{display:flex;gap:12px;align-items:flex-start;
  opacity:0;transform:translateX(-10px);transition:.35s ease}
.bullet-item.revealed{opacity:1;transform:none}
.bullet-marker{color:var(--accent);font-size:9px;margin-top:5px;flex-shrink:0}
.bullet-text{font-size:14px;line-height:1.5}
.bullet-text strong{color:var(--ink);display:block;font-size:15px}
.bullet-sub{color:var(--muted);font-size:13px;margin-top:3px;display:block}
.col-item{font-size:13px;line-height:1.5;color:var(--muted);padding:6px 0;
  border-bottom:1px solid var(--panel);opacity:0;transform:translateY(6px);
  transition:opacity .3s,transform .3s}
.col-item.revealed{opacity:1;transform:none}

/* ── Example slides (wind-tunnel worked examples) ───────────────────────── */
.example-slide .slide-heading{font-size:35px}
.ex-callout{display:inline-block;align-self:flex-start;margin:2px 0 8px;padding:7px 14px;border-radius:999px;
  background:rgba(94,200,216,.12);border:1px solid var(--accent);color:var(--accent);
  font-size:14px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}
.ex-scenario{background:var(--panel);border:1px solid var(--rule);border-left:4px solid var(--accent);
  border-radius:9px;padding:13px 18px;margin-bottom:16px;font-size:17px;color:var(--ink);line-height:1.48}
.ex-scenario-lbl{font-size:12.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:var(--accent);margin-right:8px}
.ex-steps{display:flex;flex-direction:column;gap:12px}
.ex-step{background:var(--bg);border:1px solid var(--rule);border-radius:9px;padding:13px 16px;
  opacity:0;transform:translateY(10px);transition:.32s ease}
.ex-step.revealed{opacity:1;transform:none}
.ex-step-hd{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.ex-step-num{width:27px;height:27px;border-radius:50%;background:var(--panel);
  border:1.7px solid var(--accent);color:var(--accent);font-size:14px;font-weight:800;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ex-step-lbl{font-size:17px;font-weight:700;color:var(--ink)}
.ex-step-lbl sub,.ex-step-lbl sup{font-size:.72em}
.ex-eq{font-size:19px;margin:6px 0 8px;overflow-x:auto}
.ex-result{display:inline-block;background:var(--panel);border:1px solid var(--accent);
  border-radius:7px;padding:6px 18px;font-size:19px;color:var(--ink);margin:5px 0}
.ex-note{font-size:16px;color:var(--muted);line-height:1.45;margin:6px 0}
.ex-note em{color:var(--accent)}
.ex-note strong{color:var(--accent-2)}
.ex-question{display:flex;align-items:flex-start;gap:8px;margin-top:8px;padding:9px 12px;
  background:rgba(240,169,59,.07);border-left:3px solid var(--accent-2);
  border-radius:0 7px 7px 0;font-size:15.5px;color:var(--accent-2);font-style:italic;line-height:1.4}
.ex-q-mark{flex-shrink:0;font-weight:800;font-style:normal;font-size:16px;color:var(--accent-2)}

@media (prefers-reduced-motion:reduce){
  .anim-in,.reveal-block,.em-fig,.dof-band-item,.rel-card{animation:none;transition:none}
  .em-translational .em-body,.em-rotational .em-spin,
  .em-vibrational .em-left,.em-vibrational .em-right,.em-vibrational .em-coil,
  .em-electronic .em-electron{animation:none}
  .em-electronic .em-electron{transform:translate(130px,60px)}
  .dof-curve{transition:none}
  .cp-piston,.cp-gas,.cv-shimmer circle{animation:none}
  .cp-piston{transform:translateY(0)} .cp-gas{transform:scaleY(1)}
}

/* -- Home screen (clickable section-card grid) ---------------------------- */
.home{width:100%;max-width:1100px;margin:0 auto;animation:fadeUp .5s ease both}
.home-head{margin-bottom:26px}
.home-eyebrow{font-family:var(--display);color:var(--accent);font-size:14px;
  letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px}
.home-title{font-family:var(--display);font-size:40px;line-height:1.08;margin:0 0 12px}
.home-sub{color:var(--muted);font-size:15px;margin:0;max-width:680px;line-height:1.5}
.home-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.home-card{display:flex;flex-direction:column;align-items:flex-start;gap:8px;text-align:left;
  cursor:pointer;background:var(--panel);border:1px solid var(--rule);border-top:3px solid var(--accent);
  border-radius:12px;padding:18px 20px;color:var(--ink);font-family:var(--body);
  transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.home-card:hover{transform:translateY(-4px);border-color:var(--accent);box-shadow:0 12px 30px rgba(0,0,0,.35)}
.home-card-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:6px;padding:3px 10px;letter-spacing:.04em}
.home-card-title{font-family:var(--display);font-size:20px;font-weight:700;line-height:1.2}
.home-card-sub{color:var(--muted);font-size:13.5px;line-height:1.5}
.home-card-meta{margin-top:auto;display:flex;align-items:center;justify-content:space-between;
  width:100%;padding-top:10px;font-size:12px;color:var(--muted);
  border-top:1px solid var(--rule);font-variant-numeric:tabular-nums}
.home-card-go{font-weight:700;letter-spacing:.02em}
.home-btn{background:var(--panel);color:var(--accent);border:1px solid var(--rule);border-radius:7px;
  padding:5px 12px;font-size:12px;cursor:pointer;transition:.2s;font-family:var(--body)}
.home-btn:hover{border-color:var(--accent)}
.top-section{color:var(--muted);font-size:13px}
@media (max-width:720px){ .home-title{font-size:30px} .home-grid{grid-template-columns:1fr} }

`
