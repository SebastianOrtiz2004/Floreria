import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://floreriaeltulipan.com'),
  title: "Florería El Tulipán | Arreglos Florales Exclusivos en Ambato",
  description: "Envía amor con flores frescas. Catálogo online, pedidos por WhatsApp y entregas a domicilio en Ambato.",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/logo/logoi.jpg',
    apple: '/images/logo/logoi.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="google-site-verification" content="pty1S2DQL79N-YpYUm5b-NS1-gvBmEE-zNFG6UH4mp4" />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
