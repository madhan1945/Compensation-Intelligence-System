"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGateRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Bypass auth redirect if user clicked "Continue as guest"
    const isGuestMode = sessionStorage.getItem("guest-mode") === "true";
    if (isGuestMode) return;

    // Only apply if user is unauthenticated, and they are not already on login/register pages
    if (status === "unauthenticated" && pathname !== "/login" && pathname !== "/register") {
      const timer = setTimeout(() => {
        router.push(`/login?reason=gate&callbackUrl=${encodeURIComponent(pathname)}`);
      }, 8000); // 8 seconds delay

      return () => clearTimeout(timer);
    }
  }, [status, pathname, router]);

  return null;
}
