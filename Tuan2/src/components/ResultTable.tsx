import { useState, useEffect } from "react";
import { Modal } from "./Modals";
export function ResultTable({ keyword = "", user, onAdded = () => {} }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }]);
      if (typeof onAdded === "function") onAdded();
    }
  }, [user]);

  function editUser(u) {
    setEditing({ ...u, address: { ...(u.address || {}) } });
  }

  function handleEditChange(field, value) {
    if (!editing) return;
    if (field === "city") {
      setEditing((prev) => ({
        ...prev,
        address: { ...prev.address, city: value },
      }));
    } else {
      setEditing((prev) => ({ ...prev, [field]: value }));
    }
  }

  function saveUser() {
    if (!editing) return;
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)));
    setEditing(null);
  }

  function removeUser(id) {
    if (editing && editing.id === id) setEditing(null);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  function openEdit(u) {
    // deep copy into editing state
    setEditing({ ...u, address: { ...(u.address || {}) } });
    setModalMode("edit");
    setModalOpen(true);
  }

  function saveEdit(payload) {
    setUsers((prev) =>
      prev.map((u) => (u.id === editing.id ? { ...editing, ...payload } : u))
    );
    setEditing(null);
    setModalOpen(false);
  }

  const kw = (keyword || "").toLowerCase();
  const filteredUsers = users.filter(
    (u) =>
      (u.name && u.name.toLowerCase().includes(kw)) ||
      (u.username && u.username.toLowerCase().includes(kw))
  );

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>City</th>
            <th style={{ width: 200 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>
                <small>{u.username}</small>
              </td>
              <td>{u.email}</td>
              <td>{u.address?.city || ""}</td>
              <td>
                <div className="actions">
                  <button
                    className="btn ghost"
                    onClick={() => {
                      openEdit(u);
                    }}
                  >
                    Sửa
                  </button>
                  <button className="btn" onClick={() => removeUser(u.id)}>
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={(data) => {
          if (modalMode === "edit") {
            // merge changes into editing then save
            setEditing((prev) => ({ ...prev, ...data }));
            saveEdit(data);
          }
        }}
      />
    </div>
  );
}
