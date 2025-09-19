"use client";
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { columns } from './colums';
import { Category } from '@/types/category';
import Loading from '@/components/loading';
import SimplePagination from '@/components/SimplePagination';

const LIMIT = 8;

const ManageCategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const offset = (page - 1) * LIMIT;

    const getCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/categories?offset=${offset}&limit=${LIMIT}`);
            const data = await res.json();
            setTotalItems(data.count || 0);
            setCategories(data.data || []);
        } catch (error) {
            console.error(error);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const totalPages = Math.ceil(totalItems / LIMIT);

    return (
        <div className=''>
            <div className='flex justify-end'>
                <Link href={'/dashboard/manage-categories/create'}>
                    <Button className='mb-6 p-2 w-fit rounded cursor-pointer '>
                        Thêm danh mục mới
                    </Button>
                </Link>
            </div>
            <div>
                <h1 className='text-2xl font-bold text-center mb-2'>Danh sách các loại danh mục</h1>
                {isLoading ? (
                    <Loading />
                ) : (
                    <DataTable columns={columns(offset)} data={categories} />
                )}
            </div>
            {totalPages > 1 && (
                <SimplePagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
};

export default ManageCategoriesPage;