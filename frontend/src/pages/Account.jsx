import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api, { formatApiError } from "@/lib/api";
import { toast } from "sonner";

export default function Account() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addresses, setAddresses] = useState([]);
  const [pw, setPw] = useState({ current: "", next: "" });
  const [newAddr, setNewAddr] = useState({ label: "Home", full_name: "", phone: "", street: "", city: "", state: "", pincode: "", country: "India" });

  useEffect(() => { api.get("/auth/addresses").then(r=>setAddresses(r.data)); }, []);

  const save = async (e) => {
    e.preventDefault();
    try { const { data } = await api.put("/auth/profile", { name, phone }); setUser(data); toast.success("Profile updated"); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  const changePw = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/change-password", { current_password: pw.current, new_password: pw.next });
      toast.success("Password changed"); setPw({ current: "", next: "" });
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  const addAddr = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/addresses", newAddr);
      setAddresses(a => [...a, data]);
      setNewAddr({ label: "Home", full_name: "", phone: "", street: "", city: "", state: "", pincode: "", country: "India" });
      toast.success("Address added");
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };

  const delAddr = async (id) => {
    await api.delete(`/auth/addresses/${id}`);
    setAddresses(a => a.filter(x => x.id !== id));
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 md:px-10 py-16" data-testid="account-page">
      <p className="overline text-gold">Profile</p>
      <h1 className="serif-display text-5xl mt-3 text-navy">My Account</h1>

      <div className="grid md:grid-cols-2 gap-10 mt-12">
        <form onSubmit={save} className="space-y-4 border border-navy/10 p-6">
          <h2 className="font-serif text-2xl text-navy">Profile Info</h2>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border border-navy/20 px-4 py-3" />
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone" className="w-full border border-navy/20 px-4 py-3" />
          <div className="text-sm text-navy/60">Email: {user?.email}</div>
          <button className="btn-primary" data-testid="save-profile-btn">Save</button>
        </form>

        <form onSubmit={changePw} className="space-y-4 border border-navy/10 p-6">
          <h2 className="font-serif text-2xl text-navy">Change Password</h2>
          <input type="password" required value={pw.current} onChange={e=>setPw({...pw, current: e.target.value})} placeholder="Current password" className="w-full border border-navy/20 px-4 py-3" />
          <input type="password" required value={pw.next} onChange={e=>setPw({...pw, next: e.target.value})} placeholder="New password" className="w-full border border-navy/20 px-4 py-3" />
          <button className="btn-primary">Update Password</button>
        </form>
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-3xl text-navy mb-6">Address Book</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map(a => (
            <div key={a.id} className="border border-navy/10 p-5 text-sm">
              <div className="flex justify-between mb-2"><span className="overline text-navy">{a.label}</span><button onClick={()=>delAddr(a.id)} className="text-red-500 text-xs">Delete</button></div>
              <div className="text-navy/80">{a.full_name}<br/>{a.street}<br/>{a.city}, {a.state} {a.pincode}<br/>{a.country}<br/>{a.phone}</div>
            </div>
          ))}
        </div>
        <form onSubmit={addAddr} className="mt-8 border border-navy/10 p-6 grid md:grid-cols-2 gap-3">
          <h3 className="font-serif text-xl text-navy md:col-span-2">Add New Address</h3>
          <input required value={newAddr.full_name} onChange={e=>setNewAddr({...newAddr, full_name: e.target.value})} placeholder="Full Name" className="border border-navy/20 px-3 py-2" />
          <input required value={newAddr.phone} onChange={e=>setNewAddr({...newAddr, phone: e.target.value})} placeholder="Phone" className="border border-navy/20 px-3 py-2" />
          <input required value={newAddr.street} onChange={e=>setNewAddr({...newAddr, street: e.target.value})} placeholder="Street" className="md:col-span-2 border border-navy/20 px-3 py-2" />
          <input required value={newAddr.city} onChange={e=>setNewAddr({...newAddr, city: e.target.value})} placeholder="City" className="border border-navy/20 px-3 py-2" />
          <input required value={newAddr.state} onChange={e=>setNewAddr({...newAddr, state: e.target.value})} placeholder="State" className="border border-navy/20 px-3 py-2" />
          <input required value={newAddr.pincode} onChange={e=>setNewAddr({...newAddr, pincode: e.target.value})} placeholder="Pincode" className="border border-navy/20 px-3 py-2" />
          <input required value={newAddr.country} onChange={e=>setNewAddr({...newAddr, country: e.target.value})} placeholder="Country" className="border border-navy/20 px-3 py-2" />
          <button className="btn-primary md:col-span-2 mt-2">Add Address</button>
        </form>
      </div>
    </div>
  );
}
