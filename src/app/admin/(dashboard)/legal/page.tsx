import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteLegalDocument } from "./actions";

const DOC_TYPE_LABELS: Record<string, string> = {
  LAW: "Luật",
  DECREE: "Nghị định",
  RESOLUTION: "Nghị quyết",
  CIRCULAR: "Thông tư",
  DECISION: "Quyết định",
  OTHER: "Khác",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Còn hiệu lực",
  EXPIRED: "Hết hiệu lực",
  AMENDED: "Đã sửa đổi",
  DRAFT: "Dự thảo",
};

export default async function AdminLegalPage() {
  const documents = await prisma.legalDocument.findMany({
    orderBy: { documentNumber: "asc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Văn bản pháp luật</h1>
        <Button asChild variant="navy">
          <Link href="/admin/legal/new"><Plus className="mr-2 h-4 w-4" /> Thêm văn bản</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Số văn bản</th>
                  <th className="px-4 py-3 text-left font-medium">Tên văn bản</th>
                  <th className="px-4 py-3 text-left font-medium">Loại</th>
                  <th className="px-4 py-3 text-left font-medium">Cơ quan ban hành</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày ban hành</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Chưa có văn bản nào</td></tr>
                ) : documents.map((doc) => (
                  <tr key={doc.id} className={`border-b hover:bg-gray-50 ${doc.status !== "ACTIVE" ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs">{doc.documentNumber}</td>
                    <td className="px-4 py-3 font-medium max-w-xs truncate" title={doc.title}>{doc.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{DOC_TYPE_LABELS[doc.documentType] || doc.documentType}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{doc.issuingAuthority}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {doc.issuedDate ? new Date(doc.issuedDate).toLocaleDateString("vi-VN") : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={doc.status === "ACTIVE" ? "success" : doc.status === "EXPIRED" ? "destructive" : "outline"}>
                        {STATUS_LABELS[doc.status] || doc.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/legal/${doc.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <form action={deleteLegalDocument.bind(null, doc.id)} className="inline">
                          <button type="submit" className="rounded p-1 text-red-500 hover:bg-red-50" title="Xóa">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
