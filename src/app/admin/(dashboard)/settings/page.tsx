import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { updateSettings } from "./actions";
import SettingsForm from "./settings-form";

export default async function AdminSettingsPage() {
  const contact = await prisma.contactSetting.findFirst();

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Cài đặt website</h1>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ & Giao diện</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateSettings} className="space-y-5">
            <SettingsForm contact={contact} />
            <div className="flex gap-3 pt-4 border-t">
              <button type="submit" className="rounded-lg bg-navy-800 px-5 py-2 text-sm font-medium text-white hover:bg-navy-900">
                Lưu thay đổi
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
