import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Chatbot from "./components/Chatbot.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import AdminPortal from "./pages/AdminPortal.jsx";
import seedProducts from "./data/seedProducts.js";

const API_URL = "http://localhost:3001/products";
const JSON_HEADERS = { "Content-Type": "application/json" };

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  // Data fetching: load products once when the app mounts.
  useEffect(() => {
    let cancelled = false;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) {
          setProducts(seedProducts);
          setOffline(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function addProduct(newProduct) {
    if (offline) {
      setProducts((prev) => [...prev, { ...newProduct, id: Date.now() }]);
      return;
    }
    const res = await fetch(API_URL, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(newProduct),
    });
    if (!res.ok) throw new Error("Could not add product");
    const saved = await res.json();
    setProducts((prev) => [...prev, saved]);
  }

  async function updateProduct(id, changes) {
    if (!offline) {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: JSON_HEADERS,
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Could not update product");
      const saved = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? saved : p)));
      return;
    }
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }

  async function deleteProduct(id) {
    if (!offline) {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete product");
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="app">
      <NavBar />
      {offline && (
        <p className="banner" role="status">
          Product server not found. Showing sample data; changes will reset when you refresh.
          Run <code>npm run server</code> to save changes.
        </p>
      )}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop products={products} loading={loading} />} />
          <Route
            path="/admin"
            element={
              <AdminPortal
                products={products}
                loading={loading}
                onAdd={addProduct}
                onUpdate={updateProduct}
                onDelete={deleteProduct}
              />
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Chatbot products={products} />
    </div>
  );
}
