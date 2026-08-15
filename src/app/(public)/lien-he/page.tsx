import Link from "next/link";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Liên hệ tư vấn | Nhà Ở Xã Hội 2026",
  description: "Liên hệ để được tư vấn về hồ sơ nhà ở xã hội. Gọi điện, nhắn Zalo hoặc đặt lịch gặp trực tiếp.",
};

export default async function ContactPage() {
  const contact = await prisma.contactSetting.findFirst();

  return (
    <div className="container mx-auto max-w-4xl px-3 md:px-4 py-6 md:py-8">
      <div className="mb-6 text-center md:mb-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Liên hệ tư vấn hồ sơ</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
          Chúng tôi sẵn sàng hỗ trợ bạn chuẩn bị hồ sơ nhà ở xã hội
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact?.hotline && (
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-navy-600" />
                <div>
                  <p className="font-medium">Hotline</p>
                  <a href={`tel:${contact.hotline.replace(/\s/g, "")}`} className="text-lg font-bold text-navy-800 hover:underline">
                    {contact.hotline}
                  </a>
                </div>
              </div>
            )}

            {contact?.zaloUrl && (
              <div className="flex items-start gap-3">
                <MessageCircle className="mt-1 h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Zalo</p>
                  <a href={contact.zaloUrl} target="_blank" rel="noopener noreferrer" className="text-navy-800 hover:underline">
                    Nhắn Zalo chuyên viên
                  </a>
                </div>
              </div>
            )}

            {contact?.officeAddress && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Văn phòng</p>
                  <p className="text-sm">{contact.officeAddress}</p>
                </div>
              </div>
            )}

            {contact?.workingHours && (
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">Thời gian làm việc</p>
                  <p className="text-sm">{contact.workingHours}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contact?.hotline && (
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <a href={`tel:${contact.hotline.replace(/\s/g, "")}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  GỌI NGAY
                </a>
              </Button>
            )}

            {contact?.zaloUrl && (
              <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                <a href={contact.zaloUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  NHẮN ZALO
                </a>
              </Button>
            )}

            <Button asChild variant="outline" className="w-full">
              <Link href="/dat-lich">ĐẶT LỊCH GẶP</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      {contact?.googleMapsUrl && (
        <div className="mt-8 overflow-hidden rounded-xl border">
          <iframe
            src={contact.googleMapsUrl.replace("https://maps.google.com/?q=", "https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=")}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="bg-gray-100"
          />
        </div>
      )}
    </div>
  );
}
