"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import Modal from "./Modal";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string | null;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  open,
  onOpenChange,
  slug,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [mainImgIdx, setMainImgIdx] = useState(0);

  useEffect(() => {
    if (open && slug) {
      setLoading(true);
      fetch(`/api/users/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data || null);
          setMainImgIdx(0);
        })
        .catch(() => setProduct(null))
        .finally(() => setLoading(false));
    } else {
      setProduct(null);
      setMainImgIdx(0);
    }
  }, [open, slug]);

  if (!open) return null;

  return (
    <Modal>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "p-0 bg-white",
            "!max-w-[1100px] !w-[1100px] max-h-[80vh] overflow-y-hidden"
          )}
        >
          <DialogHeader className="border-b px-6 py-4 bg-pink-50">
            <DialogTitle className="text-2xl font-bold text-pink-700">
              Chi tiết sản phẩm
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row gap-8 p-6 bg-white min-h-[320px]">
            <div className="flex-shrink-0 w-full md:w-1/2 flex flex-col items-center justify-center gap-2">
              {loading ? (
                <div className="w-[260px] h-[260px] flex items-center justify-center">
                  Đang tải...
                </div>
              ) : product &&
                product.productImages &&
                product.productImages.length > 0 ? (
                <div className="w-full flex flex-col items-center">
                  <div className="w-[260px] h-[260px] relative mb-2">
                    <Image
                      src={product.productImages[mainImgIdx].url}
                      alt={product.name}
                      fill
                      className="rounded-lg object-cover border shadow"
                    />
                  </div>
                  <div className="w-full mt-2">
                    <Carousel
                      opts={{
                        align: "start",
                        slidesToScroll: 5,
                      }}
                      className="w-full relative group"
                    >
                      <CarouselContent className="-ml-1">
                        {product.productImages.map((img, idx) => (
                          <CarouselItem
                            key={img.id || idx}
                            className="basis-1/5 pl-1"
                          >
                            <button
                              className={`w-full h-30 relative border rounded overflow-hidden ${
                                mainImgIdx === idx ? "ring-2 ring-pink-500" : ""
                              }`}
                              onClick={() => setMainImgIdx(idx)}
                              tabIndex={0}
                            >
                              <Image
                                src={img.url}
                                alt={product.name + "-thumb-" + idx}
                                fill
                                className="object-cover"
                              />
                            </button>
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
                </div>
              ) : (
                <div className="w-[260px] h-[260px] bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              {loading ? (
                <div>Đang tải chi tiết sản phẩm...</div>
              ) : product ? (
                <>
                  <h2 className="text-xl font-bold mb-2 text-pink-700">
                    {product.name}
                  </h2>
                  <p>
                    <span className="font-semibold">Giá:</span>{" "}
                    <span className="text-pink-600 font-bold">
                      {formatCurrency(product.price)}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Mô tả:</span>{" "}
                    <span className="text-gray-700">{product.description}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <p>
                      <span className="font-semibold">Danh mục:</span>{" "}
                      {product.categoryName}
                    </p>
                    <p>
                      <span className="font-semibold">Chất liệu:</span>{" "}
                      {product.materialName}
                    </p>
                    <p>
                      <span className="font-semibold">Kích thước:</span>{" "}
                      {product.length} x {product.width} x {product.height} cm
                    </p>
                    <p>
                      <span className="font-semibold">Số lượng tồn kho:</span>{" "}
                      {product.stockQty}
                    </p>
                    <p>
                      <span className="font-semibold">Trạng thái:</span>{" "}
                      <span
                        className={
                          product.isActive ? "text-green-600" : "text-red-500"
                        }
                      >
                        {product.isActive ? "Kích hoạt" : "Tạm ngưng"}
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <div>Không tìm thấy sản phẩm.</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Modal>
  );
};

export default ProductDetailModal;
