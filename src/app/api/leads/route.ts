import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateCode } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      phone,
      zalo,
      email,
      province,
      project,
      serviceInterest,
      documentStatus,
      note,
      source,
      eligibilityCheckId,
    } = body;

    // Check if lead already exists with this phone
    let existingLead = await prisma.lead.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    let lead;

    if (existingLead) {
      lead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          fullName,
          zalo: zalo || null,
          email: email || null,
          serviceInterest: serviceInterest || existingLead.serviceInterest,
          status: "NEW",
          ...(eligibilityCheckId && { eligibilityCheckId }),
          ...(note && { note: `${existingLead.note || ""}\n${note}` }),
        },
      });
    } else {
      lead = await prisma.lead.create({
        data: {
          leadCode: generateCode("LH"),
          fullName,
          phone,
          zalo: zalo || null,
          email: email || null,
          source: source || "DIRECT",
          serviceInterest: serviceInterest || null,
          status: "NEW",
          eligibilityCheckId: eligibilityCheckId || null,
          note: note || null,
        },
      });
    }

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        content: `Khách gửi yêu cầu tư vấn từ website. Dịch vụ: ${serviceInterest || "Chưa xác định"}`,
      },
    });

    return NextResponse.json({
      success: true,
      leadCode: lead.leadCode,
      message: "Đã nhận yêu cầu. Chuyên viên sẽ liên hệ sớm nhất.",
    });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi gửi yêu cầu" },
      { status: 500 }
    );
  }
}
