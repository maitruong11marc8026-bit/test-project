import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Планировщик',
  description: 'Ваш личный планировщик дня рождения',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
