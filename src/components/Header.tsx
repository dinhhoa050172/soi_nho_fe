"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/asset/logo.png";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  UserCog,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuthRedux } from "@/hooks/useAuthRedux";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import Cookies from "js-cookie";
import { LogoutRequest } from "@/types/auth";
import toast from "react-hot-toast";
import { useAppSelector } from "@/store/hooks";
import { Badge } from "./ui/badge";
import MiniCartPopup from "@/components/MiniCartPopup";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const Header = ({
  showMiniCart,
  setShowMiniCart,
}: {
  showMiniCart: boolean;
  setShowMiniCart: (v: boolean) => void;
}) => {
  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const userData = user ? JSON.parse(user) : null;
  const dispatch = useAuthRedux();
  const acToken = Cookies.get("accessToken");
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [loading, setLoading] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items || []);
  const cartRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const cartCount = (cartItems || []).reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const pathname = usePathname();

  const getCategory = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/categories`
    );
    if (!res.ok) {
      setCategories([]);
      return;
    }
    try {
      const data = await res.json();
      if (!data.data) setCategories([]);
      setCategories(data.data || []);
    } catch (error) {
      setCategories([]);
      console.error("Lỗi parse JSON categories:", error);
    }
  };

  const getProductByName = async (name: string) => {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || ""
      }/api/users/products?name=${name}`
    );
    if (!res.ok) {
      setProducts([]);
      return;
    }
    try {
      const data = await res.json();
      if (!data.data) setProducts([]);
      setProducts(data.data || []);
    } catch (error) {
      setProducts([]);
      console.error("Lỗi parse JSON products:", error);
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setMobileCategoriesOpen(false);
    getCategory();
  }, [pathname]);

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setProducts([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await getProductByName(debouncedSearchTerm);
      setLoading(false);
    };

    fetchData();
  }, [debouncedSearchTerm]);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowMiniCart(false);
      }
    }
    if (showMiniCart) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMiniCart]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setSearchTerm("");
        setProducts([]);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search Results Component
  const SearchResults = ({ className = "" }: { className?: string }) => (
    <div className={cn("absolute bg-white border shadow-lg rounded-md w-full z-50 mt-1 max-h-80 overflow-y-auto", className)}>
      {loading ? (
        <div className="p-4 space-y-2">
          {[...Array(4)].map((_, idx) => (
            <Skeleton key={idx} className="h-10 w-full rounded-md" />
          ))}
        </div>
      ) : products.length > 0 ? (
        products.map((product) => {
          const firstImage = product.productImages[0]?.url;
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              onClick={() => {
                setSearchTerm("");
                setMobileSearchOpen(false);
                setMobileMenuOpen(false);
              }}
              className="flex items-center px-4 py-3 hover:bg-gray-50 gap-3 border-b last:border-b-0"
            >
              {firstImage && (
                <div className="w-10 h-10 flex-shrink-0">
                  <Image
                    src={firstImage}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded object-cover w-full h-full"
                  />
                </div>
              )}
              <span className="text-sm font-medium line-clamp-2">{product.name}</span>
            </Link>
          );
        })
      ) : (
        <p className="px-4 py-3 text-gray-500 italic text-center">
          Không tìm thấy sản phẩm.
        </p>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      {/* Main Header */}
      <div className="container mx-auto">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex-shrink-0">
              <Image 
                src={logo} 
                alt="Logo" 
                width={30} 
                height={50} 
                className="w-14 h-10 sm:w-16 sm:h-12 lg:w-18 lg:h-14" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-2xl">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/products">Sản phẩm</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Danh mục</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 grid-cols-2 p-2">
                      {categories.map((item) => (
                        <ListItem
                          key={item.name}
                          title={item.name}
                          href={`/categories/${
                            item.slug
                          }?name=${encodeURIComponent(item.name)}`}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/design">Thiết kế độc quyền</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/about">Về chúng tôi</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Search & User Menu */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            {/* Search */}
            <div className="relative w-50 xl:w-90" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-2 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <SearchResults />}
            </div>

            {/* User Menu */}
            {user ? (
              <>
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="border px-2 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
                        <User className="w-4 h-4" />
                        <span className="max-w-24 truncate">{userData.fullName}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="p-2 w-40">
                          <li>
                            {userData.roleName === "Admin" ? (
                              <Link
                                href="/dashboard"
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                              >
                                <UserCog className="w-4 h-4" />
                                Quản lý
                              </Link>
                            ) : (
                              <Link
                                href="/user/profile"
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md text-sm"
                              >
                                <UserCog className="w-4 h-4" />
                                Hồ sơ
                              </Link>
                            )}
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm"
                            >
                              <LogOut className="w-4 h-4" />
                              Đăng xuất
                            </button>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>

                {/* Cart */}
                <div className="relative mr-2" ref={cartRef}>
                  <button
                    onClick={() => setShowMiniCart(!showMiniCart)}
                    className="relative p-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs bg-pink-600 text-white min-w-[18px] h-[18px] flex items-center justify-center">
                        {cartCount > 99 ? "99+" : cartCount}
                      </Badge>
                    )}
                  </button>
                  {showMiniCart && (
                    <MiniCartPopup
                      items={cartItems}
                      onClose={() => setShowMiniCart(false)}
                    />
                  )}
                </div>
              </>
            ) : (
              <Link href="/login" className={buttonVariants({ size: "sm" })}>
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile Right Section */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Search Button (Tablet) */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="hidden md:block p-2 hover:bg-gray-100 rounded-lg"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart (Mobile & Tablet) */}
            {user && (
              <Link 
                href="/cart" 
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-xs bg-pink-600 text-white min-w-[18px] h-[18px] flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Link>
            )}

            {/* Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Search Bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-t bg-white px-4 py-3" ref={mobileSearchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10 pr-4 py-2 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <SearchResults />}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-2 space-y-1">
            {/* Search (Mobile only) */}
            <div className="md:hidden relative my-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 pr-4 py-2 text-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <SearchResults />}
            </div>

            {/* Navigation Links */}
            <Link 
              href="/products" 
              className="block py-3 px-2 font-medium hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sản phẩm
            </Link>

            {/* Categories */}
            <div>
              <button
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="flex items-center justify-between w-full py-3 px-2 font-medium hover:bg-gray-50 rounded-md transition-colors"
              >
                Danh mục
                <ChevronDown className={cn("w-4 h-4 transition-transform", mobileCategoriesOpen && "rotate-180")} />
              </button>
              {mobileCategoriesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {categories.map((item) => (
                    <Link
                      key={item.name}
                      href={`/categories/${item.slug}?name=${encodeURIComponent(item.name)}`}
                      className="block py-2 px-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileCategoriesOpen(false);
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/design" 
              className="block py-3 px-2 font-medium hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Thiết kế độc quyền
            </Link>

            <Link 
              href="/about" 
              className="block py-3 px-2 font-medium hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Về chúng tôi
            </Link>

            {/* User Section */}
            <div className="sticky bottom-0 bg-white border-t px-4 py-3">
            {user ? (
              <div className="space-y-2">
                {/* <div className="px-2 py-2 bg-gray-50 rounded-md">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4" />
                    <span className="truncate">{userData.fullName}</span>
                  </div>
                </div> */}
                <div className="flex gap-2">
                  <Link
                    href={userData.roleName === "Admin" ? "/dashboard" : "/user/profile"}
                    className="flex items-center justify-center gap-2 flex-1 py-2 px-2 hover:bg-gray-50 rounded-md transition-colors text-sm border"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCog className="w-4 h-4" />
                    {userData.roleName === "Admin" ? "Quản lý" : "Hồ sơ"}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 flex-1 py-2 px-2 hover:bg-red-50 rounded-md transition-colors text-sm text-red-600 border border-red-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                href="/login" 
                className={cn(buttonVariants(), "w-full justify-center")}
                onClick={() => setMobileMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
          </div>
        </div>
      )}
    </header>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="block p-2 hover:bg-gray-50 rounded-md transition-colors">
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug mt-1">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Header;