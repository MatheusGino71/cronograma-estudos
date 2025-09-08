import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ClearLocalStorage } from "@/components/utils/ClearLocalStorage";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MindTech - Organize seus estudos com inteligência",
  description: "Plataforma completa para organização de cronogramas de estudo, catálogo de disciplinas e acompanhamento de progresso com analytics avançados.",
  keywords: "cronograma, estudos, disciplinas, progresso, analytics, educação",
  authors: [{ name: "MindTech Team" }],
  openGraph: {
    title: "MindTech - Organize seus estudos com inteligência",
    description: "Plataforma completa para organização de cronogramas de estudo, catálogo de disciplinas e acompanhamento de progresso com analytics avançados.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <ClearLocalStorage />
              <Navigation />
              <main className="flex-1">
                <AuthWrapper>
                  {children}
                </AuthWrapper>
              </main>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
