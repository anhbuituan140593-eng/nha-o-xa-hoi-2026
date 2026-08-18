"use client";

import { useState } from "react";

interface Province {
  id: string;
  name: string;
}

export default function ProjectForm({ provinces }: { provinces: Province[] }) {
  const [provinceId, setProvinceId] = useState(provinces[0]?.id || "");
  const [imageRows, setImageRows] = useState<{ url: string; caption: string }[]>([]);

  return (
    <>
      {/* Thông tin cơ bản */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Tên dự án *</label>
          <input required name="name" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: Chung cư NOXH Bình Dương" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Chủ đầu tư *</label>
          <input required name="investor" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: Công ty CP XYZ" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Tỉnh/Thành phố *</label>
          <select
            required
            name="provinceId"
            value={provinceId}
            onChange={(e) => setProvinceId(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
          >
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Quận/Huyện</label>
          <input name="district" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: TP. Thủ Dầu Một" />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Địa chỉ *</label>
          <input required name="address" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: Đường ABC, Phường XYZ" />
        </div>
      </div>

      {/* Quy mô & Giá */}
      <div className="border-t pt-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Quy mô & Giá bán</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Tổng số căn hộ</label>
            <input type="number" name="totalUnits" min={0} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: 500" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Diện tích (m²)</label>
            <input name="areaRange" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: 35 - 70 m²" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Khoảng giá (tỷ VNĐ)</label>
            <input name="priceRange" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: 500 triệu - 1.2 tỷ" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Giá/m² (VNĐ)</label>
            <input type="number" name="pricePerSqm" min={0} step={100000} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: 18000000" />
          </div>
        </div>
      </div>

      {/* Thời gian */}
      <div className="border-t pt-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Thời gian</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Bắt đầu nhận hồ sơ</label>
            <input type="date" name="applicationStart" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Hạn nộp hồ sơ</label>
            <input type="date" name="applicationEnd" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ngày bốc thăm (dự kiến)</label>
            <input type="date" name="lotteryDate" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Ngày bàn giao (dự kiến)</label>
            <input type="date" name="handoverDate" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" />
          </div>
        </div>
      </div>

      {/* Liên hệ & Nguồn */}
      <div className="border-t pt-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Liên hệ & Nguồn thông tin</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Địa chỉ nộp hồ sơ</label>
            <input name="submissionAddress" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: Phòng Quản lý nhà ở, Sở Xây dựng..." />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Hotline</label>
            <input name="hotline" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: 0901 234 567" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Website</label>
            <input name="website" type="url" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="https://..." />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">URL nguồn chính thức</label>
            <input name="officialSourceUrl" type="url" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="Link công văn/thông báo chính thức" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">URL ảnh đại diện</label>
            <input name="thumbnailUrl" type="url" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* Toàn cảnh 360° — tách riêng cho dễ thấy */}
      <div className="border-t pt-5">
        <h3 className="mb-1 text-sm font-semibold text-gray-700">Toàn cảnh 360°</h3>
        <p className="mb-3 text-xs text-muted-foreground">Dán link 360° để hiển thị iframe trong trang chi tiết dự án. Ví dụ: https://360.vhggroup.vn/phucdat-hatinh/</p>
        <div className="rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-4">
          <label className="mb-1 block text-sm font-medium">Link toàn cảnh 360°</label>
          <input name="panoramaUrl" type="url" className="w-full rounded border bg-white px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="https://360.vhggroup.vn/phucdat-hatinh/" />
          <p className="mt-1 text-xs text-muted-foreground">Để trống nếu dự án chưa có. Với dự án “Phúc Đạt Hà Tĩnh” sẽ tự dùng link trên nếu bỏ trống.</p>
        </div>
      </div>

      {/* Trạng thái & Mô tả */}
      <div className="border-t pt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Trạng thái</label>
            <select name="status" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600">
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
            <input name="progress" className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="VD: Đang thi công móng" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Mô tả</label>
            <textarea name="description" rows={4} className="w-full rounded border px-3 py-2 text-sm focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600" placeholder="Thông tin chi tiết về dự án..." />
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
                {/* Hidden inputs để gửi qua FormData */}
                <input type="hidden" name={`imageUrl_${idx}`} value={imageRows[idx].url} />
                <input type="hidden" name={`imageCaption_${idx}`} value={imageRows[idx].caption} />
              </div>
              <button
                type="button"
                onClick={() => setImageRows(imageRows.filter((_, i) => i !== idx))}
                className="mt-1 text-red-500 hover:text-red-700"
                title="Xóa ảnh"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setImageRows([...imageRows, { url: "", caption: "" }])}
            className="rounded border border-dashed px-4 py-2 text-sm text-gray-600 hover:border-navy-400 hover:text-navy-700"
          >
            + Thêm ảnh
          </button>
        </div>
      </div>
    </>
  );
}
