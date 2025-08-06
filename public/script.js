document.addEventListener('DOMContentLoaded', async () => {
  const productGrid = document.getElementById('productos');
  try {
    const res = await fetch('/api/products');
    const products = await res.json();
    products.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${p.image}" alt="${p.name}" />
        <h3>${p.name}</h3>
        <p>$${p.price.toFixed(2)}</p>
      `;
      productGrid.appendChild(div);
    });
  } catch (err) {
    productGrid.innerHTML = '<p>Error cargando productos</p>';
  }
});
