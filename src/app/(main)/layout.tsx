"use client";

import { MiniCartContext } from "@/context/MiniCartContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart } from "@/store/slices/cartSlice";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [showMiniCart, setShowMiniCart] = useState(false);
    const openMiniCart = () => setShowMiniCart(true);
    const user = useAppSelector((state) => state.user.user);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCart(user.id));
        }
    }, [user?.id, dispatch]);

    return (
        <MiniCartContext.Provider value={{ openMiniCart }}>
            <div className="flex flex-col min-h-screen bg-background">
                <Header showMiniCart={showMiniCart} setShowMiniCart={setShowMiniCart} />

                <main className="flex-1 container mx-auto px-2 sm:px-4 w-full">
                    {children}
                </main>

                <Footer />
            </div>
        </MiniCartContext.Provider>
    );
}