import { prisma } from "@/lib/db";
import type { LegalRule, RuleCategory, RuleOperator } from "@prisma/client";

export interface RuleQuery {
  applicantType?: string;
  maritalStatus?: string;
  province?: string;
  checkDate?: Date;
}

export interface ApplicantData {
  applicantType: string;
  maritalStatus: string;
  housingStatus: string;
  incomeSelf: number;
  incomeSpouse?: number;
  householdIncome?: number;
  employmentType: string;
  childrenCount?: number;
  province?: string;
}

export interface EligibilityEvaluation {
  result: "ELIGIBLE" | "LIKELY_ELIGIBLE" | "NEED_VERIFICATION" | "NOT_ELIGIBLE" | "INSUFFICIENT_DATA";
  details: EvaluationDetail[];
  rulesApplied: AppliedRule[];
  score: number;
}

export interface EvaluationDetail {
  category: string;
  status: "PASS" | "FAIL" | "WARNING" | "INFO";
  message: string;
  legalBasis?: {
    documentNumber: string;
    article: string;
    clause: string;
    url?: string;
  };
}

export interface AppliedRule {
  code: string;
  name: string;
  category: string;
  operator: string;
  value: number;
  passed: boolean;
  actualValue?: number;
}

export async function getApplicableRules(query: RuleQuery): Promise<LegalRule[]> {
  const checkDate = query.checkDate ?? new Date();

  const where: Record<string, unknown> = {
    active: true,
    effectiveFrom: { lte: checkDate },
    OR: [
      { effectiveTo: null },
      { effectiveTo: { gte: checkDate } },
    ],
  };

  if (query.applicantType) {
    where.OR = [
      { applicantType: query.applicantType },
      { applicantType: null },
    ];
  }

  if (query.province) {
    where.OR = [
      ...(Array.isArray(where.OR) ? where.OR : []),
      { province: { code: query.province } },
      { provinceId: null },
    ];
  }

  return prisma.legalRule.findMany({
    where,
    include: {
      legalDocument: true,
      province: true,
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}

export function evaluateEligibility(
  rules: LegalRule[],
  data: ApplicantData
): EligibilityEvaluation {
  const details: EvaluationDetail[] = [];
  const appliedRules: AppliedRule[] = [];
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;

  // Evaluate income rules
  const incomeRules = rules.filter((r) => r.category === "INCOME_LIMIT");
  if (incomeRules.length > 0) {
    const applicableIncomeRule = findApplicableIncomeRule(incomeRules, data);
    if (applicableIncomeRule) {
      const householdIncome = data.householdIncome ??
        (data.incomeSelf + (data.incomeSpouse ?? 0));
      const passed = compareValues(householdIncome, applicableIncomeRule.operator, Number(applicableIncomeRule.value));

      appliedRules.push({
        code: applicableIncomeRule.code,
        name: applicableIncomeRule.name,
        category: "INCOME_LIMIT",
        operator: applicableIncomeRule.operator,
        value: Number(applicableIncomeRule.value),
        passed,
        actualValue: householdIncome,
      });

      if (passed) {
        passCount++;
        details.push({
          category: "Thu nhập",
          status: "PASS",
          message: `Thu nhập ${formatVND(householdIncome)} đáp ứng ngưỡng ${formatVND(Number(applicableIncomeRule.value))}`,
          legalBasis: applicableIncomeRule.legalDocument ? {
            documentNumber: applicableIncomeRule.legalDocument.documentNumber,
            article: applicableIncomeRule.article ?? "",
            clause: applicableIncomeRule.clause ?? "",
            url: applicableIncomeRule.legalDocument.officialUrl ?? undefined,
          } : undefined,
        });
      } else {
        failCount++;
        details.push({
          category: "Thu nhập",
          status: "FAIL",
          message: `Thu nhập ${formatVND(householdIncome)} vượt ngưỡng ${formatVND(Number(applicableIncomeRule.value))}`,
          legalBasis: applicableIncomeRule.legalDocument ? {
            documentNumber: applicableIncomeRule.legalDocument.documentNumber,
            article: applicableIncomeRule.article ?? "",
            clause: applicableIncomeRule.clause ?? "",
            url: applicableIncomeRule.legalDocument.officialUrl ?? undefined,
          } : undefined,
        });
      }
    } else {
      warningCount++;
      details.push({
        category: "Thu nhập",
        status: "WARNING",
        message: "Không tìm thấy quy định thu nhập phù hợp. Cần xác minh thêm.",
      });
    }
  }

  // Evaluate applicant type
  const typeRules = rules.filter((r) => r.category === "APPLICANT_TYPE");
  if (typeRules.length > 0) {
    const typeMatch = typeRules.some((r) => r.applicantType === data.applicantType);
    if (typeMatch) {
      passCount++;
      details.push({
        category: "Đối tượng",
        status: "PASS",
        message: "Thuộc đối tượng được hỗ trợ nhà ở xã hội",
      });
    } else {
      failCount++;
      details.push({
        category: "Đối tượng",
        status: "FAIL",
        message: "Chưa xác định thuộc đối tượng được hỗ trợ",
      });
    }
  }

  // Evaluate housing condition
  const housingRules = rules.filter((r) => r.category === "HOUSING_CONDITION");
  if (housingRules.length > 0 && data.housingStatus) {
    const hs = data.housingStatus.toUpperCase();

    if (hs === "NO_OWNERSHIP") {
      passCount++;
      details.push({
        category: "Nhà ở",
        status: "PASS",
        message: "Chưa có nhà ở thuộc sở hữu của mình — đáp ứng điều kiện về nhà ở",
      });
    } else if (hs === "UNDER_15M2") {
      passCount++;
      details.push({
        category: "Nhà ở",
        status: "PASS",
        message: "Diện tích nhà ở bình quân đầu người dưới 15m² sàn/người — đáp ứng điều kiện về nhà ở",
      });
    } else if (hs === "FAR_FROM_WORK") {
      warningCount++;
      details.push({
        category: "Nhà ở",
        status: "WARNING",
        message: "Có nhà nhưng cách xa nơi làm việc — cần xác nhận theo quy định tỉnh/TP nơi làm việc",
      });
    } else if (hs === "OTHER") {
      warningCount++;
      details.push({
        category: "Nhà ở",
        status: "WARNING",
        message: "Trường hợp đặc biệt — cần được chuyên viên tư vấn xem xét riêng theo quy định hiện hành",
      });
    } else {
      warningCount++;
      details.push({
        category: "Nhà ở",
        status: "WARNING",
        message: "Cần xác nhận tình trạng nhà ở theo quy định hiện hành",
      });
    }
  }

  // Evaluate employment
  if (data.employmentType) {
    const formalEmployment = ["CONTRACT", "CO_HOP_DONG"].includes(data.employmentType.toUpperCase());
    const freelance = ["FREELANCE", "TU_DO", "KINH_DOANH_TU_DO"].includes(data.employmentType.toUpperCase());

    if (formalEmployment) {
      passCount++;
      details.push({
        category: "Việc làm",
        status: "PASS",
        message: "Có hợp đồng lao động hoặc cơ quan trả lương",
      });
    } else if (freelance) {
      warningCount++;
      details.push({
        category: "Việc làm",
        status: "WARNING",
        message: "Lao động tự do - cần chuẩn bị hồ sơ kê khai thu nhập theo quy định",
      });
    } else {
      warningCount++;
      details.push({
        category: "Việc làm",
        status: "INFO",
        message: "Cần cung cấp thêm thông tin về việc làm",
      });
    }
  }

  // Determine overall result
  const totalChecks = passCount + failCount + warningCount;
  let result: EligibilityEvaluation["result"];
  let score = 0;

  if (totalChecks === 0) {
    result = "INSUFFICIENT_DATA";
  } else if (failCount > 0) {
    result = "NOT_ELIGIBLE";
    score = Math.round((passCount / totalChecks) * 100);
  } else if (warningCount > 0) {
    result = "NEED_VERIFICATION";
    score = Math.round((passCount / totalChecks) * 100);
  } else if (passCount >= 3) {
    result = "ELIGIBLE";
    score = 100;
  } else {
    result = "LIKELY_ELIGIBLE";
    score = Math.round((passCount / totalChecks) * 100);
  }

  return { result, details, rulesApplied: appliedRules, score };
}

function findApplicableIncomeRule(rules: LegalRule[], data: ApplicantData): LegalRule | null {
  // Priority: rules matching marital status first, then generic rules
  // In our DB, some income rules use applicantType field to store marital status values
  const sorted = [...rules].sort((a, b) => {
    const aSpecificity = (a.applicantType ? 2 : 0) + (a.provinceId ? 1 : 0);
    const bSpecificity = (b.applicantType ? 2 : 0) + (b.provinceId ? 1 : 0);
    return bSpecificity - aSpecificity || b.priority - a.priority;
  });

  for (const rule of sorted) {
    if (!rule.applicantType) continue;
    // Check if this rule's applicantType matches either the actual applicant type OR the marital status
    if (rule.applicantType === data.applicantType || rule.applicantType === data.maritalStatus) {
      return rule;
    }
  }

  // Fallback to generic rule (no applicantType filter)
  for (const rule of sorted) {
    if (!rule.applicantType) return rule;
  }

  return null;
}

function compareValues(actual: number, operator: RuleOperator, threshold: number): boolean {
  switch (operator) {
    case "LTE": return actual <= threshold;
    case "GTE": return actual >= threshold;
    case "LT": return actual < threshold;
    case "GT": return actual > threshold;
    case "EQ": return actual === threshold;
    case "NEQ": return actual !== threshold;
    default: return false;
  }
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}
