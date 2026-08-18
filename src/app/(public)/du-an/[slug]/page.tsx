import Link from "next/link";
import { Building2, MapPin, Calendar, Phone, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { PanoramaViewer } from "@/components/panorama-viewer";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug, isDemo: false },
    include: {
      province: true,
      images: { orderBy: { sortOrder: "asc" } },
      requirements: true,
    },
  });

  if (!project) {
    notFound();
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    ACCEPTING: { label: "Đang nhận hồ sơ", color: "success" },
    UPCOMING: { label: "Sắp nhận", color: "warning" },
    CLOSED: { label: "Đã hết hạn", color: "destructive" },
    UNDER_CONSTRUCTION: { label: "Đang xây dựng", color: "info" },
    COMPLETED: { label: "Hoàn thành", color: "secondary" },
    NOT_ANNOUNCED: { label: "Chưa công bố", color: "outline" },
  };

  const status = statusConfig[project.status] || statusConfig.NOT_ANNOUNCED;

  return (
    <div className="container mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <Badge variant={status.color as "success" | "warning" | "destructive" | "info" | "secondary" | "outline"}>
          {status.label}
        </Badge>
        <h1 className="mt-3 text-xl font-bold sm:text-2xl md:text-3xl">{project.name}</h1>
        <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <span className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {project.investor}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {project.address}, {project.province.name}
          </span>
        </div>
      </div>

      {/* Gallery */}
      {project.images.length > 0 && (
        <div className="mb-6 grid gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {project.images.map((image) => (
            <div key={image.id} className="aspect-video overflow-hidden rounded-lg bg-gray-100">
              <img src={image.url} alt={image.caption || project.name} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Panorama 360 */}
      {(() => {
        // Hiển thị 360 nếu dự án có panoramaUrl, hoặc fallback cho Phúc Đạt Hà Tĩnh
        const panoramaUrl =
          (project as unknown as { panoramaUrl?: string | null }).panoramaUrl ||
          (project.slug.includes("phuc-dat") || project.name.toLowerCase().includes("phúc đạt") || project.name.toLowerCase().includes("phuc dat")
            ? "https://360.vhggroup.vn/phucdat-hatinh/"
            : null);
        return panoramaUrl ? (
          <div className="mb-6 sm:mb-8">
            <PanoramaViewer url={panoramaUrl} title={`Toàn cảnh 360° - ${project.name}`} />
          </div>
        ) : null;
      })()}

      {/* Info Grid */}
      <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thông tin dự án</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng số căn</span>
              <span className="font-medium">{project.totalUnits || "Đang cập nhật"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Diện tích</span>
              <span className="font-medium">{project.areaRange || "Đang cập nhật"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giá</span>
              <span className="font-medium text-navy-800">{project.priceRange || "Đang cập nhật"}</span>
            </div>
            {project.progress && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiến độ</span>
                <span className="font-medium">{project.progress}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lịch trình nhận hồ sơ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày bắt đầu</span>
              <span className="font-medium">
                {project.applicationStart ? new Date(project.applicationStart).toLocaleDateString("vi-VN") : "Đang cập nhật"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày kết thúc</span>
              <span className="font-medium">
                {project.applicationEnd ? new Date(project.applicationEnd).toLocaleDateString("vi-VN") : "Đang cập nhật"}
              </span>
            </div>
            {project.lotteryDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày bốc thăm</span>
                <span className="font-medium">{new Date(project.lotteryDate).toLocaleDateString("vi-VN")}</span>
              </div>
            )}
            {project.handoverDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bàn giao dự kiến</span>
                <span className="font-medium">{new Date(project.handoverDate).toLocaleDateString("vi-VN")}</span>
              </div>
            )}
            {project.submissionAddress && (
              <div>
                <span className="text-muted-foreground">Địa điểm nộp hồ sơ:</span>
                <p className="mt-1 font-medium">{project.submissionAddress}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {project.description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Giới thiệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-relaxed">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      {project.requirements.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Yêu cầu đối tượng</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {project.requirements.map((req) => (
                <li key={req.id} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                  {req.requirement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Card className="bg-navy-50 border-navy-200">
        <CardContent className="pt-6 text-center">
          <h3 className="mb-2 text-lg font-bold">Bạn muốn làm hồ sơ cho dự án này?</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Kiểm tra điều kiện miễn phí và đặt lịch tư vấn với chuyên viên.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/kiem-tra">KIỂM TRA ĐIỀU KIỆN</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dat-lich">ĐĂNG KÝ TƯ VẤN HỒ SƠ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
