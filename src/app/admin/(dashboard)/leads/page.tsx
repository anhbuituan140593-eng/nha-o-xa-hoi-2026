import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Search } from "lucide-react";
import DeleteLeadButton from "./delete-lead-button";

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-indigo-100 text-indigo-800",
  APPOINTMENT_REQUESTED: "bg-yellow-100 text-yellow-800",
  APPOINTMENT_CONFIRMED: "bg-green-100 text-green-800",
  CONSULTED: "bg-purple-100 text-purple-800",
  SERVICE_ACCEPTED: "bg-emerald-100 text-emerald-800",
  WAITING_DOCUMENTS: "bg-orange-100 text-orange-800",
  REVIEWING: "bg-cyan-100 text-cyan-800",
  NEED_MORE_DOCUMENTS: "bg-red-100 text-red-800",
  READY: "bg-teal-100 text-teal-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: { consultant: true, project: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Khách hàng</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            Lọc
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Mã</th>
                  <th className="px-4 py-3 text-left font-medium">Họ tên</th>
                  <th className="px-4 py-3 text-left font-medium">Điện thoại</th>
                  <th className="px-4 py-3 text-left font-medium">Dịch vụ</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày tạo</th>
                  <th className="px-4 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Chưa có khách hàng nào
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{lead.leadCode}</td>
                      <td className="px-4 py-3 font-medium">{lead.fullName}</td>
                      <td className="px-4 py-3">{lead.phone}</td>
                      <td className="px-4 py-3">{lead.serviceInterest || "-"}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={statusColors[lead.status] || ""}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/leads/${lead.id}`}>
                            <Button variant="ghost" size="sm">Xem</Button>
                          </Link>
                          <DeleteLeadButton id={lead.id} />
                        </div>
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
