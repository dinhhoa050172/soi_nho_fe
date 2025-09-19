import { Address, Province, District, Ward } from "@/types/address";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressFormProps {
  currentAddress: Partial<Address>;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  selectedProvince: string;
  selectedDistrict: string;
  selectedWard: string;
  isEditing: boolean;
  isSubmitting: boolean;
  onChange: (field: keyof Address, value: Address[keyof Address]) => void;
  onProvinceChange: (provinceCode: string) => void;
  onDistrictChange: (districtCode: string) => void;
  onWardChange: (wardCode: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function AddressForm({
  currentAddress,
  provinces,
  districts,
  wards,
  selectedProvince,
  selectedDistrict,
  selectedWard,
  isEditing,
  isSubmitting,
  onChange,
  onProvinceChange,
  onDistrictChange,
  onWardChange,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 mt-10">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h2 className="font-bold text-lg mb-4">
          {isEditing ? "Chỉnh sửa địa chỉ" : "Tạo địa chỉ mới"}
        </h2>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label className="mb-2">Họ và tên</Label>
            <Input
              value={currentAddress.fullName || ""}
              onChange={(e) => onChange("fullName", e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="mb-2">Số điện thoại</Label>
            <Input
              value={currentAddress.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              required
              pattern="^0\d{9}$"
              title="Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"
            />
          </div>
          <div>
            <Label className="mb-2">Mã bưu chính</Label>
            <Input
              value={currentAddress.postalCode || ""}
              onChange={(e) => onChange("postalCode", e.target.value)}
              pattern="^\d{5,6}$"
              title="Mã bưu chính phải là 5-6 chữ số"
            />
          </div>
          <div>
            <Label className="mb-2">Quốc gia</Label>
            <Input
              value={currentAddress.country || "Việt Nam"}
              onChange={(e) => onChange("country", e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="mb-2">Tỉnh/Thành phố</Label>
            <Select value={selectedProvince} onValueChange={onProvinceChange}>
              <SelectTrigger className="w-full border rounded px-2 py-2">
                <SelectValue placeholder="Chọn tỉnh/thành" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((p) => (
                  <SelectItem key={p.code} value={String(p.code)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Quận/Huyện</Label>
            <Select
              value={selectedDistrict}
              onValueChange={onDistrictChange}
            >
              <SelectTrigger className="w-full border rounded px-2 py-2">
                <SelectValue placeholder="Chọn quán/huyện" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d.code} value={String(d.code)}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2">Phường/Xã</Label>
            <Select
              value={selectedWard}
              onValueChange={onWardChange}
            >
              <SelectTrigger className="w-full border rounded px-2 py-2">
                <SelectValue placeholder="Chọn phường/xã" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((w) => (
                  <SelectItem key={w.code} value={String(w.code)}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label className="mb-2">Địa chỉ (Số nhà, tên đường)</Label>
            <Input
              value={currentAddress.street || ""}
              onChange={(e) => onChange("street", e.target.value)}
              required
            />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentAddress.isDefault || false}
              onChange={(e) => onChange("isDefault", e.target.checked)}
              id="isDefault"
              className="cursor-pointer"
            />
            <Label htmlFor="isDefault">Đặt làm mặc định</Label>
          </div>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={onCancel}
            type="button"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isEditing
              ? "Cập nhật"
              : "Lưu địa chỉ"}
          </Button>
        </form>
      </div>
    </div>
  );
}
