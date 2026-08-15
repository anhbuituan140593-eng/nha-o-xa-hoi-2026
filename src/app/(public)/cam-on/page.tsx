import Link from "next/link";
import { CheckCircle, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const contact = await prisma.contactSetting.findFirst();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h1 className="mb-4 text-3xl font-bold">Đã nhận yêu cầu của bạn</h1>

      <p className="mb-8 text-lg text-muted-foreground">
        Chuyên viên sẽ liên hệ để trao đổi và xác nhận lịch tư vấn.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {contact?.hotline && (
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <a href={`tel:${contact.hotline.replace(/\s/g, "")}`}>
              <Phone className="mr-2 h-4 w-4" />
              GỌI NGAY
            </a>
          </Button>
        )}

        {contact?.zaloUrl && (
          <Button asChild className="bg-blue-500 hover:bg-blue-600">
            <a href={contact.zaloUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              NHẮN ZALO
            </a>
          </Button>
        )}

        <Button asChild variant="outline">
          <Link href="/du-an">XEM DỰ ÁN</Link>
        </Button>
      </div>
    </div>
  );
}
