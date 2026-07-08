import React, { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/forgot-password", { email });
    setSent(true);
    toast.success("If the email exists, a reset link has been sent.");
  };
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <p className="overline text-gold">Recover</p>
        <h1 className="serif-display text-5xl mt-3 text-navy">Reset Password</h1>
        {sent ? (
          <p className="mt-8 text-navy/70">Check the backend logs for the reset link (mocked email).</p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" className="w-full border border-navy/20 px-4 py-3" />
            <button className="btn-primary w-full">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}
