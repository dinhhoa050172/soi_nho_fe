'use client'
import React from 'react'
import UpdateMaterialForm from './UpdateForm'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const UpdateMaterialPage = () => {
    const router = useRouter();
    return (
        <div>
            <Button onClick={() => router.back()} variant={"outline"} className=" border-none cursor-pointer">
                <ChevronLeft />
                Quay lại
            </Button>
            <h1 className="text-center text-2xl font-bold mb-4">Cập nhật nguyên liệu</h1>
            <UpdateMaterialForm />
        </div>
    )
}

export default UpdateMaterialPage