"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const categorySchema = z.object({
    name: z.string().min(1, "Tên danh mục là bắt buộc"),
    desc: z.string().min(1, "Mô tả là bắt buộc"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CreateCategoryForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            desc: "",
        },
    });
    const router = useRouter();

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                toast.success("Tạo danh mục thành công!");
                reset();
                router.push("/dashboard/manage-categories");
            } else {
                const err = await res.json();
                toast.error(err.message || "Tạo danh mục thất bại!");
            }
        } catch {
            toast.error("Có lỗi xảy ra!");
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-4xl mx-auto bg-white p-6 rounded "
        >
            <div className="mb-4">
                <Label htmlFor="name" className="mb-2">Tên danh mục</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="mb-4">
                <Label htmlFor="desc" className="mb-2">Mô tả</Label>
                <Textarea id="desc" {...register("desc")} />
                {errors.desc && <p className="text-red-500 text-sm">{errors.desc.message}</p>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full mt-2 cursor-pointer">
                {isSubmitting ? "Đang lưu..." : "Tạo danh mục"}
            </Button>
        </form>
    );
};

export default CreateCategoryForm;