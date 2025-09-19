// components/ui/data-table.tsx
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define our custom column properties
type CustomColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  size?: number;
  meta?: {
    className?: string;
  };
};

interface DataTableProps<TData extends RowData, TValue = unknown> {
  columns: CustomColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends RowData, TValue = unknown>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable<TData>({
    data,
    columns: columns as ColumnDef<TData, TValue>[],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnDef = header.column.columnDef as CustomColumnDef<
                  TData,
                  TValue
                >;
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      width: columnDef.size ? `${columnDef.size}px` : undefined,
                    }}
                    className={columnDef.meta?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  const columnDef = cell.column.columnDef as CustomColumnDef<
                    TData,
                    TValue
                  >;
                  return (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: columnDef.size
                          ? `${columnDef.size}px`
                          : undefined,
                      }}
                      className={columnDef.meta?.className}
                    >
                      {flexRender(columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
