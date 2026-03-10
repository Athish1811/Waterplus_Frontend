document.getElementById("inventoryBtn")
  .addEventListener("click", async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("❌ Please login first");
      return;
    }

    const product_id = document.getElementById("product_id").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    if (!product_id || !quantity || quantity <= 0) {
      alert("❌ Please enter a valid product ID and quantity");
      return;
    }

    const res = await fetch(`https://waterplus-backend-d1nx.vercel.app/api/inventory/${product_id}/add-stock`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });

    if (res.ok) {
      const data = await res.json();
      alert(`✅ Inventory Updated! New stock: ${data.product?.stock_quantity ?? ""}`);
    } else {
      const data = await res.json().catch(() => ({}));
      alert("Update Failed ❌ " + (data.detail || ""));
    }
  });
