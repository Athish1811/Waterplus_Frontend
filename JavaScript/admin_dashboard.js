async function loadAdminData() {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");
  if (!token || role !== "admin") {
    alert("Admin access only");
    window.location.href = "../pages/login.html";
    return;
  }
  const headers = { "Authorization": `Bearer ${token}` };

  try {
    // Use the admin stats endpoint which gives all stats in one call
    const statsRes = await fetch(`${API_BASE_URL}/dashboard/admin-stats`, { headers });
    const stats = await statsRes.json();

    if (document.getElementById("totalProducts")) {
      document.getElementById("totalProducts").innerText = stats.total_products ?? 0;
    }
    if (document.getElementById("totalOrders")) {
      document.getElementById("totalOrders").innerText = stats.total_orders ?? 0;
    }
    if (document.getElementById("totalUsers")) {
      document.getElementById("totalUsers").innerText = stats.total_users ?? 0;
    }
    if (document.getElementById("totalRevenue")) {
      document.getElementById("totalRevenue").innerText = "₹" + (stats.total_revenue ?? 0);
    }
    if (document.getElementById("pendingOrders")) {
      document.getElementById("pendingOrders").innerText = stats.pending_orders ?? 0;
    }
    if (document.getElementById("confirmedOrders")) {
      document.getElementById("confirmedOrders").innerText = stats.confirmed_orders ?? 0;
    }
    if (document.getElementById("availableStock")) {
      document.getElementById("availableStock").innerText = stats.available_stock ?? 0;
    }
  } catch (err) {
    console.error("Error loading admin data:", err);
  }
}

loadAdminData();
