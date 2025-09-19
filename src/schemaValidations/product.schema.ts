import { z } from "zod";

export const createSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là không được để trống"),
  price: z.coerce.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  height: z.coerce.number().min(0, "Chiều cao phải lớn hơn hoặc bằng 0"),
  width: z.coerce.number().min(0, "Chiều rộng phải lớn hơn hoặc bằng 0"),
  length: z.coerce.number().min(0, "Chiều dài phải lớn hơn hoặc bằng 0"),
  stockQty: z.coerce.number().min(0, "Số lượng tồn phải lớn hơn hoặc bằng 0"),
  description: z.string().min(1, "Mô tả là không được để trống"),
  categoryId: z.string().min(1, "Danh mục là không được để trống"),
  materialId: z.string().min(1, "Chất liệu là không được để trống"),
  images: z.array(z.any()).optional(),
});

export const updateSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là không được để trống"),
  price: z.coerce.number().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  height: z.coerce.number().min(0, "Chiều cao phải lớn hơn hoặc bằng 0"),
  width: z.coerce.number().min(0, "Chiều rộng phải lớn hơn hoặc bằng 0"),
  length: z.coerce.number().min(0, "Chiều dài phải lớn hơn hoặc bằng 0"),
  stockQty: z.coerce.number().min(0, "Số lượng tồn phải lớn hơn hoặc bằng 0"),
  description: z.string().min(1, "Mô tả là không được để trống"),
  categoryId: z.string().min(1, "Danh mục là không được để trống"),
  materialId: z.string().min(1, "Chất liệu là không được để trống"),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        isThumbnail: z.boolean(),
      })
    )
    .optional(),
});

export type CreateFormValues = z.infer<typeof createSchema>;
export type UpdateFormValues = z.infer<typeof updateSchema>;
