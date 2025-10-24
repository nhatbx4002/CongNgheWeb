const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const addProductBtn = document.getElementById("addProductBtn");
const addProductForm = document.getElementById("addProductForm");
const productList = document.getElementById("product-list");
const cancelBtn = document.getElementById("cancelBtn");
const errorMsg = document.getElementById("errorMsg");


addProductBtn.addEventListener("click", () => {
  addProductForm.classList.toggle("hidden");
});

cancelBtn.addEventListener("click", () => {
  addProductForm.classList.add("hidden");
  errorMsg.textContent = "";
});


searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase().trim();
  const products = document.querySelectorAll(".product-card");

  products.forEach((item) => {
    const name = item.querySelector("h3").textContent.toLowerCase();
    if (name.includes(keyword)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
});


addProductForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("newName").value.trim();
  const price = document.getElementById("newPrice").value.trim();
  const desc = document.getElementById("newDesc").value.trim();

  if (!name || !price || Number(price) <= 0) {
    errorMsg.textContent = "⚠️ Vui lòng nhập tên và giá hợp lệ!";
    return;
  }

  const newItem = document.createElement("article");
  newItem.className = "product-card";
  newItem.innerHTML = `
    <div class="product-image">
      <img src="https://via.placeholder.com/600x400/00C2FF/000000?text=${encodeURIComponent(name)}" alt="${name}">
    </div>
    <div class="product-info">
      <h3>${name}</h3>
      <p>${desc || "Sản phẩm mới của TechZone."}</p>
      <div class="product-price">Giá: ${price}₫</div>
      <button class="buy-btn">Thêm vào giỏ</button>
    </div>
  `;


  productList.prepend(newItem);
  addProductForm.reset();
  addProductForm.classList.add("hidden");
  errorMsg.textContent = "";
});
