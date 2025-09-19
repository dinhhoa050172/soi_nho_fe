import { z } from "zod";

export const designFormSchema = z
  .object({
    characterName: z.string().min(1, "Tên nhân vật là bắt buộc"),

    characterDesignType: z.enum(["Gấu", "Mèo", "Thỏ", "Chó", "Vịt", "Khác"], {
      errorMap: () => ({ message: "Tạo hình là bắt buộc" }),
    }),
    characterDesignCustomNote: z.string().optional(),

    height: z.string().min(1, "Chiều cao là bắt buộc"),
    width: z.string().min(1, "Chiều rộng là bắt buộc"),
    length: z.string().min(1, "Chiều dài là bắt buộc"),
    note: z.string().optional(),

    materialIds: z.array(z.string()),

    images: z
      .array(z.string().url("Phải là đường dẫn hợp lệ"))
      .min(1, "Cần ít nhất một hình ảnh"),

    accessories: z.object({
      head: z.string(),
      headCustomNote: z.string().optional(),
      headColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Màu không hợp lệ"),

      neck: z.string(),
      neckCustomNote: z.string().optional(),
      neckColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Màu không hợp lệ"),

      sideFlowers: z.string(),
      color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Màu không hợp lệ"),
    }),
  })
  .superRefine((val, ctx) => {
    if (val.characterDesignType === "Khác") {
      if (
        !val.characterDesignCustomNote ||
        val.characterDesignCustomNote.trim().length < 5
      ) {
        ctx.addIssue({
          path: ["characterDesignCustomNote"],
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập mô tả tạo hình tùy chỉnh",
        });
      }
    }
  });

export type DesignFormValues = z.infer<typeof designFormSchema>;
