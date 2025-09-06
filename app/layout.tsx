import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import type { Metadata } from 'next'; // Import Metadata type
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/navigation/navbar"; // Import MainNav
import Footer from "@/components/layout/Footer"; // Import Footer
import { AuthProvider } from "@/components/auth/AuthProvider"; // Import AuthProvider
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"; // Import ErrorBoundary
import { NetworkStatus } from "@/components/ui/NetworkStatus"; // Import NetworkStatus

// Configure Poppins for headings
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Common weights for headings
  variable: "--font-poppins", // CSS variable for Poppins
  display: "swap",
});

// Global Metadata
export const metadata: Metadata = {
  title: {
    template: '%s | Banana AI',
    default: 'Banana AI - AI Image Editing Reimagined',
  },
  description: 'Banana AI - powered by Google Nano Banan AI, is a AI image editing tool designed to simplify enhance photos, remove backgrounds, restore old images, and much more.',
  keywords: '',
  alternates: {
    canonical: 'https://banana-ai.art',
  },
};

// Configure Roboto for body text
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Common weights for body text
  variable: "--font-roboto", // CSS variable for Roboto
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${poppins.variable} ${roboto.variable}`} suppressHydrationWarning>
      {/* <Script id="salesnip">
        {`!function(e,n){if(!n.loaded){var t,a,r=n||{};for(r.__queue=[],(n=e.createElement("script")).type="text/javascript",n.async=!0,n.src="https://cdn.salesnip.com/v1/script.min.js",(o=e.getElementsByTagName("script")[0])?o.parentNode.insertBefore(n,o):e.head.appendChild(n),r.__handler=function(e){return function(){r.__queue.push([e].concat(Array.prototype.slice.call(arguments,0)))}},t="open on off".split(" "),a=0;a<t.length;a++){var i=t[a];r[i]=r.__handler(i)}var o=new Proxy(r,{get:function(e,n){return n in e||(e[n]=r.__handler(n)),e[n]}});window.salesnip=o,window.salesnip.loaded=1}}(document,window.salesnip||{});`}
      </Script> */}
      <body className="bg-background text-foreground font-sans flex flex-col min-h-screen">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange storageKey="theme-flux-v1">
            <AuthProvider>
              <MainNav /> {/* Add MainNav here */}
              <main className="flex-grow">
                {children}
              </main>
              <Footer /> {/* Add Footer here */}
              <NetworkStatus /> {/* Add NetworkStatus here */}
            </AuthProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
