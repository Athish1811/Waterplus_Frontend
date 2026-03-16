let productList = [];

let isProductsLoaded = false;

async function loadProductOptions() {
    if (isProductsLoaded) return;

    const select = document.getElementById('productSelect');
    if (!select) return;

    try {
        select.innerHTML = '<option value="">Loading products...</option>';

        const res = await fetch(`${API_BASE_URL}/products/`);
        if (!res.ok) {
            select.innerHTML = '<option value="">❌ Error loading products</option>';
            return;
        }

        const products = await res.json();
        productList = products;

        if (products.length === 0) {
            select.innerHTML = '<option value="">No Products Found</option>';
            return;
        }

        select.innerHTML = '<option value="">Select water type</option>';
        products.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            const stockInfo = p.stock_quantity > 0 ? `(Stock: ${p.stock_quantity})` : "(Out of Stock)";
            opt.textContent = `${p.name} - ₹${p.price.toFixed(2)} ${stockInfo}`;

            if (p.stock_quantity <= 0) opt.disabled = true;
            select.appendChild(opt);
        });

        isProductsLoaded = true;

    } catch (err) {
        console.error("Failed to load products:", err);
        select.innerHTML = '<option value="">❌ Connection failed</option>';
    }
}

function calculateTotal() {
    const productId = parseInt(document.getElementById('productSelect')?.value);
    const quantity = parseInt(document.getElementById('quantityInput')?.value) || 0;
    const display = document.getElementById('totalPriceDisplay');

    if (!productId || quantity <= 0) {
        if (display) display.innerText = "₹0.00";
        return;
    }

    const product = productList.find(p => p.id === productId);
    if (product && display) {
        const total = product.price * quantity;
        display.innerText = "₹" + total.toFixed(2);
    }
}

document.getElementById('orderBtn')?.addEventListener('click', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access_token');
    if (!token) {
        alert('Please login first');
        window.location.href = '../pages/login.html';
        return;
    }

    const productId = parseInt(document.getElementById('productSelect')?.value);
    const quantity = parseInt(document.getElementById('quantityInput')?.value);
    const deliveryAddress = document.getElementById('addressInput')?.value.trim();

    if (!productId) {
        alert('Please select a product');
        return;
    }

    if (!quantity || quantity <= 0) {
        alert('Quantity must be greater than 0');
        return;
    }

    if (!deliveryAddress) {
        alert('Please enter a delivery address');
        return;
    }

    const orderData = {
        product_id: productId,
        quantity,
        delivery_address: deliveryAddress,
    };

    console.log("🚀 Placing order with:", {
        url: `${API_BASE_URL}/orders/`,
        data: orderData,
        token_present: !!token
    });

    try {
        const response = await fetch(`${API_BASE_URL}/orders/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });

        const text = await response.text();
        let data;
        try {
            data = text ? JSON.parse(text) : {};
        } catch (e) {
            console.error("Failed to parse response JSON. Raw text:", text);
            data = { detail: "Invalid server response" };
        }

        if (!response.ok) {
            console.error("Order failed with status:", response.status, data);
            if (response.status === 401) {
                alert('❌ Session Expired. Please log out and back in again.');
                return;
            }
            alert('❌ ' + (data.detail || 'Order failed (Status: ' + response.status + ')'));
            return;
        }

        alert('✅ Order Placed Successfully!');
        window.location.href = '../pages/order_success.html?order_id=' + (data.id || '');
    } catch (error) {
        console.error('Fetch error:', error);
        alert(`❌ Connection Error. \nIs the backend running at ${API_BASE_URL}?\nError: ${error.message}`);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('productSelect');
    if (select) {
        
        select.addEventListener('focus', loadProductOptions);
        select.addEventListener('change', calculateTotal);
    }

    document.getElementById('quantityInput')?.addEventListener('input', calculateTotal);
});
