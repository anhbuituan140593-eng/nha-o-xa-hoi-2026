import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export default async function AdminRulesPage() {
  const rules = await prisma.legalRule.findMany({
    include: { legalDocument: true, province: true },
    orderBy: [{ category: "asc" }, { priority: "desc" }],
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Quản lý điều kiện / Rules</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Mã</th>
                  <th className="px-4 py-3 text-left font-medium">Tên</th>
                  <th className="px-4 py-3 text-left font-medium">Loại</th>
                  <th className="px-4 py-3 text-left font-medium">Đối tượng</th>
                  <th className="px-4 py-3 text-left font-medium">Điều kiện</th>
                  <th className="px-4 py-3 text-left font-medium">Tỉnh</th>
                  <th className="px-4 py-3 text-left font-medium">Active</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className={`border-b hover:bg-gray-50 ${!rule.active ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs">{rule.code}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{rule.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{rule.category}</Badge>
                    </td>
                    <td className="px-4 py-3">{rule.applicantType || "-"}</td>
                    <td className="px-4 py-3 font-mono">
                      {rule.operator} {new Intl.NumberFormat("vi-VN").format(Number(rule.value))} {rule.unit}
                    </td>
                    <td className="px-4 py-3">{rule.province?.name || "Toàn quốc"}</td>
                    <td className="px-4 py-3">
                      <Badge variant={rule.active ? "success" : "destructive"}>
                        {rule.active ? "Có" : "Không"}
                      </Badge>
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
