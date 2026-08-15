import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { logoutAction } from "./actions";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderOpen,
  Building2,
  Scale,
  Settings,
  FileText,
  LogOut,
  Home,
} from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || !["SUPER_ADMIN", "ADMIN", "CONSULTANT", "REVIEWER"].includes(user.role)) {
    redirect("/admin/login");
  }

  const menuItems = [
    { href: "/", label: "Trang Chủ", icon: Home, external: true },
    { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Khách hàng", icon: Users },
    { href: "/admin/appointments", label: "Lịch hẹn", icon: Calendar },
    { href: "/admin/cases", label: "Hồ sơ khách hàng", icon: FolderOpen },
    { href: "/admin/projects", label: "Dự án", icon: Building2 },
    { href: "/admin/legal", label: "Pháp luật", icon: Scale },
    { href: "/admin/rules", label: "Điều kiện", icon: Settings },
    { href: "/admin/forms", label: "Biểu mẫu", icon: FileText },
    { href: "/admin/settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <div className="p-4">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-navy-900">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800 text-white text-sm">
              A
            </div>
            Admin Panel
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) =>
            "external" in item && item.external ? (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-navy-900"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-navy-900"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="border-t p-3">
          <div className="mb-2 px-3 text-xs text-gray-500">
            {user.name || user.email}
            <br />
            <span className="text-navy-600">{user.role}</span>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
