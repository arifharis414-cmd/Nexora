import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { getImageUrl } from "../../utils/getImageUrl";

const emptyForm = { name: "", description: "", price: "", discountPercent: 0, category: "", stock: "", isFeatured: false, images: [] };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Sends the selected file to POST /api/upload, gets back a path like /uploads/xyz.jpg,
  // and appends it to this product's images array
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data, { headers: { "Content-Type": "multipart/form-data" } });
      setForm((f) => ({ ...f, images: [...f.images, res.data.imagePath] }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file later
    }
  };

  const removeImage = (path) => {
    setForm((f) => ({ ...f, images: f.images.filter((img) => img !== path) }));
  };

  const load = () => {
    api.get("/products", { params: { limit: 100 } }).then((r) => setProducts(r.data.products));
    api.get("/categories").then((r) => setCategories(r.data));
  };
  useEffect(load, []);

  const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, slug: slugify(form.name), price: Number(form.price), stock: Number(form.stock), discountPercent: Number(form.discountPercent) };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, discountPercent: p.discountPercent, category: p.category?._id || p.category, stock: p.stock, isFeatured: p.isFeatured, images: p.images || [] });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 shadow-sm grid md:grid-cols-2 gap-3 mb-8">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2" />
        <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input required type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2" />
        <input type="number" placeholder="Discount %" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2" />
        <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
        <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 md:col-span-2" rows={2} />

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Product Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((img) => (
              <div key={img} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(img)} className="absolute top-0 right-0 bg-black/60 text-white text-xs w-5 h-5 flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} disabled={uploading} className="text-sm" />
          {uploading && <span className="text-xs text-gray-500 ml-2">Uploading...</span>}
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg">{editingId ? "Update Product" : "Add Product"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-5 py-2 rounded-lg border border-gray-200">Cancel</button>}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-soft)] text-left">
            <tr><th className="p-3"></th><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-gray-100">
                <td className="p-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-bg-soft)] overflow-hidden">
                    {p.images?.[0] && <img src={getImageUrl(p.images[0])} alt="" className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category?.name}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-[var(--color-primary)]">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-[var(--color-danger)]">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
