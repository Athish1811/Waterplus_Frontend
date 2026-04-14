// API Configuration
const API_BASE_URL = "https://waterplus-backend-d1nx.vercel.app/api";

const form = document.querySelector(".contact-form");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector('input[name="name"]')?.value.trim();
  const email = document.querySelector('input[name="email"]')?.value.trim();
  const phone = document.querySelector('input[name="phone"]')?.value.trim();
  const subject = document.querySelector('input[name="subject"]')?.value.trim();
  const message = document.querySelector('textarea[name="message"]')?.value.trim();

  // validation
  if (!name || !email || !phone || !message) {
    alert("Please fill all required fields ❌");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/contact/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject: subject || "Contact Form",
        message
      })
    });

    if (!res.ok) {
      throw new Error("Message send failed");
    }

    alert("✅ Message sent successfully!");
    form.reset();

  } catch (error) {
    console.error(error);
    alert("❌ Failed to send message");
  }
});

function toggleMenu() {
  document.getElementById("menu").classList.toggle("active");
}