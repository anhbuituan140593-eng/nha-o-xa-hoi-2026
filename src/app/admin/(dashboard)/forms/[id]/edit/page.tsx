import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateForm } from "../actions";
import FormFields from "../form-fields";

export default async function EditFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [form, documents] = await Promise.all([
    prisma.applicationForm.findUnique({ where: { id } }),
    prisma.legalDocument.findMany({ orderBy: { documentNumber: "asc" } }),
  ]);

  if (!form) {
    return <Card><CardContent className="py-12 text-center">Không tìm thấy biểu mẫu</CardContent></Card>;
  }

  const boundUpdate = updateForm.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/forms"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Link>
        </Button>
        <h1 className="text-2xl font-bold">Sửa biểu mẫu</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>{form.name}</CardTitle></CardHeader>
        <CardContent>
          <form action={boundUpdate} className="space-y-5">
            <FormFields
              documents={documents.map(d => ({ id: d.id, documentNumber: d.documentNumber }))}
              defaults={{
                name: form.name,
                code: form.code,
                fileUrl: form.fileUrl,
                description: form.description,
                applicantType: form.applicantType,
                legalDocumentId: form.legalDocumentId,
                effectiveFrom: form.effectiveFrom,
                effectiveTo: form.effectiveTo,
                active: form.active,
              }}
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit">Lưu thay đổi</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/forms">Hủy</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
