"use client";

import React from "react";
import CreateCategoryForm from "./CreateForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateCategoryPage = () => {
    const router = useRouter();

  return (
    <div>
      <Button
        onClick={() => router.back()}
        variant={"outline"}
        className=" border-none cursor-pointer"
      >
        <ChevronLeft /> Quay lại
      </Button>

      <h1 className="text-2xl font-bold text-center">Tạo danh mục mới</h1>
      <CreateCategoryForm />
    </div>
  );
};

export default CreateCategoryPage;
