"use client";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMiniCart } from "@/context/MiniCartContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCartApi, fetchCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface CarouselProductProps {
  products: Product[];
  title?: string;
}

const CarouselProduct: React.FC<CarouselProductProps> = ({
  products,
  title,
}) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { openMiniCart } = useMiniCart();

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

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full space-y-4 mb-2">
      {title && <h2 className="text-2xl font-bold text-pink-600">{title}</h2>}

      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: true,
        }}
        className="w-full relative group"
      >
        <CarouselContent className="-ml-2">
          {products.map((product) => {
            const image = product.productImages?.[0];
            const isDisabled = !product.isActive || product.stockQty === 0;
            let statusLabel = "";
            if (!product.isActive) {
              statusLabel = "Tạm ngừng bán";
            } else if (product.stockQty === 0) {
              statusLabel = "Hết hàng";
            }
            return (
              <CarouselItem
                key={product.id}
                className="
            basis-full
            sm:basis-1/2
            md:basis-1/3
            lg:basis-1/4
            pl-2
          "
              >
                <div className="h-full">
                  <div
                    className={`border rounded-2xl overflow-hidden shadow hover:shadow-lg transition relative h-full flex flex-col ${
                      isDisabled
                        ? "opacity-80 cursor-pointer"
                        : "cursor-pointer hover:border-pink-500"
                    }`}
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-grow"
                    >
                      <div className="relative w-full aspect-square min-h-[180px] sm:min-h-[220px] md:min-h-[240px]">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={product.name}
                            className={`object-cover w-full h-full ${
                              isDisabled ? "opacity-70" : ""
                            }`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                      <div className="px-2 md:px-4 pb-2">
                        <h2 className="text-base md:text-lg font-semibold mb-1 truncate">
                          {product.name}
                        </h2>
                      </div>
                    </Link>
                    <div className="px-2 md:px-4 pb-2 pt-0 flex justify-between items-center gap-2">
                      <p className="text-pink-600 font-bold text-base md:text-lg">
                        {formatCurrency(Number(product.price))}
                      </p>
                      <Button
                        className="bg-pink-600 text-white rounded-md hover:bg-pink-700 transition text-xs md:text-sm cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          AddToCart(product, 1);
                        }}
                        disabled={isDisabled}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sx:inline">Thêm vào giỏ</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Nút điều hướng nhỏ hơn trên mobile */}
        <CarouselPrevious className="left-1 sm:left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white w-8 h-8 sm:w-10 sm:h-10" />
        <CarouselNext className="right-1 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white w-8 h-8 sm:w-10 sm:h-10" />
      </Carousel>
    </div>
  );
};

export default CarouselProduct;
