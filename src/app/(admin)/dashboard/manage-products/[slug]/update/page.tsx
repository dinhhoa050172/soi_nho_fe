"use client";

import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react'
import UpdateForm from './UpdateForm';

const UpdateProductPage = () => {
    const router = useRouter();
    
    return (
        <div>
            <Button onClick={() => router.back()} variant={"outline"} className=" border-none cursor-pointer">
                <ChevronLeft />
                Quay lại
            </Button>
            <h1 className='text-2xl font-bold text-center'>Cập nhập sản phẩm</h1>
            <UpdateForm />
        </div>
    )
}

export default UpdateProductPage