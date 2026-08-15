import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Rà soát hồ sơ nhà ở xã hội | Nhà Ở Xã Hội 2026",
  description: "Dịch vụ rà soát hồ sơ trước khi nộp. Kiểm tra thành phần, biểu mẫu và giấy xác nhận.",
};

export default function ReviewServicePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Hero */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <Search className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold">Đã có hồ sơ? Hãy rà soát trước khi nộp.</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Chuyên viên kiểm tra thành phần hồ sơ, biểu mẫu, giấy xác nhận và các vấn đề cần bổ sung.
        </p>
      </div>

      {/* What's Checked */}
      <div className="mb-10 space-y-4">
        <h2 className="text-xl font-semibold">Chúng tôi sẽ kiểm tra:</h2>
        {[
          { status: "🟢", label: "Đầy đủ", desc: "Giấy tờ đúng yêu cầu" },
          { status: "🟡", label: "Cần kiểm tra", desc: "Cần xem xét thêm" },
          { status: "🔴", label: "Cần bổ sung", desc: "Thiếu hoặc không hợp lệ" },
          { status: "🔵", label: "Đang chờ xác minh", desc: "Cần liên hệ cơ quan" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-4 rounded-lg border p-4">
            <span className="text-2xl">{item.status}</span>
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Example Report */}
      <div className="mb-10 rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 font-semibold">Ví dụ báo cáo rà soát:</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span>Đơn đăng ký</span>
            <span className="text-green-600">🟢 Đầy đủ</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Xác nhận thu nhập</span>
            <span className="text-yellow-600">🟡 Cần kiểm tra</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span>Xác nhận nhà ở</span>
            <span className="text-red-600">🔴 Chưa có</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-24 md:static rounded-xl bg-navy-800 p-8 text-center text-white">
        <h2 className="mb-3 text-xl font-bold">Muốn rà soát hồ sơ của bạn?</h2>
        <p className="mb-6 text-navy-200">
          Đặt lịch để chuyên viên kiểm tra và hướng dẫn bổ sung.
        </p>
        <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-gray-100">
          <Link href="/dat-lich">
            ĐẶT LỊCH RÀ SOÁT <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
