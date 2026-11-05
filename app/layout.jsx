import "./globals.css";
export const metadata = {
  metadataBase: new URL("https://kirtankotha.vercel.app"),

  title: "কীর্তনকথা — সুরের কথায় প্রাণের সংযোগ",
  description:
    "বাংলা কীর্তন, পদাবলী ও ভক্তিগীতির উন্মুক্ত গানের খাতা। প্রিয় গান খুঁজুন, পড়ুন এবং আপনার জানা গান যোগ করুন।",

  applicationName: "কীর্তনকথা",
  keywords: [
    "কীর্তনকথা",
    "বাংলা কীর্তন",
    "ভক্তিগীতি",
    "পদাবলী",
    "ভজন",
    "Bangla Kirtan",
    "Kirtan Lyrics",
  ],

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "কীর্তনকথা — সুরের কথায় প্রাণের সংযোগ",
    description:
      "বাংলা কীর্তন, পদাবলী ও ভক্তিগীতির সংগ্রহ। পড়ুন, খুঁজুন এবং প্রিয় গানের তালিকা তৈরি করুন।",
    url: "/",
    siteName: "কীর্তনকথা",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/images/devotional-temple.webp",
        width: 1536,
        height: 1024,
        alt: "পদ্মফুল, প্রদীপ ও ভোরের আলোয় বাংলার মন্দির",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "কীর্তনকথা — বাংলা কীর্তন ও ভক্তিগীতি",
    description: "ভক্তির সুরে, হৃদয়ের সংযোগ। খুঁজে নিন আপনার প্রিয় গান।",
    images: ["/images/devotional-temple.webp"],
  },

  robots: {
    index: true,
    follow: true,
  },
};
export default function Layout({ children }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
