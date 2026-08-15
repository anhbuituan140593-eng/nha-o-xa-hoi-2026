import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getApplicableRules, evaluateEligibility } from "@/lib/eligibility/engine";
import { generateCode } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      applicantType,
      maritalStatus,
      housingStatus,
      incomeSelf,
      incomeSpouse,
      childrenCount,
      employmentType,
      fullName,
      phone,
    } = body;

    // Calculate household income
    const householdIncome = (incomeSelf || 0) + (incomeSpouse || 0);

    // Get applicable rules
    const rules = await getApplicableRules({
      applicantType,
      maritalStatus,
      checkDate: new Date(),
    });

    // Evaluate eligibility
    const evaluation = evaluateEligibility(rules, {
      applicantType,
      maritalStatus,
      housingStatus,
      incomeSelf: incomeSelf || 0,
      incomeSpouse: incomeSpouse || 0,
      householdIncome,
      employmentType,
      childrenCount: childrenCount || 0,
    });

    // Generate checklist based on results
    const checklist = generateChecklist(evaluation.result, {
      applicantType,
      maritalStatus,
      housingStatus,
      employmentType,
      incomeSelf,
      incomeSpouse,
      childrenCount,
    });

    // Save to database
    const checkCode = generateCode("KQ");

    const eligibilityCheck = await prisma.eligibilityCheck.create({
      data: {
        checkCode,
        applicantType,
        maritalStatus,
        province: null,
        incomeSelf: incomeSelf ? parseFloat(incomeSelf) : null,
        incomeSpouse: incomeSpouse ? parseFloat(incomeSpouse) : null,
        householdIncome: parseFloat(householdIncome.toString()),
        housingStatus,
        employmentType,
        childrenCount: childrenCount || 0,
        result: evaluation.result,
        score: evaluation.score,
        rulesApplied: JSON.parse(JSON.stringify(evaluation.rulesApplied)),
        checklist: JSON.parse(JSON.stringify(checklist)),
      },
    });

    // Create or update Lead with contact info
    if (fullName && phone) {
      const existing = await prisma.lead.findFirst({ where: { phone } });
      if (existing) {
        await prisma.lead.update({
          where: { id: existing.id },
          data: { fullName, eligibilityCheckId: eligibilityCheck.id },
        });
      } else {
        const leadCode = generateCode("LD");
        await prisma.lead.create({
          data: {
            leadCode,
            fullName,
            phone,
            source: "DIRECT",
            status: "NEW",
            eligibilityCheckId: eligibilityCheck.id,
          },
        });
      }
    }

    // Save answers
    const answers = [
      { questionCode: "APPLICANT_TYPE", answer: applicantType },
      { questionCode: "HOUSING_STATUS", answer: housingStatus },
      { questionCode: "MARITAL_STATUS", answer: maritalStatus },
      { questionCode: "INCOME_SELF", answer: String(incomeSelf) },
      { questionCode: "EMPLOYMENT_TYPE", answer: employmentType },
    ];

    if (incomeSpouse > 0) {
      answers.push({ questionCode: "INCOME_SPOUSE", answer: String(incomeSpouse) });
    }

    if (childrenCount > 0) {
      answers.push({ questionCode: "CHILDREN_COUNT", answer: String(childrenCount) });
    }

    await prisma.eligibilityAnswer.createMany({
      data: answers.map((a) => ({
        eligibilityCheckId: eligibilityCheck.id,
        ...a,
      })),
    });

    return NextResponse.json({
      checkCode: eligibilityCheck.checkCode,
      result: evaluation.result,
      score: evaluation.score,
      details: evaluation.details,
      checklist,
    });
  } catch (error) {
    console.error("Eligibility check error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi kiểm tra điều kiện" },
      { status: 500 }
    );
  }
}

