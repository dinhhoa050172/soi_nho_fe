import { apiClient } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await apiClient.get(`/user/user-profile`);
  console.error("getMe res", res.data);
  return NextResponse.json(res.data);
}
