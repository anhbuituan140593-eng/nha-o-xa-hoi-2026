import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { Users, Calendar, FolderOpen, CheckCircle } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalLeads,
    newLeadsToday,
    appointmentsToday,
    pendingAppointments,
    activeCases,
    completedCases,
    totalChecks,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.appointment.count({
      where: { preferredDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.appointment.count({ where: { status: "REQUESTED" } }),
    prisma.clientCase.count({
      where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
    }),
    prisma.clientCase.count({ where: { status: "COMPLETED" } }),
    prisma.eligibilityCheck.count(),
  ]);

  const kpis = [
    { label: "Lead hôm nay", value: newLeadsToday, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Tổng Lead", value: totalLeads, icon: Users, color: "text-navy-600 bg-navy-50" },
    { label: "Lịch hẹn hôm nay", value: appointmentsToday, icon: Calendar, color: "text-green-600 bg-green-50" },
    { label: "Lịch chưa xác nhận", value: pendingAppointments, icon: Calendar, color: "text-yellow-600 bg-yellow-50" },
    { label: "Hồ sơ đang xử lý", value: activeCases, icon: FolderOpen, color: "text-purple-600 bg-purple-50" },
    { label: "Hồ sơ hoàn tất", value: completedCases, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    { label: "Lượt kiểm tra điều kiện", value: totalChecks, icon: CheckCircle, color: "text-indigo-600 bg-indigo-50" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tổng quan</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Việc cần làm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {pendingAppointments > 0 && (
              <p className="text-yellow-700">⏰ {pendingAppointments} lịch hẹn chờ xác nhận</p>
            )}
            {newLeadsToday > 0 && (
              <p className="text-blue-700">📞 {newLeadsToday} khách mới cần liên hệ</p>
            )}
            {activeCases > 0 && (
              <p className="text-purple-700">📋 {activeCases} hồ sơ đang xử lý</p>
            )}
            {pendingAppointments === 0 && newLeadsToday === 0 && activeCases === 0 && (
              <p className="text-gray-500">Không có việc cần làm gấp</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
