import "./globals.css";
import { MetaPixelEvents } from "@/components/meta-pixel-events";

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
        <MetaPixelEvents />
        {children}
      </body>
    </html>
  );
}
