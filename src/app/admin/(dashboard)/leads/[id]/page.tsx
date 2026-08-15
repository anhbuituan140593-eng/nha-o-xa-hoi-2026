import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Phone, MessageCircle, Calendar, FileText, User } from "lucide-react";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      consultant: true,
      project: true,
      province: true,
      eligibilityCheck: true,
      activities: { orderBy: { createdAt: "desc" }, take: 20 },
      appointments: { orderBy: { createdAt: "desc" } },
      clientCases: true,
    },
  });

  if (!lead) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{lead.fullName}</h1>
            <Badge variant="secondary">{lead.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Mã: {lead.leadCode}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${lead.phone}`} className="font-medium hover:underline">{lead.phone}</a>
            </div>
            {lead.zalo && (
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <span>{lead.zalo}</span>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>
            )}
            {lead.province && (
              <p className="text-sm text-muted-foreground">📍 {lead.province.name}</p>
            )}
          </CardContent>
        </Card>

        {/* Service Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nhu cầu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div><strong>Dịch vụ:</strong> {lead.serviceInterest || "Chưa xác định"}</div>
            <div><strong>Dự án:</strong> {lead.project?.name || "Chưa chọn"}</div>
            <div><strong>Nguồn:</strong> {lead.source}</div>
            <div><strong>Chuyên viên:</strong> {lead.consultant?.name || "Chưa giao"}</div>
            {lead.note && (
              <div className="mt-3 rounded bg-gray-50 p-3">
                <strong>Ghi chú:</strong>
                <p className="mt-1 whitespace-pre-line">{lead.note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hành động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
              <a href={`tel:${lead.phone}`}>
                <Phone className="mr-2 h-4 w-4" /> Gọi khách
              </a>
            </Button>
            {lead.zalo && (
              <Button asChild size="sm" variant="outline" className="w-full">
                <a href={`https://zalo.me/${lead.zalo}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" /> Mở Zalo
                </a>
              </Button>
            )}
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href="/admin/appointments">
                <Calendar className="mr-2 h-4 w-4" /> Tạo lịch hẹn
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Eligibility Check Result */}
      {lead.eligibilityCheck && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Kết quả kiểm tra điều kiện</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div><strong>Kết quả:</strong> {lead.eligibilityCheck.result}</div>
              <div><strong>Điểm:</strong> {lead.eligibilityCheck.score}%</div>
              <div><strong>Thu nhập:</strong> {new Intl.NumberFormat("vi-VN").format(Number(lead.eligibilityCheck.householdIncome))} ₫</div>
              <div><strong>Đối tượng:</strong> {lead.eligibilityCheck.applicantType}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointments */}
      {lead.appointments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Lịch hẹn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lead.appointments.map((apt) => (
                <li key={apt.id} className="flex items-center justify-between rounded border p-3 text-sm">
                  <div>
                    <span className="font-medium">
                      {new Date(apt.preferredDate).toLocaleDateString("vi-VN")} - {apt.preferredTime}
                    </span>
                    <Badge variant="secondary" className="ml-2">{apt.status}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{apt.appointmentCode}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Activity Log */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Lịch sử hoạt động</CardTitle>
        </CardHeader>
        <CardContent>
          {lead.activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có hoạt động nào</p>
          ) : (
            <ul className="space-y-3">
              {lead.activities.map((activity) => (
                <li key={activity.id} className="border-l-2 border-navy-200 pl-4 text-sm">
                  <p className="text-muted-foreground">
                    {new Date(activity.createdAt).toLocaleString("vi-VN")} • {activity.type}
                  </p>
                  <p>{activity.content}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
