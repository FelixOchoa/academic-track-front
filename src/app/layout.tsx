import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: 'Panel de Indicadores Académicos | Facultad de Ingeniería y Tecnologías',
  description: 'Sistema Web de Seguimiento Académico, autoevaluación, acreditación CNA y toma de decisiones para programas de Ingeniería.',
  keywords: ['Indicadores Académicos', 'Seguimiento Académico', 'Facultad de Ingeniería', 'CNA', 'Autoevaluación'],
  icons: {
    icon: '/logo-loading.png',
    shortcut: '/logo-loading.png',
    apple: '/logo-loading.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={quicksand.variable}>
      <head>
        <link rel="icon" href="/logo-loading.png" type="image/png" />
      </head>
      <body className={`${quicksand.className} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
