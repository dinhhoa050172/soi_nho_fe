export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  price: number;
  height: number;
  width: number;
  length: number;
  stockQty: number;
  description: string;
  categoryName: string;
  materialName: string;
  isActive: boolean;
  productImages: ProductImage[];
}

export interface ProductCreate extends Product {
  id: string;
  name: string;
  price: number;
  height: number;
  width: number;
  length: number;
  stockQty: number;
  description: string;
  categoryId: string;
  materialId: string;
  productImages: ProductImage[];
}

export interface ProductImage {
  id: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  isThumbnail: boolean;
  productId: string;
}

export interface Material {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  unit: string;
  stockQty: 50;
  thresholdQty: 10;
  price: null;
  description: null;
  isActive: boolean;
}
