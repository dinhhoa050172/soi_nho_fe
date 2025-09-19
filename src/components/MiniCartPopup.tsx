import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export interface MiniCartItem {
  productId: string;
  productName: string;
  price: number | string;
  quantity: number;
  productImageUrl?: string;
}

export default function MiniCartPopup({
  items,
  onClose,
}: {
  items: MiniCartItem[];
  onClose: () => void;
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="w-80 bg-white rounded-lg shadow-lg border z-50 absolute right-0 top-full mt-2 -translate-x-5">
      <div className="p-4 border-b flex justify-between items-center">
        <span className="font-bold">Giỏ hàng</span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          &times;
        </button>
      </div>
      <div className="p-4 max-h-60 overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center text-gray-500">Giỏ hàng trống</div>
        ) : (
          items.map((item, idx) => (
            <div key={item.productId || idx} className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {item.productImageUrl && (
                  <Image
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-10 h-10 object-cover rounded"
                    width={40}
                    height={40}
                  />
                )}
                <div>
                  <div className="font-medium text-pink-600 truncate max-w-[120px]">
                    {item.productName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.quantity} × {formatCurrency(Number(item.price))}
                  </div>
                </div>
              </div>
              <div className="font-semibold text-pink-600">
                {formatCurrency(Number(item.price) * item.quantity)}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex justify-between mb-2">
          <span>Tổng cộng:</span>
          <span className="font-bold text-pink-600">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <Link href="/cart">
          <Button className="w-full mb-2 cursor-pointer" variant="outline"
          onClick={onClose}>
            Xem giỏ hàng
          </Button>
        </Link>
        <Link href="/checkout">
          <Button className="w-full bg-pink-600 hover:bg-pink-700 cursor-pointer"
          onClick={onClose}>
            Thanh toán
          </Button>
        </Link>
      </div>
    </div>
  );
}