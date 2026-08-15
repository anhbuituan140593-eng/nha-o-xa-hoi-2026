"use client";

interface DocOption { id: string; documentNumber: string }

const APPLICANT_TYPES = [
  { value: "", label: "Tất cả đối tượng" },
  { value: "CO_CONG", label: "Người có công với cách mạng" },
  { value: "NGHEO_NONG_THON", label: "Hộ nghèo, cận nghèo nông thôn" },
  { value: "NGHEO_THIEN_TAI", label: "Hộ nghèo, cận nghèo vùng thiên tai" },
  { value: "NGHEO_DO_THI", label: "Hộ nghèo, cận nghèo đô thị" },
  { value: "THU_NHAP_THAP", label: "Người thu nhập thấp đô thị" },
  { value: "CONG_NHAN", label: "Công nhân, NLĐ trong/ngoài KCN" },
  { value: "LUONG_VU_TRANG", label: "Lực lượng vũ trang, quốc phòng, cơ yếu" },
  { value: "CONG_CHUC", label: "Cán bộ, công chức, viên chức" },
  { value: "TRA_LAI_NHA_CONG_VU", label: "Người trả lại nhà ở công vụ" },
  { value: "BI_THU_HOI_DAT", label: "Bị thu hồi đất, giải tỏa chưa bồi thường" },
  { value: "HOC_SINH_SINH_VIEN", label: "Học sinh, sinh viên" },
  { value: "DOANH_NGHIEP_KCN", label: "Doanh nghiệp, HTX trong KCN" },
  { value: "NHIEU_CON", label: "Người có từ 02 con đẻ trở lên" },
];

export default function FormFields({ documents, defaults }: {
  documents: DocOption[];
  defaults?: {
    name?: string; code?: string; fileUrl?: string; description?: string | null;
    applicantType?: string | null; legalDocumentId?: string | null;
    effectiveFrom?: Date; effectiveTo?: Date | null; active?: boolean;
  };
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Tên biểu mẫu *</label>
          <input required name="name" defaultValue={defaults?.name || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: Đơn đăng ký mua NOXH" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mã biểu mẫu *</label>
          <input required name="code" defaultValue={defaults?.code || ""} className="w-full rounded border px-3 py-2 text-sm font-mono focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: MAU_DON_DANG_KY" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">URL file biểu mẫu *</label>
          <input required name="fileUrl" type="url" defaultValue={defaults?.fileUrl || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="https://..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Đối tượng áp dụng</label>
          <select name="applicantType" defaultValue={defaults?.applicantType || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600">
            {APPLICANT_TYPES.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Căn cứ pháp lý</label>
          <select name="legalDocumentId" defaultValue={defaults?.legalDocumentId || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600">
            <option value="">-- Chọn văn bản --</option>
            {documents.map(d => (<option key={d.id} value={d.id}>{d.documentNumber}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Hiệu lực từ</label>
          <input type="date" name="effectiveFrom" defaultValue={defaults?.effectiveFrom ? new Date(defaults.effectiveFrom).toISOString().split("T")[0] : ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Hiệu lực đến</label>
          <input type="date" name="effectiveTo" defaultValue={defaults?.effectiveTo ? new Date(defaults.effectiveTo).toISOString().split("T")[0] : ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
        </div>
        <div className="flex items-center gap-2 pt-4">
          <input type="checkbox" name="active" defaultChecked={defaults?.active !== false} className="h-4 w-4 rounded border-gray-300" />
          <label className="text-sm font-medium">Kích hoạt</label>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Mô tả</label>
          <textarea name="description" rows={3} defaultValue={defaults?.description || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="Mô tả về biểu mẫu..." />
        </div>
      </div>
    </>
  );
}
