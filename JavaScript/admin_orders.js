// API_BASE is loaded from config.js via admin_orders.html (if included)
// Actually, let's ensure API_BASE_URL is used consistently.
const API_BASE = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");

    if (!token || role !== "admin") {
        alert("Admin access only");
        window.location.href = "../pages/login.html";
        return;
    }

    loadOrders(token);

});

// =======================
// LOAD ORDERS
// =======================

async function loadOrders(token) {

    try {

        const res = await fetch(`${API_BASE}/orders/admin`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("API Error:", res.status, errorText);
            alert("Failed to load orders: " + errorText);
            return;
        }

        const data = await res.json();

        const table = document.getElementById("ordersTable");
        table.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            table.innerHTML = "<tr><td colspan='6'>No Orders Found</td></tr>";
            return;
        }

        data.forEach(order => {
            let statusColor = "#636e72"; 
            if (order.status === "pending") statusColor = "#fdcb6e";
            if (order.status === "confirmed") statusColor = "#0984e3";
            if (order.status === "delivered") statusColor = "#00b894";
            if (order.status === "cancelled") statusColor = "#d63031";

            const orderDate = new Date(order.created_at + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customer_name || "N/A"}</td>
                <td>${order.product_name || "ID: " + order.product_id}</td>
                <td>${order.quantity}</td>
                <td>₹${(order.total_price || 0).toFixed(2)}</td>
                <td style="color:${statusColor}; font-weight:bold; text-transform: capitalize;">${order.status}</td>
                <td><small>${orderDate}</small></td>
                <td>
                    <div class="action-btns" style="display: flex; gap: 5px; justify-content: center;">
                      ${order.status === 'pending' ? `<button onclick="updateStatus(${order.id}, 'confirmed')" style="background:#3498db; color:white;">Confirm</button>` : ''}
                      ${(order.status === 'pending' || order.status === 'confirmed') ? `<button onclick="updateStatus(${order.id}, 'delivered')" style="background:#2ecc71; color:white;">Deliver</button>` : ''}
                      ${order.status !== 'delivered' && order.status !== 'cancelled' ? `<button onclick="updateStatus(${order.id}, 'cancelled')" style="background:#e74c3c; color:white;">Cancel</button>` : ''}
                    </div>
                </td>
            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error("Orders Load Error:", error);
        alert("Server error while loading orders");

    }

}

// =======================
// UPDATE STATUS
// =======================

async function updateStatus(orderId, status) {

    const token = localStorage.getItem("access_token");

    try {

        const res = await fetch(`${API_BASE}/orders/admin/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (!res.ok) {
            alert("Failed to update order");
            return;
        }

        loadOrders(token);

    } catch (error) {

        console.error("Status Update Error:", error);

    }

}