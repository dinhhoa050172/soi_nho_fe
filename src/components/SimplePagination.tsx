import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface SimplePaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const SimplePagination: React.FC<SimplePaginationProps> = ({ page, totalPages, onPageChange }) => {
    return (
        <div className="mt-8 flex justify-center">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(Math.max(page - 1, 1))}
                            className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <span className="px-4 py-2 border rounded">
                            {page} / {totalPages}
                        </span>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                            className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default SimplePagination;
