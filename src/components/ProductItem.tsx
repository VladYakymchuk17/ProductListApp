import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeProduct } from "../app/productsSlice";
import { type ProductItemProps } from "../types/type";
import DeleteModal from "../components/DeleteModal";
import { Link } from "react-router-dom";

const ProductItem = ({ product }: ProductItemProps) => {
  const dispatch = useDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    fetch(`http://localhost:3001/products/${product.id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete product");
        dispatch(removeProduct(product.id));
        setIsDeleteModalOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <li className="product-item">
      <Link to={`/product/${product.id}`}>
        <div className="product-info">
          {product.name} (Count: {product.count})
        </div>
        <img src={product.imageUrl} />
      </Link>
      <button onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          productName={product.name}
        />
      )}
    </li>
  );
};

export default ProductItem;
