import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'Panel de Indicadores Académicos | Facultad de Ingeniería y Tecnologías',
  description: 'Sistema Web de Seguimiento Académico, autoevaluación, acreditación CNA y toma de decisiones para programas de Ingeniería.',
  keywords: ['Indicadores Académicos', 'Seguimiento Académico', 'Facultad de Ingeniería', 'CNA', 'Autoevaluación'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
        <div className="flex flex-col md:flex-row min-h-screen">
          <Sidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </body>
    </html>
  );
}
