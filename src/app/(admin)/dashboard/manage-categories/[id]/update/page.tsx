'use client'
import React from 'react'
import UpdateCategoryForm from './UpdateCategoryForm'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const UpdateCategoryPage = () => {
    const router = useRouter();
    return (
        <div>
            <Button onClick={() => router.back()} variant={"outline"} className=" border-none cursor-pointer">
                <ChevronLeft />
                Quay lại
            </Button>
            <h1 className="text-center text-2xl font-bold mb-4">Cập nhật danh mục</h1>
            <UpdateCategoryForm />
        </div>
    )
}

export default UpdateCategoryPage