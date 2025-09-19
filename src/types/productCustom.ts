export interface ProductImage {
  id: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  isThumbnail: boolean;
}

export interface ProductCustom {
  id: string;
  characterName: string;
  characterDesign: string;
  height: string;
  width: string;
  length: string;
  note: string;
  accessory: string[];
  isActive: boolean;
  userId: number;
  status: string | null;
  price: number | null;
  productImages: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductCustomResponse {
  count: number;
  limit: number;
  page: number;
  data: ProductCustom[];
}
