import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { getSiteContent } from "@/lib/content";

// Render public pages per-request so CMS / database edits publish instantly.
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await getSiteContent();
  return (
    <>
      <Navbar nav={c.nav} brand={c.brand} contact={c.contact} />
      <main className="flex-1">{children}</main>
      <Footer brand={c.brand} contact={c.contact} hours={c.hours} nav={c.nav} />
      <ChatWidget />
    </>
  );
}
