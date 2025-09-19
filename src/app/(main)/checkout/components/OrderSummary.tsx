import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface CartItem {
  productId: string;
  productName: string;
  productImageUrl?: string;
  price?: number;
  quantity?: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  onOrder: (e: React.FormEvent) => void;
}

export default function OrderSummary({
  cartItems,
  subtotal,
  shippingFee,
  total,
  onOrder,
}: OrderSummaryProps) {
  return (
    <div className="h-fit shadow-md rounded-md p-6">
      <div className="font-bold text-lg mb-2">Đơn hàng của bạn</div>
      <div className="mb-2 text-muted-foreground">{cartItems.length} sản phẩm</div>
      {cartItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Giỏ hàng của bạn đang trống</div>
      ) : (
        <>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.productId} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    {item.productImageUrl ? (
                      <Image
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-md"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price ?? 0)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {formatCurrency((item.price ?? 0) * (item.quantity ?? 1))}
                </p>
              </li>
            ))}
          </ul>
          <Separator className="my-6" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phí vận chuyển</span>
              <span>{formatCurrency(shippingFee)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
          <Button type="submit" className="w-full mt-6 cursor-pointer bg-pink-600 hover:bg-pink-700" size="lg" onClick={onOrder}>
            Đặt hàng
          </Button>
        </>
      )}
    </div>
  );
}
