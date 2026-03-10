async function loadUserDashboard() {
  const user_id = localStorage.getItem("user_id");
 const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "../pages/login.html";
  }

  const res = await fetch(`https://waterplus-backend-d1nx.vercel.app/api/orders/user/${user_id}`, {
    headers: token ? {"Authorization": `Bearer ${token}`} : {}
  });
  const orders = await res.json();

  document.getElementById("orderCount").innerText =
    Array.isArray(orders) ? orders.length : 0;
}

loadUserDashboard();
