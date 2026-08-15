import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createForm } from "../actions";
import FormFields from "../form-fields";

export default async function NewFormPage() {
  const documents = await prisma.legalDocument.findMany({ orderBy: { documentNumber: "asc" } });

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/forms"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Link>
        </Button>
        <h1 className="text-2xl font-bold">Thêm biểu mẫu mới</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Thông tin biểu mẫu</CardTitle></CardHeader>
        <CardContent>
          <form action={createForm} className="space-y-5">
            <FormFields documents={documents.map(d => ({ id: d.id, documentNumber: d.documentNumber }))} />
            <div className="flex gap-3 pt-4">
              <Button type="submit">Tạo biểu mẫu</Button>
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
