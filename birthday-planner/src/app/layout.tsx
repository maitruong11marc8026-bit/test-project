import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Birthday Planner 🎉",
  description: "Планировщик дня рождения с расчётом еды и списком покупок",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
