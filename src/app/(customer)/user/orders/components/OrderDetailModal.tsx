"use client";

import { ProductCustom } from "@/types/productCustom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Box,
  Ruler,
  FileText,
  Image as ImageIcon,
  XCircle,
  Package,
  Palette,
  MessageSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderDetailModalProps {
  order: ProductCustom | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
}: OrderDetailModalProps) {
  if (!order) return null;

  const renderAccessory = (accessory: string) => {
    const [type, name, ...rest] = accessory.split(":");
    const color = rest.pop(); // Lấy màu cuối cùng

    // Xử lý tên phụ kiện
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
      <div
        key={accessory}
        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
      >
        <div
          className="w-5 h-5 rounded-full border"
          style={{ backgroundColor: color || "#000000" }}
        />
        <div className="flex-1">
          <p className="font-medium">{displayType}</p>
          <p className="text-sm text-gray-500">{displayName}</p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span>Chi tiết đơn hàng #{order.id}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin sản phẩm */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                <span>Thông tin sản phẩm</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium w-24">Tên nhân vật:</span>
                  <Badge variant="outline" className="text-base">
                    {order.characterName}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium w-24">Hình dạng:</span>
                  <Badge variant="outline" className="capitalize">
                    {order.characterDesign.includes(":")
                      ? order.characterDesign.split(":")[1].trim()
                      : order.characterDesign}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="flex items-center gap-2 font-medium">
                  <Ruler className="h-4 w-4" />
                  Kích thước
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-500">Chiều cao</span>
                    <span className="font-medium">{order.height} cm</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-500">Chiều rộng</span>
                    <span className="font-medium">{order.width} cm</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-500">Chiều dài</span>
                    <span className="font-medium">{order.length} cm</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phụ kiện và hình ảnh */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  <span>Phụ kiện</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.accessory?.length > 0 ? (
                  <div className="space-y-2">
                    {order.accessory.map(renderAccessory)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                    <XCircle className="h-8 w-8 mb-2" />
                    <p>Không có phụ kiện</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Ghi chú</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.note ? (
              <div className="rounded-lg max-h-60 overflow-y-auto whitespace-pre-line text-sm leading-relaxed">
                {order.note}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <FileText className="h-8 w-8 mb-2" />
                <p>Không có ghi chú</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hình ảnh */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <span>Hình ảnh mô tả sản phẩm</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {order.productImages?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {order.productImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square border rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={image.url}
                      alt="Product image"
                      className="object-cover transition-transform group-hover:scale-105"
                      width={1000}
                      height={1000}
                    />
                    {image.isThumbnail && (
                      <Badge className="absolute top-2 left-2">Ảnh chính</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <ImageIcon className="h-8 w-8 mb-2" />
                <p>Không có hình ảnh</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Xác nhận
          </Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
