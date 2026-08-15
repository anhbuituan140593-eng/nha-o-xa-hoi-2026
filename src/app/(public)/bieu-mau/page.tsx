import { FileDown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Biểu mẫu nhà ở xã hội | Nhà Ở Xã Hội 2026",
  description: "Tải biểu mẫu hồ sơ nhà ở xã hội: đơn đăng ký mua, thuê, thuê mua, xác nhận đối tượng, thu nhập.",
};

export default async function FormsPage() {
  const forms = await prisma.applicationForm.findMany({
    where: { active: true },
    include: { legalDocument: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Biểu mẫu hồ sơ NOXH</h1>
        <p className="mt-2 text-muted-foreground">
          Các biểu mẫu theo quy định pháp luật hiện hành
        </p>
      </div>

      {forms.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">Đang cập nhật biểu mẫu</p>
            <p className="text-sm text-muted-foreground">
              Vui lòng quay lại sau hoặc liên hệ để được hỗ trợ.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {forms.map((form) => (
            <Card key={form.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 shrink-0 text-navy-600" />
                  <div>
                    <h3 className="font-semibold">{form.name}</h3>
                    {form.description && (
                      <p className="text-sm text-muted-foreground">{form.description}</p>
                    )}
                    {form.legalDocument && (
                      <Badge variant="secondary" className="mt-2">
                        Căn cứ: {form.legalDocument.documentNumber}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button asChild variant="outline">
                  <a href={form.fileUrl} target="_blank" rel="noopener noreferrer">
                    <FileDown className="mr-2 h-4 w-4" />
                    Tải mẫu
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
        💡 Nếu bạn cần hướng dẫn điền biểu mẫu, chuyên viên có thể hỗ trợ miễn phí trong buổi tư vấn đầu tiên.
      </div>
    </div>
  );
}
