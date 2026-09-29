import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const factors={sedentary:1.2,lightly_active:1.375,moderately_active:1.55,very_active:1.725};
function makePlan(p){
  const bmr=Math.round(10*+p.weight+6.25*+p.height-5*+p.age+(p.sex==="male"?5:-161));
  const tdee=Math.round(bmr*factors[p.activity]);
  const calories=p.goal==="fat_loss"?Math.max(1400,tdee-350):p.goal==="muscle_gain"?tdee+250:tdee;
  const protein=Math.round(+p.weight*(p.goal==="muscle_gain"?1.8:1.6));
  const mealNames=p.diet==="veg"?["Oats + yogurt + banana","Lentil rice bowl","Greek yogurt + fruit","Paneer/tofu wrap"]:["Eggs + toast + fruit","Chicken rice bowl","Yogurt + fruit","Chicken/egg wrap"];
  const splits=p.days>=5?["Upper body","Lower body","Push","Pull","Legs"]:p.days===4?["Upper body","Lower body","Upper body","Lower body"]:["Full body","Full body","Full body"];
  const exercises={bodyweight:["Squats","Push-ups","Lunges","Glute bridges","Plank"],home_dumbbells:["Goblet squats","Dumbbell press","Dumbbell rows","Romanian deadlifts","Shoulder press"],full_gym:["Squat","Bench press","Lat pulldown","Romanian deadlift","Cable row"]}[p.equipment];
  return {bmr,tdee,calories,protein,mealNames,splits,exercises};
}
export default function Dashboard({profile,onReset}){
 const [tab,setTab]=useState("overview"); const nav=useNavigate(); const [logged,setLogged]=useState([]);
 const plan=useMemo(()=>makePlan(profile),[profile]);
 const goal={fat_loss:"Fat loss",muscle_gain:"Muscle gain",maintenance:"Maintenance",general_fitness:"General fitness"}[profile.goal];
 const activity={sedentary:"Mostly sitting",lightly_active:"Lightly active",moderately_active:"Moderately active",very_active:"Very active"}[profile.activity];
 function logout(){onReset();nav("/setup")}
 return <div className="dash">
   <header className="topbar"><div className="brand"><span className="brand-mark">✦</span><b>FitPlan AI</b></div><div className="top-actions"><button className="link-btn" onClick={()=>nav("/setup")}>Edit profile</button><button className="avatar">{profile.name?.[0]?.toUpperCase()||"U"}</button></div></header>
   <div className="dash-body">
    <aside className="side">
      <div className="welcome"><span>Good day,</span><b>{profile.name}</b><small>{goal}</small></div>
      <nav>{[["overview","⌂","Overview"],["workout","◈","Workout"],["meals","◷","Meals"],["progress","↗","Progress"]].map(([id,ic,t])=><button key={id} className={tab===id?"nav-btn active":"nav-btn"} onClick={()=>setTab(id)}><span>{ic}</span>{t}</button>)}</nav>
      <button className="reset" onClick={logout}>Start over</button>
    </aside>
    <main className="content">
      {tab==="overview"&&<Overview profile={profile} plan={plan} goal={goal} activity={activity} setTab={setTab}/>}
      {tab==="workout"&&<Workout plan={plan} profile={profile}/>}
      {tab==="meals"&&<Meals plan={plan} profile={profile}/>}
      {tab==="progress"&&<Progress profile={profile} logged={logged} setLogged={setLogged}/>}
    </main>
   </div>
 </div>
}
function Overview({profile,plan,goal,activity,setTab}){
 return <><div className="hero"><div><span className="pill">AI PLAN READY</span><h1>Your plan, built around <em>you.</em></h1><p>{goal} • {activity} • {profile.days} training days/week</p></div><div className="hero-orb">✦</div></div>
 <div className="metrics">{[["🔥","Daily calories",plan.calories+" kcal"],["🥩","Protein target",plan.protein+" g"],["⚡","TDEE",plan.tdee+" kcal"],["🎯","Training days",profile.days+" / week"]].map(x=><div className="metric" key={x[1]}><span>{x[0]}</span><small>{x[1]}</small><b>{x[2]}</b></div>)}</div>
 <section><div className="section-head"><div><h2>Today's focus</h2><p>A simple start you can actually stick to.</p></div></div>
 <div className="today-grid"><Card title="Workout" icon="💪" main={plan.splits[0]} sub="35–50 min • 3 sets each" onClick={()=>setTab("workout")}/><Card title="First meal" icon="🍳" main={plan.mealNames[0]} sub={`${Math.round(plan.calories*.28)} kcal target`} onClick={()=>setTab("meals")}/><Card title="Quick win" icon="💧" main="Stay hydrated" sub="Keep water nearby today"/></div></section>
 <section><div className="section-head"><div><h2>How FitPlan thinks</h2><p>Your targets are estimated from the information you entered.</p></div></div><div className="info-card"><div><b>Estimated BMR</b><strong>{plan.bmr} kcal</strong><small>Energy your body uses at rest</small></div><div className="line"></div><div><b>Estimated TDEE</b><strong>{plan.tdee} kcal</strong><small>Daily energy with your activity</small></div><div className="line"></div><div><b>Plan target</b><strong>{plan.calories} kcal</strong><small>Adjusted for your goal</small></div></div></section>
 </>}
