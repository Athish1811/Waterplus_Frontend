const API_BASE = "https://waterplus-backend-d1nx.vercel.app/api";

async function loadOrders() {

  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_BASE}/orders/user/${user_id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const orders = await res.json();

  const container = document.getElementById("ordersContainer");
  container.innerHTML = "";

  if (!orders || orders.length === 0) {
    container.innerHTML = "<h3>No Orders Found</h3>";
    return;
  }

  orders.forEach(order => {

    container.innerHTML += `
    
    <div class="order-card">

      <h3>Order #${order.id}</h3>

      <p><b>Product ID:</b> ${order.product_id}</p>

      <p><b>Quantity:</b> ${order.quantity}</p>

      <p><b>Total:</b> ₹${order.total_price}</p>

      <p class="status">${order.status}</p>

    </div>

    `;
  });

}

loadOrders();