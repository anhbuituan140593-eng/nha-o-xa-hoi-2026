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
      label: "ĐỦ ĐIỀU KIỆN MUA NOXH",
      desc: "Bạn đáp ứng các điều kiện cơ bản để mua nhà ở xã hội theo quy định hiện hành.",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    LIKELY_ELIGIBLE: {
      label: "ĐỦ ĐIỀU KIỆN MUA NOXH",
      desc: "Bạn đáp ứng các điều kiện cơ bản. Vui lòng chuẩn bị hồ sơ để nộp cho cơ quan có thẩm quyền xét duyệt.",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    NEED_VERIFICATION: {
      label: "CẦN XEM XÉT THÊM",
      desc: "Hồ sơ của bạn cần bổ sung hoặc xác minh thêm. Vui lòng liên hệ chuyên viên để được hướng dẫn giấy tờ cần chuẩn bị.",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertTriangle,
    },
    NOT_ELIGIBLE: {
      label: "KHÔNG ĐỦ ĐIỀU KIỆN",
      desc: "Bạn chưa đáp ứng điều kiện mua nhà ở xã hội theo quy định hiện hành.",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
    INSUFFICIENT_DATA: {
      label: "CẦN XEM XÉT THÊM",
      desc: "Thiếu thông tin để đánh giá. Vui lòng bổ sung và kiểm tra lại.",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertTriangle,
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
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">{config.desc}</p>
          <p className="mt-3 text-sm text-muted-foreground">Mã kết quả: {check.checkCode}</p>
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
                  : "secondary"
              }
            >
              {check.housingStatus === "NO_OWNERSHIP"
                ? "✅ Chưa có nhà — đáp ứng"
                : check.housingStatus === "UNDER_15M2"
                  ? "✅ Dưới 15m²/người — đáp ứng"
                  : check.housingStatus === "FAR_FROM_WORK"
                    ? "⚪ Đã ghi nhận"
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
                  : "secondary"
              }
            >
              {check.employmentType === "CONTRACT"
                ? "✅ Có hợp đồng"
                : ["FREELANCE", "BUSINESS", "NO", "OTHER"].includes(check.employmentType || "")
                  ? "⚪ Đã ghi nhận — bổ sung chứng minh thu nhập theo checklist"
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
            <h3 className="mb-2 text-lg font-bold">Trường hợp của bạn cần xem xét thêm</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Hồ sơ của bạn cần bổ sung hoặc xác minh thêm. Đặt lịch để chuyên viên xem thông tin và hướng dẫn giấy tờ cần chuẩn bị.
            </p>
            <Button asChild>
              <Link href="/dat-lich">HẸN CHUYÊN VIÊN</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {check.result === "NOT_ELIGIBLE" && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardContent className="pt-6 text-center">
            <h3 className="mb-2 text-lg font-bold">Bạn chưa đủ điều kiện mua NOXH</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Kết quả cho thấy bạn chưa đáp ứng điều kiện theo quy định hiện hành. Bạn có thể liên hệ chuyên viên để được tư vấn chi tiết về trường hợp của mình.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild variant="outline">
                <Link href="/kiem-tra">KIỂM TRA LẠI</Link>
              </Button>
              <Button asChild>
                <Link href="/dat-lich">LIÊN HỆ TƯ VẤN</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {check.result === "INSUFFICIENT_DATA" && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6 text-center">
            <h3 className="mb-2 text-lg font-bold">Cần xem xét thêm</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Thiếu thông tin để đánh giá đầy đủ. Vui lòng kiểm tra lại hoặc đặt lịch để được tư vấn.
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
