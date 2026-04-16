import { useCallback } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/currency';
import { trackLogin, trackUpgrade } from '../utils/analytics';
import { logger } from '../utils/logger';
import toast from 'react-hot-toast';

interface UseAuthActionsParams {
  user: User | null;
}

export function useAuthActions({ user }: UseAuthActionsParams) {
  const handleLogin = useCallback(async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      trackLogin('google');
    } catch (error) {
      logger.error('Login failed', error as Error, { action: 'login', method: 'google' });
    }
  }, []);

  const handleLogout = useCallback(() => signOut(auth), []);

  const upgradeToPro = useCallback(async () => {
    if (!user) return;
    try {
      const fn = httpsCallable(getFunctions(), 'upgradeToPro');
      await fn();
      trackUpgrade('pro');
      toast.success('Parabéns! Você agora é um usuário PRO.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'subscriptions');
    }
  }, [user]);

  return { handleLogin, handleLogout, upgradeToPro };
}
