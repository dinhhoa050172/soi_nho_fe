"use client";

import Loading from "@/components/loading";
import SimplePagination from "@/components/SimplePagination";
import { ProductCustom } from "@/types/productCustom";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import OrderDetailModal from "./components/OrderDetailModal";
import { Package } from "lucide-react";
import OrderCard from "./OrderCard";

export default function OrdersPage() {
  const [productsCustom, setProductsCustom] = useState<ProductCustom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const LIMIT = 8;
  const [totalItems, setTotalItems] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<ProductCustom | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const offset = (page - 1) * LIMIT;

  const getProductsCustom = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || ""
        }/api/users/product-custom?offset=${offset}&limit=${LIMIT}`
      );
      const data = await res.json();
      setTotalItems(data.count || 0);
      setProductsCustom(data.data || []);
    } catch (error) {
      console.error(error);
      setProductsCustom([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProductsCustom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.ceil(totalItems / LIMIT);

  const handleOpenDetail = (order: ProductCustom) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-gray-700" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng của bạn
              </h1>
              {totalItems > 0 && (
                <p className="text-gray-600 mt-1">
                  Tổng cộng {totalItems} đơn hàng
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <Card className="p-6 shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="py-12">
              <Loading />
            </div>
          ) : productsCustom.length > 0 ? (
            <>
              <div className="space-y-6">
                {productsCustom.map((order, idx) => (
                  <OrderCard
                    key={order.id || idx}
                    order={order}
                    index={offset + idx + 1}
                    onOpenDetail={handleOpenDetail}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <SimplePagination
                    page={page}
                    onPageChange={setPage}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-600">Bạn chưa có đơn hàng nào được tạo</p>
            </div>
          )}
        </Card>
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
