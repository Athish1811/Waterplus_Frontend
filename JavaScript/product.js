// API Configuration
const API_BASE_URL = 'https://waterplus-backend-d1nx.vercel.app/api';

// Load all products on page load
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`);
    const products = await response.json();

    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';

    products.forEach((product) => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <img src="../Assets/${product.size_liters}-liters.png" 
             alt="${product.name}" 
             onerror="this.src='../Assets/1-liter.png'">
        <p>${product.name} - ₹${product.price}</p>
        <p style="font-size: 12px; color: #666;">
          Stock: ${product.stock_quantity}
        </p>
        <button onclick="viewProductDetails(${product.id})">
          View Details
        </button>
      `;
      productGrid.appendChild(productElement);
    });

  } catch (error) {
    console.error('Error loading products:', error);
    alert('Failed to load products');
  }
}

// View product details
async function viewProductDetails(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const product = await response.json();

    alert(
      `Product: ${product.name}
Size: ${product.size_liters}L
Price: ₹${product.price}
Stock: ${product.stock_quantity}

${product.description || 'High-quality drinking water'}`
    );

    if (confirm('Would you like to place an order?')) {
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        alert('Please login first');
        window.location.href = '../pages/login.html';
        return;
      }

      window.location.href =
        '../pages/orders.html?product_id=' + productId;
    }

  } catch (error) {
    console.error('Error loading product details:', error);
    alert('Failed to load product details');
  }
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', loadProducts);
