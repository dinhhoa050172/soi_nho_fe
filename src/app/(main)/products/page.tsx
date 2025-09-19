"use client";

import Loading from "@/components/loading";
import SimplePagination from "@/components/SimplePagination";
import { Button } from "@/components/ui/button";
import { useMiniCart } from "@/context/MiniCartContext";
import { formatCurrency } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCartApi, fetchCart } from "@/store/slices/cartSlice";
import { Product } from "@/types/product";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const LIMIT = 12;

export default function ProductPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { openMiniCart } = useMiniCart();

  const offset = (page - 1) * LIMIT;

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products?offset=${offset}&limit=${LIMIT}`
      );
      const data = await response.json();
      setTotalItems(data.count || 0);
      setProducts(data.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const AddToCart = async (product: Product, quantity: number) => {
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
      router.push("/login");
      return;
    }
    if (user.roleName !== "Customer") {
      toast.error("Bạn không có quyền thêm vào giỏ hàng!");
      return;
    }
    if (!product) return;

    try {
      await dispatch(
        addToCartApi({
          userId: user.id,
          productId: product.id,
          quantity,
          price: Number(product.price),
        })
      ).unwrap();
      await dispatch(fetchCart(user.id));
      toast.success("Đã thêm vào giỏ hàng!");
      openMiniCart();
    } catch {
      toast.error("Không thể thêm vào giỏ hàng!");
    }
  };

  useEffect(() => {
    getProducts();
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, user?.id]);

  const totalPages = Math.ceil(totalItems / LIMIT);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="px-2 sm:px-4 md:px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => {
          const image = product.productImages[0];
          const isDisabled = !product.isActive || product.stockQty === 0;
          let statusLabel = "";
          if (!product.isActive) {
            statusLabel = "Tạm ngừng bán";
          } else if (product.stockQty === 0) {
            statusLabel = "Hết hàng";
          }
          return (
            <Link
              href={`/products/${product.slug}`}
              key={product.id}
              className={`border rounded-2xl overflow-hidden shadow hover:shadow-lg transition relative flex flex-col h-full bg-white ${
                isDisabled
                  ? "opacity-80 cursor-pointer"
                  : "cursor-pointer hover:border-pink-500"
              }`}
            >
              <div className="relative w-full h-48 sm:h-56 md:h-60">
                {image ? (
                  <Image
                    src={image.url}
                    alt={product.name}
                    className={`object-cover w-full h-full ${
                      isDisabled ? "opacity-70" : ""
                    }`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black bg-opacity-60 text-white text-sm md:text-lg font-bold px-2 py-1 rounded-lg">
                      {statusLabel}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4 flex flex-col flex-1">
                <h2 className="text-base sm:text-lg font-semibold mb-2 truncate">
                  {product.name}
                </h2>
                <div className="flex flex-col gap-2 mt-auto">
                  <div className="flex justify-between items-center">
                    <p className="text-pink-600 font-bold text-base sm:text-lg">
                      {formatCurrency(product.price)}
                    </p>
                    <Button
                      className="bg-pink-600 text-white rounded-md hover:bg-pink-700 transition text-xs sm:text-sm cursor-pointer px-2 sm:px-4"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        AddToCart(product, 1);
                      }}
                      disabled={isDisabled}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden xs:inline">Thêm vào giỏ</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <SimplePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}