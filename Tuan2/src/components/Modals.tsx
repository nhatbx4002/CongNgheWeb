import { useState, useEffect } from "react";

export function Modal({ open, mode = "add", initial = null, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    address: { city: "" },
  });

  useEffect(() => {
    if (initial)
      setForm({ ...initial, address: { ...(initial.address || {}) } });
    else setForm({ name: "", username: "", email: "", address: { city: "" } });
  }, [initial, open]);

  if (!open) return null;
  function handleChange(key, value) {
    if (key === "city") {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, city: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  }
  function submit() {
    if (!form.name.trim() || !form.username.trim()) {
      alert("Vui lòng nhập Name và Username!");
      return;
    }
    onSave(form);
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content card">
        <div className="modal-header">
          <div className="modal-title">
            {mode === "add" ? "Thêm người dùng" : "Chỉnh sửa người dùng"}
          </div>
          <button className="ghost" onClick={onClose}>
            Đóng
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={form.address?.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>
            Hủy
          </button>
          <button className="btn primary" onClick={submit}>
            {mode === "add" ? "Lưu" : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
