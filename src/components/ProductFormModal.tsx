import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../app/productsSlice";
import { type ProductFormModalProps } from "../types/type";

const ProductFormModal = ({
  isOpen,
  onClose,
  product,
}: ProductFormModalProps) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    imageUrl: product?.imageUrl || "",
    count: product?.count || 0,
    width: product?.size.width || 0,
    height: product?.size.height || 0,
    weight: product?.weight || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      formData.count < 0 ||
      !formData.weight.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    const newProduct = {
      id: product ? product.id : Date.now(),
      name: formData.name,
      imageUrl: formData.imageUrl,
      count: Number(formData.count),
      size: { width: Number(formData.width), height: Number(formData.height) },
      weight: formData.weight,
      comments: product?.comments || [],
    };

    const url = product
      ? `http://localhost:3001/products/${product.id}`
      : "http://localhost:3001/products";
    const method = product ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(`Failed to ${product ? "update" : "add"} product`);
        return res.json();
      })
      .then((data) => {
        dispatch(product ? updateProduct(data) : addProduct(data));
        onClose();
      })
      .catch((err) => alert(err.message));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{product ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Name of a product:
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </label>
          <label>
            Paste image url:
            <input
              type="text"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
          </label>
          <label>
            Count:
            <input
              type="number"
              placeholder="Count"
              value={formData.count}
              onChange={(e) =>
                setFormData({ ...formData, count: Number(e.target.value) })
              }
              required
              min="0"
            />
          </label>
          <label>
            Width:
            <input
              type="number"
              placeholder="Width"
              value={formData.width}
              onChange={(e) =>
                setFormData({ ...formData, width: Number(e.target.value) })
              }
              required
              min="0"
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              placeholder="Height"
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: Number(e.target.value) })
              }
              required
              min="0"
            />
          </label>
          <label>
            Weight:
            <input
              type="text"
              placeholder="Weight (e.g., 200g)"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
              required
            />
          </label>
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
