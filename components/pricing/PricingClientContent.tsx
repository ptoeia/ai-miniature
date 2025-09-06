"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Gift, Sparkles } from 'lucide-react';
import { LoginModal } from '@/components/auth/LoginModal';
import { SuccessNotification } from '@/components/ui/SuccessNotification';
import  config  from '@/config';

// Define and export the structure of a plan for use in server components
export interface Plan {
  id: string;
  creemId: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
  cta: string;
  isFeatured: boolean;
  billingPeriod: 'one_time' | 'monthly' | 'yearly';
}

// This component now receives plans as a prop instead of defining them internally.
const PricingClientContent = ({ plans }: { plans: Plan[] }) => {
  const { session, user } = useAuth();
  const router = useRouter();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [hasClaimedFreeTrial, setHasClaimedFreeTrial] = useState<boolean>(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<'one_time' | 'monthly'>('one_time');

  // Fetch user credits and trial status
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/credits');
          if (response.ok) {
            const data = await response.json();
            setUserCredits(data.credits || 0);
            setHasClaimedFreeTrial(data.hasClaimedFreeTrial || false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handlePlanAction = async (plan: Plan) => {
    // Handle Free Trial logic - use dynamic price and credits from plan data
    const isFreeTrialPlan = plan.price === '$0.00' || plan.price === '$0';
    
    if (isFreeTrialPlan) {
      if (!session) {
        setShowLoginModal(true);
        return;
      }

      // If user already has the free trial, redirect to homepage instead of profile
      if (hasClaimedFreeTrial || userCredits >= plan.credits) {
        router.push('/');
        return;
      }

      // Claim free trial
      setLoadingProductId(plan.id);
      try {
        const response = await fetch('/api/user/claim-free-trial', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserCredits(data.credits);
          setHasClaimedFreeTrial(true);
          // Show success notification and redirect to homepage
          setShowSuccessNotification(true);
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          throw new Error('Failed to claim free trial');
        }
      } catch (error) {
        console.error('Free trial claim error:', error);
        alert('Error claiming free trial. Please try again.');
      } finally {
        setLoadingProductId(null);
      }
      return;
    }

    // Handle paid plans
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    setLoadingProductId(plan.id);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: plan.id, creemId: plan.creemId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session.');
      }

      const { checkoutUrl } = await response.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Checkout URL not found in response.');
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
    } finally {
      setLoadingProductId(null);
    }
  };

  const getButtonText = (plan: Plan) => {
    const isFreeTrialPlan = plan.price === '$0.00' || plan.price === '$0';
    
    if (isFreeTrialPlan) {
      if (!session) return 'Sign Up & Get Credits';
      if (hasClaimedFreeTrial || userCredits >= plan.credits) return 'Start Creating';
      return 'Claim Free Credits';
    }
    
    return plan.cta;
  };

  const getButtonStyle = (plan: Plan) => {
    const isFreeTrialPlan = plan.price === '$0.00' || plan.price === '$0';
    
    if (isFreeTrialPlan) {
      if (hasClaimedFreeTrial || userCredits >= plan.credits) {
        return 'bg-green-500 text-white hover:bg-green-600 border-0';
      }
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 border-0';
    }
    
    return plan.isFeatured 
      ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-0' 
      : 'bg-primary text-primary-foreground hover:bg-primary/90 border-0';
  };

  useEffect(() => {
    if (session) {
      setShowLoginModal(false);
    }
  }, [session]);

  // Filter plans based on active tab
  const filteredPlans = plans.filter(plan => {
    if (activeTab === 'one_time') {
      return plan.billingPeriod === 'one_time';
    } else {
      return plan.billingPeriod === 'monthly' || plan.billingPeriod === 'yearly';
    }
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="font-poppins text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                Choose Your Credit Pack
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-muted-foreground sm:mt-4 font-roboto">
                Start with {plans.find(p => p.price === '$0.00' || p.price === '$0')?.credits || 'free'} free credits, then choose the perfect plan for your creative needs.
            </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab('one_time')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'one_time'
                  ? 'bg-background text-foreground shadow-sm border-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground border-2 border-transparent'
              }`}
            >
              One Time
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'monthly'
                  ? 'bg-background text-foreground shadow-sm border-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground border-2 border-transparent'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-6 items-stretch">
            {filteredPlans.map((plan) => {
                const isFreeTrialPlan = plan.price === '$0.00' || plan.price === '$0';
                const isTrialClaimed = isFreeTrialPlan && (hasClaimedFreeTrial || userCredits >= plan.credits);

                return (
                    <div
                        key={plan.id}
                        className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg w-full sm:w-80 lg:w-72 ${
                          isFreeTrialPlan 
                            ? 'ring-2 ring-green-500 border-green-500' 
                            : plan.isFeatured 
                              ? 'ring-2 ring-primary border-primary' 
                              : 'border-border'
                        }`}>
                        
                        {/* Popular Badge */}
                        {plan.isFeatured && !isFreeTrialPlan && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                              Popular
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-grow">
                            <h3 className="text-2xl font-bold font-poppins flex items-center gap-2">
                              {plan.name}
                              {isFreeTrialPlan && <Sparkles className="w-6 h-6 text-green-500" />}
                            </h3>
                            <p className="mt-3 text-sm text-muted-foreground font-roboto h-12">{plan.description}</p>
                            <div className="mt-6">
                                <span className="text-5xl font-bold font-poppins">
                                  {isFreeTrialPlan ? '$0' : plan.price}
                                </span>
                                {!isFreeTrialPlan && (
                                  <span className="text-muted-foreground">
                                    {plan.billingPeriod === 'monthly' ? ' / month' : 
                                     plan.billingPeriod === 'yearly' ? ' / year' : ''}
                                  </span>
                                )}
                            </div>
                            
                            <ul className="mt-8 space-y-3 text-sm font-roboto flex-grow">
                                {plan.features.map((feature, index) => {
                                  // Dynamically replace credit text for free trial plans
                                  let displayFeature = feature;
                                  if (isFreeTrialPlan && feature.includes('free credits')) {
                                    displayFeature = `${plan.credits} free credits`;
                                  }
                                  
                                  return (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle2 className={`mr-2 mt-0.5 h-5 w-5 flex-shrink-0 ${
                                          isFreeTrialPlan ? 'text-green-500' : 'text-blue-500'
                                        }`} />
                                        <span>{displayFeature}</span>
                                    </li>
                                  );
                                })}
                            </ul>
                        </div>
                        <Button
                            size="lg"
                            className={`mt-8 w-full font-semibold ${getButtonStyle(plan)}`}
                            onClick={() => handlePlanAction(plan)}
                            disabled={loadingProductId === plan.id}>
                            {loadingProductId === plan.id ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                            ) : (
                                <>
                                  {isFreeTrialPlan && !isTrialClaimed && <Gift className="mr-2 h-4 w-4" />}
                                  {getButtonText(plan)}
                                </>
                            )}
                        </Button>
                        
                        {/* Trial claimed status */}
                        {isFreeTrialPlan && isTrialClaimed && (
                          <p className="mt-2 text-center text-sm text-green-600 font-medium">
                            ✅ Free trial claimed
                          </p>
                        )}
                    </div>
                );
            })}
        </div>
        
        {/* Success Notification */}
        <SuccessNotification
          message={`🎉 Congratulations! You've received ${plans.find(p => p.price === '$0.00' || p.price === '$0')?.credits || 'free'} credits. Redirecting to homepage...`}
          isVisible={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
        />
        
        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
    </div>
  );
};

export default PricingClientContent;
