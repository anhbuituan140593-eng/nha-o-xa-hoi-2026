import { auth } from "@/auth";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;
  return session.user as { id: string; email: string; name?: string; role: string };
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireStaff() {
  const user = await getCurrentUser();
  if (!user || !["SUPER_ADMIN", "ADMIN", "CONSULTANT", "REVIEWER"].includes(user.role)) {
    throw new Error("Unauthorized");
  }
  return user;
}
