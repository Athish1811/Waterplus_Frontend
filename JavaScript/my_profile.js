const API_BASE_URL = "https://waterplus-backend-d1nx.vercel.app/api";

async function loadMyProfile() {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login first.");
      window.location.href = "login.html";
      return;
    }

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Unable to load profile");
    }

    const profileCard = document.querySelector(".profile-card");

    profileCard.innerHTML = `
      <h3>My Profile</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
      <p><strong>Address:</strong> ${data.address || "Not provided"}</p>
      <a href="edit_profile.html" class="card-btn">Edit Profile</a>
    `;

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

document.addEventListener("DOMContentLoaded", loadMyProfile);
