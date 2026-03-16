async function loadOrders() {

  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "../pages/login.html";
    return;
  }

  const container = document.getElementById("ordersContainer");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      container.innerHTML = `<h3>Error: ${err.detail || "Failed to load orders"}</h3>`;
      return;
    }

    const orders = await res.json();

    container.innerHTML = "";

    if (!orders || orders.length === 0) {
      container.innerHTML = "<h3>No Orders Found</h3>";
      return;
    }

    orders.forEach(order => {
      const orderDate = new Date(order.created_at + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
      container.innerHTML += `
      <div class="order-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <h3>Order #${order.id}</h3>
          <span class="status ${order.status}">${order.status}</span>
        </div>
        <p><b>Product:</b> ${order.product_name || "ID: " + order.product_id}</p>
        <p><b>Quantity:</b> ${order.quantity}</p>
        <p><b>Total Amount:</b> ₹${(order.total_price || 0).toFixed(2)}</p>
        <p style="font-size: 0.8rem; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px;">
          <b>Placed on:</b> ${orderDate}
        </p>
      </div>
      `;
    });

  } catch (error) {
    console.error("Orders load error:", error);
    container.innerHTML = "<h3>Could not connect to server</h3>";
  }

}

loadOrders();