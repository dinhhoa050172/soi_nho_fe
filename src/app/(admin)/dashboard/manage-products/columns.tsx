"use client";
import { Product } from "@/types/product";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import { formatCurrency } from "@/lib/utils";

function ActionsCell({ row, onOpenDetail, onReload }: { row: Row<Product>; onOpenDetail: (slug: string) => void; onReload: () => void }) {
  const Product = row.original;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${Product.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Xóa sản phẩm thành công!");
        onReload();
      } else {
        const data = await res.json();
        toast.error(data.message || "Xóa sản phẩm thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi xóa!" + err);
    } finally {
      setLoading(false);
    }
  };


  //handle update status product
  const handleUpdateStatus = async (status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${Product.id}/isActive`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: status }),
      });
      if (res.ok) {
        toast.success(`Cập nhật trạng thái sản phẩm thành công!`);
        onReload();
      } else {
        const data = await res.json();
        toast.error(data.message || "Cập nhật trạng thái sản phẩm thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!" + err);
    } finally {
      setLoading(false);
    }
  }
  const handleUpdate = () => {
    router.push(`/dashboard/manage-products/${Product.slug}/update`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onOpenDetail(Product.slug)}>
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUpdate}>Cập nhập</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateStatus(!Product.isActive)}>
            {Product.isActive ? "Tạm ngưng bán" : "Kích hoạt"}
          </DropdownMenuItem>
          <ConfirmDeleteModal
            trigger={
              <DropdownMenuItem className="text-red-500">
                Xóa sản phẩm khỏi cửa hàng
              </DropdownMenuItem>
            }
            itemName={Product.name}
            onConfirm={handleDelete}
            isLoading={loading}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Product Detail Modal */}
    </>
  );
}

export const columns = (
  onOpenDetail: (slug: string) => void,
  onReload: () => void,
  offset: number = 0
): ColumnDef<Product>[] => [
    {
      accessorKey: "STT",
      header: () => <div className="text-center">STT</div>,
      size: 60, // width 60px
      cell: ({ row }) => {
        const index = offset + row.index + 1;
        return <div className="text-center">{index}</div>;
      },
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">Tên sản phẩm</div>,
      size: 200, // width 200px
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="whitespace-normal break-words line-clamp-2 min-w-[200px] max-w-[250px]">
            <span className="font-semibold">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: () => <div className="text-center">Mô tả</div>,
      size: 300, // width 300px
      cell: ({ row }) => (
        <div
          className="whitespace-normal break-words line-clamp-2 max-w-[300px]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: () => <div className="text-center">Giá</div>,
      size: 120, // width 120px
      cell: ({ row }) => {
        const price = row.getValue("price") as number;
        return <div className="text-center">{formatCurrency(price)}</div>;
      },
    },
    {
      accessorKey: "stockQty",
      header: () => <div className="text-center">Số lượng tồn kho</div>,
      size: 120, // width 120px
      cell: ({ row }) => {
        const stockQty = row.getValue("stockQty") as number;
        return <div className="text-center">{stockQty}</div>;
      },
    },
    {
      accessorKey: "categoryName",
      header: () => <div className="text-center">Danh mục</div>,
      size: 140, // width 140px
    },
    {
      accessorKey: "materialName",
      header: () => <div className="text-center">Chất liệu</div>,
      size: 140, // width 140px
    },
    {
      accessorKey: "isActive",
      header: () => <div className="text-center">Trạng thái</div>,
      size: 120, // width 120px
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return <div className="text-center">{isActive ? "Kích hoạt" : "Tạm ngưng"}</div>;
      },
    },
    {
      id: "actions",
      size: 80, // width 80px
      cell: (props) => <ActionsCell {...props} onOpenDetail={onOpenDetail} onReload={onReload} />,
    },
  ];
