const API_BASE = "https://waterplus-backend-d1nx.vercel.app/api";

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

            let statusColor = "gray";

            if (order.status === "pending") statusColor = "orange";
            if (order.status === "confirmed") statusColor = "blue";
            if (order.status === "delivered") statusColor = "green";

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.user_id}</td>
                <td>${order.product_id}</td>
                <td>${order.quantity}</td>
                <td style="color:${statusColor};font-weight:bold">${order.status}</td>
                <td>
                    <button onclick="updateStatus(${order.id}, 'confirmed')">Confirm</button>
                    <button onclick="updateStatus(${order.id}, 'delivered')">Deliver</button>
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