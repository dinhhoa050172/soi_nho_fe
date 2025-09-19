"use client";

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
import { Category } from "@/types/category";

function ActionsCell({ row }: { row: Row<Category> }) {
  const Product = row.original;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${Product.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Xóa sản phẩm thành công!");
        router.refresh();
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

  const handleUpdate = () => {
    router.push(`/dashboard/manage-categories/${Product.id}/update`);
  };

  //handle update status category
  const handleUpdateStatus = async (status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories/${Product.id}/isActive`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: status }),
      });
      if (res.ok) {
        toast.success(`Cập nhật trạng thái thành công!`);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Cập nhật trạng thái thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!" + err);
    } finally {
      setLoading(false);
    }
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
          <DropdownMenuItem onClick={handleUpdate}>Cập nhập</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(!Product.isActive)}
          >
            {Product.isActive ? "Tạm ngưng bán" : "Kích hoạt"}
          </DropdownMenuItem>
          <ConfirmDeleteModal
            trigger={
              <DropdownMenuItem className="text-red-500">
                Xóa loại sản phẩm khỏi cửa hàng
              </DropdownMenuItem>
            }
            itemName={Product.name}
            onConfirm={handleDelete}
            isLoading={loading}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns = (offset: number = 0): ColumnDef<Category>[] => [
  {
    accessorKey: "STT",
    header: () => <div className="text-center">STT</div>,
    cell: ({ row }) => {
      const index = offset + row.index + 1;
      return <div className="text-center">{index}</div>;
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="text-center">Tên danh mục</div>,
  },
  {
    accessorKey: "desc",
    header: () => <div className="text-center">Mô tả</div>,
    cell: (props) => (
      <div
        className="whitespace-normal break-words line-clamp-2"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {props.row.original.desc || "Chưa có mô tả"}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: () => <div className="text-center">Trạng thái</div>,
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <div className="text-center">
          {isActive ? "Kích hoạt" : "Tạm ngưng"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: (props) => <ActionsCell {...props} />,
  },
];
