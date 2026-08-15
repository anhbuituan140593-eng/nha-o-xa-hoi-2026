import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Hồ sơ NOXH trọn gói | Nhà Ở Xã Hội 2026",
  description: "Dịch vụ hỗ trợ hồ sơ nhà ở xã hội trọn gói. Từ kiểm tra điều kiện đến hoàn thiện hồ sơ.",
};

export default function FullPackagePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Hỗ trợ hồ sơ Nhà ở xã hội trọn gói</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Từ kiểm tra điều kiện, lập checklist, hướng dẫn giấy tờ đến rà soát trước khi nộp.
        </p>
      </div>

      {/* What's Included */}
      <div className="mb-10 space-y-6">
        {[
          {
            title: "Kiểm tra điều kiện",
            items: ["Đối tượng", "Nhà ở", "Thu nhập", "Hôn nhân", "Địa phương", "Dự án"],
          },
          {
            title: "Lập checklist",
            items: ["Tạo bộ giấy tờ riêng theo trường hợp của bạn"],
          },
          {
            title: "Hướng dẫn giấy tờ",
            items: ["Hướng dẫn chuẩn bị hồ sơ chi tiết từng loại"],
          },
          {
            title: "Hỗ trợ biểu mẫu",
            items: ["Cung cấp và hướng dẫn điền các biểu mẫu đang có hiệu lực"],
          },
          {
            title: "Rà soát hồ sơ",
            items: [
              "Kiểm tra sai mẫu",
              "Thiếu giấy tờ",
              "Thiếu chữ ký",
              "Thiếu xác nhận",
              "Thông tin không thống nhất",
              "Giấy xác nhận hết hạn",
              "Yêu cầu dự án",
            ],
          },
          {
            title: "Hướng dẫn nộp",
            items: ["Địa chỉ", "Thời gian", "Cơ quan tiếp nhận", "Link chính thức"],
          },
        ].map((section) => (
          <div key={section.title} className="rounded-lg border p-5">
            <h3 className="mb-3 font-semibold text-lg">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="sticky bottom-24 md:static rounded-xl bg-navy-800 p-8 text-center text-white">
        <h2 className="mb-3 text-xl font-bold">Bạn cần hỗ trợ hoàn thiện hồ sơ?</h2>
        <p className="mb-6 text-navy-200">
          Đặt lịch tư vấn trực tiếp để chuyên viên xem xét trường hợp của bạn.
        </p>
        <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-gray-100">
          <Link href="/dat-lich">
            ĐĂNG KÝ TƯ VẤN TRỰC TIẾP <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
