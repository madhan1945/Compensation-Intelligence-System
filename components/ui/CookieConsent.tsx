"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already made a selection
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay display slightly for a premium, natural slide-in entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100%-3rem)] sm:w-full bg-bg-card/95 border border-bg-border rounded-2xl p-5 shadow-2xl backdrop-blur-md transition-all duration-500 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-6 scale-95 pointer-events-none"
      }`}
    >
      <div className="space-y-4 text-left">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
          </span>
          <h4 className="text-sm font-bold text-text-primary">Cookie settings</h4>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          We use cookies to verify session security, analyze platform traffic, and enhance your compensation search experience.
        </p>
        <div className="flex items-center justify-end space-x-3 pt-1">
          <button
            onClick={handleDecline}
            className="text-[11px] font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer px-3 py-1.5 rounded-md hover:bg-bg-elevated/50 active:scale-95"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="text-[11px] font-bold text-text-primary bg-accent-blue hover:bg-blue-600 transition-colors cursor-pointer px-4 py-2 rounded-lg active:scale-95 shadow-md shadow-accent-blue/10 hover:shadow-accent-blue/20"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
