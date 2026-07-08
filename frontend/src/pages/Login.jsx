import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const user = await login(email, password);
      toast.success("Welcome back");
      nav(user.role === "admin" ? "/admin" : "/");
    } catch (e) {
      setErr(formatApiError(e.response?.data?.detail) || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md" data-testid="login-page">
        <p className="overline text-gold text-center">Welcome</p>
        <h1 className="serif-display text-5xl mt-3 text-navy text-center">Sign In</h1>
        <form onSubmit={submit} className="mt-10 space-y-4">
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border border-navy/20 px-4 py-3" data-testid="login-email" />
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border border-navy/20 px-4 py-3" data-testid="login-password" />
          {err && <div className="text-red-600 text-sm" data-testid="login-error">{err}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="login-submit">{loading ? "..." : "Sign In"}</button>
        </form>
        <div className="text-center mt-6 text-sm">
          <Link to="/forgot-password" className="text-navy/70 hover:text-gold">Forgot password?</Link>
        </div>
        <div className="text-center mt-2 text-sm text-navy/70">
          New here? <Link to="/register" className="text-gold underline">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
