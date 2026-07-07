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
        <script
          id="meta-pixel"
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `
          }}
        />
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
