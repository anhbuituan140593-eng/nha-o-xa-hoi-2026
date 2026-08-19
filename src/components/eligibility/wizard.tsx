"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const APPLICANT_TYPES = [
  { value: "CO_CONG", label: "Người có công với cách mạng" },
  { value: "THAN_NHAN_LIET_SI", label: "Thân nhân liệt sĩ" },
  { value: "NGUOI_KHUYET_TAT", label: "Người khuyết tật" },
  { value: "TAI_DINH_CU", label: "Người được bố trí tái định cư (mua/thuê mua NOXH)" },
  { value: "NGHEO_NONG_THON", label: "Hộ nghèo, cận nghèo tại khu vực nông thôn" },
  { value: "NGHEO_THIEN_TAI", label: "Hộ nghèo, cận nghèo nông thôn vùng thiên tai, biến đổi khí hậu" },
  { value: "NGHEO_DO_THI", label: "Hộ nghèo, cận nghèo tại khu vực đô thị" },
  { value: "THU_NHAP_THAP", label: "Người thu nhập thấp tại khu vực đô thị" },
  { value: "CONG_NHAN", label: "Công nhân, người lao động tại doanh nghiệp, HTX trong/ngoài KCN" },
  { value: "LUONG_VU_TRANG", label: "Sĩ quan, quân nhân chuyên nghiệp, hạ sĩ quan LLVT; công nhân công an; quốc phòng; cơ yếu" },
  { value: "CONG_CHUC", label: "Cán bộ, công chức, viên chức" },
  { value: "TRA_LAI_NHA_CONG_VU", label: "Người đã trả lại nhà ở công vụ" },
  { value: "BI_THU_HOI_DAT", label: "Hộ gia đình, cá nhân bị thu hồi đất, giải tỏa nhà ở chưa được bồi thường" },
  { value: "HOC_SINH_SINH_VIEN", label: "Học sinh, sinh viên các trường đại học, cao đẳng, GDNN, trường chuyên biệt" },
  { value: "DOANH_NGHIEP_KCN", label: "Doanh nghiệp, hợp tác xã, liên hiệp HTX trong khu công nghiệp" },
  { value: "NHIEU_CON", label: "Người có từ 02 con đẻ trở lên (theo Luật Dân số 2025)" },
];

const MARITAL_STATUSES = [
  { value: "SINGLE", label: "Độc thân" },
  { value: "SINGLE_WITH_CHILD", label: "Độc thân đang nuôi con chưa thành niên" },
  { value: "MARRIED", label: "Đã kết hôn" },
  { value: "DIVORCED", label: "Ly hôn" },
  { value: "WIDOWED", label: "Góa" },
];

const HOUSING_STATUSES = [
  { value: "NO_OWNERSHIP", label: "Chưa có nhà ở thuộc sở hữu của mình" },
  { value: "UNDER_15M2", label: "Có nhà nhưng diện tích bình quân dưới 15m² sàn/người" },
  { value: "FAR_FROM_WORK", label: "Có nhà nhưng cách xa nơi làm việc (theo quy định tỉnh/TP)" },
  { value: "OTHER", label: "Trường hợp khác" },
];

const EMPLOYMENT_TYPES = [
  { value: "CONTRACT", label: "Có hợp đồng lao động" },
  { value: "NO", label: "Không" },
  { value: "FREELANCE", label: "Lao động tự do" },
  { value: "BUSINESS", label: "Kinh doanh tự do" },
  { value: "OTHER", label: "Khác" },
];

interface WizardData {
  fullName: string;
  phone: string;
  applicantType: string;
  maritalStatus: string;
  housingStatus: string;
  incomeSelf: number;
  incomeSpouse: number;
  childrenCount: number;
  employmentType: string;
}

const TOTAL_STEPS = 6;

