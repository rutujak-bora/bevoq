import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { formatINR, formatApiError } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { Trash2, Edit } from "lucide-react";

export function AdminProducts() {
  const [products, setProducts] = useState([]);
  const load = () => api.get("/admin/products").then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);
  const del = async (id) => { if(!window.confirm("Delete this product?")) return; await api.delete(`/admin/products/${id}`); toast.success("Deleted"); load(); };
  return (
    <AdminLayout>
      <div className="p-8" data-testid="admin-products-page">
        <div className="flex items-center justify-between">
          <div>
            <p className="overline text-gold">Catalog</p>
            <h1 className="serif-display text-4xl mt-2 text-navy">Products</h1>
          </div>
          <Link to="/admin/products/new" className="btn-primary" data-testid="new-product-btn">+ New Product</Link>
        </div>
        <div className="bg-white border border-navy/10 mt-8">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-navy/60 border-b border-navy/10">
              <tr><th className="text-left p-4">Product</th><th className="text-left">Category</th><th className="text-left">Price</th><th className="text-left">Stock</th><th className="text-left">Status</th><th></th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-navy/5">
                  <td className="p-4 flex items-center gap-3">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-12 h-14 object-cover" />}
                    <div>
                      <div className="font-serif text-navy">{p.title}</div>
                      <div className="text-xs text-navy/50">{p.slug}</div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{formatINR(p.price)}</td>
                  <td className={p.stock <= 5 ? "text-red-600" : ""}>{p.stock}</td>
                  <td className="uppercase text-xs">{p.status}</td>
                  <td className="text-right pr-4">
                    <Link to={`/admin/products/${p.id}/edit`} className="inline-block p-2 text-navy hover:text-gold"><Edit size={16} /></Link>
                    <button onClick={()=>del(p.id)} className="p-2 text-navy hover:text-red-600" data-testid={`delete-product-${p.slug}`}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export function AdminProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const isEdit = !!id;
  const [form, setForm] = useState({
    title: "", description: "", price: 0, compare_at_price: null, sku: "", stock: 0,
    category: "General", tags: [], sizes: [], colors: [], images: [],
    status: "active", collections: [], featured: false, trending: false, best_selling: false,
  });
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get("/admin/products").then(r => {
        const p = r.data.find(x => x.id === id);
        if (p) setForm(p);
      });
    }
  }, [id, isEdit]);

  const change = (k, v) => setForm(f => ({...f, [k]: v}));
  const addImg = () => { if (imgUrl) { change("images", [...form.images, imgUrl]); setImgUrl(""); } };
  const removeImg = (i) => change("images", form.images.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null };
      if (isEdit) await api.put(`/admin/products/${id}`, payload);
      else await api.post("/admin/products", payload);
      toast.success(isEdit ? "Updated" : "Created");
      nav("/admin/products");
    } catch (err) { toast.error(formatApiError(err.response?.data?.detail)); }
    finally { setLoading(false); }
  };

  const csv = (arr) => arr.join(", ");
  const parseCsv = (s) => s.split(",").map(x=>x.trim()).filter(Boolean);

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl" data-testid="product-form">
        <p className="overline text-gold">{isEdit ? "Edit" : "New"}</p>
        <h1 className="serif-display text-4xl mt-2 text-navy">{isEdit ? "Edit Product" : "New Product"}</h1>
        <form onSubmit={submit} className="mt-8 grid md:grid-cols-2 gap-4 bg-white border border-navy/10 p-6">
          <input required value={form.title} onChange={e=>change("title", e.target.value)} placeholder="Title" className="md:col-span-2 border border-navy/20 px-4 py-3" data-testid="pf-title" />
          <textarea value={form.description} onChange={e=>change("description", e.target.value)} placeholder="Description" rows={4} className="md:col-span-2 border border-navy/20 px-4 py-3" />
          <input required type="number" value={form.price} onChange={e=>change("price", e.target.value)} placeholder="Price" className="border border-navy/20 px-4 py-3" data-testid="pf-price" />
          <input type="number" value={form.compare_at_price || ""} onChange={e=>change("compare_at_price", e.target.value)} placeholder="Compare-at Price (optional)" className="border border-navy/20 px-4 py-3" />
          <input value={form.sku || ""} onChange={e=>change("sku", e.target.value)} placeholder="SKU" className="border border-navy/20 px-4 py-3" />
          <input required type="number" value={form.stock} onChange={e=>change("stock", e.target.value)} placeholder="Stock" className="border border-navy/20 px-4 py-3" data-testid="pf-stock" />
          <input value={form.category} onChange={e=>change("category", e.target.value)} placeholder="Category" className="border border-navy/20 px-4 py-3" />
          <select value={form.status} onChange={e=>change("status", e.target.value)} className="border border-navy/20 px-4 py-3">
            <option value="active">Active</option><option value="draft">Draft</option>
          </select>
          <input value={csv(form.tags)} onChange={e=>change("tags", parseCsv(e.target.value))} placeholder="Tags (comma-sep)" className="md:col-span-2 border border-navy/20 px-4 py-3" />
          <input value={csv(form.sizes)} onChange={e=>change("sizes", parseCsv(e.target.value))} placeholder="Sizes: S, M, L" className="border border-navy/20 px-4 py-3" />
          <input value={csv(form.colors)} onChange={e=>change("colors", parseCsv(e.target.value))} placeholder="Colors: Black, White" className="border border-navy/20 px-4 py-3" />
          <input value={csv(form.collections)} onChange={e=>change("collections", parseCsv(e.target.value))} placeholder="Collection slugs: women, trending" className="md:col-span-2 border border-navy/20 px-4 py-3" />
          <div className="md:col-span-2">
            <div className="overline text-navy mb-2">Images</div>
            <div className="flex gap-2 mb-3">
              <input value={imgUrl} onChange={e=>setImgUrl(e.target.value)} placeholder="Image URL" className="flex-1 border border-navy/20 px-3 py-2" />
              <button type="button" onClick={addImg} className="btn-outline">Add</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {form.images.map((u, i) => (
                <div key={i} className="relative">
                  <img src={u} alt="" className="w-full h-24 object-cover" />
                  <button type="button" onClick={()=>removeImg(i)} className="absolute top-1 right-1 bg-white/90 px-2 text-xs">×</button>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex gap-6 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e=>change("featured", e.target.checked)} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.trending} onChange={e=>change("trending", e.target.checked)} /> Trending</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.best_selling} onChange={e=>change("best_selling", e.target.checked)} /> Best Selling</label>
          </div>
          <button type="submit" disabled={loading} className="btn-primary md:col-span-2" data-testid="pf-submit">{loading ? "..." : (isEdit ? "Update" : "Create")}</button>
        </form>
      </div>
    </AdminLayout>
  );
}
