'use client';
import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { columns } from './columns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Loading from '@/components/loading';
import SimplePagination from '@/components/SimplePagination';
import ProductDetailModal from '@/components/ProductDetailModal';

const LIMIT = 8;

const ManageProductPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

    const offset = (page - 1) * LIMIT;

    const getProducts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/products?offset=${offset}&limit=${LIMIT}`
            );
            const data = await res.json();
            setTotalItems(data.count || 0);
            setProducts(data.data || []);
        } catch (error) {
            console.error(error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const totalPages = Math.ceil(totalItems / LIMIT);

    const handleOpenDetail = (slug: string) => {
        setSelectedSlug(slug);
        setModalOpen(true);
    };

    return (
        <div className=''>
            <div className='flex justify-end'>
                <Link href={'/dashboard/manage-products/create'}>
                    <Button className='mb-6 p-2 w-fit rounded cursor-pointer '>
                        Thêm sản phẩm mới
                    </Button>
                </Link>
            </div>
            <div>
                <h1 className='text-2xl font-bold text-center mb-2'>Danh sách sản phẩm</h1>
                {isLoading ? (
                    <Loading />
                ) : (
                    <DataTable columns={columns(handleOpenDetail, getProducts, offset)} data={products} />
                )}
            </div>
            {totalPages > 1 && (
                <div >
                    <SimplePagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
            )}
            <ProductDetailModal open={modalOpen} onOpenChange={setModalOpen} slug={selectedSlug} />
        </div>
    );
};

export default ManageProductPage;