// API Configuration
const API_BASE_URL = "https://waterplus-backend-d1nx.vercel.app/api";

const form = document.querySelector("form");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Contact form values
  const name = document.querySelector('input[placeholder*="name"]')?.value.trim() || "Guest";
  const email = document.querySelector('input[placeholder*="email"]')?.value.trim();
  const phone = document.querySelector('input[placeholder*="phone"]')?.value.trim();
  const subject = document.querySelector('input[placeholder*="subject"]')?.value.trim() || "Contact Form";
  const message = document.querySelector("textarea")?.value.trim();

  if (!email || !message) {
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
        subject,
        message
      })
    });

    if (!res.ok) throw new Error("Message send failed");

    alert("✅ Message sent successfully!");
    form.reset();

  } catch (error) {
    console.error(error);
    alert("❌ Failed to send message");
  }
});
