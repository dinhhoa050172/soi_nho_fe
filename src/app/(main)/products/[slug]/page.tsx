"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCartApi, fetchCart } from "@/store/slices/cartSlice";
import { Label } from "@/components/ui/label";
import { useMiniCart } from "@/context/MiniCartContext";
import asset_Image from "@/asset";
import CarouselProduct from "@/components/CarouselProduct";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { openMiniCart } = useMiniCart();
  const user = useAppSelector((state) => state.user.user);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const getProduct = async (slug: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/users/products/${slug}`
      );
      if (!res.ok) throw new Error("Không tìm thấy sản phẩm");

      const data = await res.json();
      return data || null;
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProduct(slug);
      if (productData) {
        setProduct(productData);
        setMainImage(productData.productImages?.[0]?.url || "");
      }
    };

    fetchProduct();
  }, [slug]);

  const getRelatedProducts = async (
    categoryName: string,
    excludeId: string
  ) => {
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || ""
        }/api/products?category_name=${encodeURIComponent(
          categoryName
        )}&limit=8`
      );
      if (!res.ok) throw new Error("Không thể lấy sản phẩm liên quan");
      const data = await res.json();
      const filtered = (data?.data || data)?.filter(
        (p: Product) => p.id !== excludeId
      );
      setRelatedProducts(filtered || []);
    } catch {
      setRelatedProducts([]);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProduct(slug);
      if (productData) {
        setProduct(productData);
        setMainImage(productData.productImages?.[0]?.url || "");
        if (productData.categoryName && productData.id) {
          getRelatedProducts(productData.categoryName, productData.id);
        }
      }
    };
    fetchProduct();
  }, [slug]);

  const AddToCart = async (productId: string | undefined, quantity: number) => {
    if (!user?.id) {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      router.push("/login");
      return;
    }

    if (user.roleName !== "Customer") {
      toast.error("Bạn không có quyền thêm vào giỏ hàng!");
      return;
    }

    if (!product || !productId) return;

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
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm vào giỏ hàng!");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="relative max-w-6xl mx-auto px-2 sm:px-4 md:px-6 py-4">
        <div className="flex absolute left-2 sm:left-4 top-4 z-10 md:ml-2">
          <Button
            variant="outline"
            size="sm"
            className="w-fit bg-white hover:bg-gray-50 cursor-pointer"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline">Quay lại</span>
          </Button>
        </div>
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center text-pink-600 mt-2 sm:mt-0 absolute inset-x-0 top-4 z-0">
          Thông tin sản phẩm
        </h2>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8">
        {/* Ảnh sản phẩm */}
        <div>
          <div className="w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[500px] relative border rounded-md overflow-hidden bg-white">
            {mainImage && (
              <Image
                src={mainImage}
                alt={product?.name || "Product Image"}
                fill
                className="object-contain p-2 sm:p-4"
                loading="eager"
              />
            )}
          </div>
          {/* Thumbnail carousel */}
          <div className="mt-4">
            {product?.productImages && product.productImages.length > 0 && (
              <div className="overflow-x-auto">
                <Carousel
                  opts={{
                    align: "start",
                    slidesToScroll: 5,
                  }}
                  className="w-full relative group"
                >
                  <CarouselContent className="-ml-1 my-1 flex-nowrap">
                    {product.productImages.map((img, index) => (
                      <CarouselItem
                        key={index}
                        className="min-w-[64px] sm:min-w-[80px] basis-auto"
                      >
                        <div
                          className={`w-16 h-16 sm:w-20 sm:h-20 border rounded-md overflow-hidden cursor-pointer ${
                            mainImage === img.url ? "ring-2 ring-pink-500" : ""
                          }`}
                          onClick={() => setMainImage(img.url)}
                        >
                          <Image
                            src={img.url}
                            alt={`Thumb ${index}`}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                            loading="eager"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {product.productImages.length > 5 && (
                    <>
                      <CarouselPrevious className="left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white" />
                      <CarouselNext className="right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white" />
                    </>
                  )}
                </Carousel>
              </div>
            )}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <Card className="shadow-lg hover:shadow-xl transition-shadow min-h-[320px]">
            <CardContent className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-pink-600">
                {product?.name}
              </CardTitle>
              <p className="text-gray-700 text-base sm:text-lg mb-2">
                Giá:{" "}
                <span className="text-pink-600 font-semibold">
                  {formatCurrency(Number(product?.price || 0))}
                </span>
              </p>
              {product?.categoryName && (
                <p className="text-gray-600 mb-2">
                  Danh mục:{" "}
                  <span className="font-semibold">{product.categoryName}</span>
                </p>
              )}
              {product?.materialName && (
                <p className="text-gray-600 mb-4">
                  Chất liệu:{" "}
                  <span className="font-semibold">{product.materialName}</span>
                </p>
              )}

              {/* Số lượng */}
              <div className="mb-4 flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700 block mb-2">
                  Số lượng
                </Label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-r-none cursor-pointer"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="h-8 w-12 rounded-none text-center border-x-0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-l-none cursor-pointer"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              {/* Nút mua */}
              {product?.isActive && product?.stockQty !== 0 ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className="flex-1 h-10 sm:h-12 cursor-pointer"
                    disabled={!product?.isActive || product?.stockQty === 0}
                    onClick={() => AddToCart(product?.id, quantity)}
                  >
                    <Plus className="mr-2" />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    className="flex-1 h-10 sm:h-12 cursor-pointer"
                    disabled={!product?.isActive || product?.stockQty === 0}
                    onClick={() =>
                      router.push(
                        `/checkout?buyNow=1&productId=${product?.id}&quantity=${quantity}`
                      )
                    }
                  >
                    Mua ngay
                  </Button>
                </div>
              ) : (
                <p className="text-red-600 font-semibold mt-2">
                  Sản phẩm tạm hết hàng
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Giới thiệu */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 mt-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-pink-600 border-b pb-2">
            Giới thiệu
          </h3>
          <div className="prose max-w-none text-gray-700">
            <p className="whitespace-pre-line leading-relaxed">
              {product?.description}
            </p>
          </div>
        </div>

        {/* Hướng dẫn bảo quản */}
        <div className="w-full h-[180px] sm:h-[220px] md:h-[320px] mt-6 relative rounded-xl overflow-hidden">
          <Image
            src={asset_Image.huongdanbaoquan}
            alt="Cách bảo quản đồ len"
            fill
            className="object-contain"
            sizes="100vw"
            priority={false}
          />
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 mt-8">
        <h3 className="text-lg sm:text-2xl font-bold text-left text-pink-600 mb-4 sm:mb-6">
          Sản phẩm liên quan
        </h3>
        {relatedProducts.length > 0 ? (
          <CarouselProduct products={relatedProducts} />
        ) : (
          <div className="text-gray-500">Không có sản phẩm liên quan</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
