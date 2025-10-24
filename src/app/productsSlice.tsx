import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product, Comment, ProductsState } from "../types/type";

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
    setCurrentProduct(state, action: PayloadAction<Product>) {
      state.currentProduct = action.payload;
    },
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state.products[index] = action.payload;
      if (state.currentProduct?.id === action.payload.id)
        state.currentProduct = action.payload;
    },
    removeProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter((p) => p.id !== action.payload);
      if (state.currentProduct?.id === action.payload)
        state.currentProduct = null;
    },
    addComment(state, action: PayloadAction<Comment>) {
      const product = state.products.find(
        (p) => p.id === action.payload.productId
      );
      if (product) product.comments.push(action.payload);
      if (state.currentProduct?.id === action.payload.productId) {
        state.currentProduct.comments.push(action.payload);
      }
    },
    removeComment(
      state,
      action: PayloadAction<{ productId: number; commentId: number }>
    ) {
      const product = state.products.find(
        (p) => p.id === action.payload.productId
      );
      if (product) {
        product.comments = product.comments.filter(
          (c) => c.id !== action.payload.commentId
        );
      }
      if (state.currentProduct?.id === action.payload.productId) {
        state.currentProduct.comments = state.currentProduct.comments.filter(
          (c) => c.id !== action.payload.commentId
        );
      }
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  addProduct,
  updateProduct,
  removeProduct,
  addComment,
  removeComment,
} = productsSlice.actions;

export type RootState = {
  products: ProductsState;
};

export default productsSlice.reducer;
