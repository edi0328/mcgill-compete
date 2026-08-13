import type { Metadata } from "next";
import { ViewTransition } from "react";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/content/site";
import "./globals.css";

// Downloaded at build time and self-hosted - no runtime font CDN requests.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Departure Mono (OFL, see src/app/fonts/DepartureMono-LICENSE) - the pixel
// display font used for headings and the wordmark.
const departureMono = localFont({
  src: "./fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} · McGill's Competitive Programming Club`,
    template: `%s · ${site.name}`,
  },
  description: site.shortDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // Lets Next force an instant scroll-to-top on route navigation (the
      // view transition masks it) while keeping smooth in-page anchor scroll.
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${departureMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Apply the saved theme choice before paint; no choice = system.
            ?theme=light|dark wins over the saved choice (used for testing). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=new URLSearchParams(location.search).get("theme")||localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <MotionProvider>
          <SiteHeader />
          {/* Cross-section navigations (TransitionLink) settle the whole
              page in via "page-shell" (globals.css). Untyped transitions -
              initial load, lazy reveals like the hero gem - resolve to
              "none" and play nothing. Renders no DOM node; SSR unchanged. */}
          <ViewTransition default={{ navigate: "page-shell", default: "none" }}>
            <main className="flex-1">{children}</main>
          </ViewTransition>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
