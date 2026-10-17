import { useState } from "react";
import ProductRow from "../components/ProductRow.jsx";
import { validateProduct } from "../utils/validateProduct.js";

const EMPTY_FORM = { name: "", description: "", origin: "", price: "" };

export default function AdminPortal({ products, loading, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validateProduct(form);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    setSubmitting(true);
    try {
      await onAdd({
        name: form.name.trim(),
        description: form.description.trim(),
        origin: form.origin.trim(),
        price: Number(form.price),
      });
      setForm(EMPTY_FORM);
      setStatus("Product added. It now appears in the shop.");
    } catch (err) {
      setStatus("Something went wrong while adding the product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fields = [
    { name: "name", label: "Coffee Name", type: "text", placeholder: "Type here" },
    { name: "description", label: "Description", type: "text", placeholder: "Type here" },
    { name: "origin", label: "Origin", type: "text", placeholder: "Type here" },
    { name: "price", label: "Price", type: "number", placeholder: "0.00" },
  ];

  return (
    <div className="admin">
      <form className="admin-form" onSubmit={handleSubmit} noValidate>
        <h2>Add a product</h2>
        {fields.map((f) => (
          <div className="form-field" key={f.name}>
            <label htmlFor={f.name}>{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              step={f.type === "number" ? "0.01" : undefined}
              min={f.type === "number" ? "0" : undefined}
              placeholder={f.placeholder}
              value={form[f.name]}
              onChange={handleChange}
              className={errors[f.name] ? "input-error" : ""}
              aria-invalid={errors[f.name] ? "true" : "false"}
              aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
            />
            {errors[f.name] && (
              <p className="error-text" id={`${f.name}-error`}>
                {errors[f.name]}
              </p>
            )}
          </div>
        ))}
        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting ? "Adding..." : "Submit"}
        </button>
        {status && (
          <p className="status-text" role="status">
            {status}
          </p>
        )}
      </form>

      <section className="manage">
        <h2>Manage products</h2>
        {loading && <p className="message">Loading products...</p>}
        {!loading && products.length === 0 && (
          <p className="message">No products yet. Add your first coffee using the form.</p>
        )}
        <ul className="manage-list">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
