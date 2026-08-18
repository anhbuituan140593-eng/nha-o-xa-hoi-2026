import Link from "next/link";
import { CheckCircle, FileText, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dịch vụ hỗ trợ hồ sơ nhà ở xã hội | Nhà Ở Xã Hội 2026",
  description: "Dịch vụ hỗ trợ chuẩn bị, rà soát hồ sơ mua nhà ở xã hội. Tư vấn miễn phí.",
};

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
      <div className="mb-8 text-center md:mb-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Dịch vụ hỗ trợ hồ sơ</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
          Hỗ trợ chuyên nghiệp từ kiểm tra điều kiện đến hoàn thiện hồ sơ
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-4 sm:gap-8 md:grid-cols-2">
        {/* Full Package */}
        <Card className="border-2 border-navy-200">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 text-navy-700 mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Hồ sơ NOXH trọn gói</CardTitle>
            <CardDescription>
              Từ kiểm tra điều kiện, lập checklist, hướng dẫn giấy tờ đến rà soát trước khi nộp.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-3">
              {[
                "Kiểm tra điều kiện đối tượng, nhà ở, thu nhập",
                "Lập checklist hồ sơ cá nhân hóa",
                "Hướng dẫn chuẩn bị giấy tờ",
                "Hỗ trợ điền biểu mẫu",
                "Rà soát hồ sơ trước khi nộp",
                "Hướng dẫn nộp hồ sơ đúng quy định",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full">
              <Link href="/dich-vu/ho-so-tron-goi">ĐẶT LỊCH TƯ VẤN</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Review Service */}
        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Rà soát hồ sơ NOXH</CardTitle>
            <CardDescription>
              Chuyên viên kiểm tra thành phần hồ sơ, biểu mẫu, giấy xác nhận và các vấn đề cần bổ sung.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-3">
              {[
                "Kiểm tra thành phần hồ sơ",
                "Kiểm tra biểu mẫu đang có hiệu lực",
                "Kiểm tra giấy xác nhận hết hạn",
                "Báo cáo chi tiết từng tài liệu",
                "Hướng dẫn bổ sung",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dich-vu/ra-soat-ho-so">ĐẶT LỊCH RÀ SOÁT</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Process Note */}
      <div className="mx-auto mt-12 max-w-2xl text-center">
        <Card className="bg-navy-50 border-navy-200">
          <CardContent className="pt-6">
            <Users className="mx-auto mb-4 h-8 w-8 text-navy-600" />
            <h3 className="mb-2 font-semibold">Quy trình dịch vụ — Miễn phí tư vấn</h3>
            <p className="text-sm text-muted-foreground">
              Khách gửi yêu cầu → Nhân viên gọi điện → Hẹn lịch gặp → Gặp trực tiếp →
              Tư vấn → Thống nhất dịch vụ → Hoàn thiện hồ sơ
            </p>
            <p className="mt-3 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Miễn phí tư vấn ban đầu — Không thu phí qua website
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
