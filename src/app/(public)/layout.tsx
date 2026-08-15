import { Header, Footer, MobileStickyCTA } from "@/components/layout";
import { prisma } from "@/lib/db";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contact = await prisma.contactSetting.findFirst();

  return (
    <div className="flex min-h-screen flex-col">
      <Header contact={contact ?? undefined} />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer contact={contact ?? undefined} />
      <MobileStickyCTA contact={contact ?? undefined} />
    </div>
  );
}
