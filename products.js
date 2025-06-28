// تحميل وعرض المنتجات في الصفحة الرئيسية أو لوحة التحكم
function loadProducts() {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const container = document.getElementById('products') || document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';
  products.forEach((product, index) => {
    const productBox = document.createElement('div');
    productBox.className = 'product';
    productBox.innerHTML = `
      <img src="${product.image}" alt="صورة المنتج" />
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <span class="price">${product.price} ريال</span>
      ${container.id === 'product-list' ? `<button onclick="deleteProduct(${index})">🗑 حذف</button>` : ''}
    `;
    container.appendChild(productBox);
  });
}

// حذف منتج
function deleteProduct(index) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  loadProducts();
}

// تحويل الصورة من الملف إلى base64
function readImageAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// إضافة منتج جديد
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');
  if (!form) {
    loadProducts(); // إذا لم تكن لوحة التحكم، فقط عرض المنتجات
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const imageFile = document.getElementById('product-image').files[0];

    if (!imageFile) return alert('يرجى اختيار صورة للمنتج');

    const imageBase64 = await readImageAsBase64(imageFile);

    const newProduct = { name, description, price, image: imageBase64 };

    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));

    form.reset();
    loadProducts();
  });

  loadProducts(); // عرض المنتجات الحالية عند الدخول
});
