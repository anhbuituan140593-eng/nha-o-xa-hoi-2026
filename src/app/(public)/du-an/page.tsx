import Link from "next/link";
import { Building2, MapPin, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Dự án nhà ở xã hội | Nhà Ở Xã Hội 2026",
  description: "Danh sách các dự án nhà ở xã hội đang nhận hồ sơ trên toàn quốc.",
};

const statusConfig = {
  ACCEPTING: { label: "Đang nhận hồ sơ", color: "success" as const },
  UPCOMING: { label: "Sắp nhận", color: "warning" as const },
  CLOSED: { label: "Đã hết hạn", color: "destructive" as const },
  UNDER_CONSTRUCTION: { label: "Đang xây dựng", color: "info" as const },
  COMPLETED: { label: "Hoàn thành", color: "secondary" as const },
  NOT_ANNOUNCED: { label: "Chưa công bố", color: "outline" as const },
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { isDemo: false, status: { not: "NOT_ANNOUNCED" } },
    include: { province: true },
    orderBy: [{ status: "asc" }, { applicationEnd: "desc" }],
  });

  return (
    <div className="container mx-auto px-3 md:px-4 py-6 md:py-8">
      <div className="mb-6 text-center md:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Dự án nhà ở xã hội</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
          Các dự án NOXH đang nhận hồ sơ trên toàn quốc
        </p>
      </div>

      {projects.length === 0 ? (
        <Card className="py-10 text-center sm:py-12">
          <CardContent>
            <Building2 className="mx-auto mb-4 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
            <p className="text-base font-medium sm:text-lg">Chưa có dự án nào được cập nhật</p>
            <p className="text-sm text-muted-foreground">
              Vui lòng quay lại sau hoặc liên hệ để biết thông tin mới nhất.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const status = statusConfig[project.status] || statusConfig.NOT_ANNOUNCED;
            const daysLeft = project.applicationEnd
              ? Math.ceil((new Date(project.applicationEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <Card key={project.id} className="overflow-hidden">
                {project.thumbnailUrl && (
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-2 flex items-start justify-between sm:mb-3">
                    <Badge variant={status.color}>{status.label}</Badge>
                    {daysLeft !== null && daysLeft > 0 && daysLeft <= 7 && (
                      <span className="shrink-0 text-xs font-medium text-red-600">
                        Còn {daysLeft} ngày
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 font-semibold line-clamp-2">
                    <Link href={`/du-an/${project.slug}`} className="hover:text-primary">
                      {project.name}
                    </Link>
                  </h3>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <span className="line-clamp-2">{project.address}, {project.province.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">{project.investor}</span>
                    </div>
                    {project.priceRange && (
                      <div className="font-medium text-navy-800">{project.priceRange}</div>
                    )}
                    {project.applicationEnd && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>Hạn nộp: {new Date(project.applicationEnd).toLocaleDateString("vi-VN")}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <Button asChild size="sm" className="w-full sm:w-auto">
                      <Link href={`/du-an/${project.slug}`}>Xem chi tiết</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
