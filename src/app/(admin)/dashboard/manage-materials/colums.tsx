"use client";
import { Material } from "@/types/product";
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

function ActionsCell({ row, refetch }: { row: Row<Material>; refetch?: () => void }) {
  const Product = row.original;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/materials/${Product.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Xóa sản phẩm thành công!");
        refetch?.();
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
    router.push(`/dashboard/manage-materials/${Product.id}/update`);
  };


  //handle update status material
  const handleUpdateStatus = async (status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/materials/${Product.id}/isActive`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: status }),
      });
      if (res.ok) {
        toast.success(`Cập nhật trạng thái vật liệu thành công!`);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.message || "Cập nhật trạng thái vật liệu thất bại!");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái!" + err);
    } finally {
      setLoading(false);
    }
  }
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
          <DropdownMenuItem onClick={() => handleUpdateStatus(!Product.isActive)}>
            {Product.isActive ? "Tạm ngưng bán" : "Kích hoạt"}
          </DropdownMenuItem>
          <ConfirmDeleteModal
            trigger={
              <DropdownMenuItem className="text-red-500">
                Xóa nguyên liệu khỏi cửa hàng
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

export const columns = ( offset: number = 0,refetch?: () => void): ColumnDef<Material>[] => [
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
    header: () => <div className="text-center">Tên nguyên liệu</div>,
    size: 180, // width 180px
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">Mô tả</div>,
    size: 260, // width 260px
    cell: ({ row }) => (
      <div className="whitespace-normal break-words line-clamp-2 max-w-[260px]"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Giá tiền</div>,
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
    accessorKey: "unit",
    header: () => <div className="text-center">Đơn vị</div>,
    size: 100, // width 100px
  },
  {
    accessorKey: "thresholdQty",
    header: () => <div className="text-center">Số lượng tối thiểu</div>,
    size: 140, // width 140px
    cell: ({ row }) => {
      const thresholdQty = row.getValue("thresholdQty") as number;
      return <div className="text-center">{thresholdQty}</div>;
    },
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
    cell: (props) => <ActionsCell {...props} refetch={refetch} />,
  },
];
