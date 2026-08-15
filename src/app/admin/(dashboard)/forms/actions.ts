"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function createForm(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const fileUrl = formData.get("fileUrl") as string;

  if (!name || !code || !fileUrl) {
    throw new Error("Thiếu thông tin bắt buộc");
  }

  const legalDocumentId = (formData.get("legalDocumentId") as string) || null;
  const applicantType = (formData.get("applicantType") as string) || null;
  const description = (formData.get("description") as string) || null;
  const effectiveFrom = formData.get("effectiveFrom") ? new Date(formData.get("effectiveFrom") as string) : new Date();
  const effectiveTo = formData.get("effectiveTo") ? new Date(formData.get("effectiveTo") as string) : null;
  const active = formData.get("active") === "on" || formData.get("active") === "true";

  await prisma.applicationForm.create({
    data: {
      name,
      code,
      fileUrl,
      legalDocumentId: legalDocumentId || undefined,
      applicantType: applicantType || undefined,
      description: description || undefined,
      effectiveFrom,
      effectiveTo: effectiveTo || undefined,
      active,
    },
  });

  redirect("/admin/forms?created=1");
}

export async function updateForm(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const legalDocumentId = (formData.get("legalDocumentId") as string) || null;
  const applicantType = (formData.get("applicantType") as string) || null;
  const description = (formData.get("description") as string) || null;
  const effectiveFrom = formData.get("effectiveFrom") ? new Date(formData.get("effectiveFrom") as string) : undefined;
  const effectiveTo = formData.get("effectiveTo") ? new Date(formData.get("effectiveTo") as string) : null;

  await prisma.applicationForm.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      fileUrl: formData.get("fileUrl") as string,
      legalDocumentId: legalDocumentId || undefined,
      applicantType: applicantType || undefined,
      description: description || undefined,
      ...(effectiveFrom && { effectiveFrom }),
      effectiveTo: effectiveTo || undefined,
      active: formData.get("active") === "on" || formData.get("active") === "true",
    },
  });

  redirect("/admin/forms?updated=1");
}

export async function deleteForm(id: string) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }
  await prisma.applicationForm.delete({ where: { id } });
  redirect("/admin/forms?deleted=1");
}
