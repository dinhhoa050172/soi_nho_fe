import { apiClient } from "@/lib/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { isActive }: { isActive: boolean } = await req.json();

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!", error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = (await context.params).id;
    const response = await apiClient.put(
      `/product-catalog/category/${id}`,
      { isActive },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Cập nhật trạng thái danh mục thất bại!" },
      { status: 500 }
    );
  }
}
