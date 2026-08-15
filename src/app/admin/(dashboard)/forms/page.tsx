import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteForm } from "./actions";

export default async function AdminFormsPage() {
  const [forms, documents] = await Promise.all([
    prisma.applicationForm.findMany({
      include: { legalDocument: true },
      orderBy: { name: "asc" },
    }),
    prisma.legalDocument.findMany({ orderBy: { documentNumber: "asc" } }),
  ]);

  return (
    <div className="max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý biểu mẫu</h1>
        <Button asChild variant="navy">
          <Link href="/admin/forms/new"><Plus className="mr-2 h-4 w-4" /> Thêm biểu mẫu</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Mã</th>
                  <th className="px-4 py-3 text-left font-medium">Tên</th>
                  <th className="px-4 py-3 text-left font-medium">Đối tượng</th>
                  <th className="px-4 py-3 text-left font-medium">Căn cứ pháp lý</th>
                  <th className="px-4 py-3 text-left font-medium">Active</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {forms.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Chưa có biểu mẫu nào</td></tr>
                ) : forms.map((form) => (
                  <tr key={form.id} className={`border-b hover:bg-gray-50 ${!form.active ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs">{form.code}</td>
                    <td className="px-4 py-3 font-medium">{form.name}</td>
                    <td className="px-4 py-3">{form.applicantType || "Tất cả"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{form.legalDocument?.documentNumber || "-"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={form.active ? "success" : "destructive"}>{form.active ? "Có" : "Không"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/forms/${form.id}/edit`}><Pencil className="h-4 w-4" /></Link>
                        </Button>
                        <form action={deleteForm.bind(null, form.id)} className="inline">
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
