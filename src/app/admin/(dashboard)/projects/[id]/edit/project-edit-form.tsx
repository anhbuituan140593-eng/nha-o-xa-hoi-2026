"use client";

import { useState } from "react";

interface Province { id: string; name: string }
interface ProjectImage { id: string; url: string; caption?: string | null; sortOrder: number }

interface ProjectData {
  name: string;
  investor: string;
  provinceId: string;
  district?: string | null;
  address: string;
  totalUnits?: number | null;
  areaRange?: string | null;
  priceRange?: string | null;
  pricePerSqm?: number | null | { toNumber: () => number };
  applicationStart?: Date | null;
  applicationEnd?: Date | null;
  lotteryDate?: Date | null;
  handoverDate?: Date | null;
  submissionAddress?: string | null;
  hotline?: string | null;
  website?: string | null;
  officialSourceUrl?: string | null;
  thumbnailUrl?: string | null;
  description?: string | null;
  progress?: string | null;
  status: string;
  images: ProjectImage[];
}

function toDateStr(d: Date | null | undefined) {
  if (!d) return "";
  const date = new Date(d);
  return date.toISOString().split("T")[0];
}

export default function ProjectEditForm({ project, provinces }: { project: ProjectData; provinces: Province[] }) {
  const [imageRows, setImageRows] = useState<{ url: string; caption: string }[]>(
    project.images.length > 0
      ? project.images.map(img => ({ url: img.url, caption: img.caption || "" }))
      : []
  );

  return (
    <>
      {/* Thông tin cơ bản */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Tên dự án *</label>
          <input required name="name" defaultValue={project.name} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Chủ đầu tư *</label>
          <input required name="investor" defaultValue={project.investor} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tỉnh/Thành phố *</label>
          <select required name="provinceId" defaultValue={project.provinceId} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600">
            {provinces.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Quận/Huyện</label>
          <input name="district" defaultValue={project.district || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Địa chỉ *</label>
          <input required name="address" defaultValue={project.address} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
        </div>
      </div>

      {/* Quy mô & Giá */}
      <div className="border-t pt-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Quy mô & Giá bán</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Tổng số căn hộ</label>
            <input type="number" name="totalUnits" min={0} defaultValue={project.totalUnits || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Diện tích (m²)</label>
            <input name="areaRange" defaultValue={project.areaRange || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Khoảng giá (tỷ VNĐ)</label>
            <input name="priceRange" defaultValue={project.priceRange || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Giá/m² (VNĐ)</label>
            <input type="number" name="pricePerSqm" min={0} step={100000} defaultValue={project.pricePerSqm ? (typeof project.pricePerSqm === "number" ? project.pricePerSqm : project.pricePerSqm.toNumber()) : ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
        </div>
      </div>

      {/* Thời gian */}
      <div className="border-t pt-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Thời gian</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Bắt đầu nhận hồ sơ</label>
            <input type="date" name="applicationStart" defaultValue={toDateStr(project.applicationStart)} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Hạn nộp hồ sơ</label>
            <input type="date" name="applicationEnd" defaultValue={toDateStr(project.applicationEnd)} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ngày bốc thăm (dự kiến)</label>
            <input type="date" name="lotteryDate" defaultValue={toDateStr(project.lotteryDate)} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ngày bàn giao (dự kiến)</label>
            <input type="date" name="handoverDate" defaultValue={toDateStr(project.handoverDate)} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
        </div>
      </div>

      {/* Liên hệ & Nguồn */}
      <div className="border-t pt-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Liên hệ & Nguồn thông tin</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Địa chỉ nộp hồ sơ</label>
            <input name="submissionAddress" defaultValue={project.submissionAddress || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Hotline</label>
            <input name="hotline" defaultValue={project.hotline || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Website</label>
            <input name="website" type="url" defaultValue={project.website || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">URL nguồn chính thức</label>
            <input name="officialSourceUrl" type="url" defaultValue={project.officialSourceUrl || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">URL ảnh đại diện</label>
            <input name="thumbnailUrl" type="url" defaultValue={project.thumbnailUrl || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
        </div>
      </div>

      {/* Trạng thái & Mô tả */}
      <div className="border-t pt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Trạng thái</label>
            <select name="status" defaultValue={project.status} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600">
              <option value="UPCOMING">Sắp nhận hồ sơ</option>
              <option value="ACCEPTING">Đang nhận hồ sơ</option>
              <option value="CLOSED">Đã hết hạn</option>
              <option value="UNDER_CONSTRUCTION">Đang xây dựng</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="NOT_ANNOUNCED">Chưa công bố</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tiến độ</label>
            <input name="progress" defaultValue={project.progress || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Mô tả</label>
            <textarea name="description" rows={4} defaultValue={project.description || ""} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
        </div>
      </div>

      {/* Ảnh dự án */}
      <div className="border-t pt-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Ảnh dự án (mặt bằng, phối cảnh, thực tế,...)</h3>
        <div className="space-y-3">
          {imageRows.map((_, idx) => (
            <div key={idx} className="flex items-start gap-2 rounded border p-3">
              <div className="flex-1 space-y-2">
                <input
                  value={imageRows[idx].url}
                  onChange={(e) => {
                    const rows = [...imageRows];
                    rows[idx] = { ...rows[idx], url: e.target.value };
                    setImageRows(rows);
                  }}
                  className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
                  placeholder="URL ảnh (https://...)"
                />
                <input
                  value={imageRows[idx].caption}
                  onChange={(e) => {
                    const rows = [...imageRows];
                    rows[idx] = { ...rows[idx], caption: e.target.value };
                    setImageRows(rows);
                  }}
                  className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
                  placeholder="Mô tả ảnh (VD: Phối cảnh tổng thể, Mặt bằng tầng 1, ...)"
                />
                <input type="hidden" name={`imageUrl_${idx}`} value={imageRows[idx].url} />
                <input type="hidden" name={`imageCaption_${idx}`} value={imageRows[idx].caption} />
              </div>
              <button type="button" onClick={() => setImageRows(imageRows.filter((_, i) => i !== idx))} className="mt-1 text-red-500 hover:text-red-700" title="Xóa ảnh">×</button>
            </div>
          ))}
          <button type="button" onClick={() => setImageRows([...imageRows, { url: "", caption: "" }])} className="rounded border border-dashed px-4 py-2 text-sm text-gray-600 hover:border-navy-400 hover:text-navy-700">
            + Thêm ảnh
          </button>
        </div>
      </div>
    </>
  );
}
