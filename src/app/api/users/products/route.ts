import { apiClient } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const offset = searchParams.get("offset") || "0";
    const limit = searchParams.get("limit") || "100";
    const name = searchParams.get("name") || "";

    const res = await apiClient.get(
      `/product-catalog/product-by-name?offset=${offset}&limit=${limit}&name=${name}`
    );

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { message: "Lỗi khi lấy danh sách sản phẩm!" },
      { status: 500 }
    );
  }
}
