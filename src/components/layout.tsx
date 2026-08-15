"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Calendar, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  contact?: {
    hotline?: string | null;
    zaloUrl?: string | null;
    siteName?: string;
    logoUrl?: string | null;
    disclaimerLegal?: string | null;
    disclaimerService?: string | null;
  };
}

const NAV_ITEMS = [
  { href: "/", label: "Trang chủ" },
  { href: "/kiem-tra", label: "Kiểm tra điều kiện" },
  { href: "/du-an", label: "Dự án" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/bieu-mau", label: "Biểu mẫu" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Header({ contact }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileMenuOpen(false)}>
          {contact?.logoUrl ? (
            <img src={contact.logoUrl} alt={contact.siteName || "Logo"} className="h-7 w-7 md:h-8 md:w-8 object-contain" />
          ) : (
            <div className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-navy-800 text-xs md:text-sm font-bold text-white">
              N
            </div>
          )}
          <span className="text-base md:text-lg font-bold text-navy-900 leading-tight">
            {contact?.siteName || "Nhà Ở Xã Hội 2026"}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-navy-800"
                  : "text-gray-600 hover:text-navy-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side: phone + CTA + hamburger */}
        <div className="flex items-center gap-2">
          {contact?.hotline && (
            <a
              href={`tel:${contact.hotline.replace(/\s/g, "")}`}
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-navy-700"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{contact.hotline}</span>
            </a>
          )}
          <Button asChild size="sm" variant="navy" className="hidden md:inline-flex">
            <Link href="/dat-lich">Đặt lịch tư vấn</Link>
          </Button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-navy-800 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white shadow-lg">
          <nav className="container mx-auto px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-navy-50 text-navy-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 border-t pt-4">
              <Button asChild className="w-full" variant="navy">
                <Link href="/dat-lich" onClick={() => setMobileMenuOpen(false)}>
                  Đặt lịch tư vấn
                </Link>
              </Button>
              {contact?.hotline && (
                <a
                  href={`tel:${contact.hotline.replace(/\s/g, "")}`}
                  className="mt-3 flex items-center justify-center gap-2 rounded-lg border py-3 text-base font-medium text-navy-700 hover:bg-navy-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="h-4 w-4" />
                  Gọi hotline: {contact.hotline}
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer({ contact }: HeaderProps) {
  return (
    <footer className="border-t bg-navy-900 text-white">
      <div className="container mx-auto px-3 md:px-4 py-10 md:py-12">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">{contact?.siteName || "Nhà Ở Xã Hội 2026"}</h3>
            <p className="text-sm text-navy-200 leading-relaxed">
              Hỗ trợ kiểm tra điều kiện, chuẩn bị hồ sơ và tư vấn mua nhà ở xã hội theo quy định pháp luật hiện hành.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-navy-200">
              <li><Link href="/kiem-tra" className="hover:text-white">Kiểm tra điều kiện</Link></li>
              <li><Link href="/du-an" className="hover:text-white">Dự án NOXH</Link></li>
              <li><Link href="/dich-vu" className="hover:text-white">Dịch vụ hồ sơ</Link></li>
              <li><Link href="/bieu-mau" className="hover:text-white">Biểu mẫu</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Pháp lý</h4>
            <ul className="space-y-2 text-sm text-navy-200">
              <li><Link href="/phap-luat" className="hover:text-white">Văn bản pháp luật</Link></li>
              <li><Link href="/faq" className="hover:text-white">Câu hỏi thường gặp</Link></li>
              <li><Link href="/chinh-sach-bao-mat" className="hover:text-white">Chính sách bảo mật</Link></li>
              <li><Link href="/dieu-khoan" className="hover:text-white">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Liên hệ</h4>
            <div className="space-y-3 text-sm text-navy-200">
              {contact?.hotline && (
                <a href={`tel:${contact.hotline.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4" />
                  {contact.hotline}
                </a>
              )}
              {contact?.zaloUrl && (
                <a href={contact.zaloUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white">
                  <MessageCircle className="h-4 w-4" />
                  Nhắn Zalo
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-navy-800 pt-8 text-center text-xs text-navy-300">
          <p className="mb-2 leading-relaxed">
            {contact?.disclaimerLegal ||
              "Thông tin trên website nhằm hỗ trợ người dùng tự đánh giá sơ bộ điều kiện và chuẩn bị hồ sơ nhà ở xã hội. Kết quả trên website không phải quyết định xét duyệt của cơ quan nhà nước."}
          </p>
          <p>&copy; {new Date().getFullYear()} {contact?.siteName || "Nhà Ở Xã Hội 2026"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function MobileStickyCTA({ contact }: HeaderProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-2 pb-safe shadow-lg md:hidden">
      <div className="flex items-center justify-between gap-1.5 max-w-md mx-auto">
        <a
          href={`tel:${(contact?.hotline || "").replace(/\s/g, "")}`}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-lg bg-green-600 py-2.5 text-xs font-medium text-white active:bg-green-700"
        >
          <Phone className="h-5 w-5" />
          Gọi
        </a>
        <a
          href={contact?.zaloUrl || "#"}
          className="flex flex-1 flex-col items-center gap-0.5 rounded-lg bg-blue-500 py-2.5 text-xs font-medium text-white active:bg-blue-600"
        >
          <MessageCircle className="h-5 w-5" />
          Zalo
        </a>
        <Link
          href="/dat-lich"
          className="flex flex-1 flex-col items-center gap-0.5 rounded-lg bg-navy-800 py-2.5 text-xs font-medium text-white active:bg-navy-900"
        >
          <Calendar className="h-5 w-5" />
          Đặt lịch
        </Link>
      </div>
    </div>
  );
}
