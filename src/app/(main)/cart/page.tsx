"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCart,
  removeFromCartApi,
  updateCartItemApi,
  clearCartApi,
} from "@/store/slices/cartSlice";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const SHIPFEE = 20000;

const CartPage = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items || []);
  const [shippingMethod, setShippingMethod] = useState("flat");
  const user = useAppSelector((state) => state.user.user);
  const cartId = useAppSelector((state) => state.cart.cartId);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [user?.id, dispatch]);

  const handleRemove = async (productId: string) => {
    if (cartId && user?.id) {
      await dispatch(removeFromCartApi({ cartId, productId }));
      await dispatch(fetchCart(user.id));
    }
  };

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      toast.error("Số lượng không thể nhỏ hơn 1!");
      return;
    }
    if (!cartId) {
      toast.error("Không tìm thấy giỏ hàng!");
      return;
    }
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập trên trang chủ!");
      return;
    }
    await dispatch(updateCartItemApi({ cartId, productId, quantity }));
    await dispatch(fetchCart(user.id));
  };

  const handleClearCart = async () => {
    if (cartId && user?.id) {
      await dispatch(clearCartApi({ cartId }));
      await dispatch(fetchCart(user.id));
    }
  };

  const handleShippingMethodChange = (val: string) => {
    setShippingMethod(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("shippingMethod", val);
    }
  };

  const shippingFee = shippingMethod === "flat" ? SHIPFEE : 0;
  const subtotal = (cartItems || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingFee;

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6 md:mb-8">
        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">
          Giỏ hàng của bạn
        </h1>
        {cartItems.length > 0 && (
          <Badge className="ml-2 mt-0.5" variant="secondary">
            {cartItems.length} sản phẩm
          </Badge>
        )}
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-8 sm:py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
              <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              <p className="text-base sm:text-lg text-gray-500">
                Giỏ hàng của bạn đang trống
              </p>
              <Button className="mt-2 sm:mt-4" asChild>
                <Link href="/products">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tiếp tục mua sắm
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* LEFT: Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <Card key={item.productId} className="p-2 sm:p-3 md:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1">
                    {item.productImageUrl && (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md overflow-hidden">
                        <Image
                          src={item.productImageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-0.5 sm:space-y-1">
                      <Link
                        href={`/products/${item.productName}`}
                        className="text-pink-600 hover:underline"
                      >
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-pink-600 line-clamp-2">
                          {item.productName}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-1 sm:gap-2 md:gap-3">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-r-none"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </Button>
                      <Input
                        id={`quantity-${item.productId}`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productId,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-10 h-7 sm:w-12 sm:h-8 text-center rounded-none border-x-0 text-xs sm:text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-l-none"
                        onClick={() =>
                          handleQuantityChange(
                            item.productId,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                    <p className="w-16 sm:w-20 md:w-24 text-center font-semibold text-xs sm:text-sm md:text-base text-pink-600">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <ConfirmDeleteModal
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive/80"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      }
                      itemName={item.productName}
                      onConfirm={() => handleRemove(item.productId)}
                    />
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/products">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="text-xs sm:text-sm">Tiếp tục mua hàng</span>
                </Link>
              </Button>
              <ConfirmDeleteModal
                trigger={
                  <Button variant="outline" className="flex-1">
                    <span className="text-xs sm:text-sm">Xóa tất cả</span>
                  </Button>
                }
                title="Xác nhận xóa tất cả"
                description="Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?"
                onConfirm={handleClearCart}
              />
            </div>
          </div>

          {/* RIGHT: Cart Summary */}
          <div className="mt-4 sm:mt-6 lg:mt-0 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <CardTitle className="text-base sm:text-lg md:text-xl text-pink-600">
                  Tổng đơn hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <Separator className="my-2 sm:my-3" />

                <RadioGroup
                  defaultValue="flat"
                  onValueChange={handleShippingMethodChange}
                  className="space-y-2 sm:space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="flat"
                      id="flat"
                      className="cursor-pointer"
                    />
                    <Label htmlFor="flat" className="font-normal text-xs sm:text-sm">
                      Đồng giá: {formatCurrency(SHIPFEE)}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="store"
                      id="store"
                      className="cursor-pointer"
                    />
                    <Label htmlFor="store" className="font-normal text-xs sm:text-sm">
                      Lấy tại cửa hàng: {formatCurrency(0)}
                    </Label>
                  </div>
                </RadioGroup>

                <div className="text-muted-foreground text-xs sm:text-sm">
                  Phí vận chuyển sẽ được cập nhật khi thanh toán.
                </div>

                <Separator className="my-2 sm:my-3" />

                <div className="flex justify-between font-semibold text-sm sm:text-base text-pink-600">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-3 sm:p-4 md:p-6">
                <Link href="/checkout" className="w-full">
                  <Button className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold bg-pink-600 hover:bg-pink-700">
                    Thanh toán
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;