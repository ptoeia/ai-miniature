import Link from 'next/link';
import { Container } from '@/components/creem/landing/container';
import { Twitter, Linkedin, Mail } from 'lucide-react'; // MessageSquare is no longer used directly here
import { FaDiscord } from 'react-icons/fa';
import config from '@/config';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex gap-4">

            {/* Social Media Links */}
            {/*
            <a href={config.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-muted-foreground hover:text-foreground/80">
              <Twitter className="h-5 w-5" />
            </a>
            <a href={config.socialLinks.discord} target="_blank" rel="noopener noreferrer" aria-label="Discord" className="text-muted-foreground hover:text-foreground/80">
              <FaDiscord className="h-5 w-5" />
            </a>
            <a href={config.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground/80">
              <Linkedin className="h-5 w-5" />
            </a>
            */}
            {/* Support Email */}
            <a href={`mailto:${config.contact_us_email}`} aria-label="Support Email" className="text-muted-foreground hover:text-foreground/80">
              <Mail className="h-5 w-5" />
            </a>
          </div>
          
          <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} Banana AI. All rights reserved.
            </p>
            <a 
              href={`mailto:${config.contact_us_email}`}
              className="text-sm text-muted-foreground hover:text-foreground/80 underline"
            >
              Contact Us
            </a>
          </div>
          
          <nav className="flex gap-4">
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-foreground/80"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground/80"
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
        
        {/* Powered By Section */}
        <div className="mt-6 pt-4 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground/70">
            This website is powered by Google Gemini 2.5 Flash Preview model
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
