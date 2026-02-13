import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LiteInvite | Create Digital Invites in Seconds",
  description: "The fastest way to create and share beautiful, mobile-friendly event invitations. No signup required.",
  openGraph: {
    title: "LiteInvite | Professional Event Invites",
    description: "Create your event, upload a photo, and get a shareable link instantly.",
    url: "https://lite-invite.vercel.app",
    siteName: "LiteInvite",
    images: [
      {
        url: "https://lite-invite.vercel.app/og-main.png", // Replace with an actual image in your public folder later
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiteInvite",
    description: "Beautiful digital invitations made easy.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
