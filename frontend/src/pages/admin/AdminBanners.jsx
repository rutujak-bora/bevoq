import React, { useEffect, useState, useRef } from "react";
import api, { formatApiError } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { 
  Trash2, Edit, Plus, UploadCloud, Image as ImageIcon, Eye, 
  ArrowUp, ArrowDown, Check, X, Sparkles, ExternalLink 
} from "lucide-react";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const initialForm = {
    title: "",
    subtitle: "Season 2026 · Unisex Fashion",
    description: "",
    image_url: "",
    cta_text: "Shop Collection",
    cta_link: "/products",
    secondary_cta_text: "Our Story",
    secondary_cta_link: "/about",
    order: 1,
    active: true
  };

  const [form, setForm] = useState(initialForm);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/banners");
      setBanners(res.data || []);
    } catch (err) {
      toast.error("Failed to load banners: " + (formatApiError(err.response?.data?.detail) || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (under 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await api.post("/admin/upload-banner", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm((prev) => ({ ...prev, image_url: res.data.image_url }));
      toast.success("Banner image uploaded successfully!");
    } catch (err) {
      toast.error("Upload failed: " + (formatApiError(err.response?.data?.detail) || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image_url) {
      toast.error("Title and Image are required");
      return;
    }

    try {
      if (editingBanner) {
        await api.put(`/admin/banners/${editingBanner.id}`, form);
        toast.success("Banner updated successfully!");
      } else {
        await api.post("/admin/banners", { ...form, order: banners.length + 1 });
        toast.success("New banner slide created!");
      }
      setShowModal(false);
      setEditingBanner(null);
      setForm(initialForm);
      loadBanners();
    } catch (err) {
      toast.error("Save failed: " + (formatApiError(err.response?.data?.detail) || err.message));
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      image_url: banner.image_url || "",
      cta_text: banner.cta_text || "Shop Now",
      cta_link: banner.cta_link || "/products",
      secondary_cta_text: banner.secondary_cta_text || "",
      secondary_cta_link: banner.secondary_cta_link || "",
      order: banner.order || 1,
      active: banner.active !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner slide?")) return;
    try {
      await api.delete(`/admin/banners/${id}`);
      toast.success("Banner deleted");
      loadBanners();
    } catch (err) {
      toast.error("Delete failed: " + (formatApiError(err.response?.data?.detail) || err.message));
    }
  };

  const toggleActive = async (banner) => {
    try {
      await api.put(`/admin/banners/${banner.id}`, { ...banner, active: !banner.active });
      toast.success(`Banner ${!banner.active ? "activated" : "deactivated"}`);
      loadBanners();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const moveOrder = async (banner, direction) => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const targetBanner = banners[targetIndex];
    try {
      await api.put(`/admin/banners/${banner.id}`, { ...banner, order: targetBanner.order });
      await api.put(`/admin/banners/${targetBanner.id}`, { ...targetBanner, order: banner.order });
      loadBanners();
    } catch (err) {
      toast.error("Reorder failed");
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto" data-testid="admin-banners-page">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-navy/10">
          <div>
            <span className="overline text-gold">Storefront Customization</span>
            <h1 className="serif-display text-3xl md:text-4xl text-navy mt-1">Homepage Hero Carousel</h1>
            <p className="text-sm text-navy/60 mt-1">
              Manage 3 to 4 auto-playing campaign banners, upload custom imagery, and configure call-to-action buttons.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingBanner(null);
              setForm({ ...initialForm, order: banners.length + 1 });
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2 py-2.5 px-5 text-xs uppercase tracking-wider shadow-md"
            data-testid="add-banner-btn"
          >
            <Plus size={16} /> Add New Banner Slide
          </button>
        </div>

        {/* Banners Grid */}
        <div className="mt-8">
          {loading ? (
            <div className="text-center py-20 text-navy/60">Loading carousel slides...</div>
          ) : banners.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-navy/20 rounded p-8">
              <ImageIcon size={48} className="mx-auto text-navy/30 mb-3" />
              <h3 className="font-serif text-xl font-bold text-navy">No Banner Slides Found</h3>
              <p className="text-sm text-navy/60 mt-1 mb-4">Click "Add New Banner Slide" to upload your first homepage hero image.</p>
              <button
                onClick={() => { setEditingBanner(null); setForm(initialForm); setShowModal(true); }}
                className="btn-primary text-xs uppercase"
              >
                Create First Slide
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b, idx) => (
                <div 
                  key={b.id} 
                  className={`bg-white border rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    b.active ? "border-navy/10" : "border-navy/10 opacity-70 bg-gray-50"
                  }`}
                  data-testid={`banner-card-${b.id}`}
                >
                  {/* Banner Image Preview */}
                  <div className="relative aspect-[16/9] w-full bg-navy/90 overflow-hidden group">
                    <img 
                      src={b.image_url} 
                      alt={b.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Position Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-navy/90 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
                        Slide #{idx + 1}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        b.active ? "bg-emerald-600 text-white" : "bg-gray-600 text-white"
                      }`}>
                        {b.active ? "Active" : "Hidden"}
                      </span>
                    </div>

                    {/* Preview overlay text */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      {b.subtitle && (
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-gold mb-0.5">
                          {b.subtitle}
                        </div>
                      )}
                      <h4 className="font-serif text-lg font-bold truncate">{b.title}</h4>
                    </div>
                  </div>

                  {/* Details & Actions */}
                  <div className="p-5 flex flex-col justify-between gap-4">
                    <div>
                      {b.description && (
                        <p className="text-xs text-navy/70 line-clamp-2 mb-3">{b.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="bg-cream px-2.5 py-1 rounded text-navy border border-navy/10">
                          <strong>CTA:</strong> {b.cta_text} → <span className="font-mono text-navy/60">{b.cta_link}</span>
                        </span>
                        {b.secondary_cta_text && (
                          <span className="bg-cream px-2.5 py-1 rounded text-navy border border-navy/10">
                            <strong>Secondary:</strong> {b.secondary_cta_text}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-navy/10 text-xs">
                      {/* Reorder Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => moveOrder(b, "up")}
                          className="p-1.5 border border-navy/20 rounded hover:bg-navy hover:text-white disabled:opacity-30 transition-colors"
                          title="Move Slide Up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          disabled={idx === banners.length - 1}
                          onClick={() => moveOrder(b, "down")}
                          className="p-1.5 border border-navy/20 rounded hover:bg-navy hover:text-white disabled:opacity-30 transition-colors"
                          title="Move Slide Down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      {/* Edit, Toggle, Delete */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(b)}
                          className={`px-3 py-1 text-[11px] uppercase font-semibold rounded border transition-colors ${
                            b.active 
                              ? "border-amber-500 text-amber-700 hover:bg-amber-50" 
                              : "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {b.active ? "Hide" : "Show"}
                        </button>
                        <button
                          onClick={() => handleEdit(b)}
                          className="p-1.5 border border-navy/20 text-navy hover:text-gold hover:border-gold rounded transition-colors"
                          title="Edit Slide"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete Slide"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create / Edit Slide Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white max-w-2xl w-full rounded-sm shadow-2xl overflow-hidden my-8">
              <div className="bg-navy text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" />
                  <h3 className="font-serif text-lg font-bold">
                    {editingBanner ? "Edit Hero Banner Slide" : "Add New Hero Banner Slide"}
                  </h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Image Upload / URL */}
                <div>
                  <label className="block text-xs uppercase font-semibold text-navy mb-2">
                    Banner Image (High Resolution) *
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 border-2 border-dashed border-navy/20 hover:border-gold p-4 rounded text-center cursor-pointer transition-colors bg-cream/50"
                    >
                      <UploadCloud size={24} className="mx-auto text-navy/50 mb-1" />
                      <span className="text-xs font-semibold text-navy">
                        {uploading ? "Uploading Image..." : "Click to Upload Image File from Device"}
                      </span>
                      <p className="text-[10px] text-navy/50 mt-0.5">Supports JPG, PNG, WEBP (Recommended: 1920x900px)</p>
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-navy/60 flex items-center gap-2">
                    <span>Or enter image URL:</span>
                    <input
                      type="text"
                      value={form.image_url}
                      onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 border border-navy/20 px-3 py-1.5 text-xs rounded"
                    />
                  </div>

                  {/* Thumbnail Preview */}
                  {form.image_url && (
                    <div className="mt-3 relative aspect-[16/9] w-full max-h-44 rounded overflow-hidden border border-navy/15 bg-black">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                        Live Preview
                      </span>
                    </div>
                  )}
                </div>

                {/* Subtitle & Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-navy mb-1">
                      Overline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      placeholder="e.g. Season 2026 · Unisex Fashion"
                      className="w-full border border-navy/20 px-3 py-2 text-sm rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-navy mb-1">
                      Main Heading Title *
                    </label>
                    <input
                      required
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Fashion for Everyone, Every Day."
                      className="w-full border border-navy/20 px-3 py-2 text-sm rounded font-serif"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs uppercase font-semibold text-navy mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Short engaging slide description..."
                    className="w-full border border-navy/20 px-3 py-2 text-sm rounded"
                  />
                </div>

                {/* Primary Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-navy/10">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-navy mb-1">
                      Primary Button Label
                    </label>
                    <input
                      type="text"
                      value={form.cta_text}
                      onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                      placeholder="Shop Collection"
                      className="w-full border border-navy/20 px-3 py-2 text-sm rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-navy mb-1">
                      Primary Button Link
                    </label>
                    <input
                      type="text"
                      value={form.cta_link}
                      onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                      placeholder="/collections/t-shirts"
                      className="w-full border border-navy/20 px-3 py-2 text-sm rounded font-mono"
                    />
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-navy mb-1">
                      Secondary Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.secondary_cta_text}
                      onChange={(e) => setForm({ ...form, secondary_cta_text: e.target.value })}
                      placeholder="Our Story / Custom"
                      className="w-full border border-navy/20 px-3 py-2 text-sm rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-semibold text-navy mb-1">
                      Secondary Button Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.secondary_cta_link}
                      onChange={(e) => setForm({ ...form, secondary_cta_link: e.target.value })}
                      placeholder="/about or /bulk-custom"
                      className="w-full border border-navy/20 px-3 py-2 text-sm rounded font-mono"
                    />
                  </div>
                </div>

                {/* Active Switch */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 text-navy rounded border-navy/30"
                  />
                  <label htmlFor="active" className="text-xs font-semibold text-navy uppercase cursor-pointer">
                    Enable this slide on homepage
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-navy/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs uppercase tracking-wider font-semibold border border-navy/20 rounded hover:bg-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-6 py-2 text-xs uppercase tracking-wider font-bold shadow"
                  >
                    {editingBanner ? "Update Slide" : "Create Slide"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
