import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Gift, X, Sparkles } from 'lucide-react';
import { LoginModal } from '@/components/auth/LoginModal';
import { SuccessNotification } from './SuccessNotification';

interface FreeTrialBannerProps {
  onClaim?: () => void;
  className?: string;
}

export const FreeTrialBanner = ({ onClaim, className = '' }: FreeTrialBannerProps) => {
  const { session } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [hasClaimedFreeTrial, setHasClaimedFreeTrial] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Check if user should see the banner
  useEffect(() => {
    const checkBannerVisibility = async () => {
      // Don't show if user dismissed it
      if (localStorage.getItem('freeTrialBannerDismissed') === 'true') {
        return;
      }

      if (session?.user) {
        try {
          const response = await fetch('/api/user/credits');
          if (response.ok) {
            const data = await response.json();
            setUserCredits(data.credits || 0);
            setHasClaimedFreeTrial(data.hasClaimedFreeTrial || false);
            
            // Show banner if user hasn't claimed free trial and has less than 10 credits
            if (!data.hasClaimedFreeTrial && data.credits < 10) {
              setIsVisible(true);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Show banner for non-logged-in users
        setIsVisible(true);
      }
    };

    checkBannerVisibility();
  }, [session]);

  const handleClaimFreeTrial = async () => {
    if (!session) {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
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
        setIsVisible(false);
        
        // Call parent callback if provided
        if (onClaim) {
          onClaim();
        }
        
        // Show success notification
        setShowSuccessNotification(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to claim free trial'}`);
      }
    } catch (error) {
      console.error('Free trial claim error:', error);
      alert('Error claiming free trial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('freeTrialBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={`relative bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg shadow-lg ${className}`}>
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center justify-between pr-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Get 10 Free Credits! 
                <Sparkles className="w-5 h-5" />
              </h3>
              <p className="text-sm text-white/90">
                {session 
                  ? "Claim your free credits and start creating amazing AI images today!"
                  : "Sign up now and get 10 free credits to try our AI image tools!"
                }
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleClaimFreeTrial}
            disabled={isLoading}
            className="bg-white text-green-600 hover:bg-white/90 font-semibold px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            {isLoading ? (
              'Claiming...'
            ) : session ? (
              'Claim Now'
            ) : (
              'Sign Up & Claim'
            )}
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        message="🎉 Congratulations! You've received 10 free credits. Start creating amazing images now!"
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}; 