// API_BASE_URL from config.js

document.querySelector("form")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector('input[type="email"]').value.trim();
  const password = document.querySelector('input[type="password"]').value;

  if (!email || !password) {
    alert("⚠️ Please enter email and password");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    // ❌ Error case
    if (!response.ok) {
      console.error("Backend error:", data);
      alert("❌ " + (data.detail || "Login failed"));
      return;
    }

    // ✅ Success
    localStorage.clear();

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("user_role", data.role);

    alert("✅ Login Successful");

    if (data.role === "admin") {
      window.location.href = "../pages/admin_dashboard.html";
    } else {
      window.location.href = "../pages/user_dashboard.html";
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("❌ Server connection failed");
  }
});


// ✅ Auto Redirect
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("user_role");

  if (token && role) {
    if (role === "admin") {
      window.location.href = "../pages/admin_dashboard.html";
    } else {
      window.location.href = "../pages/user_dashboard.html";
    }
  }
});