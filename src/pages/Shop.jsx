import { useState } from "react";
import ProductCard from "../components/ProductCard.jsx";

export default function Shop({ products, loading }) {
  const [search, setSearch] = useState("");
  const [selectedOrigins, setSelectedOrigins] = useState([]);

  // Build the list of locations from the product data.
  const origins = [...new Set(products.map((p) => p.origin))].sort();

  function toggleOrigin(origin) {
    setSelectedOrigins((prev) =>
      prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]
    );
  }

  const query = search.trim().toLowerCase();
  const visibleProducts = products.filter((p) => {
    const matchesSearch =
      query === "" ||
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.origin.toLowerCase().includes(query);
    const matchesOrigin = selectedOrigins.length === 0 || selectedOrigins.includes(p.origin);
    return matchesSearch && matchesOrigin;
  });

  return (
    <div className="shop">
      <aside className="sidebar">
        <label htmlFor="search" className="visually-hidden">
          Search coffees
        </label>
        <input
          id="search"
          type="search"
          className="search-input"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <fieldset className="location-filter">
          <legend className="visually-hidden">Filter by location</legend>
          {origins.map((origin) => (
            <label key={origin} className="location-option">
              <input
                type="checkbox"
                checked={selectedOrigins.includes(origin)}
                onChange={() => toggleOrigin(origin)}
              />
              {origin}
            </label>
          ))}
        </fieldset>
      </aside>

      <section className="product-grid" aria-live="polite">
        {loading && <p className="message">Loading coffees...</p>}
        {!loading && visibleProducts.length === 0 && (
          <p className="message">No coffees match your search. Try a different name or location.</p>
        )}
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
