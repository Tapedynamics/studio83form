import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ficha de Conocimiento | Curso Avanzado Studio83",
  description: "Formulario de inscripcion para el curso avanzado de estetica Studio83. Completa tus datos para recibir una propuesta formativa personalizada.",
  keywords: ["curso estetica", "Studio83", "formacion", "Tenerife", "masaje", "tratamientos"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">
        <header className="border-b border-[--border] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="https://studio83.es" className="text-2xl font-bold logo-gradient">
              Studio83
            </a>
            <span className="text-sm text-[--text-muted] font-[family-name:var(--font-sans)]">
              Curso Avanzado
            </span>
          </div>
        </header>

        <main className="py-8 px-4">
          {children}
        </main>

        <footer className="border-t border-[--border] bg-[--accent] py-8 mt-12">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm text-[--text-muted]">
              &copy; {new Date().getFullYear()} Studio83 - Playa de Las Americas, Tenerife
            </p>
            <p className="text-sm text-[--text-muted] mt-2">
              <a href="https://wa.me/34634011846" className="text-[--primary] hover:text-[--primary-dark]">
                WhatsApp: +34 634 011 846
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
