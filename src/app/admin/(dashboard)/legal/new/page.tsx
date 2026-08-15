import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createLegalDocument } from "../actions";
import LegalFields from "../legal-fields";

export default function NewLegalDocumentPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/legal"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Link>
        </Button>
        <h1 className="text-2xl font-bold">Thêm văn bản pháp luật</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Thông tin văn bản</CardTitle></CardHeader>
        <CardContent>
          <form action={createLegalDocument} className="space-y-5">
            <LegalFields />
            <div className="flex gap-3 pt-4">
              <Button type="submit">Tạo văn bản</Button>
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
