import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Birthday Planner — Спланируй день рождения за 5 минут',
  description: 'Бесплатный онлайн-планировщик дня рождения: расчёт еды, список гостей, бюджет, задачи, список покупок и многое другое.',
  keywords: 'день рождения, планировщик, расчёт еды, список гостей, бюджет праздника',
  openGraph: {
    title: 'Birthday Planner 🎉',
    description: 'Спланируй идеальный праздник за 5 минут. Гости, еда, бюджет — всё в одном месте.',
    type: 'website',
    locale: 'ru_RU',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Birthday Planner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Planner 🎉',
    description: 'Спланируй идеальный праздник за 5 минут.',
  },
};

export default function RootPage() {
  return <LandingPage />;
}
