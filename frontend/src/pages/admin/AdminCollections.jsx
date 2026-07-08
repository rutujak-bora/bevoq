import React, { useEffect, useState } from "react";
import api, { formatApiError } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function AdminCollections() {
  const [items, setItems] = useState([]);
  const [f, setF] = useState({ title: "", slug: "", description: "", banner_image: "" });
  const load = () => api.get("/admin/collections").then(r=>setItems(r.data));
  useEffect(() => { load(); }, []);
  const submit = async (e) => {
    e.preventDefault();
    try { await api.post("/admin/collections", f); toast.success("Created"); setF({ title:"", slug:"", description:"", banner_image:"" }); load(); }
    catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
  };
  const del = async (id) => { if(!window.confirm("Delete?")) return; await api.delete(`/admin/collections/${id}`); load(); };
  return (
    <AdminLayout>
      <div className="p-8" data-testid="admin-collections">
        <p className="overline text-gold">Curate</p>
        <h1 className="serif-display text-4xl mt-2 text-navy">Collections</h1>
        <form onSubmit={submit} className="grid md:grid-cols-4 gap-3 bg-white border border-navy/10 p-5 mt-6">
          <input required value={f.title} onChange={e=>setF({...f, title:e.target.value})} placeholder="Title" className="border border-navy/20 px-3 py-2" />
          <input required value={f.slug} onChange={e=>setF({...f, slug:e.target.value})} placeholder="slug" className="border border-navy/20 px-3 py-2" />
          <input value={f.description} onChange={e=>setF({...f, description:e.target.value})} placeholder="Description" className="border border-navy/20 px-3 py-2" />
          <input value={f.banner_image} onChange={e=>setF({...f, banner_image:e.target.value})} placeholder="Banner Image URL" className="border border-navy/20 px-3 py-2" />
          <button className="btn-primary md:col-span-4">Add Collection</button>
        </form>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {items.map(c => (
            <div key={c.id} className="bg-white border border-navy/10 overflow-hidden">
              {c.banner_image && <img src={c.banner_image} alt="" className="w-full h-32 object-cover" />}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-serif text-lg text-navy">{c.title}</div>
                    <div className="text-xs text-navy/60">{c.slug}</div>
                  </div>
                  <button onClick={()=>del(c.id)} className="text-navy/50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
                <p className="text-sm text-navy/70 mt-2">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
