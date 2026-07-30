import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get("/categories").then((r) => setCategories(r.data));
  useEffect(load, []);

  const slugify = (str) => str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, slug: slugify(form.name) };
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, payload);
        toast.success("Category updated");
      } else {
        await api.post("/categories", payload);
        toast.success("Category created");
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? Products in it will remain but be uncategorized.")) return;
    await api.delete(`/categories/${id}`);
    toast.success("Category deleted");
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 shadow-sm flex flex-wrap gap-3 mb-8">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[150px]" />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-[150px]" />
        <button className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg">{editingId ? "Update" : "Add"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", description: "" }); }} className="px-5 py-2 rounded-lg border border-gray-200">Cancel</button>}
      </form>

      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {categories.map((c) => (
          <div key={c._id} className="p-4 flex justify-between items-center text-sm">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-gray-500">{c.description}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setEditingId(c._id); setForm({ name: c.name, description: c.description }); }} className="text-[var(--color-primary)]">Edit</button>
              <button onClick={() => handleDelete(c._id)} className="text-[var(--color-danger)]">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
