import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";
import * as orderService from "../services/orderService";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: "", address: {} });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    authService
      .getProfile()
      .then((data) => setForm({ name: data.name, phone: data.phone || "", address: data.address || {} }))
      .catch(() => toast.error("Could not load profile"));
    orderService
      .getMyOrders()
      .then(setOrders)
      .catch(() => toast.error("Could not load orders"));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(form);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <form onSubmit={handleSave} className="space-y-3 max-w-md">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2" />
          <input value={user?.email} disabled className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-400" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2" />
          <button className="bg-[var(--color-primary)] text-white px-5 py-2 rounded-lg hover:bg-[var(--color-primary-dark)]">Save Changes</button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="border border-gray-100 rounded-xl p-4 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">Order #{o._id.slice(-6)}</p>
                  <p className="text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="capitalize bg-[var(--color-bg-soft)] px-3 py-1 rounded-full text-xs font-medium">{o.status}</span>
                <span className="font-bold">${o.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
