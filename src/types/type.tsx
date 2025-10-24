export interface Product {
  id: number;
  imageUrl: string;
  name: string;
  count: number;
  size: {
    width: number;
    height: number;
  };
  weight: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  productId: number;
  description: string;
  date: string;
}

export interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
}

export interface CommentListProps {
  productId: number;
  comments: Comment[];
}

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export interface ProductItemProps {
  product: Product;
}
