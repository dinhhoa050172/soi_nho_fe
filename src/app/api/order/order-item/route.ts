import { apiClient } from "@/lib/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!", error: "Unauthorized" },
        { status: 401 }
      );
    }
    const res = await apiClient.get("/user/order/order-item", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json(
      { error: "Get order item failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!", error: "Unauthorized" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const res = await apiClient.post("/user/order/order-item", body, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json(
      { error: "Create order item failed" },
      { status: 500 }
    );
  }
}
