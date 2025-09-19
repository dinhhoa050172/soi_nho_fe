import { Address } from "@/types/address";
import { Button } from "@/components/ui/button";

interface AddressListProps {
  addresses: Address[];
  selectedAddress: Address | null;
  onSelect: (addr: Address) => void;
  onEdit: (addr: Address) => void;
  renderDeleteButton: (id: string) => React.ReactNode;
  onAddNew: () => void;
  onClose: () => void;
}

export default function AddressList({
  addresses,
  selectedAddress,
  onSelect,
  onEdit,
  renderDeleteButton,
  onAddNew,
  onClose,
}: AddressListProps) {
  return (
    <div
      className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] flex flex-col relative"
      style={{ minHeight: 400 }}
    >
      <h2 className="font-bold text-lg mb-4">Chọn địa chỉ giao hàng</h2>
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className={`p-4 border rounded ${
                selectedAddress?.id === addr.id
                  ? "border-pink-600 bg-pink-50"
                  : ""
              }`}
            >
              <div className="flex justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelect(addr)}
                >
                  <div className="font-medium">
                    {addr.fullName} - {addr.phone}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="text-sm">
                    Địa chỉ: {addr.street}, {addr.ward}, {addr.district},{" "}
                    {addr.province}, {addr.country}
                  </div>
                  <div className="text-sm">Mã bưu chính: {addr.postalCode}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => onEdit(addr)}
                  >
                    Sửa
                  </Button>
                  {!addr.isDefault && renderDeleteButton(addr.id)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-4 flex flex-col gap-2 sticky bottom-0 bg-white">
        <Button className="w-full cursor-pointer" onClick={onAddNew}>
          + Thêm địa chỉ mới
        </Button>
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={onClose}
        >
          Đóng
        </Button>
      </div>
    </div>
  );
}
