"use client";

import { Banner } from "@/components/Banner";
import React, { useEffect, useState } from "react";
import CarouselProduct from "@/components/CarouselProduct";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{
    [key: string]: Product[];
  }>({});

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      // Fetch tất cả category
      const resCat = await fetch("/api/categories");
      const dataCat = await resCat.json();
      const cats = dataCat.data || dataCat.items || [];

      // Lọc đúng 3 category mong muốn
      const selectedNames = ["Len Land", "Hoa len", "Túi xách len"];
      const selectedCats = selectedNames
        .map((name) => cats.find((cat: Category) => cat.name === name))
        .filter(Boolean) as Category[];
      setCategories(selectedCats);

      // Fetch 8 sản phẩm cho mỗi category
      const proms = selectedCats.map(async (cat: Category) => {
        const resPro = await fetch(
          `/api/products?category_name=${encodeURIComponent(cat.name)}&limit=8`
        );
        const dataPro = await resPro.json();
        return { category: cat, products: dataPro.data || dataPro.items || [] };
      });
      const all = await Promise.all(proms);
      const obj: { [key: string]: Product[] } = {};
      all.forEach(({ category, products }) => {
        obj[category.name] = products;
      });
      setProductsByCategory(obj);
    };
    fetchCategoriesAndProducts();
  }, []);

  return (
    <div>
      <Banner />
      {categories.map((cat) => (
        <div key={cat.id} className="my-8">
          <CarouselProduct
            products={productsByCategory[cat.name] || []}
            title={cat.name}
          />
        </div>
      ))}
    </div>
  );
};

export default HomePage;
