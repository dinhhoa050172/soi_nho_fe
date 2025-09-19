"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Plus } from "lucide-react";
import { addToCartApi, fetchCart } from "@/store/slices/cartSlice";
import { useAppDispatch } from "@/store/hooks";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { useMiniCart } from "@/context/MiniCartContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAppSelector } from "@/store/hooks";

const LIMIT = 8;

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { openMiniCart } = useMiniCart();
  const user = useAppSelector((state) => state.user.user);

  const offset = (page - 1) * LIMIT;

  const getProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || ""
        }/api/products?offset=${offset}&limit=${LIMIT}&category_name=${encodeURIComponent(
          categoryName ?? ""
        )}`
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

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryName]);

  const totalPages = Math.ceil(totalItems / LIMIT);

  const handleCardClick = (productSlug: string) => {
    router.push(`/products/${productSlug}`);
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

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-pink-600">
        Sản phẩm thuộc danh mục: {categoryName}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-gray-500">
            Không có sản phẩm nào.
          </div>
        ) : (
          products.map((product) => {
            const image = product.productImages[0];
            const isDisabled = !product.isActive || product.stockQty === 0;
            let statusLabel = "";
            if (!product.isActive) {
              statusLabel = "Tạm ngừng bán";
            } else if (product.stockQty === 0) {
              statusLabel = "Hết hàng";
            }
            return (
              <div
                key={product.id}
                onClick={() => handleCardClick(product.slug)}
                className={`border rounded-2xl overflow-hidden shadow hover:shadow-lg transition relative ${
                  isDisabled
                    ? "opacity-80 cursor-pointer"
                    : "cursor-pointer hover:border-pink-500"
                }`}
              >
                <div className="relative w-full h-60">
                  {image ? (
                    <Image
                      src={image.url}
                      alt={product.name}
                      className={`object-cover w-full h-60 ${
                        isDisabled ? "opacity-70" : ""
                      }`}
                      width={250}
                      height={250}
                    />
                  ) : (
                    <div className="w-full h-60 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  {isDisabled && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-black bg-opacity-60 text-white text-lg font-bold px-3 py-1 rounded-lg">
                        {statusLabel}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 truncate">
                    {product.name}
                  </h2>
                  <div className="flex justify-between items-center">
                    <p className="text-pink-600 font-bold">
                      {formatCurrency(product.price)}
                    </p>
                    <Button
                      className="bg-pink-600 text-white rounded-md hover:bg-pink-700 transition text-sm cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        AddToCart(product, 1);
                      }}
                      disabled={isDisabled}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 py-2 border rounded">
                  {page} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
