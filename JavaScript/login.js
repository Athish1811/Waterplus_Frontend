  const API_BASE_URL = "https://waterplus-backend-d1nx.vercel.app/api";

  // Login Form Handler
  document.querySelector("form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector('input[type="email"]').value.trim();
    const password = document.querySelector('input[type="password"]').value;

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert("❌ " + (data.detail || "Invalid email or password"));
        return;
      }

      // Clear old storage first
      localStorage.clear();

      // Store new login data
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
      console.error(error);
      alert("❌ Server error");
    }
  });
