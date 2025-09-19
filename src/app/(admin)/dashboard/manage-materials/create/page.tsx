"use client";

import React from 'react'
import CreateMaterialForm from './CreateForm'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const CreateMaterialPage = () => {
    const router = useRouter();

    return (
        <div>
            <Button onClick={() => router.back()} variant={"outline"} className=" border-none cursor-pointer"><ChevronLeft /> Quay lại</Button>
            <h1 className='text-2xl font-bold text-center'>Tạo nguyên liệu mới</h1>
            <CreateMaterialForm />
        </div>
    )
}

export default CreateMaterialPage