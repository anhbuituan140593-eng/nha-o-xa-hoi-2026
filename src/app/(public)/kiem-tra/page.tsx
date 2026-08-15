import EligibilityWizard from "@/components/eligibility/wizard";

export const metadata = {
  title: "Kiểm tra điều kiện mua nhà ở xã hội | Nhà Ở Xã Hội 2026",
  description: "Kiểm tra xem bạn có đủ điều kiện mua, thuê mua nhà ở xã hội theo quy định pháp luật hiện hành.",
};

export default function KiemTraPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="bg-navy-800 py-8 text-center text-white">
        <h1 className="text-2xl font-bold md:text-3xl">Kiểm tra điều kiện</h1>
        <p className="mt-2 text-navy-200">Trả lời 5 câu hỏi để biết bạn có đủ điều kiện hay không</p>
      </div>
      <EligibilityWizard />
    </div>
  );
}
