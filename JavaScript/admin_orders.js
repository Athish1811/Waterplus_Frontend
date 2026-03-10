const API_BASE = "https://waterplus-backend-d1nx.vercel.app/api";
const token = localStorage.getItem("access_token");

// Redirect if not logged in
if (!token) {
    alert("Admin login required");
    window.location.href = "../pages/login.html";
}

// =======================
// LOAD ALL ORDERS
// =======================

async function loadOrders() {

    try {

        const res = await fetch(`${API_BASE}/orders/admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 401) {
            alert("Session expired. Please login again.");
            localStorage.clear();
            window.location.href = "../pages/login.html";
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

            if(order.status === "pending") statusColor = "orange";
            if(order.status === "confirmed") statusColor = "blue";
            if(order.status === "delivered") statusColor = "green";

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
                    <button onclick="deleteOrder(${order.id})">Delete</button>
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

    await fetch(`${API_BASE}/orders/${orderId}/status?status=${status}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    loadOrders();

}

// =======================
// DELETE ORDER
// =======================

async function deleteOrder(orderId) {

    const confirmDelete = confirm("Delete this order?");

    if(!confirmDelete) return;

    await fetch(`${API_BASE}/orders/${orderId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    loadOrders();

}

loadOrders();