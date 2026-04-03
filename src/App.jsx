import { useState, useEffect, useRef, useCallback } from "react";

const SETS = [
  [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39,41,43,45,47,49,51,53,55,57,59,61,63,65,67,69,71,73,75,77,79,81,83,85,87,89,91,93,95,97,99],
  [2,3,6,7,10,11,14,15,18,19,22,23,26,27,30,31,34,35,38,39,42,43,46,47,50,51,54,55,58,59,62,63,66,67,70,71,74,75,78,79,82,83,86,87,90,91,94,95,98,99],
  [4,5,6,7,12,13,14,15,20,21,22,23,28,29,30,31,36,37,38,39,44,45,46,47,52,53,54,55,60,61,62,63,68,69,70,71,76,77,78,79,84,85,86,87,92,93,94,95,100],
  [8,9,10,11,12,13,14,15,24,25,26,27,28,29,30,31,40,41,42,43,44,45,46,47,56,57,58,59,60,61,62,63,72,73,74,75,76,77,78,79,88,89,90,91,92,93,94,95],
  [16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95],
  [32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,96,97,98,99,100],
  [64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100]
];
const BITS = [1,2,4,8,16,32,64];

function StarField() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.25 + 0.04,
      opacity: Math.random() * 0.7 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    const nebulas = [
      { x: W*0.2, y: H*0.2, r: 250, hue: 270 },
      { x: W*0.8, y: H*0.6, r: 200, hue: 200 },
      { x: W*0.5, y: H*0.9, r: 180, hue: 300 },
      { x: W*0.1, y: H*0.75, r: 150, hue: 240 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(W*0.5, H*0.4, 0, W*0.5, H*0.4, W);
      bg.addColorStop(0, "#130d1f"); bg.addColorStop(0.5, "#0b0814"); bg.addColorStop(1, "#050308");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      nebulas.forEach(n => {
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        g.addColorStop(0, `hsla(${n.hue},65%,45%,0.07)`);
        g.addColorStop(0.5, `hsla(${n.hue},60%,35%,0.03)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2); ctx.fill();
      });

      stars.forEach(s => {
        s.twinkle += s.twinkleSpeed; s.y -= s.speed;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
        const a = s.opacity * (0.55 + 0.45 * Math.sin(s.twinkle));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(215,205,255,${a})`; ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafRef.current); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
}

function OracleEye({ size = 90 }) {
  return (
    <div style={{ position:"relative", width:size, height:size, margin:"0 auto" }}>
      <div style={{
        position:"absolute", inset:0, borderRadius:"50%",
        border:"1.5px solid rgba(201,162,39,0.4)",
        animation:"rotate360 8s linear infinite"
      }} />
      <div style={{
        position:"absolute", inset:8, borderRadius:"50%",
        border:"1px dashed rgba(201,162,39,0.2)",
        animation:"counterRotate 12s linear infinite"
      }} />
      <svg viewBox="0 0 90 90" width={size} height={size} style={{ position:"absolute", inset:0, filter:"drop-shadow(0 0 10px rgba(201,162,39,0.6))", animation:"eyeGlow 2.5s ease-in-out infinite" }}>
        <defs>
          <radialGradient id="irisG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c9a227"/>
            <stop offset="45%" stopColor="#7b3fc8"/>
            <stop offset="100%" stopColor="#140a28"/>
          </radialGradient>
          <radialGradient id="highlightG" cx="60%" cy="35%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
        </defs>
        <path d="M15,45 Q45,19 75,45 Q45,71 15,45Z" fill="#100820" stroke="rgba(201,162,39,0.45)" strokeWidth="1"/>
        <circle cx="45" cy="45" r="14" fill="url(#irisG)"/>
        <circle cx="45" cy="45" r="5.5" fill="#060410"/>
        <circle cx="45" cy="45" r="5" fill="url(#highlightG)" opacity="0.5"/>
        <circle cx="49.5" cy="41" r="2.5" fill="rgba(255,255,255,0.75)"/>
      </svg>
    </div>
  );
}

const SPARKLES = [
  {top:"8%",left:"8%",d:"0s"},{top:"15%",right:"6%",d:"0.5s"},
  {bottom:"12%",left:"10%",d:"1s"},{bottom:"8%",right:"8%",d:"0.3s"},
  {top:"45%",left:"4%",d:"0.8s"},{top:"45%",right:"4%",d:"1.2s"},
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes rotate360{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes counterRotate{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
@keyframes eyeGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(201,162,39,0.6))}50%{filter:drop-shadow(0 0 18px rgba(201,162,39,1)) drop-shadow(0 0 36px rgba(201,162,39,0.35))}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
@keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes cardFlip{from{opacity:0;transform:perspective(800px) rotateY(-10deg) scale(0.95)}to{opacity:1;transform:perspective(800px) rotateY(0deg) scale(1)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes goldShimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes borderFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes numPop{0%{transform:scale(0);opacity:0}70%{transform:scale(1.2);opacity:1}100%{transform:scale(1);opacity:1}}
@keyframes goldPulse{0%,100%{text-shadow:0 0 20px rgba(201,162,39,0.5),0 0 60px rgba(201,162,39,0.2)}50%{text-shadow:0 0 40px rgba(201,162,39,1),0 0 100px rgba(201,162,39,0.5),0 0 160px rgba(201,162,39,0.2)}}
@keyframes ringExpand{0%{transform:scale(0.5);opacity:0.7}100%{transform:scale(2.8);opacity:0}}
@keyframes sparkle{0%,100%{opacity:0;transform:scale(0) rotate(0deg)}50%{opacity:1;transform:scale(1) rotate(180deg)}}
@keyframes thinkDot{0%,80%,100%{transform:translateY(0);opacity:0.25}40%{transform:translateY(-12px);opacity:1}}
@keyframes runeFade{from{opacity:0.03}to{opacity:0.12}}
@keyframes orbFloat0{from{transform:translate(0,0) scale(1)}to{transform:translate(50px,70px) scale(1.12)}}
@keyframes orbFloat1{from{transform:translate(0,0)}to{transform:translate(-60px,40px)}}
@keyframes orbFloat2{from{transform:translate(0,0)}to{transform:translate(40px,-50px) scale(1.08)}}
@keyframes orbFloat3{from{transform:translate(0,0)}to{transform:translate(-35px,-55px)}}

.root{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem 1rem;position:relative;font-family:'Raleway',sans-serif;color:#e8dfc8;z-index:1;}

.orb{position:fixed;border-radius:50%;filter:blur(70px);pointer-events:none;z-index:0;}

.rune{position:fixed;font-family:'Cinzel',serif;color:#c9a227;pointer-events:none;z-index:0;animation:runeFade 4s ease-in-out infinite alternate;}

.card{background:rgba(16,10,26,0.9);border-radius:22px;padding:2.5rem 2rem;max-width:560px;width:100%;position:relative;z-index:2;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(100,65,180,0.25);box-shadow:0 40px 80px rgba(0,0,0,0.65),0 0 0 1px rgba(201,162,39,0.04) inset;}
.card::before{content:'';position:absolute;inset:-1px;border-radius:23px;padding:1px;background:linear-gradient(135deg,rgba(201,162,39,0.45),rgba(110,55,210,0.2),rgba(60,40,160,0.3),rgba(201,162,39,0.15));background-size:400% 400%;animation:borderFlow 7s ease infinite;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}

.anim-scale{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;}
.anim-flip{animation:cardFlip 0.45s cubic-bezier(0.22,1,0.36,1) forwards;}
.anim-reveal{animation:scaleIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards;}

.eyebrow{font-family:'Cinzel',serif;font-size:10px;letter-spacing:5px;color:#c9a227;text-transform:uppercase;text-align:center;margin-bottom:0.35rem;opacity:0.75;}
.title{font-family:'Cinzel',serif;font-size:2.2rem;font-weight:700;text-align:center;background:linear-gradient(135deg,#f5e8c0 0%,#c9a227 40%,#f5e8c0 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite;line-height:1.2;}
.divider{width:80px;height:1px;background:linear-gradient(to right,transparent,#c9a227,transparent);margin:1rem auto;position:relative;}
.divider::after{content:'✦';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:10px;color:#c9a227;background:rgba(16,10,26,0.9);padding:0 5px;}
.subtitle{text-align:center;color:#5e5478;font-size:14px;font-weight:300;line-height:1.75;margin-bottom:1.8rem;}

.inp{width:100%;background:rgba(12,8,20,0.8);border:1px solid rgba(100,70,180,0.3);border-radius:12px;padding:0.9rem 1.2rem;color:#e8dfc8;font-family:'Raleway',sans-serif;font-size:16px;outline:none;transition:border-color 0.25s,box-shadow 0.25s;margin-bottom:1.25rem;caret-color:#c9a227;}
.inp:focus{border-color:rgba(201,162,39,0.6);box-shadow:0 0 0 3px rgba(201,162,39,0.08),0 0 20px rgba(201,162,39,0.08);}
.inp::placeholder{color:#3a3050;}

.btn-start{width:100%;background:linear-gradient(135deg,#b8911e,#d4ab28,#c9a227,#e0b830);background-size:300% 300%;border:none;border-radius:12px;padding:1rem;color:#0a0810;font-family:'Cinzel',serif;font-size:14px;font-weight:700;letter-spacing:3px;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;position:relative;overflow:hidden;animation:goldShimmer 4s ease infinite;}
.btn-start::after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,rgba(255,255,255,0.18),transparent);border-radius:12px;}
.btn-start:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(201,162,39,0.4);}
.btn-start:active{transform:translateY(0);}

.progress{display:flex;gap:6px;justify-content:center;margin-bottom:1.5rem;}
.pip{height:4px;flex:1;border-radius:2px;background:#191330;transition:background 0.4s,box-shadow 0.4s;}
.pip.done{background:#c9a227;}
.pip.active{background:#9b72d8;box-shadow:0 0 10px rgba(155,114,216,0.9);}

.step-label{text-align:center;font-size:11px;color:#3e3560;margin-bottom:1rem;letter-spacing:3px;font-family:'Cinzel',serif;}
.question{font-family:'Cinzel',serif;font-size:15px;color:#c9a227;text-align:center;margin-bottom:1rem;letter-spacing:0.5px;animation:slideUp 0.4s ease forwards;}

.grid{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;margin-bottom:1.4rem;padding:0.85rem;background:rgba(8,5,16,0.75);border-radius:14px;border:1px solid rgba(50,35,80,0.6);position:relative;overflow:hidden;}
.grid::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(120,80,200,0.07) 0%,transparent 70%);pointer-events:none;}
.num{aspect-ratio:1;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:500;border-radius:5px;background:#181230;color:#8070a8;transition:all 0.18s;cursor:default;}
.num:hover{background:#2e1f52;color:#c9a227;transform:scale(1.15);z-index:1;box-shadow:0 0 8px rgba(201,162,39,0.25);}

.btn-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.btn-yes{background:rgba(201,162,39,0.07);border:1.5px solid rgba(201,162,39,0.45);border-radius:12px;padding:1rem;color:#c9a227;font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;cursor:pointer;transition:all 0.2s;}
.btn-yes:hover{background:rgba(201,162,39,0.14);border-color:#c9a227;box-shadow:0 0 24px rgba(201,162,39,0.2),inset 0 0 16px rgba(201,162,39,0.04);transform:translateY(-2px);}
.btn-yes:active{transform:translateY(0);}
.btn-no{background:rgba(255,255,255,0.02);border:1.5px solid rgba(70,50,110,0.45);border-radius:12px;padding:1rem;color:#5e5280;font-family:'Cinzel',serif;font-size:14px;letter-spacing:3px;cursor:pointer;transition:all 0.2s;}
.btn-no:hover{background:rgba(255,255,255,0.04);color:#b0a0d0;border-color:rgba(130,100,200,0.5);transform:translateY(-2px);}
.btn-no:active{transform:translateY(0);}

.big-number{font-family:'Cinzel',serif;font-size:6rem;font-weight:700;text-align:center;color:#c9a227;line-height:1;animation:numPop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards,goldPulse 2.5s ease-in-out infinite 0.7s;position:relative;}
.ring{position:absolute;border-radius:50%;border:1.5px solid rgba(201,162,39,0.45);animation:ringExpand 2.4s ease-out infinite;}
.sparkle-dot{position:absolute;width:7px;height:7px;border-radius:50%;background:#c9a227;animation:sparkle 2.2s ease-in-out infinite;}
.name-badge{display:inline-block;background:linear-gradient(135deg,rgba(201,162,39,0.1),rgba(201,162,39,0.04));border:1px solid rgba(201,162,39,0.28);border-radius:20px;padding:4px 16px;font-size:13px;color:#c9a227;letter-spacing:1px;}
.btn-again{display:block;width:100%;margin-top:1.5rem;background:transparent;border:1px solid rgba(70,50,110,0.4);border-radius:12px;padding:0.8rem;color:#5e5280;font-family:'Raleway',sans-serif;font-size:14px;cursor:pointer;transition:all 0.2s;letter-spacing:1px;}
.btn-again:hover{border-color:rgba(130,100,200,0.45);color:#b0a0d0;background:rgba(130,100,200,0.05);}
.thinking-dots span{display:inline-block;animation:thinkDot 1.4s ease-in-out infinite;color:#c9a227;font-size:2.2rem;}
.thinking-dots span:nth-child(2){animation-delay:0.22s;}
.thinking-dots span:nth-child(3){animation-delay:0.44s;}
`;

const ORBS = [
  { size:480, x:"-8%", y:"-12%", color:"rgba(110,50,210,0.08)", dur:"18s", i:0 },
  { size:380, x:"68%", y:"58%", color:"rgba(200,140,25,0.06)", dur:"23s", i:1 },
  { size:320, x:"38%", y:"-8%", color:"rgba(70,35,180,0.06)", dur:"16s", i:2 },
  { size:300, x:"-4%", y:"52%", color:"rgba(180,55,230,0.05)", dur:"26s", i:3 },
];
const RUNES = ["✦","◈","⬡","✧","⊕","◉","✦","◈","⊛","◇"];

export default function MindReader() {
  const [phase, setPhase] = useState("welcome");
  const [name, setName] = useState("");
  const [step, setStep] = useState(0);
  const [flags, setFlags] = useState(Array(7).fill(0));
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [key, setKey] = useState(0);

  const start = () => {
    if (!name.trim()) return;
    setPhase("playing"); setStep(0); setFlags(Array(7).fill(0)); setKey(k=>k+1);
  };

  const answer = useCallback((yes) => {
    const nf = [...flags];
    if (yes) nf[step] = BITS[step];
    setFlags(nf);
    if (step < 6) { setKey(k=>k+1); setStep(step+1); }
    else {
      setThinking(true);
      setTimeout(() => {
        setResult(nf.reduce((a,b)=>a+b,0));
        setThinking(false);
        setPhase("reveal");
      }, 1800);
    }
  }, [flags, step]);

  const reset = () => { setPhase("welcome"); setName(""); setStep(0); setFlags(Array(7).fill(0)); setResult(null); };

  return (
    <>
      <style>{CSS}</style>
      <StarField />

      {ORBS.map(o => (
        <div key={o.i} className="orb" style={{
          width:o.size, height:o.size, left:o.x, top:o.y,
          background:o.color,
          animation:`orbFloat${o.i} ${o.dur} ease-in-out infinite alternate`,
        }} />
      ))}

      {RUNES.map((r, i) => (
        <div key={i} className="rune" style={{
          left:`${(i*9.8+4)%93}%`, top:`${(i*12.1+6)%88}%`,
          fontSize:14+(i%3)*10, opacity:0.05,
          animationDuration:`${4+i*0.6}s`, animationDelay:`${i*0.35}s`,
        }}>{r}</div>
      ))}

      <div className="root">
        {phase === "welcome" && (
          <div className="card anim-scale">
            <div className="eyebrow">The Oracle</div>
            <h1 className="title">Mind Reader</h1>
            <div className="divider" />
            <div style={{margin:"1.5rem auto 1.8rem"}}><OracleEye size={90} /></div>
            <p className="subtitle">Think of any number between 1 and 100.<br/>Answer truthfully — the oracle sees all.</p>
            <input className="inp" placeholder="Your name, seeker…" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&start()} autoFocus />
            <button className="btn-start" onClick={start}>BEGIN THE RITUAL</button>
          </div>
        )}

        {phase === "playing" && !thinking && (
          <div className="card anim-flip" key={key}>
            <div className="progress">
              {SETS.map((_,i) => <div key={i} className={`pip${i<step?" done":i===step?" active":""}`} />)}
            </div>
            <div className="step-label">QUESTION {step+1} OF 7</div>
            <div className="question">Is your number among these?</div>
            <div className="grid">
              {SETS[step].map(n => <div key={n} className="num">{n}</div>)}
            </div>
            <div className="btn-row">
              <button className="btn-yes" onClick={()=>answer(true)}>✦ YES</button>
              <button className="btn-no" onClick={()=>answer(false)}>✦ NO</button>
            </div>
          </div>
        )}

        {thinking && (
          <div className="card" style={{textAlign:"center"}}>
            <OracleEye size={90} />
            <p style={{fontFamily:"'Cinzel',serif",color:"#c9a227",fontSize:11,letterSpacing:4,margin:"1.2rem 0 1rem"}}>
              THE ORACLE CALCULATES
            </p>
            <div className="thinking-dots"><span>•</span><span>•</span><span>•</span></div>
          </div>
        )}

        {phase === "reveal" && !thinking && (
          <div className="card anim-reveal" style={{textAlign:"center"}}>
            {SPARKLES.map((s,i) => <div key={i} className="sparkle-dot" style={{...s,animationDelay:s.d}} />)}
            <div className="eyebrow">The Oracle Speaks</div>
            <h1 className="title" style={{fontSize:"1.5rem"}}>Your Number Is</h1>
            <div className="divider" />
            <div style={{position:"relative",padding:"2rem 0 1.5rem"}}>
              <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}>
                {[60,90,120].map((sz,i)=>(
                  <div key={i} className="ring" style={{width:sz,height:sz,marginLeft:-sz/2,marginTop:-sz/2,animationDelay:`${i*0.65}s`}} />
                ))}
              </div>
              <div className="big-number">{result}</div>
            </div>
            <p style={{color:"#4a4070",fontSize:11,letterSpacing:3,fontFamily:"'Cinzel',serif",marginBottom:"0.6rem"}}>REVEALED FOR</p>
            <div style={{marginBottom:"1.2rem"}}><span className="name-badge">{name}</span></div>
            <p style={{color:"#3e3860",fontSize:13,fontWeight:300,lineHeight:1.75}}>
              The universe holds no secrets from<br/>those who know how to ask.
            </p>
            <button className="btn-again" onClick={reset}>↺ &nbsp; Consult the oracle again</button>
          </div>
        )}
      </div>
    </>
  );
}
