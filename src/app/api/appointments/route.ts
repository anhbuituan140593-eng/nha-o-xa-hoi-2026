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
      service,
      project,
      preferredDate,
      preferredTime,
      note,
    } = body;

    // Validate date is not in the past
    const selectedDate = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json(
        { error: "Ngày hẹn không được là ngày trong quá khứ" },
        { status: 400 }
      );
    }

    // Create or find lead
    let lead = await prisma.lead.findFirst({
      where: { phone },
      orderBy: { createdAt: "desc" },
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          leadCode: generateCode("LH"),
          fullName,
          phone,
          zalo: zalo || null,
          email: email || null,
          serviceInterest: service,
          source: "DIRECT",
          status: "APPOINTMENT_REQUESTED",
          note: note || null,
        },
      });
    } else {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          status: "APPOINTMENT_REQUESTED",
          ...(note && { note }),
        },
      });
    }

    // Find matching service package
    const servicePackage = await prisma.servicePackage.findFirst({
      where: { type: service, active: true },
    });

    // Create appointment
    const appointmentCode = generateCode("LT");

    const appointment = await prisma.appointment.create({
      data: {
        appointmentCode,
        leadId: lead.id,
        serviceId: servicePackage?.id,
        preferredDate: new Date(preferredDate),
        preferredTime,
        status: "REQUESTED",
        customerNote: note || null,
      },
    });

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        content: `Đặt lịch hẹn: ${preferredDate} ${preferredTime} - Mã: ${appointmentCode}`,
      },
    });

    return NextResponse.json({
      success: true,
      appointmentCode,
      message: "Yêu cầu đặt lịch đã được gửi. Chuyên viên sẽ liên hệ xác nhận.",
    });
  } catch (error) {
    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo lịch hẹn" },
      { status: 500 }
    );
  }
}
