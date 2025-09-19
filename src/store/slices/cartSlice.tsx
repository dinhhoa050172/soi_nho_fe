import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api";

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng
export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  productImageUrl?: string;
  slug?: string;
}

export interface AddToCartRequest {
  userId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface UpdateCartRequest {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface RemoveCartItemRequest {
  cartId: string;
  productId: string;
}

export interface CartResponse {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
}

// State của cart
interface CartState {
  items: CartItem[];
  cartId: string | null;
  isLoading: boolean;
  error: string | null;
}

// State khởi tạo
const initialState: CartState = {
  items: [],
  cartId: null,
  isLoading: false,
  error: null,
};

// Thunk: Lấy giỏ hàng
export const fetchCart = createAsyncThunk<CartResponse, string>(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await apiClient.get(`/user/cart/${userId}`);
      return res.data;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Lỗi không thể lấy giỏ hàng");
    }
  }
);

// Thunk: Thêm sản phẩm vào giỏ hàng
export const addToCartApi = createAsyncThunk<CartItem[], AddToCartRequest>(
  "cart/addToCartApi",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/user/cart`, data);
      return res.data.items;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Lỗi không thể thêm sản phẩm vào giỏ hàng");
    }
  }
);

// Thunk: Xóa sản phẩm khỏi giỏ hàng
export const removeFromCartApi = createAsyncThunk<
  CartItem[],
  RemoveCartItemRequest
>(
  "cart/removeFromCartApi",
  async ({ cartId, productId }, { rejectWithValue }) => {
    try {
      const res = await apiClient.delete(`/user/cart`, {
        data: { cartId, productId },
      });
      return res.data.items;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Lỗi không thể xóa sản phẩm khỏi giỏ hàng");
    }
  }
);

// Thunk: Cập nhật số lượng sản phẩm
export const updateCartItemApi = createAsyncThunk<
  CartItem[],
  UpdateCartRequest
>("cart/updateCartItemApi", async (data, { rejectWithValue }) => {
  try {
    const res = await apiClient.put(`/user/cart`, {
      cartId: data.cartId,
      productId: data.productId,
      quantity: data.quantity,
    });
    return res.data.items;
  } catch (err) {
    console.error(err);
    return rejectWithValue("Lỗi không thể cập nhật số lượng");
  }
});

// Thunk: Xóa toàn bộ giỏ hàng
export const clearCartApi = createAsyncThunk<CartItem[], { cartId: string }>(
  "cart/clearCartApi",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      const res = await apiClient.delete(`/user/cart/${cartId}`);
      return res.data.items;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Lỗi không thể xóa giỏ hàng");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Các reducer local nếu muốn thao tác local state
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.cartId = action.payload.id;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCartApi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCartApi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(addToCartApi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCartApi.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Update quantity
      .addCase(updateCartItemApi.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Clear cart
      .addCase(clearCartApi.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
