import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, AlertTriangle, Info, FileText, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const check = await prisma.eligibilityCheck.findUnique({
    where: { checkCode: id },
    include: {
      generatedChecklists: true,
      answers: true,
    },
  });

  if (!check) {
    notFound();
  }

  const resultConfig = {
    ELIGIBLE: {
      label: "CÓ KHẢ NĂNG ĐỦ ĐIỀU KIỆN",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    LIKELY_ELIGIBLE: {
      label: "CÓ KHẢ NĂNG ĐÁP ỨNG",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle,
    },
    NEED_VERIFICATION: {
      label: "CẦN XÁC MINH THÊM",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertTriangle,
    },
    NOT_ELIGIBLE: {
      label: "CHƯA ĐỦ ĐIỀU KIỆN",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
    INSUFFICIENT_DATA: {
      label: "THIẾU THÔNG TIN",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Info,
    },
  };

  const config = resultConfig[check.result] || resultConfig.INSUFFICIENT_DATA;
  const Icon = config.icon;

  return (
    <div className="container mx-auto max-w-3xl px-3 py-6 sm:px-4 sm:py-8">
      {/* Result Header */}
      <Card className="mb-6">
        <CardContent className="pt-6 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.color.split(" ")[0]}`}>
            <Icon className={`h-8 w-8 ${config.color.split(" ")[1]}`} />
          </div>
          <Badge variant="outline" className={`mb-4 ${config.color}`}>
            {config.label}
          </Badge>
          <p className="text-sm text-muted-foreground">Mã kết quả: {check.checkCode}</p>
        </CardContent>
      </Card>

      {/* Evaluation Details from Engine */}
      {(check.rulesApplied as Array<{ category: string; passed: boolean; actualValue?: number; value?: number }>)?.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chi tiết đánh giá theo quy định</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(check.rulesApplied as Array<{ code: string; name: string; category: string; operator: string; value: number; passed: boolean; actualValue?: number }>).map((rule, i) => (
              <div key={i} className={`flex items-center justify-between rounded-lg border p-3 sm:p-4 ${rule.passed ? "bg-green-50" : "bg-red-50"}`}>
                <div>
                  <p className="text-sm font-medium sm:text-base">{rule.name}</p>
                  {rule.actualValue !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      Giá trị thực tế: {new Intl.NumberFormat("vi-VN").format(rule.actualValue)} ₫
                    </p>
                  )}
                </div>
                <Badge variant={rule.passed ? "success" : "destructive"}>
                  {rule.passed ? "✅ Đạt" : "❌ Không đạt"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tóm tắt hồ sơ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Applicant Type */}
          <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
            <span className="text-sm font-medium sm:text-base">Đối tượng</span>
            <Badge variant={check.applicantType ? "success" : "warning"}>
              {check.applicantType ? "✅ Phù hợp" : "🟡 Cần kiểm tra"}
            </Badge>
          </div>

          {/* Housing */}
          <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
            <span className="text-sm font-medium sm:text-base">Nhà ở</span>
            <Badge
              variant={
                check.housingStatus === "NO_OWNERSHIP" || check.housingStatus === "UNDER_15M2"
                  ? "success"
                  : check.housingStatus === "FAR_FROM_WORK"
                    ? "warning"
                    : check.housingStatus === "OTHER"
                      ? "secondary"
                      : "secondary"
              }
            >
              {check.housingStatus === "NO_OWNERSHIP"
                ? "✅ Chưa có nhà — đáp ứng"
                : check.housingStatus === "UNDER_15M2"
                  ? "✅ Dưới 15m²/người — đáp ứng"
                  : check.housingStatus === "FAR_FROM_WORK"
                    ? "🟡 Cần xác nhận khoảng cách"
                    : check.housingStatus === "OTHER"
                      ? "⚪ Trường hợp khác"
                      : "⚪ Chưa rõ"}
            </Badge>
          </div>

          {/* Income */}
          <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
            <span className="text-sm font-medium sm:text-base">Thu nhập hộ gia đình</span>
            <span className="text-xs font-medium sm:text-sm">
              {new Intl.NumberFormat("vi-VN").format(Number(check.householdIncome))} ₫/tháng
            </span>
          </div>

          {/* Employment */}
          <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
            <span className="text-sm font-medium sm:text-base">Việc làm</span>
            <Badge
              variant={
                check.employmentType === "CONTRACT"
                  ? "success"
                  : ["FREELANCE", "BUSINESS"].includes(check.employmentType || "")
                    ? "warning"
                    : "secondary"
              }
            >
              {check.employmentType === "CONTRACT"
                ? "✅ Có hợp đồng"
                : ["FREELANCE", "BUSINESS"].includes(check.employmentType || "")
                  ? "🟡 Lao động tự do"
                  : "⚪ Chưa rõ"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      {check.generatedChecklists.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Hồ sơ bạn cần chuẩn bị</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {check.generatedChecklists.map((item) => (
                <li key={item.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-navy-600" />
                  <div>
                    <p className="font-medium">{item.itemName}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* CTA Section */}
      {(check.result === "ELIGIBLE" || check.result === "LIKELY_ELIGIBLE") && (
        <Card className="mb-6 bg-navy-50 border-navy-200">
          <CardContent className="pt-6 text-center">
            <h3 className="mb-2 text-lg font-bold">Bạn muốn được hỗ trợ hoàn thiện hồ sơ?</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Chuyên viên có thể rà soát trường hợp của bạn và hướng dẫn bộ hồ sơ cần chuẩn bị.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href="/dat-lich">ĐẶT LỊCH TƯ VẤN</Link>
              </Button>
              <Button asChild variant="outline">
                <a href="https://zalo.me/0901234567" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  NHẮN ZALO
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {check.result === "NEED_VERIFICATION" && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6 text-center">
            <h3 className="mb-2 text-lg font-bold">Trường hợp của bạn cần kiểm tra thêm</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Bạn có thể đặt lịch gặp trực tiếp để chuyên viên xem thông tin và hướng dẫn giấy tờ cần xác minh.
            </p>
            <Button asChild>
              <Link href="/dat-lich">HẸN CHUYÊN VIÊN</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-center text-xs text-muted-foreground">
        Thông tin trên website nhằm hỗ trợ người dùng tự đánh giá sơ bộ điều kiện và chuẩn bị hồ sơ nhà ở xã hội.
        Kết quả trên website không phải quyết định xét duyệt của cơ quan nhà nước, chủ đầu tư hoặc đơn vị có thẩm quyền.
      </p>
    </div>
  );
}
