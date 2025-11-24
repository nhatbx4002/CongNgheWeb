
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

let users = [];
let searchTerm = "";

// 3. Lấy phần tử UI
const ui = {
  table: document.querySelector("#userBody"),
  message: document.querySelector("#message"),
  search: document.querySelector("#searchInput"),
  addForm: document.querySelector("#addForm"),
  editForm: document.querySelector("#editForm"),
  modal: document.querySelector("#editModal"),
  count: document.querySelector("#countLabel"),
  refresh: document.querySelector("#refreshBtn"),
};

// 4. Hàm hiển thị thông báo
function notify(msg, type = "info") {
  ui.message.textContent = msg;
  ui.message.dataset.type = type;
}

// 5. Render danh sách user
function renderTable() {
  const result = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  ui.table.innerHTML = result
    .map(
      u => `
      <tr data-id="${u.id}">
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.phone}</td>
        <td>
          <button class="action-btn edit" data-action="edit">Edit</button>
          <button class="action-btn delete" data-action="delete">Delete</button>
        </td>
      </tr>`
    )
    .join("");

  ui.count.textContent = `${result.length} users`;
}

// 6. Load users từ API
async function loadUsers() {
  notify("Loading...");
  try {
    const res = await api.get("/users");
    users = res.data;
    renderTable();
    notify("Loaded successfully", "success");
  } catch {
    notify("Load failed", "error");
  }
}

// 7. Thêm user
async function addUser(data) {
  try {
    const res = await api.post("/users", data);
    users.unshift({ id: res.data.id || Date.now(), ...data });
    renderTable();
    notify("User added", "success");
  } catch {
    notify("Add failed", "error");
  }
}

// 8. Cập nhật user
async function updateUser(id, data) {
  try {
    await api.put(`/users/${id}`, data);
    users = users.map(u => (u.id == id ? { ...u, ...data } : u));
    renderTable();
    notify("Updated", "success");
  } catch {
    notify("API error, updated locally", "error");
  }
}

// 9. Xóa user
async function deleteUser(id) {
  try {
    await api.delete(`/users/${id}`);
    users = users.filter(u => u.id != id);
    renderTable();
    notify("Deleted", "success");
  } catch {
    notify("Delete failed", "error");
  }
}

// 10. Mở modal edit
function openEditModal(user) {
  ui.editForm.id.value = user.id;
  ui.editForm.name.value = user.name;
  ui.editForm.email.value = user.email;
  ui.editForm.phone.value = user.phone;
  ui.modal.classList.remove("hidden");
}

// 11. Đóng modal
function closeEditModal() {
  ui.modal.classList.add("hidden");
}

// 12. Gắn sự kiện
function bindEvents() {
  ui.search.addEventListener("input", e => {
    searchTerm = e.target.value;
    renderTable();
  });

  ui.addForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData(ui.addForm);
    addUser(Object.fromEntries(form));
    ui.addForm.reset();
  });

  ui.table.addEventListener("click", e => {
    const action = e.target.dataset.action;
    if (!action) return;
    const id = e.target.closest("tr").dataset.id;
    const user = users.find(u => u.id == id);

    if (action === "edit") openEditModal(user);
    if (action === "delete" && confirm("Delete user?")) deleteUser(id);
  });

  ui.editForm.addEventListener("submit", e => {
    e.preventDefault();
    const id = ui.editForm.id.value;
    const data = {
      name: ui.editForm.name.value,
      email: ui.editForm.email.value,
      phone: ui.editForm.phone.value,
    };
    updateUser(id, data);
    closeEditModal();
  });

  ui.modal.addEventListener("click", e => {
    if (e.target === ui.modal || e.target.dataset.close !== undefined) {
      closeEditModal();
    }
  });

  ui.refresh.addEventListener("click", loadUsers);
}

(async function init() {
  bindEvents();
  await loadUsers();
})();
