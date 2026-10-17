import { useState } from "react";
import { validateProduct } from "../utils/validateProduct.js";

export default function ProductRow({ product, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({
    name: product.name,
    description: product.description,
    origin: product.origin,
    price: String(product.price),
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function startEditing() {
    setValues({
      name: product.name,
      description: product.description,
      origin: product.origin,
      price: String(product.price),
    });
    setError("");
    setEditing(true);
  }

  async function handleSave() {
    const foundErrors = validateProduct(values);
    const firstError = Object.values(foundErrors)[0];
    if (firstError) {
      setError(firstError);
      return;
    }
    setSaving(true);
    try {
      await onUpdate(product.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        origin: values.origin.trim(),
        price: Number(values.price),
      });
      setEditing(false);
      setError("");
    } catch (err) {
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await onDelete(product.id);
    } catch (err) {
      setError("Could not delete the product. Please try again.");
    }
  }

  if (!editing) {
    return (
      <li className="manage-row">
        <div className="manage-info">
          <strong>{product.name}</strong>
          <span>
            {product.origin} · ${Number(product.price).toFixed(2)}
          </span>
          {error && <span className="error-text">{error}</span>}
        </div>
        <div className="manage-actions">
          <button type="button" className="small-button" onClick={startEditing}>
            Edit
          </button>
          <button type="button" className="small-button danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="manage-row editing">
      <div className="edit-fields">
        <input name="name" aria-label="Coffee name" value={values.name} onChange={handleChange} />
        <input
          name="description"
          aria-label="Description"
          value={values.description}
          onChange={handleChange}
        />
        <input name="origin" aria-label="Origin" value={values.origin} onChange={handleChange} />
        <input
          name="price"
          aria-label="Price"
          type="number"
          step="0.01"
          min="0"
          value={values.price}
          onChange={handleChange}
        />
        {error && <span className="error-text">{error}</span>}
      </div>
      <div className="manage-actions">
        <button type="button" className="small-button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" className="small-button" onClick={() => setEditing(false)}>
          Cancel
        </button>
      </div>
    </li>
  );
}
