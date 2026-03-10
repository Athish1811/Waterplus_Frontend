// API Configuration
const API_BASE_URL = `http://127.0.0.1:8000/api`;

// Place Order Handler
document.getElementById('orderBtn')?.addEventListener('click', async (e) => {
  e.preventDefault();

  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert('Please login first');
    window.location.href = '../pages/login.html';
    return;
  }

  const customerName = document.querySelector('input[placeholder="Enter your name"]').value.trim();
  const mobileNumber = document.querySelector('input[placeholder="Enter mobile number"]').value.trim();
  const waterType = document.querySelector('select').value;
  const quantity = parseInt(document.querySelector('input[placeholder="Enter quantity"]').value);
  const deliveryAddress = document.querySelector('textarea').value.trim();

  // Validation
  if (!customerName || !mobileNumber || !waterType || !quantity || !deliveryAddress) {
    alert('Please fill all fields');
    return;
  }

  if (quantity <= 0) {
    alert('Quantity must be greater than 0');
    return;
  }

  // Map water type to product ID
  const productMap = {
    '20L Can': 1,
    '10L Bottle': 2,
    '5L Bottle': 3,
    '2L Bottle': 4,
    '1L Bottle': 5,
  };

  const productId = productMap[waterType] || 1;

  try {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: JSON.stringify({
        product_id: productId,
        quantity,
        delivery_address: deliveryAddress,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert('❌ ' + (data.detail || 'Order failed'));
      return;
    }

    alert('✅ Order Placed Successfully!\nOrder ID: ' + data.id);
    window.location.href = '../pages/order_success.html?order_id=' + data.id;
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Failed to place order');
  }
});
