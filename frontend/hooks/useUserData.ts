"use client";

import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import type { AuthUser } from "@/components/auth/AuthModal";

/* ═══════════════════════════════════════════════════════════
   useUserData — Unified identity hook (Firebase + Web3)
   ═══════════════════════════════════════════════════════════

   Returns the active user identity regardless of auth method.
   - Firebase users: uid is used as backend identifier
   - Web3 users: wallet address is the backend identifier
   - If both are active, Navbar's AuthUser state takes priority

   The `backendId` can be passed to any API route that expects
   a wallet_address string (backend auto-creates the user row).
   ═══════════════════════════════════════════════════════════ */

export interface UserData {
  /** The active user object, or null if not authenticated */
  user: AuthUser | null;
  /** A stable string identifier for backend API calls (uid or wallet address) */
  backendId: string | null;
  /** Shorthand: user is authenticated */
  isAuthenticated: boolean;
  /** Loading flag — true while initial auth check is pending */
  isLoading: boolean;
  /** Portfolio balance fetched from backend */
  balance: number;
  /** Refresh portfolio balance from backend */
  refreshBalance: () => Promise<void>;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "";

export function useUserData(): UserData {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  /* ── 1. Listen for Firebase auth changes ────────────── */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser((prev) => {
          // Don't override an existing web3 session
          if (prev?.type === "web3") return prev;
          return {
            type: "firebase",
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            walletAddress: null,
            uid: firebaseUser.uid,
            photoURL: firebaseUser.photoURL,
          };
        });
      } else {
        setUser((prev) => (prev?.type === "firebase" ? null : prev));
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  /* ── 2. Check for existing MetaMask connection ─────── */
  useEffect(() => {
    async function checkWeb3() {
      try {
        if (
          typeof window !== "undefined" &&
          (window as unknown as { ethereum?: { request: (a: { method: string }) => Promise<string[]> } }).ethereum
        ) {
          const eth = (window as unknown as { ethereum: { request: (a: { method: string }) => Promise<string[]> } }).ethereum;
          const accounts = await eth.request({ method: "eth_accounts" });
          if (accounts[0]) {
            setUser((prev) => {
              // Don't override existing Firebase session
              if (prev?.type === "firebase") return prev;
              return {
                type: "web3",
                displayName: null,
                email: null,
                walletAddress: accounts[0],
                uid: accounts[0],
                photoURL: null,
              };
            });
          }
        }
      } catch {
        /* silent */
      } finally {
        setIsLoading(false);
      }
    }
    checkWeb3();
  }, []);

  /* ── Derived: backendId ─────────────────────────────── */
  const backendId = user
    ? user.type === "web3"
      ? user.walletAddress
      : user.uid // Firebase uid doubles as the backend identifier
    : null;

  /* ── 3. Ensure user row exists + fetch balance ──────── */
  const refreshBalance = useCallback(async () => {
    if (!backendId) return;
    try {
      const res = await fetch(`${API}/api/v1/user/${backendId}`);
      if (res.ok) {
        const data = await res.json();
        setBalance(data.portfolio_balance ?? 0);
      }
    } catch {
      /* silent */
    }
  }, [backendId]);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  /* ── 4. Listen for Navbar-level auth changes via custom event ── */
  useEffect(() => {
    function handleAuthEvent(e: CustomEvent<AuthUser | null>) {
      setUser(e.detail);
    }
    window.addEventListener("arthashastra:auth" as string, handleAuthEvent as EventListener);
    return () =>
      window.removeEventListener("arthashastra:auth" as string, handleAuthEvent as EventListener);
  }, []);

  return {
    user,
    backendId,
    isAuthenticated: !!user,
    isLoading,
    balance,
    refreshBalance,
  };
}
