"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function createLegalDocument(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const documentNumber = formData.get("documentNumber") as string;
  const title = formData.get("title") as string;
  const documentType = formData.get("documentType") as string;
  const issuingAuthority = formData.get("issuingAuthority") as string;

  if (!documentNumber || !title || !documentType || !issuingAuthority) {
    throw new Error("Thiếu thông tin bắt buộc");
  }

  const issuedDate = formData.get("issuedDate") ? new Date(formData.get("issuedDate") as string) : new Date();
  const effectiveDate = formData.get("effectiveDate") ? new Date(formData.get("effectiveDate") as string) : new Date();
  const expiryDate = formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : null;
  const summary = (formData.get("summary") as string) || null;
  const officialUrl = (formData.get("officialUrl") as string) || null;
  const pdfUrl = (formData.get("pdfUrl") as string) || null;
  const status = (formData.get("status") as string) || "ACTIVE";
  const version = parseInt(formData.get("version") as string) || 1;

  await prisma.legalDocument.create({
    data: {
      documentNumber,
      title,
      documentType: documentType as any,
      issuingAuthority,
      issuedDate,
      effectiveDate,
      ...(expiryDate && { expiryDate }),
      ...(summary && { summary }),
      ...(officialUrl && { officialUrl }),
      ...(pdfUrl && { pdfUrl }),
      status: status as any,
      version,
    },
  });

  redirect("/admin/legal?created=1");
}

export async function updateLegalDocument(id: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const issuedDate = formData.get("issuedDate") ? new Date(formData.get("issuedDate") as string) : undefined;
  const effectiveDate = formData.get("effectiveDate") ? new Date(formData.get("effectiveDate") as string) : undefined;
  const expiryDate = formData.get("expiryDate") ? new Date(formData.get("expiryDate") as string) : null;
  const summary = (formData.get("summary") as string) || null;
  const officialUrl = (formData.get("officialUrl") as string) || null;
  const pdfUrl = (formData.get("pdfUrl") as string) || null;

  await prisma.legalDocument.update({
    where: { id },
    data: {
      documentNumber: formData.get("documentNumber") as string,
      title: formData.get("title") as string,
      documentType: (formData.get("documentType") as string) as any,
      issuingAuthority: formData.get("issuingAuthority") as string,
      ...(issuedDate !== undefined && { issuedDate }),
      ...(effectiveDate !== undefined && { effectiveDate }),
      expiryDate: expiryDate || undefined,
      summary: summary || undefined,
      officialUrl: officialUrl || undefined,
      pdfUrl: pdfUrl || undefined,
      status: (formData.get("status") as string) as any,
      version: parseInt(formData.get("version") as string) || 1,
    },
  });

  redirect("/admin/legal?updated=1");
}

export async function deleteLegalDocument(id: string) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }
  await prisma.legalDocument.delete({ where: { id } });
  redirect("/admin/legal?deleted=1");
}