function Card({title,icon,main,sub,onClick}){return <button className="today-card" onClick={onClick}><span className="card-icon">{icon}</span><small>{title}</small><b>{main}</b><span>{sub}</span><i>→</i></button>}
function Workout({plan,profile}){return <><PageTitle title="Your workout plan" text={`${profile.days} days • ${profile.equipment==="full_gym"?"Full gym":profile.equipment==="home_dumbbells"?"Home dumbbells":"Bodyweight"}`}/><div className="workout-list">{plan.splits.map((s,i)=><div className="workout-row" key={i}><div className="day-no">0{i+1}</div><div><small>DAY {i+1}</small><h3>{s}</h3><p>{plan.exercises.join(" • ")}</p></div><span className="duration">40 min</span></div>)}</div><div className="tip">💡 <b>Progressive overload:</b> when all sets feel comfortable, add a few reps or a small amount of weight next time.</div></>}
function Meals({plan,profile}){return <><PageTitle title="Your 7-day meal guide" text={`${profile.diet==="veg"?"Vegetarian":"Flexible"} • around ${plan.calories} kcal/day • ${plan.protein}g protein`}/><div className="meal-grid">{Array.from({length:7},(_,i)=><div className="meal-day" key={i}><div className="meal-day-head"><b>Day {i+1}</b><span>{plan.calories} kcal</span></div>{plan.mealNames.map((m,j)=><div className="meal" key={j}><span>{["☀️","🥗","🍎","🌙"][j]}</span><div><small>{["Breakfast","Lunch","Snack","Dinner"][j]}</small><b>{m}</b></div></div>)}</div>)}</div></>}
function Progress({profile,logged,setLogged}){const[w,setW]=useState("");return <><PageTitle title="Progress" text="Keep it simple: log your weight when it is useful to you."/><div className="progress-card"><div><span>Starting weight</span><b>{profile.weight} kg</b></div><div><span>Latest log</span><b>{logged.at(-1)?.weight||"—"} {logged.length?"kg":""}</b></div><form onSubmit={e=>{e.preventDefault();if(w){setLogged([...logged,{weight:+w,date:new Date().toLocaleDateString()}]);setW("")}}}><input type="number" step=".1" placeholder="Weight (kg)" value={w} onChange={e=>setW(e.target.value)}/><button className="btn primary">Log</button></form></div>{logged.length>0&&<div className="log-list">{logged.map((x,i)=><div key={i}><span>{x.date}</span><b>{x.weight} kg</b></div>)}</div>}<div className="tip">📌 Weight naturally changes from day to day. Look for longer-term trends rather than a single number.</div></>}
function PageTitle({title,text}){return <div className="page-title"><span className="pill">PERSONALIZED</span><h1>{title}</h1><p>{text}</p></div>}