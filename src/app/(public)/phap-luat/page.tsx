import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Văn bản pháp luật về nhà ở xã hội | Nhà Ở Xã Hội 2026",
  description: "Tổng hợp văn bản pháp luật về nhà ở xã hội: Luật Nhà ở, Nghị định, Thông tư.",
};

const docTypeLabels: Record<string, string> = {
  LAW: "Luật",
  DECREE: "Nghị định",
  RESOLUTION: "Nghị quyết",
  CIRCULAR: "Thông tư",
  DECISION: "Quyết định",
  OTHER: "Khác",
};

export default async function LegalPage() {
  const documents = await prisma.legalDocument.findMany({
    where: { status: "ACTIVE" },
    orderBy: [{ effectiveDate: "desc" }, { documentNumber: "asc" }],
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Văn bản pháp luật</h1>
        <p className="mt-2 text-muted-foreground">
          Các văn bản quy phạm pháp luật về nhà ở xã hội đang có hiệu lực
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 shrink-0 text-navy-600" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{docTypeLabels[doc.documentType] || doc.documentType}</Badge>
                      <span className="font-semibold">{doc.documentNumber}</span>
                    </div>
                    <h3 className="mt-2 font-medium">{doc.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ban hành: {new Date(doc.issuedDate).toLocaleDateString("vi-VN")} •{" "}
                      Hiệu lực: {new Date(doc.effectiveDate).toLocaleDateString("vi-VN")}
                    </p>
                    {doc.summary && (
                      <p className="mt-2 text-sm leading-relaxed">{doc.summary}</p>
                    )}
                  </div>
                </div>
                {doc.officialUrl && (
                  <a
                    href={doc.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm text-navy-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        📌 Thông tin được cập nhật từ các nguồn chính thức: Cổng thông tin Chính phủ, Cơ sở dữ liệu quốc gia về văn bản pháp luật, Bộ Xây dựng.
      </div>
    </div>
  );
}
