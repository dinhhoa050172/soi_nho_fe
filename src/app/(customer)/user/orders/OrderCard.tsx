import { ProductCustom } from "@/types/productCustom";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function OrderCard({
  order,
  index,
  onOpenDetail,
}: {
  order: ProductCustom;
  index: number;
  onOpenDetail: (order: ProductCustom) => void;
}) {
  const imageUrl =
    order.productImages && order.productImages.length > 0
      ? order.productImages[0].url
      : "https://placehold.co/300x300?text=No+Image";

  const getStatusDisplay = (status: string | null) => {
    switch (status) {
      case "COMPLETED":
        return { label: "Hoàn thành", color: "bg-green-100 text-green-800" };
      case "IN_PROGRESS":
        return { label: "Đang thực hiện", color: "bg-blue-100 text-blue-800" };
      case "ACCEPTED":
        return { label: "Đã xác nhận", color: "bg-indigo-100 text-indigo-800" };
      case "PENDING":
        return {
          label: "Chờ xác nhận",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "REJECTED":
        return { label: "Đã hủy", color: "bg-red-100 text-red-800" };
      default:
        return { label: "Đang xử lý", color: "bg-gray-100 text-gray-800" };
    }
  };

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image */}
        <div className="w-full h-60 sm:h-100 lg:w-56 lg:h-80 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={order.characterName}
            className="w-full h-full object-cover rounded-lg border border-gray-200"
            width={300}
            height={400}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            priority={false}
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Header with status and actions */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">
                Đơn hàng #{index}
              </span>
              <Badge className={statusDisplay.color}>
                {statusDisplay.label}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {order.characterName}
            </h3>
          </div>

          {/* Product info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Hình dạng:</span>
                <span className="capitalize">
                  {order.characterDesign.includes(":")
                    ? order.characterDesign.split(":")[1].trim()
                    : order.characterDesign}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Ruler className="w-4 h-4" />
                <span className="font-medium">Kích thước:</span>
                <span>
                  {order.height} × {order.width} × {order.length} cm
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Ngày tạo:</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              {order.price && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Giá:</span>
                  <span className="font-semibold text-gray-900">
                    {order.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          {order.note && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Ghi chú: </span>
                {order.note}
              </p>
            </div>
          )}

          {/* Accessories */}
          {order.accessory && order.accessory.length > 0 && (
            <div className="flex flex-row">
              <span className="text-sm font-medium text-gray-700 mr-2">
                Phụ kiện:
              </span>
              <div className="flex flex-wrap gap-2">
                {order.accessory.map((accessory, i) => {
                  const [type, name, ...rest] = accessory.split(":");
                  const color = rest.pop();

                  let displayName = name;
                  let displayType = type;

                  // Xử lý loại phụ kiện (type)
                  switch (type) {
                    case "head":
                      displayType = "Cài đầu";
                      break;
                    case "neck":
                      displayType = "Đeo cổ";
                      break;
                    case "sideFlowers":
                      displayType = "Cài hoa";
                      break;
                    default:
                      displayType = type;
                  }

                  // Xử lý tên phụ kiện (name)
                  switch (name) {
                    // Phụ kiện đầu
                    case "bow":
                      displayName = "Nơ";
                      break;
                    case "one-ear-bow":
                      displayName = "Nơ một tai";
                      break;
                    case "flower-one-side":
                      displayName = "Hoa một bên";
                      break;
                    case "flower-both-sides":
                      displayName = "Hoa hai bên";
                      break;
                    case "custom":
                      displayName = rest[0] || "Tùy chỉnh";
                      break;

                    // Phụ kiện cổ
                    case "ribbon":
                      displayName = "Dải ruy băng";
                      break;
                    case "flower-necklace":
                      displayName = "Vòng cổ hoa";
                      break;
                    case "bell":
                      displayName = "Chuông";
                      break;

                    // Hoa bên
                    case "left":
                      displayName = "Trái";
                      break;
                    case "right":
                      displayName = "Phải";
                      break;
                    case "both":
                      displayName = "Cả hai bên";
                      break;

                    default:
                      displayName = name.replace(/-/g, " ");
                  }

                  return (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs flex items-center gap-1"
                    >
                      {color && (
                        <div
                          className="w-2 h-2 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      )}
                      {displayType}: {displayName}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenDetail(order)}
              className="w-full sm:w-auto cursor-pointer"
            >
              Xem chi tiết
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
