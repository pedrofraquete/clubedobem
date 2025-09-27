import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "../lib/simple-store";
import { AuthProvider } from "../contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace Social - Transformando Comunidades",
  description: "Compre de empreendedores locais e ajude a gerar impacto social positivo nas comunidades brasileiras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AppProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AppProvider>
        
        {/* Chatbot Widget do Clube do Bem */}
        <Script
          src="https://api.abacus.ai/api/v0/getChatBotWidgetSDKLink?externalApplicationId=12c985db22"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
