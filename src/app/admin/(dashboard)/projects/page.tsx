import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";
import DeleteProjectButton from "./delete-project-button";

const statusLabels: Record<string, { label: string; color: string }> = {
  ACCEPTING: { label: "Đang nhận hồ sơ", color: "bg-green-100 text-green-800" },
  UPCOMING: { label: "Sắp nhận", color: "bg-yellow-100 text-yellow-800" },
  CLOSED: { label: "Đã hết hạn", color: "bg-red-100 text-red-800" },
  UNDER_CONSTRUCTION: { label: "Đang xây dựng", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Hoàn thành", color: "bg-gray-100 text-gray-800" },
  NOT_ANNOUNCED: { label: "Chưa công bố", color: "bg-gray-100 text-gray-500" },
};

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { province: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý dự án</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" /> Thêm dự án
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Tên dự án</th>
                  <th className="px-4 py-3 text-left font-medium">Chủ đầu tư</th>
                  <th className="px-4 py-3 text-left font-medium">Tỉnh</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-medium">Hạn nộp</th>
                  <th className="px-4 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      Chưa có dự án nào
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => {
                    const status = statusLabels[project.status] || statusLabels.NOT_ANNOUNCED;
                    return (
                      <tr key={project.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{project.name}</td>
                        <td className="px-4 py-3">{project.investor}</td>
                        <td className="px-4 py-3">{project.province.name}</td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={status.color}>{status.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {project.applicationEnd ? new Date(project.applicationEnd).toLocaleDateString("vi-VN") : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link href={`/admin/projects/${project.id}/edit`}>
                              <Button variant="ghost" size="sm">Sửa</Button>
                            </Link>
                            <DeleteProjectButton id={project.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
