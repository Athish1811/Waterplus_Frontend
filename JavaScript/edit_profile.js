const API_BASE_URL = "https://waterplus-backend-d1nx.vercel.app/api";
const form = document.getElementById("editProfileForm");

async function loadProfile() {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Unable to load profile");
    }

    document.getElementById("name").value = data.name || "";
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("address").value = data.address || "";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Login required");
      window.location.href = "login.html";
      return;
    }

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, phone, address }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Update failed");
    }

    alert("Profile updated successfully ✅");
    window.location.href = "my_profile.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

loadProfile();
