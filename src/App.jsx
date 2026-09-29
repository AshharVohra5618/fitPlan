import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";

const KEY = "fitplan_ai_profile";

export default function App() {
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; }
  });

  function saveProfile(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
    setProfile(data);
  }
  function reset() {
    localStorage.removeItem(KEY);
    setProfile(null);
  }

  return <Routes>
    <Route path="/setup" element={<Onboarding onComplete={saveProfile} initial={profile} />} />
    <Route path="/" element={profile ? <Dashboard profile={profile} onReset={reset} /> : <Navigate to="/setup" replace />} />
    <Route path="*" element={<Navigate to={profile ? "/" : "/setup"} replace />} />
  </Routes>;
}