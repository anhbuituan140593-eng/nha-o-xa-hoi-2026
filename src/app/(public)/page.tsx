import Link from "next/link";
import {
  CheckCircle,
  FileText,
  Search,
  Building2,
  Calendar,
  Users,
  ShieldCheck,
  ClipboardCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, { label: string; color: string }> = {
  ACCEPTING: { label: "Đang nhận hồ sơ", color: "bg-green-100 text-green-800" },
  UPCOMING: { label: "Sắp nhận", color: "bg-yellow-100 text-yellow-800" },
  CLOSED: { label: "Đã hết hạn", color: "bg-red-100 text-red-800" },
  UNDER_CONSTRUCTION: { label: "Đang xây dựng", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Hoàn thành", color: "bg-gray-100 text-gray-800" },
};

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { status: { in: ["ACCEPTING", "UPCOMING"] } },
    include: { province: true, images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-14 md:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
              Kiểm tra điều kiện mua{" "}
              <span className="text-blue-300">Nhà ở xã hội</span>
            </h1>
            <p className="mt-3 text-base text-navy-200 sm:text-lg md:mt-4 md:text-xl">
              Kiểm tra điều kiện, hồ sơ và dự án phù hợp theo quy định pháp luật hiện hành.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-8 md:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto md:size-xl">
                <Link href="/kiem-tra">KIỂM TRA NGAY</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-white bg-white/10 text-white hover:bg-white/20 sm:w-auto md:size-xl">
                <Link href="/du-an">XEM DỰ ÁN</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="bg-white py-10 md:py-16">
          <div className="container mx-auto px-3 md:px-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Dự án đang nhận hồ sơ</h2>
                <p className="mt-1 text-sm text-muted-foreground md:mt-2">Cập nhật các dự án nhà ở xã hội mới nhất</p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex">
                <Link href="/du-an">Xem tất cả →</Link>
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 md:mt-8">
              {projects.map((project) => {
                const status = statusLabels[project.status] || statusLabels.UPCOMING;
                const thumb = project.thumbnailUrl || project.images[0]?.url;
                return (
                  <Card key={project.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={project.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <Building2 className="h-12 w-12" />
                        </div>
                      )}
                      <Badge className={`absolute left-3 top-3 ${status.color}`}>
                        {status.label}
                      </Badge>
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="line-clamp-2 font-semibold group-hover:text-navy-700">{project.name}</h3>
                      <div className="mt-2 flex items-start gap-1 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{project.address}, {project.province.name}</span>
                      </div>
                      {(project.priceRange || project.areaRange) && (
                        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                          {project.priceRange && (
                            <span className="rounded bg-navy-50 px-2 py-1 text-navy-700">{project.priceRange}</span>
                          )}
                          {project.areaRange && (
                            <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">{project.areaRange}</span>
                          )}
                        </div>
                      )}
                      {project.applicationEnd && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Hạn nộp: {new Date(project.applicationEnd).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                      <Link
                        href={`/du-an/${project.slug}`}
                        className="mt-3 block rounded-lg border py-2 text-center text-sm font-medium text-navy-700 hover:bg-navy-50"
                      >
                        Xem chi tiết
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Button asChild variant="outline" className="w-full">
                <Link href="/du-an">Xem tất cả dự án</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-3 md:px-4">
          <div className="text-center">
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
              Vì sao nên kiểm tra hồ sơ trước khi nộp?
            </h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:mt-10 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Đúng điều kiện", desc: "Đánh giá dựa trên quy định hiện hành." },
              { icon: FileText, title: "Đúng biểu mẫu", desc: "Kiểm tra mẫu đang có hiệu lực." },
              { icon: ClipboardCheck, title: "Đủ hồ sơ", desc: "Tạo checklist theo trường hợp." },
              { icon: Building2, title: "Rõ dự án", desc: "Tra cứu thông tin tiếp nhận." },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-5 pb-5 sm:pt-6">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-700 sm:h-12 sm:w-12">
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-sm font-semibold sm:text-base">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-50 py-10 md:py-16">
        <div className="container mx-auto px-3 md:px-4">
          <div className="text-center">
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Quy trình thực hiện</h2>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 md:mt-10">
            {[
              { step: 1, title: "Kiểm tra điều kiện", icon: Search },
              { step: 2, title: "Nhận checklist", icon: ClipboardCheck },
              { step: 3, title: "Chọn dự án", icon: Building2 },
              { step: 4, title: "Đặt lịch", icon: Calendar },
              { step: 5, title: "Gặp chuyên viên trực tiếp", icon: Users },
              { step: 6, title: "Hoàn thiện hồ sơ", icon: FileText },
              { step: 7, title: "Nộp hồ sơ cho đơn vị có thẩm quyền", icon: CheckCircle },
            ].map((item) => (
              <Card key={item.step}>
                <CardContent className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-800 text-white sm:h-10 sm:w-10">
                    <span className="text-sm font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium sm:text-base">{item.title}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-10 md:py-16">
        <div className="container mx-auto px-3 md:px-4">
          <div className="text-center">
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Cần hỗ trợ hoàn thiện hồ sơ?</h2>
          </div>
          <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:gap-6 md:mt-10 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg sm:text-xl">Hồ sơ trọn gói</CardTitle>
                <CardDescription>Phù hợp nếu bạn chưa biết bắt đầu từ đâu.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dich-vu/ho-so-tron-goi">ĐẶT LỊCH TƯ VẤN</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg sm:text-xl">Rà soát hồ sơ</CardTitle>
                <CardDescription>Phù hợp nếu bạn đã chuẩn bị hồ sơ và muốn được kiểm tra trước khi nộp.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/dich-vu/ra-soat-ho-so">ĐẶT LỊCH RÀ SOÁT</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Section */}
      <section className="bg-gray-50 py-10 md:py-16">
        <div className="container mx-auto px-3 md:px-4 text-center">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Tư vấn trực tiếp tại văn phòng</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground md:mt-4 md:text-base">
            Đặt lịch gặp chuyên viên để được tư vấn chi tiết về hồ sơ nhà ở xã hội.
          </p>
          <Button asChild size="lg" className="mt-5 md:mt-6">
            <Link href="/dat-lich">ĐẶT LỊCH GẶP</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
