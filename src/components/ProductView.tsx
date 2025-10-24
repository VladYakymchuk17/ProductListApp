import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setCurrentProduct, type RootState } from "../app/productsSlice";
import ProductFormModal from "./ProductFormModal";
import CommentList from "./CommentList";

const ProductView = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const currentProduct = useSelector(
    (state: RootState) => state.products.currentProduct
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const productId = Number(id);
      if (isNaN(productId)) {
        setError("Invalid product ID");
        return;
      }
      fetch(`http://localhost:3001/products/${productId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch product");
          return res.json();
        })
        .then((data) => dispatch(setCurrentProduct(data)))
        .catch((err) => setError(err.message));
    }
  }, [id, dispatch]);

  if (error) {
    return <p>Error: {error}</p>;
  }
  if (!currentProduct) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="product-view">
      <h2>{currentProduct.name}</h2>
      <p>
        <img
          src={currentProduct.imageUrl || "https://via.placeholder.com/200"}
          alt={currentProduct.name}
        />
      </p>
      <p>Count: {currentProduct.count}</p>
      <p>
        Size: {currentProduct.size.width}x{currentProduct.size.height}
      </p>
      <p>Weight: {currentProduct.weight}</p>
      <button onClick={() => setIsEditModalOpen(true)}>Edit</button>
      <CommentList
        productId={currentProduct.id}
        comments={currentProduct.comments}
      />
      {isEditModalOpen && (
        <ProductFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          product={currentProduct}
        />
      )}
      <button>
        <Link to="/">Back to home page</Link>
      </button>
    </div>
  );
};

export default ProductView;
