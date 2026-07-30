import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const load = () => api.get("/admin/users").then((r) => setUsers(r.data));
  useEffect(load, []);

  const handleRoleChange = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    toast.success("Role updated");
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    toast.success("User deleted");
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-bg-soft)] text-left">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-100">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => handleDelete(u._id)} className="text-[var(--color-danger)]">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
