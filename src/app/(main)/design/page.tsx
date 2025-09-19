"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadMultipleFileImage from "@/components/UploadMultipleFileImage";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  designFormSchema,
  DesignFormValues,
} from "@/schemaValidations/productCustom.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export default function Design() {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  const form = useForm<DesignFormValues>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      characterName: "",
      characterDesignType: "Gấu",
      characterDesignCustomNote: "",
      height: "",
      width: "",
      length: "",
      note: "",
      materialIds: [],
      images: [],
      accessories: {
        head: "none",
        headCustomNote: "",
        headColor: "#ff6b6b",
        neck: "none",
        neckCustomNote: "",
        neckColor: "#4ecdc4",
        sideFlowers: "none",
        color: "#45b7d1",
      },
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;
  const accessories = watch("accessories");
  const characterDesignType = watch("characterDesignType");

  const onSubmit = async (values: DesignFormValues) => {
    const materialIds: string[] = [];

    if (values.accessories.head && values.accessories.head !== "none") {
      if (
        values.accessories.head === "other" &&
        values.accessories.headCustomNote?.trim()
      ) {
        materialIds.push(
          `head:custom:${values.accessories.headCustomNote.trim()}:${
            values.accessories.headColor
          }`
        );
      } else {
        materialIds.push(
          `head:${values.accessories.head}:${values.accessories.headColor}`
        );
      }
    }

    if (values.accessories.neck && values.accessories.neck !== "none") {
      if (
        values.accessories.neck === "other" &&
        values.accessories.neckCustomNote?.trim()
      ) {
        materialIds.push(
          `neck:custom:${values.accessories.neckCustomNote.trim()}:${
            values.accessories.neckColor
          }`
        );
      } else {
        materialIds.push(
          `neck:${values.accessories.neck}:${values.accessories.neckColor}`
        );
      }
    }

    if (
      values.accessories.sideFlowers &&
      values.accessories.sideFlowers !== "none"
    ) {
      materialIds.push(
        `sideFlowers:${values.accessories.sideFlowers}:${values.accessories.color}`
      );
    }

    const characterDesign =
      values.characterDesignType === "Khác"
        ? `custom: ${values.characterDesignCustomNote}`
        : values.characterDesignType;

    const payload = {
      userId: user?.id,
      characterName: values.characterName,
      characterDesign,
      height: values.height,
      width: values.width,
      length: values.length,
      note: values.note,
      accessory: materialIds,
      images: values.images,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/product-custom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        toast.success("Đặt hàng thành công!");
        router.push("/user/orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi đặt hàng!");
    }
  };

  // Custom Color Picker Component
  const ColorPicker = ({ 
    label, 
    value, 
    onChange, 
    disabled = false 
  }: { 
    label: string; 
    value: string; 
    onChange: (color: string) => void;
    disabled?: boolean;
  }) => (
    <div className={`space-y-3 ${disabled ? 'opacity-50' : ''}`}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: value,
              WebkitAppearance: 'none',
              appearance: 'none',
            }}
          />
          <div 
            className="absolute inset-0 rounded-lg border-2 border-white shadow-sm pointer-events-none"
            style={{ backgroundColor: value }}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={(e) => {
              const hexValue = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(hexValue)) {
                onChange(hexValue);
              }
            }}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="#000000"
          />
        </div>
        <div className="flex items-center justify-center w-16 h-10 rounded-md border-2 border-gray-200 text-xs font-medium" style={{ backgroundColor: value, color: value === '#000000' || value === '#ffffff' ? (value === '#000000' ? '#ffffff' : '#000000') : '#ffffff' }}>
          Preview
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Thiết kế nhân vật bằng len
      </h1>

      <form onSubmit={handleSubmit(onSubmit, err => console.log(err))} className="space-y-10">
        {/* Thông tin nhân vật */}
        <div className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold">Thông tin nhân vật</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="characterName">Tên nhân vật</Label>
              <Input
                id="characterName"
                {...register("characterName")}
                placeholder="Nhập tên nhân vật"
              />
              {errors.characterName && (
                <p className="text-sm text-red-500">
                  {errors.characterName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="characterDesign">Tạo hình nhân vật</Label>
              <Select
                value={characterDesignType}
                onValueChange={(val) =>
                  setValue(
                    "characterDesignType",
                    val as DesignFormValues["characterDesignType"]
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn hình dạng nhân vật" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gấu">Gấu</SelectItem>
                  <SelectItem value="Mèo">Mèo</SelectItem>
                  <SelectItem value="Thỏ">Thỏ</SelectItem>
                  <SelectItem value="Chó">Chó</SelectItem>
                  <SelectItem value="Vịt">Vịt</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {characterDesignType === "Khác" && (
              <div className="col-span-2 space-y-2 pt-2">
                <Label>Mô tả tạo hình nhân vật</Label>
                <Textarea
                  placeholder="VD: Cá mập đội nón, gấu mặc váy..."
                  {...register("characterDesignCustomNote")}
                />
                {errors.characterDesignCustomNote && (
                  <p className="text-sm text-red-500">
                    {errors.characterDesignCustomNote.message}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Chiều cao (cm)</Label>
              <Input
                id="height"
                type="number"
                {...register("height")}
                placeholder="20"
              />
              {errors.height && (
                <p className="text-sm text-red-500">{errors.height.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Chiều rộng (cm)</Label>
              <Input
                id="width"
                type="number"
                {...register("width")}
                placeholder="15"
              />
              {errors.width && (
                <p className="text-sm text-red-500">{errors.width.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Chiều dài (cm)</Label>
              <Input
                id="length"
                type="number"
                {...register("length")}
                placeholder="10"
              />
              {errors.length && (
                <p className="text-sm text-red-500">{errors.length.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Hình ảnh tham khảo */}
        <div className="space-y-2 border-b pb-6">
          <h2 className="text-xl font-semibold">Hình ảnh tham khảo</h2>
          <Label>Hình ảnh gợi ý (Định dạng PNG, JPG, GIF)</Label>
          <UploadMultipleFileImage
            value={watch("images")}
            onUploaded={(imgs) => setValue("images", imgs)}
          />
        </div>

        {/* Phụ kiện */}
        <div className="space-y-8 border-b pb-6">
          <h2 className="text-xl font-semibold">Phụ kiện</h2>
          
          {/* Phụ kiện Cài đầu */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Cài đầu</h3>
            <RadioGroup
              value={accessories.head}
              onValueChange={(val) => setValue("accessories.head", val)}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {[
                { value: "bow", label: "Nơ" },
                { value: "one-ear-bow", label: "Nơ một tai" },
                { value: "flower-one-side", label: "Cài hoa một bên" },
                { value: "flower-both-sides", label: "Cài hoa hai bên" },
                { value: "other", label: "Khác" },
                { value: "none", label: "Không" },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2 p-2 rounded-md transition-colors">
                  <RadioGroupItem
                    value={item.value}
                    id={`head-${item.value}`}
                  />
                  <Label htmlFor={`head-${item.value}`} className="cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {accessories.head === "other" && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-700">Mô tả chi tiết</Label>
                <Textarea
                  placeholder="Mô tả kiểu cài đầu mong muốn"
                  {...register("accessories.headCustomNote")}
                  className="mt-2"
                />
              </div>
            )}
            
            {accessories.head !== "none" && (
              <ColorPicker
                label="Màu phụ kiện đầu"
                value={accessories.headColor}
                onChange={(color) => setValue("accessories.headColor", color)}
              />
            )}
          </div>

          {/* Phụ kiện Đeo cổ */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Đeo cổ</h3>
            <RadioGroup
              value={accessories.neck}
              onValueChange={(val) => setValue("accessories.neck", val)}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {[
                { value: "bow", label: "Nơ" },
                { value: "ribbon", label: "Dải ruy băng" },
                { value: "flower-necklace", label: "Vòng cổ hoa" },
                { value: "bell", label: "Chuông" },
                { value: "other", label: "Khác" },
                { value: "none", label: "Không" },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2 p-2 rounded-md transition-colors">
                  <RadioGroupItem
                    value={item.value}
                    id={`neck-${item.value}`}
                  />
                  <Label htmlFor={`neck-${item.value}`} className="cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {accessories.neck === "other" && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-700">Mô tả chi tiết</Label>
                <Textarea
                  placeholder="Mô tả kiểu đeo cổ mong muốn"
                  {...register("accessories.neckCustomNote")}
                  className="mt-2"
                />
              </div>
            )}
            
            {accessories.neck !== "none" && (
              <ColorPicker
                label="Màu phụ kiện cổ"
                value={accessories.neckColor}
                onChange={(color) => setValue("accessories.neckColor", color)}
              />
            )}
          </div>

          {/* Phụ kiện Cài hoa bên */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Cài hoa bên</h3>
            <RadioGroup
              value={accessories.sideFlowers}
              onValueChange={(val) => setValue("accessories.sideFlowers", val)}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {[
                { value: "left", label: "Trái" },
                { value: "right", label: "Phải" },
                { value: "both", label: "Cả hai bên" },
                { value: "none", label: "Không" },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2 p-2 rounded-md transition-colors">
                  <RadioGroupItem
                    value={item.value}
                    id={`sideFlowers-${item.value}`}
                  />
                  <Label htmlFor={`sideFlowers-${item.value}`} className="cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            {accessories.sideFlowers !== "none" && (
              <ColorPicker
                label="Màu hoa"
                value={accessories.color}
                onChange={(color) => setValue("accessories.color", color)}
              />
            )}
          </div>
        </div>

        {/* Ghi chú */}
        <div className="space-y-2 border-b pb-3">
          <h2 className="text-xl font-semibold">Ghi chú</h2>
          <Label htmlFor="note">Ghi chú thêm</Label>
          <Textarea
            id="note"
            {...register("note")}
            placeholder="Nhập ghi chú về thiết kế của bạn"
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="px-8 py-6 text-lg cursor-pointer"
          >
            Đặt hàng
          </Button>
        </div>
      </form>
    </div>
  );
}