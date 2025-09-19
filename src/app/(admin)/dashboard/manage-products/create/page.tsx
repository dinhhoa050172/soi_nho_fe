'use client'
import React from 'react'
import CreateForm from './CreateForm'
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CreateProductPage = () => {
    const router = useRouter();

    return (
        <div>
            <Button onClick={() => router.back()} variant={"outline"} className=" border-none cursor-pointer"><ChevronLeft /> Quay lại</Button>
            <h1 className='text-2xl font-bold text-center'>Thêm mới sản phẩm</h1>
            <CreateForm />
        </div>
    )
}

export default CreateProductPage