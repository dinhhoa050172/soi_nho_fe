import { apiClient } from "@/lib/api";
import { Product } from "@/types/product";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const id = (await context.params).id;
  const res = await apiClient.get(`/product-catalog/product/${id}`);
  return NextResponse.json(res.data);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const data: Product = await req.json();
    console.error("Update product data:", data);

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
      `/product-catalog/product/${id}`,
      data,
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
      { message: "Cập nhật sản phẩm thất bại!" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Lấy accessToken từ cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!", error: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = (await context.params).id;
    const response = await apiClient.delete(`/product-catalog/product/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.response?.data?.message || "Xóa sản phẩm thất bại!" },
      { status: 500 }
    );
  }
}
