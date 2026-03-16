// API_BASE_URL is loaded from config.js

async function loadUserDashboard() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "../pages/login.html";
    return;
  }

  try {
    const userId = localStorage.getItem("user_id");
    const res = await fetch(`${API_BASE_URL}/dashboard/user-stats/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      console.error("Failed to load dashboard statistics:", res.status);
      return;
    }

    const stats = await res.json();

    const orderCountEl = document.getElementById("orderCount");
    if (orderCountEl) {
      orderCountEl.innerText = stats.total_orders ?? 0;
    }

    const pendingCountEl = document.getElementById("pendingCount");
    if (pendingCountEl) {
      pendingCountEl.innerText = stats.pending_orders ?? 0;
    }

    const deliveredCountEl = document.getElementById("deliveredCount");
    if (deliveredCountEl) {
      deliveredCountEl.innerText = stats.delivered_orders ?? 0;
    }

    const totalSpentEl = document.getElementById("totalSpent");
    if (totalSpentEl) {
      totalSpentEl.innerText = "₹" + (stats.total_spent ?? 0).toFixed(2);
    }

  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

loadUserDashboard();
