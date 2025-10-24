import { useDispatch, useSelector } from "react-redux";
import { setProducts, type RootState } from "../app/productsSlice";
import { useState, useEffect } from "react";
import ProductItem from "./ProductItem";
import ProductFormModal from "./ProductFormModal";
import { Link } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("name");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => dispatch(setProducts(data)))
      .catch((err) => setError(err.message));
  }, [dispatch]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name) || b.count - a.count;
    }
    return b.count - a.count || a.name.localeCompare(b.name);
  });

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="controls">
        <button onClick={() => setIsAddModalOpen(true)}>Add Product</button>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="count">Sort by Count</option>
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      {sortedProducts.length === 0 && <p>No products found.</p>}
      <ul className="product-list-items">
        {sortedProducts.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </ul>
      {isAddModalOpen && (
        <ProductFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          product={null}
        />
      )}
      {sortedProducts.length !== 0 && (
        <Link to="/product/1">View Sample Product</Link>
      )}
    </div>
  );
};

export default ProductList;
