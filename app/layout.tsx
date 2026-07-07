import "./globals.css";
import { MetaPixelEvents } from "@/components/meta-pixel-events";

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "4665704080374942";

export const metadata = {
  title: "AI Act Readiness Check",
  description:
    "Test gratuito in italiano per valutare il livello di preparazione della tua organizzazione rispetto all'AI Act."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" data-scroll-behavior="smooth">
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" alt="" />`
          }}
        />
        <MetaPixelEvents />
        {children}
      </body>
    </html>
  );
}
