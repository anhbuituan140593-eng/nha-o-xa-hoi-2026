import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create provinces
  const provinces = [
    { code: "01", name: "Hà Nội", region: "Đồng bằng sông Hồng" },
    { code: "02", name: "Hà Giang", region: "Trung du và miền núi phía Bắc" },
    { code: "03", name: "Cao Bằng", region: "Trung du và miền núi phía Bắc" },
    { code: "04", name: "Bắc Kạn", region: "Trung du và miền núi phía Bắc" },
    { code: "05", name: "Lạng Sơn", region: "Trung du và miền núi phía Bắc" },
    { code: "06", name: "Sơn La", region: "Trung du và miền núi phía Bắc" },
    { code: "07", name: "Điện Biên", region: "Trung du và miền núi phía Bắc" },
    { code: "08", name: "Lai Châu", region: "Trung du và miền núi phía Bắc" },
    { code: "09", name: "Lào Cai", region: "Trung du và miền núi phía Bắc" },
    { code: "10", name: "Yên Bái", region: "Trung du và miền núi phía Bắc" },
    { code: "11", name: "Hòa Bình", region: "Trung du và miền núi phía Bắc" },
    { code: "12", name: "Ninh Bình", region: "Đồng bằng sông Hồng" },
    { code: "13", name: "Quảng Ninh", region: "Đồng bằng sông Hồng" },
    { code: "14", name: "Thái Nguyên", region: "Trung du và miền núi phía Bắc" },
    { code: "15", name: "Bắc Ninh", region: "Đồng bằng sông Hồng" },
    { code: "16", name: "Bắc Giang", region: "Trung du và miền núi phía Bắc" },
    { code: "17", name: "Vĩnh Phúc", region: "Đồng bằng sông Hồng" },
    { code: "18", name: "Hưng Yên", region: "Đồng bằng sông Hồng" },
    { code: "19", name: "Hải Dương", region: "Đồng bằng sông Hồng" },
    { code: "20", name: "Hải Phòng", region: "Đồng bằng sông Hồng" },
    { code: "21", name: "Thái Bình", region: "Đồng bằng sông Hồng" },
    { code: "22", name: "Hà Nam", region: "Đồng bằng sông Hồng" },
    { code: "23", name: "Nam Định", region: "Đồng bằng sông Hồng" },
    { code: "24", name: "Ninh Thuận", region: "Duyên hải Nam Trung Bộ" },
    { code: "25", name: "Thanh Hóa", region: "Bắc Trung Bộ" },
    { code: "26", name: "Nghệ An", region: "Bắc Trung Bộ" },
    { code: "27", name: "Hà Tĩnh", region: "Bắc Trung Bộ" },
    { code: "28", name: "Quảng Bình", region: "Bắc Trung Bộ" },
    { code: "29", name: "Quảng Trị", region: "Bắc Trung Bộ" },
    { code: "30", name: "Thừa Thiên Huế", region: "Bắc Trung Bộ" },
    { code: "31", name: "Đà Nẵng", region: "Duyên hải Nam Trung Bộ" },
    { code: "32", name: "Quảng Nam", region: "Duyên hải Nam Trung Bộ" },
    { code: "33", name: "Quảng Ngãi", region: "Duyên hải Nam Trung Bộ" },
    { code: "34", name: "Bình Định", region: "Duyên hải Nam Trung Bộ" },
    { code: "35", name: "Phú Yên", region: "Duyên hải Nam Trung Bộ" },
    { code: "36", name: "Khánh Hòa", region: "Duyên hải Nam Trung Bộ" },
    { code: "37", name: "Bình Thuận", region: "Duyên hải Nam Trung Bộ" },
    { code: "38", name: "Kon Tum", region: "Tây Nguyên" },
    { code: "39", name: "Gia Lai", region: "Tây Nguyên" },
    { code: "40", name: "Đắk Lắk", region: "Tây Nguyên" },
    { code: "41", name: "Đắk Nông", region: "Tây Nguyên" },
    { code: "42", name: "Lâm Đồng", region: "Tây Nguyên" },
    { code: "43", name: "Bình Phước", region: "Đông Nam Bộ" },
    { code: "44", name: "Tây Ninh", region: "Đông Nam Bộ" },
    { code: "45", name: "Bình Dương", region: "Đông Nam Bộ" },
    { code: "46", name: "Đồng Nai", region: "Đông Nam Bộ" },
    { code: "47", name: "Bà Rịa - Vũng Tàu", region: "Đông Nam Bộ" },
    { code: "48", name: "Hồ Chí Minh", region: "Đông Nam Bộ" },
    { code: "49", name: "Long An", region: "Đồng bằng sông Cửu Long" },
    { code: "50", name: "Tiền Giang", region: "Đồng bằng sông Cửu Long" },
    { code: "51", name: "Bến Tre", region: "Đồng bằng sông Cửu Long" },
    { code: "52", name: "Trà Vinh", region: "Đồng bằng sông Cửu Long" },
    { code: "53", name: "Vĩnh Long", region: "Đồng bằng sông Cửu Long" },
    { code: "54", name: "Đồng Tháp", region: "Đồng bằng sông Cửu Long" },
    { code: "55", name: "An Giang", region: "Đồng bằng sông Cửu Long" },
    { code: "56", name: "Kiên Giang", region: "Đồng bằng sông Cửu Long" },
    { code: "57", name: "Cần Thơ", region: "Đồng bằng sông Cửu Long" },
    { code: "58", name: "Hậu Giang", region: "Đồng bằng sông Cửu Long" },
    { code: "59", name: "Sóc Trăng", region: "Đồng bằng sông Cửu Long" },
    { code: "60", name: "Bạc Liêu", region: "Đồng bằng sông Cửu Long" },
    { code: "61", name: "Cà Mau", region: "Đồng bằng sông Cửu Long" },
  ];

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { code: province.code },
      update: { name: province.name, region: province.region },
      create: province,
    });
  }
  console.log("✓ Provinces seeded");

  // Create legal documents
  const legalDocuments = [
    {
      documentNumber: "27/2023/QH15",
      title: "Luật Nhà ở 2023",
      documentType: "LAW" as const,
      issuingAuthority: "Quốc hội",
      issuedDate: new Date("2023-11-27"),
      effectiveDate: new Date("2024-08-01"),
      summary: "Luật quy định về sở hữu, phát triển, quản lý, sử dụng nhà ở; giao dịch về nhà ở; quản lý nhà nước về nhà ở tại Việt Nam.",
      officialUrl: "https://vanban.chinhphu.vn",
      status: "ACTIVE" as const,
    },
    {
      documentNumber: "100/2024/NĐ-CP",
      title: "Nghị định quy định chi tiết một số điều của Luật Nhà ở về phát triển và quản lý nhà ở xã hội",
      documentType: "DECREE" as const,
      issuingAuthority: "Chính phủ",
      issuedDate: new Date("2024-07-26"),
      effectiveDate: new Date("2024-08-01"),
      summary: "Nghị định quy định chi tiết về đối tượng, điều kiện được hưởng chính sách hỗ trợ về nhà ở xã hội; hình thức và nguyên tắc thực hiện chính sách; trình tự, thủ tục mua, thuê, thuê mua nhà ở xã hội.",
      officialUrl: "https://vanban.chinhphu.vn",
      status: "ACTIVE" as const,
    },
    {
      documentNumber: "201/2025/QH15",
      title: "Nghị quyết về thí điểm một số cơ chế, chính sách đặc thù phát triển nhà ở xã hội",
      documentType: "RESOLUTION" as const,
      issuingAuthority: "Quốc hội",
      issuedDate: new Date("2025-05-29"),
      effectiveDate: new Date("2025-06-01"),
      summary: "Nghị quyết quy định thí điểm một số cơ chế, chính sách đặc thù về phát triển nhà ở xã hội nhằm đẩy nhanh tiến độ thực hiện các dự án nhà ở xã hội.",
      officialUrl: "https://vanban.chinhphu.vn",
      status: "ACTIVE" as const,
    },
  ];

  for (const doc of legalDocuments) {
    await prisma.legalDocument.upsert({
      where: { documentNumber: doc.documentNumber },
      update: doc,
      create: doc,
    });
  }
  console.log("✓ Legal documents seeded");

  // Create income rules based on 2026 regulations
  const incomeRules = [
    {
      code: "INCOME_SINGLE_2026",
      name: "Ngưỡng thu nhập người độc thân 2026",
      category: "INCOME_LIMIT" as const,
      applicantType: null,
      operator: "LTE" as const,
      value: 25000000,
      unit: "VND",
      article: "Điều 30",
      clause: "Khoản 1",
      effectiveFrom: new Date("2024-08-01"),
      active: true,
      priority: 10,
    },
    {
      code: "INCOME_SINGLE_WITH_CHILD_2026",
      name: "Ngưỡng thu nhập người độc thân nuôi con chưa thành niên 2026",
      category: "INCOME_LIMIT" as const,
      applicantType: "SINGLE_WITH_CHILD",
      operator: "LTE" as const,
      value: 35000000,
      unit: "VND",
      article: "Điều 30",
      clause: "Khoản 2",
      effectiveFrom: new Date("2024-08-01"),
      active: true,
      priority: 20,
    },
    {
      code: "INCOME_MARRIED_2026",
      name: "Ngưỡng thu nhập tổng hai vợ chồng 2026",
      category: "INCOME_LIMIT" as const,
      applicantType: "MARRIED",
      operator: "LTE" as const,
      value: 50000000,
      unit: "VND",
      article: "Điều 30",
      clause: "Khoản 3",
      effectiveFrom: new Date("2024-08-01"),
      active: true,
      priority: 20,
    },
  ];

  const decree100 = await prisma.legalDocument.findUnique({
    where: { documentNumber: "100/2024/NĐ-CP" },
  });

  for (const rule of incomeRules) {
    await prisma.legalRule.upsert({
      where: { code: rule.code },
      update: rule,
      create: {
        ...rule,
        legalDocumentId: decree100?.id,
      },
    });
  }
  console.log("✓ Income rules seeded");

  // Create applicant type rules - 13 groups per Luật Nhà ở 2023
  const applicantTypes = [
    { code: "TYPE_CO_CONG", name: "Người có công với cách mạng, thân nhân liệt sĩ", applicantType: "CO_CONG" },
    { code: "TYPE_NGHEO_NONG_THON", name: "Hộ nghèo, cận nghèo tại khu vực nông thôn", applicantType: "NGHEO_NONG_THON" },
    { code: "TYPE_NGHEO_THIEN_TAI", name: "Hộ nghèo, cận nghèo nông thôn vùng thiên tai, BĐKH", applicantType: "NGHEO_THIEN_TAI" },
    { code: "TYPE_NGHEO_DO_THI", name: "Hộ nghèo, cận nghèo tại khu vực đô thị", applicantType: "NGHEO_DO_THI" },
    { code: "TYPE_THU_NHAP_THAP", name: "Người thu nhập thấp tại khu vực đô thị", applicantType: "THU_NHAP_THAP" },
    { code: "TYPE_CONG_NHAN", name: "Công nhân, NLĐ tại doanh nghiệp, HTX trong/ngoài KCN", applicantType: "CONG_NHAN" },
    { code: "TYPE_LUC_LUONG_VU_TRANG", name: "Sĩ quan, QNCN, hạ sĩ quan LLVT; CN CA; quốc phòng; cơ yếu", applicantType: "LUONG_VU_TRANG" },
    { code: "TYPE_CONG_CHUC", name: "Cán bộ, công chức, viên chức", applicantType: "CONG_CHUC" },
    { code: "TYPE_TRA_LAI_NHA_CONG_VU", name: "Người đã trả lại nhà ở công vụ", applicantType: "TRA_LAI_NHA_CONG_VU" },
    { code: "TYPE_BI_THU_HOI_DAT", name: "Hộ GĐ, cá nhân bị thu hồi đất, giải tỏa chưa được bồi thường", applicantType: "BI_THU_HOI_DAT" },
    { code: "TYPE_HOC_SINH_SINH_VIEN", name: "Học sinh, sinh viên trường ĐH, CĐ, GDNN, chuyên biệt", applicantType: "HOC_SINH_SINH_VIEN" },
    { code: "TYPE_DOANH_NGHIEP_KCN", name: "Doanh nghiệp, HTX, liên hiệp HTX trong KCN", applicantType: "DOANH_NGHIEP_KCN" },
    { code: "TYPE_NHIEU_CON", name: "Người có từ 02 con đẻ trở lên (Luật Dân số 2025)", applicantType: "NHIEU_CON" },
  ];

  const law2023 = await prisma.legalDocument.findUnique({
    where: { documentNumber: "27/2023/QH15" },
  });

  for (const type of applicantTypes) {
    await prisma.legalRule.upsert({
      where: { code: type.code },
      update: type,
      create: {
        ...type,
        category: "APPLICANT_TYPE",
        operator: "EQ",
        value: 1,
        unit: "BOOLEAN",
        article: "Điều 76",
        effectiveFrom: new Date("2024-08-01"),
        active: true,
        priority: 5,
        legalDocumentId: law2023?.id,
      },
    });
  }
  console.log("✓ Applicant type rules seeded");

  // Create service packages
  const servicePackages = [
    {
      name: "Hồ sơ NOXH trọn gói",
      slug: "ho-so-tron-goi",
      type: "FULL_PACKAGE" as const,
      description: "Từ kiểm tra điều kiện, lập checklist, hướng dẫn giấy tờ đến rà soát trước khi nộp.",
      features: [
        "Kiểm tra điều kiện đối tượng, nhà ở, thu nhập",
        "Lập checklist hồ sơ cá nhân hóa",
        "Hướng dẫn chuẩn bị giấy tờ",
        "Hỗ trợ điền biểu mẫu",
        "Rà soát hồ sơ trước khi nộp",
        "Hướng dẫn nộp hồ sơ đúng quy định",
      ],
      showPrice: false,
      durationText: "2-4 tuần",
      active: true,
      featured: true,
      sortOrder: 1,
    },
    {
      name: "Rà soát hồ sơ NOXH",
      slug: "ra-soat-ho-so",
      type: "REVIEW" as const,
      description: "Chuyên viên kiểm tra thành phần hồ sơ, biểu mẫu, giấy xác nhận và các vấn đề cần bổ sung.",
      features: [
        "Kiểm tra thành phần hồ sơ",
        "Kiểm tra biểu mẫu đang có hiệu lực",
        "Kiểm tra giấy xác nhận hết hạn",
        "Báo cáo chi tiết từng tài liệu",
        "Hướng dẫn bổ sung",
      ],
      showPrice: false,
      durationText: "1-2 ngày",
      active: true,
      featured: true,
      sortOrder: 2,
    },
    {
      name: "Tư vấn điều kiện",
      slug: "tu-van-dieu-kien",
      type: "CONSULTATION" as const,
      description: "Tư vấn chi tiết về điều kiện mua, thuê mua nhà ở xã hội theo quy định hiện hành.",
      features: [
        "Đánh giá điều kiện đối tượng",
        "Đánh giá điều kiện nhà ở",
        "Đánh giá điều kiện thu nhập",
        "Tư vấn hồ sơ cần chuẩn bị",
      ],
      showPrice: false,
      durationText: "30-60 phút",
      active: true,
      featured: false,
      sortOrder: 3,
    },
  ];

  for (const pkg of servicePackages) {
    await prisma.servicePackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log("✓ Service packages seeded");

  // Create office locations
  const officeLocations = [
    {
      name: "Văn phòng Hà Nội",
      address: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
      province: "Hà Nội",
      district: "Thanh Xuân",
      hotline: "1900 1234",
      googleMapsUrl: "https://maps.google.com/?q=123+Nguyễn+Trãi+Thanh+Xuân+Hà+Nội",
      openingHours: "08:00 - 17:30 (Thứ 2 - Thứ 7)",
      active: true,
    },
    {
      name: "Văn phòng TP.HCM",
      address: "456 Lê Văn Sỹ, Quận 3, TP.HCM",
      province: "Hồ Chí Minh",
      district: "Quận 3",
      hotline: "1900 1234",
      googleMapsUrl: "https://maps.google.com/?q=456+Lê+Văn+Sỹ+Quận+3+TPHCM",
      openingHours: "08:00 - 17:30 (Thứ 2 - Thứ 7)",
      active: true,
    },
  ];

  for (const office of officeLocations) {
    const existing = await prisma.officeLocation.findFirst({
      where: { name: office.name },
    });
    if (!existing) {
      await prisma.officeLocation.create({ data: office });
    }
  }
  console.log("✓ Office locations seeded");

  // Create contact settings
  const contactSetting = {
    hotline: "1900 1234",
    zaloPhone: "0901 234 567",
    zaloUrl: "https://zalo.me/0901234567",
    messengerUrl: "https://m.me/nhaxahoi2026",
    facebookUrl: "https://facebook.com/nhaxahoi2026",
    email: "hotro@nhaxahoi2026.vn",
    officeAddress: "123 Nguyễn Trãi, Thanh Xuân, Hà Nội",
    googleMapsUrl: "https://maps.google.com/?q=123+Nguyễn+Trãi+Thanh+Xuân+Hà+Nội",
    workingHours: "08:00 - 17:30 (Thứ 2 - Thứ 7)",
    consultationNote: "Miễn phí tư vấn ban đầu. Đặt lịch trước để được phục vụ tốt nhất.",
    siteName: "Nhà Ở Xã Hội 2026",
    disclaimerLegal: "Thông tin trên website nhằm hỗ trợ người dùng tự đánh giá sơ bộ điều kiện và chuẩn bị hồ sơ nhà ở xã hội. Kết quả trên website không phải quyết định xét duyệt của cơ quan nhà nước, chủ đầu tư hoặc đơn vị có thẩm quyền.",
    disclaimerService: "Đơn vị cung cấp dịch vụ hỗ trợ tư vấn, chuẩn bị, sắp xếp và rà soát hồ sơ dựa trên thông tin do khách hàng cung cấp và quy định pháp luật hiện hành. Dịch vụ không làm phát sinh quyền ưu tiên và không bảo đảm khách hàng được phê duyệt mua, thuê hoặc thuê mua nhà ở xã hội.",
  };

  const existingContact = await prisma.contactSetting.findFirst();
  if (!existingContact) {
    await prisma.contactSetting.create({ data: contactSetting });
  }
  console.log("✓ Contact settings seeded");

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
