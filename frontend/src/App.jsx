import { useState, useRef } from "react";

const QUOTES = [
  "The pain you feel today will be the strength you feel tomorrow.",
  "Train insane or remain the same.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Sweat is just fat crying.",
  "Be stronger than your excuses.",
  "Every rep counts. Every set matters. Every session shapes you.",
  "Push yourself because no one else is going to do it for you.",
];

const MUSCLES = [
  { id: "chest",     label: "Chest Day",  icon: "💪" },
  { id: "legs",      label: "Legs Day",   icon: "🦵" },
  { id: "back",      label: "Back Day",   icon: "🏋️" },
  { id: "shoulders", label: "Shoulders",  icon: "🔥" },
  { id: "arms",      label: "Arms Day",   icon: "💥" },
  { id: "biceps",    label: "Biceps",     icon: "🤜" },
  { id: "triceps",   label: "Triceps",    icon: "🤛" },
  { id: "abs",       label: "Abs & Core", icon: "⚡" },
];

async function fetchWorkoutPlan(query) {
  const res = await fetch("https://gym-ai-assistant-xhzj.vercel.app/api/workout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Server error");
  return json.data;
}

export default function App() {
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [selected, setSelected] = useState(null);
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("workouts");
  const resultRef = useRef(null);

  const runQuery = async (query) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await fetchWorkoutPlan(query);
      setResult(data);
      setActiveTab("workouts");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "sans-serif", background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes barLoad { from{width:0} to{width:100%} }
        .hfont { font-family:'Barlow Condensed',sans-serif; }
        .bfont { font-family:'Barlow',sans-serif; }
        .mbtn { background:#111; border:1px solid #222; border-radius:8px; padding:18px 12px; cursor:pointer; transition:all .2s; text-align:center; }
        .mbtn:hover { border-color:#E84040; transform:translateY(-2px); }
        .mbtn.active { border-color:#E84040; background:#1a0505; }
        .tab { background:none; border:none; border-bottom:2px solid transparent; color:#555; cursor:pointer; padding:10px 18px; font-family:'Barlow Condensed',sans-serif; font-size:15px; font-weight:700; letter-spacing:.5px; transition:all .2s; white-space:nowrap; }
        .tab.active { color:#E84040; border-color:#E84040; }
        .tab:hover { color:#ccc; }
        .wcard { background:#111; border:1px solid #1e1e1e; border-left:3px solid #E84040; border-radius:0 8px 8px 0; padding:16px; margin-bottom:10px; animation:fadeUp .35s ease both; }
        .badge { border-radius:4px; padding:3px 9px; font-size:12px; font-weight:700; font-family:'Barlow',sans-serif; display:inline-block; }
        .tip { display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid #1a1a1a; font-family:'Barlow',sans-serif; font-size:14px; color:#ccc; }
        .tip:last-child { border-bottom:none; }
        .mcard { background:#0d0d0d; border:1px solid #1e1e1e; border-radius:8px; padding:14px; }
        .cinput { background:#111; border:1px solid #333; border-radius:6px; padding:12px 16px; color:#fff; font-family:'Barlow',sans-serif; font-size:15px; flex:1; outline:none; transition:border-color .2s; }
        .cinput:focus { border-color:#E84040; }
        .cinput::placeholder { color:#444; }
        .cbtn { background:#E84040; color:#fff; border:none; border-radius:6px; padding:12px 24px; font-family:'Barlow Condensed',sans-serif; font-size:17px; font-weight:700; letter-spacing:1px; cursor:pointer; transition:all .2s; }
        .cbtn:hover { background:#c0392b; }
        .cbtn:disabled { background:#333; cursor:not-allowed; }
        .spinner { width:44px; height:44px; border:3px solid #1a1a1a; border-top-color:#E84040; border-radius:50%; animation:spin .8s linear infinite; }
        .res { animation:fadeUp .4s ease; }
        .mgrid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:480px){ .mgrid{grid-template-columns:1fr} }
        .wbar { height:8px; background:#1e1e1e; border-radius:4px; overflow:hidden; margin-top:10px; }
        .wfill { height:100%; background:linear-gradient(90deg,#1A6B9E,#5FB3E0); border-radius:4px; animation:barLoad 1.5s ease .3s both; }
      `}</style>

      {/* HERO */}
      <div style={{ background:"linear-gradient(135deg,#0a0a0a,#1a0000,#0a0a0a)", padding:"56px 24px 44px", textAlign:"center" }}>
        <div className="hfont" style={{ fontSize:12, letterSpacing:5, color:"#E84040", marginBottom:14 }}>⚡ AI-POWERED GYM ASSISTANT</div>
        <h1 className="hfont" style={{ fontSize:"clamp(44px,10vw,84px)", lineHeight:.92, letterSpacing:2, marginBottom:22 }}>
          FORGE YOUR<br /><span style={{ color:"#E84040" }}>CHAMPION</span><br />BODY
        </h1>
        <div className="bfont" style={{ fontSize:14, color:"#777", maxWidth:460, margin:"0 auto", fontStyle:"italic", lineHeight:1.65, borderLeft:"2px solid #E84040", paddingLeft:14 }}>
          "{quote}"
        </div>
      </div>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"0 20px 60px" }}>

        {/* MUSCLE GRID */}
        <div className="hfont" style={{ fontSize:26, letterSpacing:2, textAlign:"center", margin:"36px 0 20px" }}>CHOOSE YOUR BATTLEFIELD</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:28 }}>
          {MUSCLES.map(g => (
            <button key={g.id} className={`mbtn ${selected===g.id?"active":""}`} onClick={() => { setSelected(g.id); runQuery(`Give me a complete ${g.label} workout plan with 8 exercises`); }} disabled={loading}>
              <div style={{ fontSize:26, marginBottom:6 }}>{g.icon}</div>
              <div className="hfont" style={{ fontSize:15, letterSpacing:1, color:selected===g.id?"#E84040":"#bbb" }}>{g.label}</div>
            </button>
          ))}
        </div>

        {/* CUSTOM QUERY */}
        <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:10, padding:18, marginBottom:28 }}>
          <div className="hfont" style={{ fontSize:15, letterSpacing:1, color:"#666", marginBottom:10 }}>OR ASK SOMETHING CUSTOM</div>
          <div style={{ display:"flex", gap:10 }}>
            <input className="cinput" placeholder="e.g. full body workout for beginners..." value={customQuery} onChange={e => setCustomQuery(e.target.value)} onKeyDown={e => { if(e.key==="Enter" && customQuery.trim()){ setSelected(null); runQuery(customQuery); }}} />
            <button className="cbtn" onClick={() => { if(customQuery.trim()){ setSelected(null); runQuery(customQuery); }}} disabled={loading||!customQuery.trim()}>ASK</button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign:"center", padding:"50px 0" }}>
            <div className="spinner" style={{ margin:"0 auto 18px" }} />
            <div className="hfont" style={{ fontSize:20, letterSpacing:2, color:"#E84040" }}>BUILDING YOUR PLAN...</div>
            <div className="bfont" style={{ color:"#444", fontSize:13, marginTop:6 }}>Your AI trainer is working on it</div>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div style={{ background:"#1a0505", border:"1px solid #E84040", borderRadius:8, padding:"14px 18px", color:"#E84040", fontFamily:"'Barlow',sans-serif", fontSize:14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* RESULTS */}
        {result && !loading && (
          <div ref={resultRef} className="res">
            {/* Header */}
            <div style={{ textAlign:"center", padding:"28px 20px", background:"#0d0d0d", border:"1px solid #1a1a1a", borderRadius:12, marginBottom:24, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#E84040,#ff6b6b,#E84040)" }} />
              <div className="hfont" style={{ fontSize:"clamp(28px,6vw,50px)", letterSpacing:3, color:"#E84040" }}>{result.title}</div>
              <div className="bfont" style={{ color:"#555", fontSize:14, marginTop:4, fontStyle:"italic" }}>{result.tagline}</div>
              {result.motivational_message && (
                <div style={{ marginTop:14, background:"#1a0505", borderRadius:6, padding:"8px 18px", display:"inline-block" }}>
                  <span className="bfont" style={{ color:"#E84040", fontSize:13 }}>"{result.motivational_message}"</span>
                </div>
              )}
            </div>

            {/* TABS */}
            <div style={{ display:"flex", borderBottom:"1px solid #1e1e1e", marginBottom:22, overflowX:"auto" }}>
              {[["workouts","🏋️ WORKOUTS"],["meal","🥗 MEAL PLAN"],["water","💧 HYDRATION"],["do","✅ DO'S"],["dont","❌ DON'TS"]].map(([t,l]) => (
                <button key={t} className={`tab ${activeTab===t?"active":""}`} onClick={() => setActiveTab(t)}>{l}</button>
              ))}
            </div>

            {/* WORKOUTS */}
            {activeTab==="workouts" && (
              <div>
                <div className="bfont" style={{ color:"#444", fontSize:12, marginBottom:14, letterSpacing:1 }}>{result.workouts?.length} EXERCISES · COMPLETE ALL SETS</div>
                {result.workouts?.map((w,i) => (
                  <div key={i} className="wcard" style={{ animationDelay:`${i*.05}s` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                          <span style={{ background:"#E84040", color:"#fff", borderRadius:4, width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12, flexShrink:0, fontFamily:"'Barlow',sans-serif" }}>{i+1}</span>
                          <span className="hfont" style={{ fontSize:19, letterSpacing:.5 }}>{w.name}</span>
                        </div>
                        {w.tip && <div className="bfont" style={{ color:"#555", fontSize:13, fontStyle:"italic", paddingLeft:32 }}>💡 {w.tip}</div>}
                      </div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", flexShrink:0 }}>
                        <span className="badge" style={{ background:"#1a0505", border:"1px solid #E84040", color:"#E84040" }}>{w.sets} SETS</span>
                        <span className="badge" style={{ background:"#0a1a0a", border:"1px solid #2E7D52", color:"#4CAF50" }}>{w.reps} REPS</span>
                        <span className="badge" style={{ background:"#0a0a1a", border:"1px solid #1A6B9E", color:"#5FB3E0" }}>⏱ {w.rest}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MEAL */}
            {activeTab==="meal" && result.meal_plan && (
              <div className="mgrid">
                {[["pre_workout","PRE-WORKOUT","⚡"],["post_workout","POST-WORKOUT","🔄"],["breakfast","BREAKFAST","🌅"],["lunch","LUNCH","☀️"],["dinner","DINNER","🌙"],["snacks","SNACKS","🥜"]].map(([k,l,ic]) => (
                  <div key={k} className="mcard">
                    <div className="hfont" style={{ fontSize:12, letterSpacing:1, color:"#E84040", marginBottom:6 }}>{ic} {l}</div>
                    <div className="bfont" style={{ fontSize:14, color:"#aaa", lineHeight:1.55 }}>{result.meal_plan[k]}</div>
                  </div>
                ))}
              </div>
            )}

            {/* WATER */}
            {activeTab==="water" && result.water_intake && (
              <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:10, padding:24, textAlign:"center" }}>
                <div className="hfont" style={{ fontSize:72, color:"#5FB3E0", lineHeight:1 }}>{result.water_intake.daily_liters}L</div>
                <div className="bfont" style={{ color:"#555", fontSize:13, marginTop:4 }}>RECOMMENDED DAILY WATER INTAKE</div>
                <div className="wbar" style={{ maxWidth:360, margin:"18px auto 0" }}>
                  <div className="wfill" style={{ width:`${Math.min((result.water_intake.daily_liters/5)*100,100)}%` }} />
                </div>
                <div className="bfont" style={{ color:"#777", fontSize:14, maxWidth:480, margin:"20px auto 0", lineHeight:1.6 }}>{result.water_intake.note}</div>
              </div>
            )}

            {/* DO'S */}
            {activeTab==="do" && (
              <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:10, padding:20 }}>
                <div className="hfont" style={{ fontSize:20, color:"#4CAF50", marginBottom:14, letterSpacing:1 }}>✅ THINGS YOU SHOULD DO</div>
                {result.should_do?.map((item,i) => (
                  <div key={i} className="tip"><span style={{ color:"#4CAF50", fontSize:16, flexShrink:0 }}>→</span><span>{item}</span></div>
                ))}
              </div>
            )}

            {/* DON'TS */}
            {activeTab==="dont" && (
              <div style={{ background:"#111", border:"1px solid #1e1e1e", borderRadius:10, padding:20 }}>
                <div className="hfont" style={{ fontSize:20, color:"#E84040", marginBottom:14, letterSpacing:1 }}>❌ THINGS TO AVOID</div>
                {result.should_not_do?.map((item,i) => (
                  <div key={i} className="tip"><span style={{ color:"#E84040", fontSize:16, flexShrink:0 }}>✗</span><span>{item}</span></div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:"1px solid #111", padding:"20px", textAlign:"center" }}>
        <div className="hfont" style={{ fontSize:20, letterSpacing:3, color:"#1a1a1a" }}>IRON MIND GYM AI</div>
        <div className="bfont" style={{ color:"#222", fontSize:11, marginTop:4 }}>Powered by Claude AI · Built for Champions</div>
      </div>
    </div>
  );
}
