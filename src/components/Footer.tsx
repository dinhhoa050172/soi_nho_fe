import Link from "next/link";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Image from "next/image";
import logo from "@/asset/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 px-6 py-5 mt-10 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Slogan */}
        <div className="flex flex-col items-center">
          <Link href="/">
            <Image src={logo} alt="Logo" width={70} height={70} />
          </Link>
          <h2 className="text-2xl font-bold mb-2">Sợi Nhớ</h2>
          <p className="text-sm">
            Cửa hàng đồ len handmade chất lượng & yêu thương.
          </p>
        </div>

        {/* Về chúng tôi */}
        <div className="md:block hidden">
          <h3 className="text-lg font-semibold mb-2">Về chúng tôi</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/about">Giới thiệu</Link>
            </li>
            <li>
              <Link href="/design">Thiết kế độc quyền</Link>
            </li>
            <li>
              <Link href="/policy">Chính sách</Link>
            </li>
            <li>
              <Link href="/contact">Liên hệ</Link>
            </li>
          </ul>
        </div>

        {/* Danh mục */}
        <div className="hidden md:block">
          <h3 className="text-lg font-semibold mb-2">Danh mục</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/categories/hoa-len?name=Hoa%20len">Hoa len</Link>
            </li>
            <li>
              <Link href="/categories/thu-nhoi-bong?name=Thú%20nhồi%20bông">Thú nhồi bông</Link>
            </li>
            <li>
              <Link href="/categories/tui-xach-len?name=Túi%20xách%20len">Túi xách len</Link>
            </li>
            <li>
              <Link href="/categories/moc-khoa-len?name=Móc%20khóa%20len">Móc khóa len</Link>
            </li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div className="md:block hidden">
          <h3 className="text-lg font-semibold mb-2">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> 0123 456 789
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> soinhoshop@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <Facebook className="w-4 h-4" />
              <a href="https://www.facebook.com/profile.php?id=61577079565393" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Mobile: Về chúng tôi + Liên hệ dạng 2 cột */}
        <div className="grid grid-cols-2 gap-4 md:hidden">
          {/* Về chúng tôi */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Về chúng tôi</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link href="/design">Thiết kế độc quyền</Link>
              </li>
              <li>
                <Link href="/policy">Chính sách</Link>
              </li>
              <li>
                <Link href="/contact">Liên hệ</Link>
              </li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Liên hệ</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> 0123 456 789
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> hello@soinho.vn
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                <a href="https://www.facebook.com/profile.php?id=61577079565393" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Sợi Nhớ. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
