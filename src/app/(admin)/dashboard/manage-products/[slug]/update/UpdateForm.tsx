"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UploadMultipleFileImage from "@/components/UploadMultipleFileImage";
import {
  UpdateFormValues,
  updateSchema,
} from "@/schemaValidations/product.schema";
import { Category } from "@/types/category";
import { Material } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const UpdateForm = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  });

  const [images, setImages] = useState<string[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    // Gọi song song để tăng tốc độ
    Promise.all([getMaterial(), getCategory()]).then(() => {
      // Không làm gì ở đây, chờ useEffect tiếp theo xử lý
    });
  }, []);

  useEffect(() => {
    if (slug && categories.length > 0 && materials.length > 0) {
        
      getProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, categories, materials]);

  const getMaterial = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/materials`
    );
    const data = await res.json();
    setMaterials(data.data);
  };

  const getCategory = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`
    );
    const data = await res.json();
    setCategories(data.data);
  };
  const getProduct = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/products/${slug}`
      );
      if (!res.ok) throw new Error("Không tìm thấy sản phẩm");

      const data = await res.json();
      const product = data;
      setProductId(product.id);

      reset({
        name: product.name,
        price: product.price,
        stockQty: product.stockQty,
        categoryId:
          categories.find((cat) => cat.name === product.categoryName)?.id || "",
        materialId:
          materials.find((mat) => mat.name === product.materialName)?.id || "",
        height: product.height,
        width: product.width,
        length: product.length,
        description: product.description,
      });

      setImages(product.productImages.map((img: { url: string }) => img.url));
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải thông tin sản phẩm!");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UpdateFormValues) => {
    const submitData = {
      ...data,
      images: images.map((url, index) => ({
        url,
        isThumbnail: index === 0,
      })),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        }
      );

      if (res.ok) {
        toast.success("Cập nhật sản phẩm thành công!");
        router.push("/dashboard/manage-products");
      } else {
        const contentType = res.headers.get("content-type");
        let errMessage = "Cập nhật thất bại!";

        if (contentType && contentType.includes("application/json")) {
          const err = await res.json();
          errMessage = err.message || errMessage;
        }

        toast.error(errMessage);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật sản phẩm!");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-5xl mx-auto bg-white p-8"
    >
      <div>
        <Label htmlFor="name" className="mb-2">
          Tên sản phẩm
        </Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price" className="mb-2">
            Giá
          </Label>
          <Input type="text" {...register("price")} />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="stockQty" className="mb-2">
            Tồn kho
          </Label>
          <Input type="text" {...register("stockQty")} />
          {errors.stockQty && (
            <p className="text-red-500 text-sm">{errors.stockQty.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="categoryId" className="mb-2">
            Danh mục
          </Label>
          <select
            {...register("categoryId")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="height" className="mb-2">
            Cao (cm)
          </Label>
          <Input type="text" {...register("height")} />
          {errors.height && (
            <p className="text-red-500 text-sm">{errors.height.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="width" className="mb-2">
            Rộng (cm)
          </Label>
          <Input type="text" {...register("width")} />
          {errors.width && (
            <p className="text-red-500 text-sm">{errors.width.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="length" className="mb-2">
            Dài (cm)
          </Label>
          <Input type="text" {...register("length")} />
          {errors.length && (
            <p className="text-red-500 text-sm">{errors.length.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="materialId" className="mb-2">
          Chất liệu
        </Label>
        <select
          {...register("materialId")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Chọn chất liệu</option>
          {materials.map((mat) => (
            <option key={mat.id} value={mat.id}>
              {mat.name}
            </option>
          ))}
        </select>
        {errors.materialId && (
          <p className="text-red-500 text-sm">{errors.materialId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="mb-2">
          Mô tả
        </Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label className="mb-2">Hình ảnh sản phẩm</Label>
        <UploadMultipleFileImage value={images} onUploaded={setImages} />
        {errors.images && (
          <p className="text-red-500 text-sm">{errors.images.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
        </Button>
      </div>
    </form>
  );
};

export default UpdateForm;
