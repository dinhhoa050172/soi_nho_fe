import { apiClient } from "@/lib/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const orderId = (await context.params).id;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "Bạn chưa đăng nhập!", error: "Unauthorized" },
        { status: 401 }
      );
    }
    const res = await apiClient.get(`/user/order/${orderId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return NextResponse.json(res.data);
  } catch (error) {
    console.error("Error API:", error);
    return NextResponse.json(
      { error: "Get order detail failed" },
      { status: 500 }
    );
  }
}
