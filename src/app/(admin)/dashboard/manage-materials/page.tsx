"use client";
import { Button } from '@/components/ui/button';
import { Material } from '@/types/product';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { columns } from './colums';
import { DataTable } from '@/components/ui/data-table';
import Loading from '@/components/loading';
import SimplePagination from '@/components/SimplePagination';

const LIMIT = 8;

const ManageMaterialPage = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const offset = (page - 1) * LIMIT;

    const getMaterials = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/materials?offset=${offset}&limit=${LIMIT}`);
            const data = await res.json();
            setTotalItems(data.count || 0);
            setMaterials(data.data || []);
        } catch (error) {
            console.error(error);
            setMaterials([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getMaterials();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const totalPages = Math.ceil(totalItems / LIMIT);

    return (
        <div className=''>
            <div className='flex justify-end'>
                <Link href={'/dashboard/manage-materials/create'}>
                    <Button className='mb-6 p-2 w-fit rounded cursor-pointer '>
                        Thêm nguyên liệu mới
                    </Button>
                </Link>
            </div>
            <div>
                <h1 className='text-2xl font-bold text-center mb-2'>Danh sách nguyên liệu</h1>
                {isLoading ? (
                    <Loading />
                ) : (
                    <DataTable columns={columns(offset, getMaterials)} data={materials} />
                )}
            </div>
            {totalPages > 1 && (
                <SimplePagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
};

export default ManageMaterialPage;