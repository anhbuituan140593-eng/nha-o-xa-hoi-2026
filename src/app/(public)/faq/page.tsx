import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Câu hỏi thường gặp về nhà ở xã hội | Nhà Ở Xã Hội 2026",
  description: "Giải đáp thắc mắc về điều kiện, hồ sơ, thủ tục mua nhà ở xã hội.",
};

const faqs = [
  {
    question: "Ai được mua nhà ở xã hội?",
    answer:
      "Theo Luật Nhà ở 2023 và Nghị định 100/2024/NĐ-CP, các đối tượng được hỗ trợ gồm: người có công với cách mạng; hộ nghèo, cận nghèo; người thu nhập thấp tại đô thị; công nhân, người lao động tại khu công nghiệp; cán bộ, công chức, viên chức; lực lượng vũ trang; người trả lại nhà công vụ; người bị thu hồi đất nhưng chưa được bồi thường bằng nhà ở/đất ở.",
  },
  {
    question: "Thu nhập bao nhiêu thì được mua nhà ở xã hội?",
    answer:
      "Theo quy định hiện hành năm 2026: Người độc thân có thu nhập ≤ 25.000.000 đồng/tháng; Người độc thân nuôi con chưa thành niên ≤ 35.000.000 đồng/tháng; Hai vợ chồng tổng thu nhập ≤ 50.000.000 đồng/tháng. Thời gian xác định là 12 tháng liền kề.",
  },
  {
    question: "Người độc thân có mua được nhà ở xã hội không?",
    answer:
      "Có. Người độc thân thuộc đối tượng được hỗ trợ và đáp ứng điều kiện về thu nhập, nhà ở vẫn có thể đăng ký mua, thuê mua nhà ở xã hội.",
  },
  {
    question: "Có nhà ở tỉnh khác thì có mua được NOXH không?",
    answer:
      "Điều kiện về nhà ở được xét theo địa phương nơi có dự án. Nếu bạn chưa có nhà ở thuộc sở hữu tại tỉnh/thành phố nơi dự án tọa lạc, bạn vẫn có thể đủ điều kiện. Tuy nhiên, cần kiểm tra cụ thể theo quy định của từng dự án.",
  },
  {
    question: "Lao động tự do có được mua nhà ở xã hội không?",
    answer:
      "Có. Lao động tự do thuộc đối tượng được xem xét. Bạn cần chuẩn bị hồ sơ kê khai thu nhập theo quy định cho lao động tự do thay vì giấy xác nhận thu nhập từ cơ quan.",
  },
  {
    question: "Hồ sơ mua nhà ở xã hội gồm những gì?",
    answer:
      "Hồ sơ cơ bản gồm: Đơn đăng ký mua/thuê mua (theo mẫu); CCCD/CMND; Giấy tờ hôn nhân (nếu có); Giấy xác nhận đối tượng; Giấy xác nhận điều kiện nhà ở; Giấy xác nhận thu nhập hoặc tờ khai tự kê khai. Hồ sơ cụ thể phụ thuộc vào đối tượng và dự án.",
  },
  {
    question: "Bao lâu phải bổ sung hồ sơ nếu thiếu?",
    answer:
      "Thời hạn bổ sung tùy thuộc vào quy định của từng đợt tiếp nhận và chủ đầu tư/cơ quan thẩm quyền. Thông thường từ 7-15 ngày làm việc kể từ khi nhận thông báo.",
  },
  {
    question: "Dịch vụ của website có đảm bảo được mua nhà không?",
    answer:
      "Không. Dịch vụ chỉ hỗ trợ chuẩn bị và rà soát hồ sơ. Quyết định xét duyệt thuộc đơn vị có thẩm quyền (chủ đầu tư, Sở Xây dựng, UBND cấp tỉnh). Chúng tôi không cam kết hay bảo đảm kết quả.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Câu hỏi thường gặp</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <h3 className="mb-2 font-semibold">{faq.question}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
