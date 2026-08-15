import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProject } from "../actions";
import ProjectForm from "./project-form";

export default async function NewProjectPage() {
  const provinces = await prisma.province.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Thêm dự án mới</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin dự án</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createProject} className="space-y-5">
            <ProjectForm provinces={provinces.map(p => ({ id: p.id, name: p.name }))} />
            <div className="flex gap-3 pt-4">
              <Button type="submit">Tạo dự án</Button>
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
