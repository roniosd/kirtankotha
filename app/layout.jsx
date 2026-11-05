import "./globals.css";
import AppProvider from "@/components/AppProvider";
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://kirtankotha.vercel.app",
  ),
  title: { default: "কীর্তনকথা — ভক্তির সুরে হৃদয়ের সংযোগ", template: "%s" },
  description:
    "বাংলা কীর্তন, পদাবলী ও ভক্তিগীতির উন্মুক্ত গানের খাতা। সহজে গান খুঁজুন, বড় অক্ষরে পড়ুন এবং প্রিয় তালিকায় রাখুন।",
  applicationName: "কীর্তনকথা",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "কীর্তনকথা — বাংলা কীর্তন ও ভক্তিগীতি",
    description: "খুঁজুন, পড়ুন, প্রিয় গানে রাখুন।",
    type: "website",
    locale: "bn_BD",
    images: [
      {
        url: "/images/devotional-temple.webp",
        width: 1536,
        height: 1024,
        alt: "প্রদীপ ও পদ্মসহ বাংলার মন্দির",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/devotional-temple.webp"],
  },
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffdf8",
};
export default function Layout({ children }) {
  return (
    <html lang="bn" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="m-0 bg-[#fffdf8] font-['Hind_Siliguri',sans-serif] text-[#51331f] antialiased selection:bg-amber-200 selection:text-stone-900">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
