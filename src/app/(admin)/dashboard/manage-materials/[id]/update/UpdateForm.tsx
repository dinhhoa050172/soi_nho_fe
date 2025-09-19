"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const materialSchema = z.object({
    name: z.string().min(1, "Tên chất liệu là bắt buộc"),
    unit: z.string().min(1, "Đơn vị là bắt buộc"),
    stockQty: z.coerce.number().min(0, "Tồn kho phải >= 0"),
    thresholdQty: z.coerce.number().min(0, "Ngưỡng cảnh báo phải >= 0"),
    price: z.string().min(1, "Giá là bắt buộc"),
    description: z.string().nullable().optional(),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

const UpdateMaterialForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<MaterialFormValues>({
        resolver: zodResolver(materialSchema)
    });
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/materials/${id}`);
                if (!res.ok) throw new Error("Không tìm thấy nguyên liệu");
                const data = await res.json();
                reset({
                    name: data.name,
                    unit: data.unit,
                    stockQty: data.stockQty,
                    thresholdQty: data.thresholdQty,
                    price: String(data.price),
                    description: data.description || "",
                });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message || "Không thể tải dữ liệu nguyên liệu!");
                }
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchMaterial();
    }, [id, reset]);

    const onSubmit = async (data: MaterialFormValues) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/materials/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast.success("Cập nhật chất liệu thành công!");
                router.push("/dashboard/manage-materials");
            } else {
                const err = await res.json();
                toast.error(err.message || "Cập nhật chất liệu thất bại!");
            }
        } catch {
            toast.error("Có lỗi xảy ra!");
        }
    };

    if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-4xl mx-auto bg-white p-6 space-y-4"
        >
            <div>
                <Label htmlFor="name" className="mb-2">Tên chất liệu</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
                <Label htmlFor="unit" className="mb-2">Đơn vị</Label>
                <Input id="unit" {...register("unit")} />
                {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
            </div>
            <div>
                <Label htmlFor="stockQty" className="mb-2">Tồn kho</Label>
                <Input id="stockQty" type="number" {...register("stockQty")} />
                {errors.stockQty && <p className="text-red-500 text-sm">{errors.stockQty.message}</p>}
            </div>
            <div>
                <Label htmlFor="thresholdQty" className="mb-2">Ngưỡng cảnh báo</Label>
                <Input id="thresholdQty" type="number" {...register("thresholdQty")} />
                {errors.thresholdQty && <p className="text-red-500 text-sm">{errors.thresholdQty.message}</p>}
            </div>
            <div>
                <Label htmlFor="price" className="mb-2">Giá tiền</Label>
                <Input id="price" {...register("price")} />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
                <Label htmlFor="description" className="mb-2">Mô tả</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
                {isSubmitting ? "Đang lưu..." : "Cập nhật chất liệu"}
            </Button>
        </form>
    );
};

export default UpdateMaterialForm;
