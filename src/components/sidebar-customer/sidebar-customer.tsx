"use client";

import { useAuthRedux } from "@/hooks/useAuthRedux";
import { HandCoins, ListCheck, User } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogoutRequest } from "@/types/auth";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";

const menuItems = [
  {
    title: "Thông tin cá nhân",
    url: "/user/profile",
    icon: User,
  },
  {
    title: "Đơn hàng",
    url: "/user/orders",
    icon: ListCheck,
  },
  {
    title: "Giao dịch",
    url: "/user/transactions",
    icon: HandCoins,
  }
]

export function SidebarCustomer() {
    const dispatch = useAuthRedux();
    const acToken = Cookies.get("accessToken");
    const router = useRouter();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const handleLogout = async () => {
        try {
            if (acToken) {
                await dispatch.logout({ token: acToken } as LogoutRequest);
            } else {
                toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Có lỗi khi đăng xuất. Đã xóa phiên tạm thời.");
        } finally {
            localStorage.removeItem("user");
            router.replace("/login");
        }
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {isCollapsed && (
                    <div className="flex justify-center p-2">
                        <SidebarTrigger />
                    </div>
                )}
                <SidebarGroup>
                    <SidebarGroupLabel className="mb-4 justify-between">
                        <Link 
                            href="/" 
                            className={`
                                flex items-center gap-2 p-2 rounded-lg 
                                hover:text-accent-foreground 
                                transition-colors duration-200
                                ${isCollapsed ? 'justify-center' : 'justify-start'}
                            `}
                        >
                            {!isCollapsed && (
                                <span className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                    Sợi nhớ Store
                                </span>
                            )}
                        </Link>
                        <div className="flex justify-end p-2">
                            <SidebarTrigger />
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title} className={isCollapsed ? "justify-center" : ""}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url} className={isCollapsed ? "flex flex-col items-center justify-center" : "flex items-center gap-2"}>
                                            <item.icon className="w-6 h-6" />
                                            {!isCollapsed && <span>{item.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {/* Logout button at the bottom */}
                <div className="mt-auto pb-4 flex justify-center">
                    <Button
                        onClick={handleLogout}
                        className={isCollapsed ? "w-10 h-10 p-0 flex items-center justify-center" : "w-full flex items-center gap-2"}
                        variant={isCollapsed ? "ghost" : "default"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        {!isCollapsed && "Đăng xuất"}
                    </Button>
                </div>
            </SidebarContent>
        </Sidebar>
    )
}