export default function EligibilityWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WizardData>({
    fullName: "",
    phone: "",
    applicantType: "",
    maritalStatus: "",
    housingStatus: "",
    incomeSelf: 0,
    incomeSpouse: 0,
    childrenCount: 0,
    employmentType: "",
  });

  const updateData = (field: keyof WizardData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/eligibility/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.checkCode) {
        router.push(`/ket-qua/${result.checkCode}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return data.fullName.trim().length >= 2 && /^0\d{9}$/.test(data.phone.trim());
      case 1: return !!data.applicantType;
      case 2: return !!data.housingStatus;
      case 3: return !!data.maritalStatus;
      case 4: return data.incomeSelf > 0;
      case 5: return !!data.employmentType;
      default: return false;
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-8">
      {/* Progress */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-2">
          <span>Bước {step} / {TOTAL_STEPS - 1}</span>
          <span>{Math.round((step / (TOTAL_STEPS - 1)) * 100)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-navy-700 transition-all duration-300"
            style={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0: Contact Info */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
            <p className="text-sm text-muted-foreground">
              Vui lòng để lại thông tin để nhận kết quả kiểm tra. Chúng tôi sẽ liên hệ tư vấn miễn phí.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                placeholder="VD: Nguyễn Văn A"
                value={data.fullName}
                onChange={(e) => updateData("fullName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="VD: 0901234567"
                value={data.phone}
                onChange={(e) => updateData("phone", e.target.value)}
              />
              {data.phone && !/^0\d{9}$/.test(data.phone.trim()) && (
                <p className="text-xs text-red-500">Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Applicant Type */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Bạn thuộc nhóm đối tượng nào?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {APPLICANT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => updateData("applicantType", type.value)}
                className={`w-full flex items-center justify-between rounded-lg border p-3 sm:p-4 text-left transition-colors ${
                  data.applicantType === type.value
                    ? "border-navy-700 bg-navy-50"
                    : "hover:bg-gray-50 active:bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium sm:text-base">{type.label}</span>
                {data.applicantType === type.value && (
                  <Check className="h-5 w-5 text-navy-700" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Housing Status */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Điều kiện về nhà ở</CardTitle>
            <p className="text-sm text-muted-foreground">
              Bạn thuộc trường hợp nào dưới đây?
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {HOUSING_STATUSES.map((status) => (
              <button
                key={status.value}
                onClick={() => updateData("housingStatus", status.value)}
                className={`w-full flex items-center justify-between rounded-lg border p-3 sm:p-4 text-left transition-colors ${
                  data.housingStatus === status.value
                    ? "border-navy-700 bg-navy-50"
                    : "hover:bg-gray-50 active:bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium sm:text-base">{status.label}</span>
                {data.housingStatus === status.value && (
                  <Check className="h-5 w-5 text-navy-700" />
                )}
              </button>
            ))}
            {data.housingStatus === "UNDER_15M2" && (
              <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                Diện tích nhà ở bình quân đầu người = tổng diện tích sàn nhà ở ÷ số người trong hộ.
                Nếu thấp hơn 15m² sàn/người, bạn đáp ứng điều kiện về nhà ở.
              </p>
            )}
            {data.housingStatus === "FAR_FROM_WORK" && (
              <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                Điều kiện này áp dụng theo quy định của từng tỉnh/thành phố về khoảng cách
                giữa nơi ở và nơi làm việc.
              </p>
            )}
            {data.housingStatus === "OTHER" && (
              <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                Vui lòng liên hệ chuyên viên để được tư vấn cụ thể về trường hợp của bạn.
                Mỗi trường hợp đặc biệt sẽ được xem xét riêng theo quy định pháp luật hiện hành.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Marital Status */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Tình trạng hôn nhân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {MARITAL_STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => updateData("maritalStatus", status.value)}
                  className={`w-full flex items-center justify-between rounded-lg border p-3 sm:p-4 text-left transition-colors ${
                    data.maritalStatus === status.value
                      ? "border-navy-700 bg-navy-50"
                      : "hover:bg-gray-50 active:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium sm:text-base">{status.label}</span>
                  {data.maritalStatus === status.value && (
                    <Check className="h-5 w-5 text-navy-700" />
                  )}
                </button>
              ))}
            </div>

            {(data.maritalStatus === "MARRIED" || data.maritalStatus === "SINGLE_WITH_CHILD") && (
              <div className="mt-4 space-y-4 rounded-lg border p-4">
                {data.maritalStatus === "SINGLE_WITH_CHILD" && (
                  <div className="space-y-2">
                    <Label htmlFor="childrenCount">Số con chưa thành niên</Label>
                    <Input
                      id="childrenCount"
                      type="number"
                      min={1}
                      max={10}
                      value={data.childrenCount || ""}
                      onChange={(e) => updateData("childrenCount", parseInt(e.target.value) || 0)}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Income */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Thu nhập hàng tháng</CardTitle>
            <p className="text-sm text-muted-foreground">
              Thu nhập bình quân thực nhận hàng tháng trong 12 tháng gần nhất
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="incomeSelf">
                {data.maritalStatus === "MARRIED" ? "Thu nhập của bạn" : "Thu nhập hàng tháng"}
              </Label>
              <Input
                id="incomeSelf"
                type="number"
                placeholder="Ví dụ: 15000000"
                value={data.incomeSelf || ""}
                onChange={(e) => updateData("incomeSelf", parseFloat(e.target.value) || 0)}
              />
              {data.incomeSelf > 0 && (
                <p className="text-sm text-muted-foreground">
                  = {new Intl.NumberFormat("vi-VN").format(data.incomeSelf)} ₫/tháng
                </p>
              )}
            </div>

            {data.maritalStatus === "MARRIED" && (
              <div className="space-y-2">
                <Label htmlFor="incomeSpouse">Thu nhập vợ/chồng</Label>
                <Input
                  id="incomeSpouse"
                  type="number"
                  placeholder="Ví dụ: 12000000"
                  value={data.incomeSpouse || ""}
                  onChange={(e) => updateData("incomeSpouse", parseFloat(e.target.value) || 0)}
                />
                {data.incomeSpouse > 0 && (
                  <p className="text-sm text-muted-foreground">
                    = {new Intl.NumberFormat("vi-VN").format(data.incomeSpouse)} ₫/tháng
                  </p>
                )}
              </div>
            )}

            {data.maritalStatus === "MARRIED" && (data.incomeSelf + data.incomeSpouse) > 0 && (
              <div className="rounded-lg bg-navy-50 p-4">
                <p className="font-medium">Tổng thu nhập hộ gia đình:</p>
                <p className="text-xl font-bold text-navy-800">
                  {new Intl.NumberFormat("vi-VN").format(data.incomeSelf + data.incomeSpouse)} ₫/tháng
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Employment */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Tình trạng việc làm</CardTitle>
            <p className="text-sm text-muted-foreground">
              Hiện bạn có hợp đồng lao động hoặc cơ quan trả lương không?
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {EMPLOYMENT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => updateData("employmentType", type.value)}
                className={`w-full flex items-center justify-between rounded-lg border p-3 sm:p-4 text-left transition-colors ${
                  data.employmentType === type.value
                    ? "border-navy-700 bg-navy-50"
                    : "hover:bg-gray-50 active:bg-gray-50"
                }`}
              >
                <span className="text-sm font-medium sm:text-base">{type.label}</span>
                {data.employmentType === type.value && (
                  <Check className="h-5 w-5 text-navy-700" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex gap-3 sm:gap-4">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-12 sm:h-auto">
            Quay lại
          </Button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="flex-1 h-12 sm:h-auto"
          >
            Tiếp tục <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            className="flex-1 h-12 sm:h-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xem kết quả"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
