import { apiClient } from "@/lib/api";
// import { Material } from "@/types/product";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(
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
    const response = await apiClient.get(`/product-catalog/material/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.error();
  }
}

export async function PUT(
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

    const data = await req.json();
    const id = (await context.params).id;
    const response = await apiClient.put(
      `/product-catalog/material/${id}`,
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
    return NextResponse.error();
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
    const response = await apiClient.delete(`/product-catalog/material/${id}`, {
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
