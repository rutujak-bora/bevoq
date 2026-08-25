import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [f, setF] = useState({ name:"", email:"", phone:"", password:"", street:"", city:"", state:"", pincode:"", country:"India" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setErr("");
    try {
      const address = f.street ? { label:"Home", full_name: f.name, phone: f.phone, street: f.street, city: f.city, state: f.state, pincode: f.pincode, country: f.country } : undefined;
      await register({ name: f.name, email: f.email, phone: f.phone, password: f.password, address });
      toast.success("Welcome to BEVOQ");
      const destination = location.state?.from || "/";
      nav(destination, { replace: true });
    } catch (e) {
      setErr(formatApiError(e.response?.data?.detail) || e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg" data-testid="register-page">
        <p className="overline text-gold text-center">Join</p>
        <h1 className="serif-display text-5xl mt-3 text-navy text-center">Create Account</h1>
        <form onSubmit={submit} className="mt-10 space-y-3">
          <input required value={f.name} onChange={e=>setF({...f, name:e.target.value})} placeholder="Full Name" className="w-full border border-navy/20 px-4 py-3" data-testid="reg-name" />
          <input required type="email" value={f.email} onChange={e=>setF({...f, email:e.target.value})} placeholder="Email" className="w-full border border-navy/20 px-4 py-3" data-testid="reg-email" />
          <input required value={f.phone} onChange={e=>setF({...f, phone:e.target.value})} placeholder="Phone" className="w-full border border-navy/20 px-4 py-3" data-testid="reg-phone" />
          <input required type="password" minLength={6} value={f.password} onChange={e=>setF({...f, password:e.target.value})} placeholder="Password (min 6 chars)" className="w-full border border-navy/20 px-4 py-3" data-testid="reg-password" />
          <div className="pt-4 overline text-navy">Address (optional)</div>
          <input value={f.street} onChange={e=>setF({...f, street:e.target.value})} placeholder="Street" className="w-full border border-navy/20 px-4 py-3" />
          <div className="grid grid-cols-2 gap-3">
            <input value={f.city} onChange={e=>setF({...f, city:e.target.value})} placeholder="City" className="border border-navy/20 px-4 py-3" />
            <input value={f.state} onChange={e=>setF({...f, state:e.target.value})} placeholder="State" className="border border-navy/20 px-4 py-3" />
            <input value={f.pincode} onChange={e=>setF({...f, pincode:e.target.value})} placeholder="Pincode" className="border border-navy/20 px-4 py-3" />
            <input value={f.country} onChange={e=>setF({...f, country:e.target.value})} placeholder="Country" className="border border-navy/20 px-4 py-3" />
          </div>
          {err && <div className="text-red-600 text-sm" data-testid="reg-error">{err}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full" data-testid="reg-submit">{loading ? "..." : "Create Account"}</button>
        </form>
        <div className="text-center mt-4 text-sm text-navy/70">
          Already have an account? <Link to="/login" className="text-gold underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
