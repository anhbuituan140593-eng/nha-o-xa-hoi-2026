import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { Calendar as CalendarIcon } from "lucide-react";

const statusColors: Record<string, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-green-100 text-green-800",
  RESCHEDULED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-orange-100 text-orange-800",
};

export default async function AppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      lead: true,
      staff: true,
      service: true,
      project: true,
    },
    orderBy: [{ preferredDate: "desc" }, { preferredTime: "asc" }],
    take: 50,
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Lịch hẹn</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Mã</th>
                  <th className="px-4 py-3 text-left font-medium">Ngày</th>
                  <th className="px-4 py-3 text-left font-medium">Giờ</th>
                  <th className="px-4 py-3 text-left font-medium">Khách hàng</th>
                  <th className="px-4 py-3 text-left font-medium">Điện thoại</th>
                  <th className="px-4 py-3 text-left font-medium">Dịch vụ</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Chưa có lịch hẹn nào
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{apt.appointmentCode}</td>
                      <td className="px-4 py-3">
                        {new Date(apt.preferredDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-3 font-medium">{apt.preferredTime}</td>
                      <td className="px-4 py-3">{apt.lead?.fullName || "-"}</td>
                      <td className="px-4 py-3">{apt.lead?.phone || "-"}</td>
                      <td className="px-4 py-3">{apt.service?.name || "-"}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={statusColors[apt.status] || ""}>
                          {apt.status}
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
