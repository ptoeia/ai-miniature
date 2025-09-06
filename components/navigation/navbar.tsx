"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Container } from "@/components/creem/landing/container";
import { Poppins } from "next/font/google"; // Added Poppins import
import { useAuth } from "@/components/auth/AuthProvider"; 
import { LogOut, UserCircle2, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 
import { LoginModal } from '@/components/auth/LoginModal';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'], // For bold and extra-bold titles/brand
});

export function MainNav() {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isLoading, signOut, error } = useAuth(); 
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) { // Adjust scroll threshold as needed
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call on mount to set initial state based on current scroll position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out 
        ${isScrolled 
          ? 'border-b border-border/40 bg-background/90 backdrop-blur-lg shadow-md supports-[backdrop-filter]:bg-background/75' 
          : 'border-b border-transparent bg-transparent'}`}>
        {/* Adjusted classes: 
            - Added transition-all for smooth effect.
            - Scrolled state: Slightly less opaque background (bg-background/90), stronger blur (backdrop-blur-lg), added shadow-md.
            - Initial state: Transparent background and border.
        */}
        <Container>
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logos/logo-transprent.svg"
                  alt="AI MINIATURE logo"
                  width={28}
                  height={28}
                  priority
                  className="h-7 w-auto"
                />
                <span className={`${poppins.className} font-bold text-lg text-foreground`}>AI MINIATURE</span>
              </Link>
              <div className="hidden md:flex gap-6">
                <Link
                  href="/#features"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground/80"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground/80"
                >
                  Pricing
                </Link>

                {/* Docs link removed */}
              </div>
            </div>
            <div className="flex items-center gap-x-3">
              {/* Get Started button - Button only test */}
              <Button
                onClick={() => scrollToElement('tool-area')}
                className={`${poppins.className} font-normal rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white hover:opacity-90 transition-opacity border-0`}
              >
                Get Started
              </Button>
              {error ? (
                <Button 
                  variant="destructive" 
                  onClick={() => window.location.reload()} 
                  className={`${poppins.className} font-normal rounded-lg`}
                  title={error}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              ) : isLoading ? (
                <Button variant="outline" className={`${poppins.className} font-normal rounded-lg`} disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" title={user.email || 'User menu'}>
                      <UserCircle2 className="h-5 w-5" />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user.email && (
                      <>
                        <DropdownMenuItem className="text-sm text-muted-foreground cursor-default">
                          {user.email}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowLoginModal(true)} 
                  className={`${poppins.className} font-normal rounded-lg`}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              )}
            </div>
          </div>
        </Container>
      </nav>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
}

