import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ConfiguracoesProvider } from "@/contexts/ConfiguracoesContext";
import { ClearLocalStorage } from "@/components/utils/ClearLocalStorage";

// Fonte principal - Poppins (moderna e profissional)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Fonte alternativa - Inter (para textos corridos)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OAB NomeNaLista - Seu maior aliado na aprovação",
  description: "Treine para o Exame da OAB resolvendo milhares de questões. A prática leva à perfeição. Veja seu NOME NA LISTA dos aprovados!",
  keywords: "OAB, Exame da Ordem, questões OAB, aprovação OAB, estudo para OAB, simulado OAB, direito",
  authors: [{ name: "OAB NomeNaLista" }],
  openGraph: {
    title: "OAB NomeNaLista - Seu maior aliado na aprovação",
    description: "Treine para o Exame da OAB resolvendo milhares de questões. A prática leva à perfeição.",
    type: "website",
    images: ["/logo-nomenalista.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased" style={{ fontFamily: 'var(--font-poppins), var(--font-inter), sans-serif' }}>
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <ConfiguracoesProvider>
                <ClearLocalStorage />
                <Navigation />
                <main className="flex-1">
                  <AuthWrapper>
                    {children}
                  </AuthWrapper>
                </main>
              </ConfiguracoesProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
