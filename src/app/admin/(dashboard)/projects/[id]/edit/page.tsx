import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateProject } from "../../actions";
import ProjectEditForm from "./project-edit-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, provinces] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } } } }),
    prisma.province.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!project) {
    return (
      <div className="max-w-3xl">
        <Card><CardContent className="py-12 text-center">Không tìm thấy dự án</CardContent></Card>
      </div>
    );
  }

  const boundUpdateProject = updateProject.bind(null, id);

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Sửa dự án</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={boundUpdateProject} className="space-y-5">
            <ProjectEditForm
              project={project}
              provinces={provinces.map(p => ({ id: p.id, name: p.name }))}
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit">Lưu thay đổi</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/projects">Hủy</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
