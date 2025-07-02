function loadProducts() {
  let products = JSON.parse(localStorage.getItem('products')) || [];
  const container = document.getElementById('products') || document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';

  // الترتيب: المثبت أولًا، ثم الأحدث
  products.sort((a, b) => {
    if (b.pinned !== a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
    return new Date(b.date) - new Date(a.date);
  });

  products.forEach((product, index) => {
    const productBox = document.createElement('div');
    productBox.className = 'product';
    productBox.innerHTML = `
      <img src="${product.image}" alt="صورة المنتج" />
      <h2>${product.name}</h2>
      ${product.description ? `<p>${product.description}</p>` : ''}
      <small style="display:block; margin-top:5px; color:#888;">أضيف بتاريخ: ${product.date}</small>
      <span class="price">${product.price} ${product.currency}</span>
      ${container.id === 'product-list' ? `
        <button onclick="deleteProduct(${index})">🗑 حذف</button>
        <button onclick="togglePin(${index})">${product.pinned ? '📌 مثبت' : '📍 تثبيت'}</button>
      ` : ''}
    `;
    container.appendChild(productBox);
  });
}

function deleteProduct(index) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  loadProducts();
}

function togglePin(index) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  products[index].pinned = !products[index].pinned;
  localStorage.setItem('products', JSON.stringify(products));
  loadProducts();
}

function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');
  if (!form) {
    loadProducts();
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const currency = document.getElementById('product-currency').value;
    const imageFile = document.getElementById('product-image').files[0];

    if (!imageFile) return alert('يرجى اختيار صورة للمنتج');

    const imageBase64 = await readImageAsBase64(imageFile);
    const newProduct = {
      name,
      description,
      price,
      currency,
      image: imageBase64,
      date: new Date().toLocaleDateString('ar-EG'),
      pinned: false
    };

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    form.reset();
    loadProducts();
  });

  loadProducts();
});
