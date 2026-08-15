"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteLead(id: string) {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Không có quyền");
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    throw new Error("Không tìm thấy khách hàng");
  }

  // Disconnect eligibility check reference before deleting
  if (lead.eligibilityCheckId) {
    await prisma.lead.update({
      where: { id },
      data: { eligibilityCheckId: null },
    });
  }

  await prisma.lead.delete({ where: { id } });

  revalidatePath("/admin/leads");
}
