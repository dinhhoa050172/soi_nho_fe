import { apiClient } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const slug = (await context.params).slug;
  const res = await apiClient.get(`/product-catalog/product/slug/${slug}`);
  return NextResponse.json(res.data);
}
