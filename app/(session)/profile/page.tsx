"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress'; // Corrected import path
import { Loader2, ExternalLink, User, CreditCard, ShoppingBag, AlertCircle, KeyRound, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';


// Define interfaces for our data structures for type safety
interface Subscription {
  id: string;
  status: string;
  created_at: string;
  price_id: string; // Added for plan lookup
}

interface OneTimePurchase {
  id: string;
  created_at: string;
  amount: number;
  description: string;
}

interface AccountData {
  credits: number;
  subscriptions: Subscription[];
  oneTimePurchases: OneTimePurchase[];
  currentPlan?: { name: string; credits: number } | null;
}

// Helper component for the password update form
const UpdatePasswordForm = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    const { data, error } = await createClient().auth.updateUser({ password });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input 
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          placeholder="••••••••"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input 
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
        Update Password
      </Button>
    </form>
  );
}

// --- MOCK DATA: Replace with your actual plan details from your database or config ---
const PLAN_DETAILS: { [key: string]: { name: string; credits: number } } = {
  'price_1PgKAbRpJzUbspMmyxSgA9r3': { name: 'Free Plan', credits: 100 },
  'default': { name: 'Unknown Plan', credits: 0 },
};

// --- Sub-components for the new layout ---

const SidebarNav = ({ activeView, setActiveView }: { activeView: string; setActiveView: (view: string) => void }) => {
  const navItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard },
  ];

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5">
      <nav className="flex flex-col space-y-1">
        {navItems.map(item => (
          <Button
            key={item.id}
            variant={activeView === item.id ? 'secondary' : 'ghost'}
            className="justify-start"
            onClick={() => setActiveView(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
};

const AccountView = ({ user }: { user: any }) => (
  <Card>
    <CardHeader>
      <CardTitle>Account Details</CardTitle>
      <CardDescription>Your personal account information.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Email Address</p>
        <p className="font-mono text-sm">{user?.email}</p>
      </div>
    </CardContent>
  </Card>
);

const SecurityView = () => (
  <Card>
    <CardHeader>
      <CardTitle>Security</CardTitle>
      <CardDescription>Update your password. This option is only available for accounts created with an email and password.</CardDescription>
    </CardHeader>
    <CardContent>
      <UpdatePasswordForm />
    </CardContent>
  </Card>
);

const SubscriptionView = ({ accountData }: { accountData: AccountData | null }) => {
  const router = useRouter();
  const [isClaimingFreeTrial, setIsClaimingFreeTrial] = useState(false);
  const [hasClaimedFreeTrial, setHasClaimedFreeTrial] = useState(false);
  const [freeTrialMessage, setFreeTrialMessage] = useState('');
  
  const plan = accountData?.currentPlan || { name: 'Free Plan', credits: 0 };
  const totalAvailableCredits = accountData?.credits ?? 0;
  const subscriptionCredits = plan.credits;
  const bonusCredits = Math.max(0, totalAvailableCredits - subscriptionCredits);
  const usedSubscriptionCredits = Math.max(0, subscriptionCredits - Math.max(0, totalAvailableCredits - bonusCredits));
  const subscriptionUsagePercentage = subscriptionCredits > 0 ? (usedSubscriptionCredits / subscriptionCredits) * 100 : 0;

  // Check if user has claimed free trial
  useEffect(() => {
    const checkFreeTrialStatus = async () => {
      try {
        const response = await fetch('/api/user/credits');
        if (response.ok) {
          const data = await response.json();
          setHasClaimedFreeTrial(data.hasClaimedFreeTrial || false);
        }
      } catch (error) {
        console.error('Error checking free trial status:', error);
      }
    };
    checkFreeTrialStatus();
  }, []);

  const handleClaimFreeTrial = async () => {
    setIsClaimingFreeTrial(true);
    setFreeTrialMessage('');
    
    try {
      const response = await fetch('/api/user/claim-free-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setHasClaimedFreeTrial(true);
        setFreeTrialMessage(data.message || 'Free trial claimed successfully!');
        // Refresh account data
        window.location.reload();
      } else {
        setFreeTrialMessage(data.error || 'Failed to claim free trial');
      }
    } catch (error) {
      console.error('Free trial claim error:', error);
      setFreeTrialMessage('Error claiming free trial. Please try again.');
    } finally {
      setIsClaimingFreeTrial(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Unified Credits & Subscription Card */}
      <Card>
        <CardHeader>
          <CardTitle>Credits & Subscription</CardTitle>
          <CardDescription>Your current plan, credits balance, and usage details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Available Credits - Main Display */}
          <div className="text-center py-6 rounded-lg border bg-card">
            <div className="text-5xl font-bold text-foreground mb-2">
              {totalAvailableCredits}
            </div>
            <p className="text-lg text-muted-foreground">Total Available Credits</p>
          </div>
          
          {/* Credits Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Credits Breakdown</h3>
            
            {/* Subscription Credits */}
            {subscriptionCredits > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">{plan.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {subscriptionCredits - usedSubscriptionCredits} / {subscriptionCredits} Credits
                  </span>
                </div>
                <Progress value={subscriptionUsagePercentage} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{usedSubscriptionCredits} used</span>
                  <span>{subscriptionCredits - usedSubscriptionCredits} remaining</span>
                </div>
              </div>
            )}
            
            {/* Bonus Credits */}
            {bonusCredits > 0 && (
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">Bonus Credits</span>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    {hasClaimedFreeTrial ? 'Free Trial' : 'Bonus'}
                  </span>
                </div>
                <span className="font-semibold text-green-800">{bonusCredits}</span>
              </div>
            )}
            
            {/* No Subscription State */}
            {subscriptionCredits === 0 && bonusCredits === 0 && (
              <div className="text-center py-8 border border-dashed border-muted-foreground/30 rounded-lg">
                <p className="text-lg font-semibold mb-2">No Credits Available</p>
                <p className="text-muted-foreground mb-4">Get started with a subscription or claim your free trial.</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={() => router.push('/pricing')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Choose a Plan
                  </Button>
                  {!hasClaimedFreeTrial && (
                    <Button variant="outline" onClick={handleClaimFreeTrial} disabled={isClaimingFreeTrial}>
                      {isClaimingFreeTrial ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        'Claim Free Trial'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Free Trial Section */}
          {!hasClaimedFreeTrial && totalAvailableCredits > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-1">
                    🎉 Free Trial Available!
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Claim your free 10 credits to boost your available balance.
                  </p>
                </div>
                <Button 
                  onClick={handleClaimFreeTrial}
                  disabled={isClaimingFreeTrial}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isClaimingFreeTrial ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    'Claim Free Trial'
                  )}
                </Button>
              </div>
              {freeTrialMessage && (
                <div className={`mt-4 p-3 rounded-md text-sm ${
                  freeTrialMessage.includes('success') || freeTrialMessage.includes('claimed')
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}>
                  {freeTrialMessage}
                </div>
              )}
            </div>
          )}
          
          {/* Low Credits Warning */}
          {hasClaimedFreeTrial && totalAvailableCredits < 10 && totalAvailableCredits > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-yellow-800 font-medium">Low Credits</p>
                  <p className="text-yellow-700 text-sm">
                    You&apos;re running low on credits. Consider upgrading your plan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase History - Separate Card */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
          <CardDescription>Your subscription and credit purchase history.</CardDescription>
        </CardHeader>
        <CardContent>
          {accountData?.oneTimePurchases && accountData.oneTimePurchases.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountData.oneTimePurchases.map((purchase: OneTimePurchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{format(new Date(purchase.created_at), 'PPP')}</TableCell>
                    <TableCell>{purchase.description}</TableCell>
                    <TableCell className="text-right">${(purchase.amount / 100).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No purchase history found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function ProfilePage() {
  const { user, isLoading: authLoading, error: authError } = useAuth();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('account');
  const router = useRouter();

  useEffect(() => {
    const fetchAccountData = async () => {
      // Wait for auth to finish loading before checking user
      if (authLoading) return;
      
      // If there's an auth error, don't try to fetch account data
      if (authError) {
        setLoading(false);
        return;
      }
      
      if (!user) {
        setLoading(false);
        router.push('/');
        return;
      }
      try {
        const res = await fetch('/api/account');
        if (!res.ok) throw new Error('Failed to fetch account data');
        const data = await res.json();
        setAccountData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountData();
  }, [user, router, authLoading, authError]);

  // Show loading while auth is initializing or while fetching data
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-light-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show auth error
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-light-subtle flex items-center justify-center">
        <div className="bg-background p-8 rounded-lg shadow-lg text-center max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connection Issue</h2>
          <p className="text-muted-foreground mb-4">{authError}</p>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-light-subtle flex items-center justify-center">
        <div className="bg-background p-8 rounded-lg shadow-lg text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-2xl font-bold">Error</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light-subtle">
      <div className="container mx-auto py-8 md:py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings, subscription, and billing.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <SidebarNav activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1">
            {activeView === 'account' && <AccountView user={user} />}
            {activeView === 'security' && user?.app_metadata.provider === 'email' && <SecurityView />}
            {activeView === 'subscription' && 
              <SubscriptionView 
                accountData={accountData} 
              />
            }
          </main>
        </div>
      </div>
    </div>
  );
}
