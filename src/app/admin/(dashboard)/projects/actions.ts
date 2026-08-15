"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function createProject(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const name = formData.get("name") as string;
  const investor = formData.get("investor") as string;
  const provinceId = formData.get("provinceId") as string;
  const district = (formData.get("district") as string) || null;
  const address = formData.get("address") as string;
  const totalUnits = formData.get("totalUnits") ? parseInt(formData.get("totalUnits") as string) : null;
  const areaRange = (formData.get("areaRange") as string) || null;
  const priceRange = (formData.get("priceRange") as string) || null;
  const pricePerSqm = formData.get("pricePerSqm") ? parseFloat(formData.get("pricePerSqm") as string) : null;
  const applicationStart = formData.get("applicationStart") ? new Date(formData.get("applicationStart") as string) : null;
  const applicationEnd = formData.get("applicationEnd") ? new Date(formData.get("applicationEnd") as string) : null;
  const lotteryDate = formData.get("lotteryDate") ? new Date(formData.get("lotteryDate") as string) : null;
  const handoverDate = formData.get("handoverDate") ? new Date(formData.get("handoverDate") as string) : null;
  const submissionAddress = (formData.get("submissionAddress") as string) || null;
  const hotline = (formData.get("hotline") as string) || null;
  const website = (formData.get("website") as string) || null;
  const officialSourceUrl = (formData.get("officialSourceUrl") as string) || null;
  const thumbnailUrl = (formData.get("thumbnailUrl") as string) || null;
  const description = (formData.get("description") as string) || null;
  const progress = (formData.get("progress") as string) || null;
  const status = (formData.get("status") as string) || "UPCOMING";

  const slug = generateSlug(name);

  const project = await prisma.project.create({
    data: {
      name,
      slug,
      investor,
      provinceId,
      district,
      address,
      totalUnits,
      areaRange,
      priceRange,
      pricePerSqm: pricePerSqm ?? undefined,
      applicationStart,
      applicationEnd,
      lotteryDate,
      handoverDate,
      submissionAddress,
      hotline,
      website,
      officialSourceUrl,
      thumbnailUrl,
      description,
      progress,
      status: status as any,
    },
  });

  // Xử lý ảnh dự án từ hidden inputs (imageUrl_0, imageCaption_0, ...)
  const images: { url: string; caption?: string | null }[] = [];
  for (let i = 0; i < 50; i++) {
    const url = formData.get(`imageUrl_${i}`) as string;
    if (!url?.trim()) break;
    const caption = (formData.get(`imageCaption_${i}`) as string) || null;
    images.push({ url: url.trim(), caption });
  }

  if (images.length > 0) {
    await prisma.projectImage.createMany({
      data: images.map((img, idx) => ({
        projectId: project.id,
        url: img.url,
        caption: img.caption,
        sortOrder: idx,
      })),
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/du-an");
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const name = formData.get("name") as string;
  const slug = generateSlug(name);

  await prisma.project.update({
    where: { id },
    data: {
      name,
      slug,
      investor: (formData.get("investor") as string) || "",
      provinceId: formData.get("provinceId") as string,
      district: (formData.get("district") as string) || null,
      address: formData.get("address") as string,
      totalUnits: formData.get("totalUnits") ? parseInt(formData.get("totalUnits") as string) : null,
      areaRange: (formData.get("areaRange") as string) || null,
      priceRange: (formData.get("priceRange") as string) || null,
      pricePerSqm: formData.get("pricePerSqm") ? parseFloat(formData.get("pricePerSqm") as string) : null,
      applicationStart: formData.get("applicationStart") ? new Date(formData.get("applicationStart") as string) : null,
      applicationEnd: formData.get("applicationEnd") ? new Date(formData.get("applicationEnd") as string) : null,
      lotteryDate: formData.get("lotteryDate") ? new Date(formData.get("lotteryDate") as string) : null,
      handoverDate: formData.get("handoverDate") ? new Date(formData.get("handoverDate") as string) : null,
      submissionAddress: (formData.get("submissionAddress") as string) || null,
      hotline: (formData.get("hotline") as string) || null,
      website: (formData.get("website") as string) || null,
      officialSourceUrl: (formData.get("officialSourceUrl") as string) || null,
      thumbnailUrl: (formData.get("thumbnailUrl") as string) || null,
      description: (formData.get("description") as string) || null,
      progress: (formData.get("progress") as string) || null,
      status: (formData.get("status") as string) as any,
    },
  });

  // Update images: delete old and re-create from form
  await prisma.projectImage.deleteMany({ where: { projectId: id } });
  const images: { url: string; caption?: string | null }[] = [];
  for (let i = 0; i < 50; i++) {
    const url = formData.get(`imageUrl_${i}`) as string;
    if (!url?.trim()) break;
    const caption = (formData.get(`imageCaption_${i}`) as string) || null;
    images.push({ url: url.trim(), caption });
  }
  if (images.length > 0) {
    await prisma.projectImage.createMany({
      data: images.map((img, idx) => ({
        projectId: id,
        url: img.url,
        caption: img.caption,
        sortOrder: idx,
      })),
    });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/du-an");
  revalidatePath("/", "layout");
  redirect("/admin/projects");
}

export async function addProjectImages(projectId: string, images: { url: string; caption?: string }[]) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const currentCount = await prisma.projectImage.count({ where: { projectId } });

  const data = images.map((img, idx) => ({
    projectId,
    url: img.url,
    caption: img.caption || null,
    sortOrder: currentCount + idx,
  }));

  if (data.length > 0) {
    await prisma.projectImage.createMany({ data });
  }

  revalidatePath("/admin/projects");
  revalidatePath("/du-an");
  revalidatePath("/", "layout");
}

export async function deleteProjectImage(imageId: string) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  await prisma.projectImage.delete({ where: { id: imageId } });

  revalidatePath("/admin/projects");
  revalidatePath("/du-an");
  revalidatePath("/", "layout");
}
