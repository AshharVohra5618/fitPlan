import { useState } from "react";
import { useNavigate } from "react-router-dom";

const defaults = {
  name:"", age:"", height:"", weight:"", sex:"male",
  goal:"fat_loss", activity:"moderately_active", experience:"beginner",
  days:4, equipment:"home_dumbbells", diet:"non_veg",
  allergies:"", cuisine:"", budget:""
};

const steps = [
  ["Basics","A few basics so your plan feels personal."],
  ["Goal","Tell us what you want to work toward."],
  ["Training","We'll match the plan to your routine."],
  ["Food","Your meals should fit your preferences."],
];

export default function Onboarding({ onComplete, initial }) {
  const [p,setP] = useState({...defaults,...(initial||{})});
  const [step,setStep] = useState(0);
  const nav=useNavigate();
  const set=(k,v)=>setP(x=>({...x,[k]:v}));
  const valid = step===0 ? p.name&&p.age&&p.height&&p.weight : true;

  function next(e){
    e?.preventDefault();
    if(step<steps.length-1) setStep(step+1);
    else { onComplete(p); nav("/"); }
  }

  return <div className="setup-page">
    <div className="setup-shell">
      <div className="brand"><span className="brand-mark">✦</span><b>FitPlan AI</b><span className="brand-tag">Your personal fitness planner</span></div>
      <div className="progress">{steps.map((s,i)=><div key={s[0]} className={i<=step?"progress-item active":"progress-item"}><span>{i+1}</span><label>{s[0]}</label></div>)}</div>
      <form className="setup-card" onSubmit={next}>
        <div className="eyebrow">STEP {step+1} OF {steps.length}</div>
        <h1>{steps[step][0]}</h1><p className="lead">{steps[step][1]}</p>

        {step===0 && <div className="form-grid">
          <Field label="Your name"><input value={p.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Ahmed" required/></Field>
          <Field label="Age"><input type="number" min="13" max="100" value={p.age} onChange={e=>set("age",e.target.value)} placeholder="25" required/></Field>
          <Field label="Height (cm)"><input type="number" min="100" max="230" value={p.height} onChange={e=>set("height",e.target.value)} placeholder="175" required/></Field>
          <Field label="Weight (kg)"><input type="number" min="30" max="250" value={p.weight} onChange={e=>set("weight",e.target.value)} placeholder="70" required/></Field>
          <Field label="Sex"><Select value={p.sex} onChange={e=>set("sex",e.target.value)} opts={[["male","Male"],["female","Female"]]}/></Field>
        </div>}

        {step===1 && <div className="choice-grid">
          <Choice icon="🔥" title="Lose fat" text="A sustainable calorie deficit" active={p.goal==="fat_loss"} onClick={()=>set("goal","fat_loss")}/>
          <Choice icon="💪" title="Build muscle" text="Strength and muscle growth" active={p.goal==="muscle_gain"} onClick={()=>set("goal","muscle_gain")}/>
          <Choice icon="⚖️" title="Maintain" text="Stay around your current weight" active={p.goal==="maintenance"} onClick={()=>set("goal","maintenance")}/>
          <Choice icon="🏃" title="Get fitter" text="Improve fitness and consistency" active={p.goal==="general_fitness"} onClick={()=>set("goal","general_fitness")}/>
        </div>}

        {step===2 && <div className="form-grid">
          <Field label="Activity level"><Select value={p.activity} onChange={e=>set("activity",e.target.value)} opts={[["sedentary","Mostly sitting"],["lightly_active","Lightly active"],["moderately_active","Moderately active"],["very_active","Very active"]]}/></Field>
          <Field label="Experience"><Select value={p.experience} onChange={e=>set("experience",e.target.value)} opts={[["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]]}/></Field>
          <Field label="Training days / week"><Select value={p.days} onChange={e=>set("days",+e.target.value)} opts={[[3,"3 days"],[4,"4 days"],[5,"5 days"],[6,"6 days"]]}/></Field>
          <Field label="Equipment"><Select value={p.equipment} onChange={e=>set("equipment",e.target.value)} opts={[["bodyweight","Bodyweight"],["home_dumbbells","Dumbbells at home"],["full_gym","Full gym"]]}/></Field>
        </div>}

        {step===3 && <div className="form-grid">
          <Field label="Diet"><Select value={p.diet} onChange={e=>set("diet",e.target.value)} opts={[["non_veg","No restriction"],["veg","Vegetarian"]]}/></Field>
          <Field label="Food budget (optional)"><input value={p.budget} onChange={e=>set("budget",e.target.value)} placeholder="e.g. 1500 / week"/></Field>
          <Field label="Allergies (optional)"><input value={p.allergies} onChange={e=>set("allergies",e.target.value)} placeholder="e.g. peanuts, milk"/></Field>
          <Field label="Cuisine you enjoy (optional)"><input value={p.cuisine} onChange={e=>set("cuisine",e.target.value)} placeholder="e.g. Pakistani, Indian"/></Field>
        </div>}

        <div className="actions">
          {step>0 && <button type="button" className="btn secondary" onClick={()=>setStep(step-1)}>← Back</button>}
          <button className="btn primary" disabled={!valid}>{step===steps.length-1?"✨ Create my plan":"Continue →"}</button>
        </div>
      </form>
      <p className="privacy">No account. No Supabase. Your answers stay in this browser.</p>
    </div>
  </div>
}

function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
function Select({value,onChange,opts}){return <select value={value} onChange={onChange}>{opts.map(([v,t])=><option key={v} value={v}>{t}</option>)}</select>}
function Choice({icon,title,text,active,onClick}){return <button type="button" className={"choice "+(active?"selected":"")} onClick={onClick}><span className="choice-icon">{icon}</span><span><b>{title}</b><small>{text}</small></span><i>{active?"✓":""}</i></button>}