function generateChecklist(result: string, data: Record<string, unknown>) {
  const items = [
    {
      itemName: "Đơn đăng ký mua/thuê mua nhà ở xã hội",
      itemCategory: "APPLICATION_FORM",
      required: true,
      description: "Theo mẫu quy định hiện hành",
      formCode: "MAU_DON_DANG_KY",
    },
    {
      itemName: "Căn cước công dân/Chứng minh nhân dân",
      itemCategory: "CCCD",
      required: true,
      description: "Bản sao có chứng thực",
    },
  ];

  // Marriage documents
  const maritalStatus = data.maritalStatus as string;
  if (maritalStatus === "MARRIED") {
    items.push({
      itemName: "Giấy chứng nhận kết hôn",
      itemCategory: "MARRIAGE",
      required: true,
      description: "Bản sao có chứng thực",
    });
    items.push({
      itemName: "Căn cước công dân của vợ/chồng",
      itemCategory: "CCCD",
      required: true,
      description: "Bản sao có chứng thực",
    });
  } else if (maritalStatus === "DIVORCED") {
    items.push({
      itemName: "Quyết định/Bản án ly hôn",
      itemCategory: "MARRIAGE",
      required: true,
      description: "Bản sao có chứng thực",
    });
  }

  // Income documents
  const employmentType = data.employmentType as string;
  if (employmentType === "CONTRACT") {
    items.push({
      itemName: "Giấy xác nhận thu nhập",
      itemCategory: "INCOME",
      required: true,
      description: "Xác nhận của cơ quan/công ty trong 12 tháng gần nhất",
    });
  } else if (["FREELANCE", "BUSINESS"].includes(employmentType)) {
    items.push({
      itemName: "Tờ khai tự kê khai thu nhập",
      itemCategory: "INCOME",
      required: true,
      description: "Theo mẫu quy định cho lao động tự do",
    });
  }

  // Housing confirmation - tailored by housing status
  const housingStatus = data.housingStatus as string;
  if (housingStatus === "NO_OWNERSHIP") {
    items.push({
      itemName: "Giấy xác nhận chưa có nhà ở thuộc sở hữu",
      itemCategory: "HOUSING",
      required: true,
      description: "Xác nhận của UBND cấp xã nơi thường trú về việc chưa có nhà ở thuộc sở hữu của mình",
    });
  } else if (housingStatus === "UNDER_15M2") {
    items.push({
      itemName: "Giấy xác nhận diện tích nhà ở bình quân dưới 15m² sàn/người",
      itemCategory: "HOUSING",
      required: true,
      description: "Xác nhận của UBND cấp xã kèm giấy tờ chứng minh diện tích và số nhân khẩu trong hộ",
    });
  } else if (housingStatus === "FAR_FROM_WORK") {
    items.push({
      itemName: "Giấy xác nhận nơi ở cách xa nơi làm việc theo quy định tỉnh/TP",
      itemCategory: "HOUSING",
      required: true,
      description: "Xác nhận của cơ quan quản lý lao động hoặc UBND cấp xã theo quy định địa phương",
    });
  } else if (housingStatus === "OTHER") {
    items.push({
      itemName: "Giấy tờ chứng minh điều kiện nhà ở (trường hợp đặc biệt)",
      itemCategory: "HOUSING",
      required: true,
      description: "Vui lòng liên hệ chuyên viên để được hướng dẫn cụ thể về giấy tờ cần chuẩn bị cho trường hợp của bạn",
    });
  } else {
    items.push({
      itemName: "Giấy xác nhận về điều kiện nhà ở",
      itemCategory: "HOUSING",
      required: true,
      description: "Xác nhận của UBND cấp xã nơi thường trú",
    });
  }

  // Applicant type specific documents (13 groups)
  const applicantType = data.applicantType as string;
  const typeDocs: Record<string, { itemName: string; description: string }> = {
    CO_CONG: {
      itemName: "Giấy xác nhận người có công với cách mạng / thân nhân liệt sĩ",
      description: "Xác nhận của Sở LĐ-TBXH hoặc cơ quan quản lý hồ sơ người có công",
    },
    NGHEO_NONG_THON: {
      itemName: "Giấy chứng nhận hộ nghèo/cận nghèo khu vực nông thôn",
      description: "Xác nhận của UBND cấp xã theo chuẩn nghèo hiện hành",
    },
    NGHEO_THIEN_TAI: {
      itemName: "Giấy chứng nhận hộ nghèo/cận nghèo vùng thiên tai, BĐKH",
      description: "Xác nhận của UBND cấp xã thuộc vùng thường xuyên bị ảnh hưởng thiên tai",
    },
    NGHEO_DO_THI: {
      itemName: "Giấy chứng nhận hộ nghèo/cận nghèo khu vực đô thị",
      description: "Xác nhận của UBND cấp xã/phường theo chuẩn nghèo đô thị",
    },
    THU_NHAP_THAP: {
      itemName: "Giấy xác nhận thu nhập thấp tại đô thị",
      description: "Xác nhận của UBND cấp xã hoặc cơ quan thuế",
    },
    CONG_NHAN: {
      itemName: "Giấy xác nhận công nhân, NLĐ tại doanh nghiệp/HTX",
      description: "Xác nhận của doanh nghiệp, HTX hoặc tổ chức công đoàn",
    },
    LUONG_VU_TRANG: {
      itemName: "Giấy xác nhận sĩ quan, QNCN, hạ sĩ quan LLVT / CN CA / quốc phòng / cơ yếu",
      description: "Xác nhận của đơn vị quân đội, công an, quốc phòng hoặc cơ quan cơ yếu",
    },
    CONG_CHUC: {
      itemName: "Giấy xác nhận cán bộ, công chức, viên chức",
      description: "Xác nhận của cơ quan quản lý trực tiếp",
    },
    TRA_LAI_NHA_CONG_VU: {
      itemName: "Giấy xác nhận đã trả lại nhà ở công vụ",
      description: "Xác nhận của cơ quan quản lý nhà ở công vụ (trừ trường hợp bị thu hồi do vi phạm)",
    },
    BI_THU_HOI_DAT: {
      itemName: "Giấy xác nhận bị thu hồi đất, giải tỏa chưa được bồi thường bằng nhà/đất ở",
      description: "Xác nhận của UBND cấp huyện hoặc Ban bồi thường GPMB",
    },
    HOC_SINH_SINH_VIEN: {
      itemName: "Giấy xác nhận học sinh/sinh viên đang theo học",
      description: "Xác nhận của trường ĐH, CĐ, GDNN, trường chuyên biệt hoặc trường DTNT công lập",
    },
    DOANH_NGHIEP_KCN: {
      itemName: "Giấy xác nhận doanh nghiệp/HTX trong KCN",
      description: "Xác nhận của Ban quản lý KCN hoặc cơ quan đăng ký kinh doanh",
    },
    NHIEU_CON: {
      itemName: "Giấy khai sinh của các con đẻ (từ 02 con trở lên)",
      description: "Bản sao giấy khai sinh hoặc trích lục khai sinh theo Luật Dân số 2025",
    },
  };

  if (typeDocs[applicantType]) {
    items.push({
      ...typeDocs[applicantType],
      itemCategory: "APPLICANT_TYPE",
      required: true,
    });
  }

  return items;
}
