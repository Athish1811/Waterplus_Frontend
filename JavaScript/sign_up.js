// API_BASE_URL is loaded from config.js

// Signup Form Handler
document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (!name || !email || !password || !confirmPassword) {
    alert('Please fill all fields');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match ❌');
    return;
  }

  if (password.length < 8) {
    alert('Password must be at least 8 characters');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        confirm_password: confirmPassword,
        // role is NOT sent — backend always defaults new accounts to 'user'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert('❌ ' + (data.detail || 'Signup failed'));
      return;
    }

    alert('✅ Sign Up Successful');

    // Store token and user info
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('user_email', data.email);
    localStorage.setItem('user_role', data.role);

    // Redirect based on role
    if (data.role === 'admin') {
      window.location.href = '../pages/admin_dashboard.html';
    } else {
      window.location.href = '../pages/user_dashboard.html';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Server connection error');
  }
});
