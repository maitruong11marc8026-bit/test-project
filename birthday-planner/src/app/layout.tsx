import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#e91e8c',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://birthday-planner.vercel.app'),
  title: {
    default: 'Birthday Planner — Спланируй день рождения за 5 минут',
    template: '%s | Birthday Planner',
  },
  description: 'Бесплатный планировщик дня рождения: гости, расчёт еды, бюджет, задачи, список покупок.',
  keywords: ['день рождения', 'планировщик', 'расчёт еды', 'список гостей', 'бюджет праздника'],
  authors: [{ name: 'Birthday Planner' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Birthday Planner',
  },
  openGraph: {
    title: 'Birthday Planner 🎉',
    description: 'Спланируй идеальный праздник за 5 минут. Гости, еда, бюджет — всё в одном месте.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Birthday Planner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Planner 🎉',
    description: 'Спланируй идеальный праздник за 5 минут.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full">
        {children}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
