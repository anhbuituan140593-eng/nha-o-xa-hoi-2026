"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const TIME_SLOTS = [
  "08:00–09:00",
  "09:00–10:00",
  "10:00–11:00",
  "13:30–14:30",
  "14:30–15:30",
  "15:30–16:30",
];

const SERVICES = [
  { value: "FULL_PACKAGE", label: "Hồ sơ trọn gói" },
  { value: "REVIEW", label: "Rà soát hồ sơ" },
  { value: "CONSULTATION", label: "Tư vấn điều kiện" },
  { value: "OTHER", label: "Khác" },
];

export default function AppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    zalo: "",
    email: "",
    service: "",
    project: "",
    preferredDate: "",
    preferredTime: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/cam-on?type=appointment");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Đặt lịch tư vấn trực tiếp</h1>
        <p className="mt-2 text-muted-foreground">
          Chuyên viên sẽ liên hệ xác nhận thời gian trước khi cuộc hẹn được chính thức đặt.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin liên hệ</h3>

              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zalo">Zalo</Label>
                  <Input
                    id="zalo"
                    value={formData.zalo}
                    onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Service Info */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-lg">Thông tin dịch vụ</h3>

              <div className="space-y-2">
                <Label htmlFor="service">Dịch vụ *</Label>
                <select
                  id="service"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="">Chọn dịch vụ</option>
                  {SERVICES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Dự án quan tâm</Label>
                <Input
                  id="project"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-lg">Thời gian mong muốn</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Ngày muốn gặp *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Khung giờ *</Label>
                  <select
                    id="preferredTime"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  >
                    <option value="">Chọn khung giờ</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Bạn đang gặp khó khăn gì? Cần tư vấn về vấn đề gì?"
                />
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "GỬI YÊU CẦU ĐẶT LỊCH"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Chuyên viên sẽ liên hệ xác nhận thời gian trước khi cuộc hẹn được chính thức đặt.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
