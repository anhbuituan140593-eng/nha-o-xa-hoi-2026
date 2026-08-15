import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Nhà Ở Xã Hội 2026 | Kiểm tra điều kiện – Hồ sơ – Dự án",
  description:
    "Kiểm tra điều kiện mua nhà ở xã hội, tra cứu hồ sơ, biểu mẫu và dự án NOXH đang nhận đăng ký. Hỗ trợ tư vấn miễn phí.",
  keywords: [
    "nhà ở xã hội 2026",
    "điều kiện mua nhà ở xã hội",
    "hồ sơ nhà ở xã hội",
    "dự án nhà ở xã hội",
    "rà soát hồ sơ nhà ở xã hội",
    "làm hồ sơ nhà ở xã hội",
    "tư vấn nhà ở xã hội",
  ],
  openGraph: {
    title: "Nhà Ở Xã Hội 2026",
    description: "Kiểm tra điều kiện, hồ sơ và dự án phù hợp theo quy định pháp luật hiện hành.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
