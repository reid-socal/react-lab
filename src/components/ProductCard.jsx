export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-origin">{product.origin}</p>
      <p className="product-price">${Number(product.price).toFixed(2)}</p>
    </article>
  );
}
