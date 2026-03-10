const API_BASE_URL = "https://waterplus-backend-d1nx.vercel.app/api";
const form = document.getElementById("supplierForm");
const listDiv = document.getElementById("supplierList");

// Load suppliers
async function loadSuppliers() {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${API_BASE_URL}/suppliers/`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText);
    }

    const data = await res.json();

    listDiv.innerHTML = data.map(s => `
      <p>
        <b>${s.name}</b> | ${s.email} | ${s.phone} | ${s.address ?? ""}
        <button onclick="deleteSupplier(${s.id})">Delete</button>
      </p>
    `).join("");

  } catch (err) {
    console.error("Load suppliers error:", err);
    alert("Error loading suppliers ❌");
  }
}


// Add supplier
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !email || !phone) {
    alert("Fill all required fields ❌");
    return;
  }

  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${API_BASE_URL}/suppliers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` })
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        address
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Supplier add failed ❌");
      return;
    }

    alert("Supplier added successfully ✅");
    form.reset();
    loadSuppliers();

  } catch (err) {
    console.error("Add supplier error:", err);
    alert("Server connection error ❌");
  }
});


// Delete supplier
async function deleteSupplier(id) {
  if (!confirm("Confirm delete?")) return;

  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: "DELETE",
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    alert("Supplier deleted ✅");
    loadSuppliers();

  } catch (err) {
    console.error("Delete error:", err);
    alert("Delete failed ❌");
  }
}


// Initial load
loadSuppliers();
