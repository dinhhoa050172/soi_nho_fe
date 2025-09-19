import { apiClient } from "@/lib/api";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const offset = searchParams.get("offset") || "0";
    const limit = searchParams.get("limit") || "25";
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!", error: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await apiClient.get(
      `/product-catalog/product-custom?offset=${offset}&limit=${limit}`,
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
      { message: "Lỗi khi lấy danh sách sản phẩm tự thiết kế!" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Lấy accessToken từ cookie
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!", error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Truyền accessToken vào headers khi gọi apiClient
    await apiClient.post("/product-catalog/product-custom", body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(
      { message: "Tạo sản phẩm thành công!" },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "API error:",
      error?.response?.data || error?.message || error
    );

    return NextResponse.json(
      { message: error?.message || "Có lỗi xảy ra khi tạo sản phẩm!" },
      { status: 500 }
    );
  }
}
