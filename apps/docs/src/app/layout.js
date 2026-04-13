import { Space_Grotesk, Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

// Display font - for hero headlines (similar to CoinbaseDisplay)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// UI and body font - for buttons, headings, and text (similar to CoinbaseSans/Text)
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hyperiux UI - Beautiful Effects for Your Website",
  description:
    "A collection of animated effects and UI components. Copy-paste or use our CLI to add stunning animations to your Next.js project.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen text-foreground font-sans">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
