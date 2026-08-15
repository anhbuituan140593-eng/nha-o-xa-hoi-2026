import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateLegalDocument } from "../../actions";
import LegalFields from "../../legal-fields";

export default async function EditLegalDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const doc = await prisma.legalDocument.findUnique({ where: { id } });

  if (!doc) {
    return <Card><CardContent className="py-12 text-center">Không tìm thấy văn bản</CardContent></Card>;
  }

  const boundUpdate = updateLegalDocument.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/legal"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Link>
        </Button>
        <h1 className="text-2xl font-bold">Sửa văn bản pháp luật</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>{doc.documentNumber} - {doc.title}</CardTitle></CardHeader>
        <CardContent>
          <form action={boundUpdate} className="space-y-5">
            <LegalFields
              defaults={{
                documentNumber: doc.documentNumber,
                title: doc.title,
                documentType: doc.documentType,
                issuingAuthority: doc.issuingAuthority,
                issuedDate: doc.issuedDate,
                effectiveDate: doc.effectiveDate,
                expiryDate: doc.expiryDate,
                summary: doc.summary,
                officialUrl: doc.officialUrl,
                pdfUrl: doc.pdfUrl,
                status: doc.status,
                version: doc.version,
              }}
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit">Lưu thay đổi</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/legal">Hủy</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
