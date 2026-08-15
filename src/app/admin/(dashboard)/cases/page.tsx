import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  WAITING_DOCUMENTS: "bg-orange-100 text-orange-800",
  DOCUMENTS_RECEIVED: "bg-cyan-100 text-cyan-800",
  REVIEWING: "bg-purple-100 text-purple-800",
  NEEDS_MORE: "bg-red-100 text-red-800",
  READY_TO_SUBMIT: "bg-teal-100 text-teal-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default async function CasesPage() {
  const cases = await prisma.clientCase.findMany({
    include: {
      lead: true,
      project: true,
      servicePackage: true,
      assignedConsultant: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Hồ sơ khách hàng</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Mã hồ sơ</th>
                  <th className="px-4 py-3 text-left font-medium">Khách hàng</th>
                  <th className="px-4 py-3 text-left font-medium">Dự án</th>
                  <th className="px-4 py-3 text-left font-medium">Dịch vụ</th>
                  <th className="px-4 py-3 text-left font-medium">Chuyên viên</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {cases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Chưa có hồ sơ nào
                    </td>
                  </tr>
                ) : (
                  cases.map((c) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{c.caseCode}</td>
                      <td className="px-4 py-3 font-medium">{c.lead?.fullName}</td>
                      <td className="px-4 py-3">{c.project?.name || "-"}</td>
                      <td className="px-4 py-3">{c.servicePackage?.name || "-"}</td>
                      <td className="px-4 py-3">{c.assignedConsultant?.name || "Chưa giao"}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={statusColors[c.status] || ""}>
                          {c.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
