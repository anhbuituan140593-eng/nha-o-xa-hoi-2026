"use client";

const DOC_TYPES = [
  { value: "LAW", label: "Luật" },
  { value: "DECREE", label: "Nghị định" },
  { value: "RESOLUTION", label: "Nghị quyết" },
  { value: "CIRCULAR", label: "Thông tư" },
  { value: "DECISION", label: "Quyết định" },
  { value: "OTHER", label: "Khác" },
];

const DOC_STATUSES = [
  { value: "ACTIVE", label: "Còn hiệu lực" },
  { value: "EXPIRED", label: "Hết hiệu lực" },
  { value: "AMENDED", label: "Đã sửa đổi/bổ sung" },
  { value: "DRAFT", label: "Dự thảo" },
];

export default function LegalFields({ defaults }: {
  defaults?: {
    documentNumber?: string;
    title?: string;
    documentType?: string;
    issuingAuthority?: string;
    issuedDate?: Date | null;
    effectiveDate?: Date | null;
    expiryDate?: Date | null;
    summary?: string | null;
    officialUrl?: string | null;
    pdfUrl?: string | null;
    status?: string;
    version?: number;
  };
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Số văn bản */}
      <div>
        <label className="mb-1 block text-sm font-medium">Số văn bản *</label>
        <input
          required
          name="documentNumber"
          defaultValue={defaults?.documentNumber || ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
          placeholder="VD: 27/2023/QH15"
        />
      </div>

      {/* Loại văn bản */}
      <div>
        <label className="mb-1 block text-sm font-medium">Loại văn bản *</label>
        <select
          required
          name="documentType"
          defaultValue={defaults?.documentType || "LAW"}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
        >
          {DOC_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Tiêu đề */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Tên / Tiêu đề văn bản *</label>
        <input
          required
          name="title"
          defaultValue={defaults?.title || ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
          placeholder="VD: Luật Nhà ở 2023"
        />
      </div>

      {/* Cơ quan ban hành */}
      <div>
        <label className="mb-1 block text-sm font-medium">Cơ quan ban hành *</label>
        <input
          required
          name="issuingAuthority"
          defaultValue={defaults?.issuingAuthority || ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
          placeholder="VD: Quốc hội, Chính phủ..."
        />
      </div>

      {/* Trạng thái */}
      <div>
        <label className="mb-1 block text-sm font-medium">Trạng thái</label>
        <select
          name="status"
          defaultValue={defaults?.status || "ACTIVE"}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
        >
          {DOC_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Ngày ban hành */}
      <div>
        <label className="mb-1 block text-sm font-medium">Ngày ban hành</label>
        <input
          type="date"
          name="issuedDate"
          defaultValue={defaults?.issuedDate ? new Date(defaults.issuedDate).toISOString().split("T")[0] : ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
        />
      </div>

      {/* Ngày có hiệu lực */}
      <div>
        <label className="mb-1 block text-sm font-medium">Ngày có hiệu lực</label>
        <input
          type="date"
          name="effectiveDate"
          defaultValue={defaults?.effectiveDate ? new Date(defaults.effectiveDate).toISOString().split("T")[0] : ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
        />
      </div>

      {/* Ngày hết hiệu lực */}
      <div>
        <label className="mb-1 block text-sm font-medium">Ngày hết hiệu lực</label>
        <input
          type="date"
          name="expiryDate"
          defaultValue={defaults?.expiryDate ? new Date(defaults.expiryDate).toISOString().split("T")[0] : ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
        />
      </div>

      {/* Phiên bản */}
      <div>
        <label className="mb-1 block text-sm font-medium">Phiên bản</label>
        <input
          type="number"
          name="version"
          min={1}
          defaultValue={defaults?.version || 1}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
        />
      </div>

      {/* URL chính thức */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">URL văn bản chính thức</label>
        <input
          type="url"
          name="officialUrl"
          defaultValue={defaults?.officialUrl || ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
          placeholder="https://thuvienphapluat.vn/..."
        />
      </div>

      {/* URL PDF */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">URL file PDF</label>
        <input
          type="url"
          name="pdfUrl"
          defaultValue={defaults?.pdfUrl || ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
          placeholder="https://...pdf"
        />
      </div>

      {/* Tóm tắt */}
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium">Tóm tắt nội dung</label>
        <textarea
          name="summary"
          rows={4}
          defaultValue={defaults?.summary || ""}
          className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
          placeholder="Tóm tắt nội dung chính của văn bản..."
        />
      </div>
    </div>
  );
}
