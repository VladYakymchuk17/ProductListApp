import { Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductView from "./components/ProductView";
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Shop App</h1>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductView />} />
      </Routes>
    </div>
  );
}

export default App;
