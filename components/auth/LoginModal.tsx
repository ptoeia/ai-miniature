"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/components/auth/AuthProvider';
import { Icons } from '@/components/icons';

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const { signInWithOAuth, signInWithPassword, signUpWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'google' | 'email'>('google');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsEmailLoading(true);
    setIsLoading(true);
    try {
      if (isSignUpMode) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        const { error: signUpError } = await signUpWithPassword({ email, password });
        if (signUpError) throw signUpError;
        // Account created successfully, user needs to verify email before login
        setSuccessMessage('Account created successfully! Please check your email to verify your account before logging in.');
        // Reset form for security and usability after showing the message.
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // Switch back to login mode so they can login after verification
        setIsSignUpMode(false);
      } else {
        const { error: signInError } = await signInWithPassword({ email, password });
        if (signInError) throw signInError;
        onClose(); 
      }
    } catch (err: any) {
      setError(err.message || (isSignUpMode ? 'Failed to create account.' : 'Failed to login. Please check your credentials.'));
    } finally {
      setIsEmailLoading(false);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);
    setIsLoading(true);
    try {
      const { error: signInError } = await signInWithOAuth('google');
      if (signInError) {
        throw signInError;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google.');
    } finally {
      setIsGoogleLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-md"> {/* Removed dark theme classes */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Welcome to Banana AI</DialogTitle>
          <DialogDescription className="text-muted-foreground"> {/* Use theme's muted color */}
            Sign in or create an account to generate AI-powered images.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'google' | 'email')} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2"> {/* Removed dark theme bg */}
            <TabsTrigger value="google"> {/* Removed dark theme active state */}
              <Icons.Google className="mr-2 h-4 w-4" /> Google
            </TabsTrigger>
            <TabsTrigger value="email"> {/* Removed dark theme active state */}
              <Icons.Email className="mr-2 h-4 w-4" /> Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4"> {/* Use theme's muted color */}
              Sign in quickly with your Google account
            </p>
            <Button 
              onClick={handleGoogleLogin} 
              disabled={isGoogleLoading || isLoading}
              className="w-full py-3 text-base" // Removed specific bg/text colors, adjusted padding
              size="lg" // Make button a bit larger like screenshot
            >
              {isGoogleLoading ? (
                <Icons.Spinner className="mr-2 h-5 w-5" />
              ) : (
                <Icons.Google className="mr-2 h-5 w-5" /> 
              )}
              Continue with Google
            </Button>
            <Button variant="link" onClick={() => setActiveTab('email')} className="mt-4"> {/* Rely on link variant color */}
              Prefer to use email and password instead?
            </Button>
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            {error && (
              // Standard error styling, adjust if your theme has specific error colors
              <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                <p>{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
                <p>{successMessage}</p>
              </div>
            )}
            <form onSubmit={handleEmailAuth}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-login">Email</Label> {/* Rely on default label color */}
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isEmailLoading || isLoading}
                    // Removed dark theme classes
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-login">Password</Label> {/* Rely on default label color */}
                  <Input
                    id="password-login"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isEmailLoading || isLoading}
                    // Removed dark theme classes
                  />
                </div>
                {isSignUpMode && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password-login">Confirm Password</Label>
                    <Input
                      id="confirm-password-login"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isEmailLoading || isLoading}
                    />
                  </div>
                )}
                <Button 
                  type="submit" 
                  disabled={isEmailLoading || isLoading}
                  className="w-full mt-2 py-3" // Removed specific bg/text colors
                >
                  {isEmailLoading ? <Icons.Spinner className="mr-2 h-4 w-4" /> : null}
                  {isSignUpMode ? 'Create Account' : 'Login with Email'}
                </Button>
              </div>
            </form>
            <Button variant="link" onClick={() => setActiveTab('google')} className="mt-4 w-full"> {/* Rely on link variant color */}
              Or sign in with Google
            </Button>

            <Button 
              variant="link" 
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setError(null); // Clear errors when switching mode
                setSuccessMessage(null); // Clear success messages when switching mode
                // setEmail(''); // Optionally clear fields
                // setPassword('');
                // setConfirmPassword('');
              }}
              className="mt-4 w-full text-sm"
            >
              {isSignUpMode 
                ? 'Already have an account? Login'
                : "Don't have an account? Sign Up"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
