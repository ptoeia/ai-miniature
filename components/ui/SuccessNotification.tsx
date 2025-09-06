import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessNotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const SuccessNotification = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 5000 
}: SuccessNotificationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg max-w-md flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}; 