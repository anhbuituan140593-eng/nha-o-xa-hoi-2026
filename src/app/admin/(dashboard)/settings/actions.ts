"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function updateSettings(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const data: Record<string, string | null> = {};
  const fields = [
    "siteName", "hotline", "zaloPhone", "zaloUrl", "messengerUrl",
    "facebookUrl", "email", "officeAddress", "googleMapsUrl",
    "workingHours", "consultationNote", "logoUrl", "faviconUrl",
    "disclaimerLegal", "disclaimerService",
  ];

  for (const field of fields) {
    const value = formData.get(field) as string;
    data[field] = value?.trim() || null;
  }

  // siteName is required, default if empty
  if (!data.siteName) {
    data.siteName = "Nhà Ở Xã Hội 2026";
  }

  const existing = await prisma.contactSetting.findFirst();

  if (existing) {
    await prisma.contactSetting.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.contactSetting.create({ data });
  }

  redirect("/admin/settings?saved=1");
}
