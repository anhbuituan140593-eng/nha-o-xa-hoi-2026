"use client";

interface ContactData {
  siteName: string;
  hotline?: string | null;
  zaloPhone?: string | null;
  zaloUrl?: string | null;
  messengerUrl?: string | null;
  facebookUrl?: string | null;
  email?: string | null;
  officeAddress?: string | null;
  googleMapsUrl?: string | null;
  workingHours?: string | null;
  consultationNote?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  disclaimerLegal?: string | null;
  disclaimerService?: string | null;
}

export default function SettingsForm({ contact }: { contact: ContactData | null }) {
  return (
    <>
      {/* Logo & Favicon */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Logo & Giao diện</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">URL Logo website</label>
            <input
              name="logoUrl"
              defaultValue={contact?.logoUrl || ""}
              className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
              placeholder="https://example.com/logo.png"
            />
            <p className="mt-1 text-xs text-gray-500">Khuyến nghị: PNG/SVG, chiều cao 40-60px, nền trong suốt</p>
            {contact?.logoUrl && (
              <div className="mt-2 flex items-center gap-3 rounded border p-3">
                <img src={contact.logoUrl} alt="Logo hiện tại" className="h-12 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <span className="text-xs text-gray-500">Logo hiện tại</span>
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">URL Favicon</label>
            <input
              name="faviconUrl"
              defaultValue={contact?.faviconUrl || ""}
              className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
              placeholder="https://example.com/favicon.ico"
            />
            <p className="mt-1 text-xs text-gray-500">Icon hiển thị trên tab trình duyệt (ICO/PNG, 32x32 hoặc 16x16)</p>
          </div>
        </div>
      </div>

      {/* Thông tin website */}
      <div className="border-t pt-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Thông tin website</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Tên website *</label>
            <input
              required
              name="siteName"
              defaultValue={contact?.siteName || "Nhà Ở Xã Hội 2026"}
              className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
            />
          </div>
        </div>
      </div>

      {/* Liên hệ */}
      <div className="border-t pt-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Liên hệ</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Hotline</label>
            <input name="hotline" defaultValue={contact?.hotline || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="0901 234 567" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Zalo Phone</label>
            <input name="zaloPhone" defaultValue={contact?.zaloPhone || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="0901 234 567" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input name="email" type="email" defaultValue={contact?.email || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="lienhe@nhaxahoi.vn" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Giờ làm việc</label>
            <input name="workingHours" defaultValue={contact?.workingHours || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="T2-T6: 8:00 - 17:30" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Địa chỉ văn phòng</label>
            <input name="officeAddress" defaultValue={contact?.officeAddress || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="Số ..., Đường ..., Quận ..., TP.HCM" />
          </div>
        </div>
      </div>

      {/* Mạng xã hội */}
      <div className="border-t pt-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Mạng xã hội & Bản đồ</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Zalo URL</label>
            <input name="zaloUrl" defaultValue={contact?.zaloUrl || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="https://zalo.me/..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Messenger URL</label>
            <input name="messengerUrl" defaultValue={contact?.messengerUrl || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="https://m.me/..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Facebook URL</label>
            <input name="facebookUrl" defaultValue={contact?.facebookUrl || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Google Maps URL</label>
            <input name="googleMapsUrl" defaultValue={contact?.googleMapsUrl || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="https://maps.google.com/..." />
          </div>
        </div>
      </div>

      {/* Ghi chú & Disclaimer */}
      <div className="border-t pt-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Ghi chú & Tuyên bố miễn trừ</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Ghi chú tư vấn</label>
            <textarea name="consultationNote" rows={3} defaultValue={contact?.consultationNote || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="Lưu ý dành cho khách hàng khi liên hệ..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Disclaimer pháp lý</label>
            <textarea name="disclaimerLegal" rows={3} defaultValue={contact?.disclaimerLegal || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="Thông tin mang tính tham khảo, không thay thế tư vấn pháp luật chuyên nghiệp..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Disclaimer dịch vụ</label>
            <textarea name="disclaimerService" rows={3} defaultValue={contact?.disclaimerService || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="Chúng tôi không phải chủ đầu tư, không bán trực tiếp..." />
          </div>
        </div>
      </div>
    </>
  );
}
