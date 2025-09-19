'use client';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import UploadMultipleFileImage from "@/components/UploadMultipleFileImage";
import { Material } from "@/types/product";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CreateFormValues, createSchema } from "@/schemaValidations/product.schema";
import { Category } from "@/types/category";

const CreateForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateFormValues>({
        resolver: zodResolver(createSchema),
    });
    const router = useRouter();
    const [images, setImages] = React.useState<string[]>([]);
    // Lấy danh sách category, material từ API
    const [materials, setMaterials] = useState<Material[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const getMaterial = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/materials`);
        const data = await res.json();
        setMaterials(data.data);
    }
    const getCategory = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/categories`);
        const data = await res.json();
        setCategories(data.data);
    }
    useEffect(() => {
        getMaterial();
        getCategory();
    }, [])

    const onSubmit = async (data: CreateFormValues) => {
        const submitData = { ...data, images };
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });
            if (res.ok) {
                toast.success("Tạo sản phẩm thành công!");
                router.push("/dashboard/manage-products");
            } else {
                // const errorData = await res.json();
                // toast.error(errorData.message || "Tạo sản phẩm thất bại!");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tạo sản phẩm!");
            console.error(error);
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 max-w-5xl mx-auto bg-white p-8 "
            >
                <div>
                    <Label htmlFor="name">Tên sản phẩm</Label>
                    <Input id="name" {...register("name")} className="mt-1" />
                    {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="price">Giá</Label>
                        <Input id="price" type="number" {...register("price")} className="mt-1" />
                        {errors.price && (
                            <p className="text-red-500 text-sm">{errors.price.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="stockQty">Tồn kho</Label>
                        <Input id="stockQty" type="number" {...register("stockQty")} className="mt-1" />
                        {errors.stockQty && (
                            <p className="text-red-500 text-sm">{errors.stockQty.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="categoryId">Danh mục</Label>
                        <select
                            id="categoryId"
                            {...register("categoryId")}
                            className="w-full border rounded px-3 py-2 mt-1"
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
                        <Label htmlFor="height">Cao (cm)</Label>
                        <Input id="height" type="number" {...register("height")} className="mt-1" />
                        {errors.height && (
                            <p className="text-red-500 text-sm">{errors.height.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="width">Rộng (cm)</Label>
                        <Input id="width" type="number" {...register("width")} className="mt-1" />
                        {errors.width && (
                            <p className="text-red-500 text-sm">{errors.width.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="length">Dài (cm)</Label>
                        <Input id="length" type="number" {...register("length")} className="mt-1" />
                        {errors.length && (
                            <p className="text-red-500 text-sm">{errors.length.message}</p>
                        )}
                    </div>
                </div>
                <div>
                    <Label htmlFor="materialId">Chất liệu</Label>
                    <select
                        id="materialId"
                        {...register("materialId")}
                        className="w-full border rounded px-3 py-2 mt-1"
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
                    <Label htmlFor="description">Mô tả</Label>
                    <Textarea id="description" {...register("description")} rows={4} className="mt-1" />
                    {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                    )}
                </div>
                <div>
                    <Label className="mb-1">Hình ảnh sản phẩm</Label>
                    <UploadMultipleFileImage
                        value={images}
                        onUploaded={setImages}
                    />
                    {errors.images && (
                        <p className="text-red-500 text-sm">{errors.images.message}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                        {isSubmitting ? "Đang lưu..." : "Tạo sản phẩm"}
                    </Button>
                </div>

            </form>
        </>

    );
};

export default CreateForm;