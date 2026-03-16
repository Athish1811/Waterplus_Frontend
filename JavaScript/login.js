// API_BASE_URL is loaded from config.js

// ===============================
// Login Form Submit
// ===============================
document.querySelector("form")?.addEventListener("submit", async (e) => {
e.preventDefault();

const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');

const email = emailInput.value.trim();
const password = passwordInput.value;

if (!email || !password) {
alert("⚠️ Please enter email and password");
return;
}

try {
const response = await fetch(`${API_BASE_URL}/auth/login`, {
method: "POST",
headers: {
"Content-Type": "application/x-www-form-urlencoded",
},
body: new URLSearchParams({
username: email,
password: password,
}),
});

// Try parsing response
let data;
try {
  data = await response.json();
} catch {
  throw new Error("Invalid server response");
}

if (!response.ok) {
  alert("❌ " + (data.detail || "Invalid email or password"));
  return;
}


localStorage.clear();


localStorage.setItem("access_token", data.access_token);
localStorage.setItem("user_id", data.user_id);
localStorage.setItem("user_role", data.role);

alert("✅ Login Successful");

// Redirect based on role
if (data.role === "admin") {
  window.location.href = "../pages/admin_dashboard.html";
} else {
  window.location.href = "../pages/user_dashboard.html";
}


} catch (error) {
console.error("Login error:", error);
alert("❌ Unable to connect to server");
}
});

// ===============================
// Auto Redirect if Already Logged In
// ===============================
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
