import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";

export default function AdminLogin() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@bevoq.com");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const u = await login(email, password);
      if (u.role !== "admin") throw new Error("Not an admin account");
      nav("/admin");
    } catch (e) {
      setErr(formatApiError(e.response?.data?.detail) || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-navy text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md" data-testid="admin-login-page">
        <div className="text-center mb-10">
          <div className="font-serif text-4xl">BEVOQ<span className="text-gold">.</span></div>
          <p className="overline text-gold mt-2">Admin Console</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Admin Email" className="w-full bg-transparent border border-white/20 px-4 py-3 focus:border-gold outline-none" data-testid="admin-login-email" />
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full bg-transparent border border-white/20 px-4 py-3 focus:border-gold outline-none" data-testid="admin-login-password" />
          {err && <div className="text-red-400 text-sm">{err}</div>}
          <button disabled={loading} className="w-full bg-gold text-navy py-3 uppercase tracking-[0.2em] text-xs font-medium hover:bg-white transition-colors" data-testid="admin-login-submit">{loading ? "..." : "Sign In"}</button>
        </form>
      </div>
    </div>
  );
}
