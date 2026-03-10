document.querySelector("#productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("❌ Please login first");
    return;
  }

  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const size_liters = parseFloat(document.getElementById("size_liters").value);
  const price = parseFloat(document.getElementById("price").value);
  const stock_quantity = parseInt(document.getElementById("stock_quantity").value) || 0;

  const res = await fetch(`http://127.0.0.1:8000/api/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, description, size_liters, price, stock_quantity })
  });

  if (res.ok) {
    alert("Product Added Successfully ✅");
    document.getElementById("productForm").reset();
  } else {
    const data = await res.json();
    alert("Product Add Failed ❌ " + (data.detail || ""));
  }
});
