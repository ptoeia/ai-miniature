'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      
      if (!online) {
        setShowOfflineMessage(true);
      } else if (showOfflineMessage) {
        // Show a brief "back online" message
        setTimeout(() => setShowOfflineMessage(false), 3000);
      }
    };

    // Initial check
    updateOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [showOfflineMessage]);

  if (!showOfflineMessage) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline
          ? 'bg-green-100 border border-green-300 text-green-800'
          : 'bg-red-100 border border-red-300 text-red-800'
      }`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? 'Back online' : 'No internet connection'}
        </span>
      </div>
    </div>
  );
}; 