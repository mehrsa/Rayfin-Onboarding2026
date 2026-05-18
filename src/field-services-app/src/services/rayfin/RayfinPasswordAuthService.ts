import { AuthUser, IAuthService } from '../interfaces/IAuthService';

import { getRayfinClient } from './RayfinClientService';

function sessionUser(): AuthUser {
  const session = getRayfinClient().auth.getSession();
  if (!session.isAuthenticated || !session.user) {
    throw new Error('Authentication completed but no session was established.');
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.email.split('@')[0],
  };
}

export class RayfinPasswordAuthService implements IAuthService {
  get fabricAuthEnabled(): boolean {
    return false;
  }

  async signOut(): Promise<void> {
    await getRayfinClient().auth.signOut();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const session = getRayfinClient().auth.getSession();
    if (!session.isAuthenticated || !session.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.email.split('@')[0],
    };
  }

  async isAuthenticated(): Promise<boolean> {
    return getRayfinClient().auth.getSession().isAuthenticated;
  }

  async signInWithPassword(email: string, password: string): Promise<AuthUser> {
    await getRayfinClient().auth.signIn({ email, password });
    return sessionUser();
  }

  async signUpWithPassword(email: string, password: string): Promise<AuthUser> {
    await getRayfinClient().auth.signUp({ email, password });
    await getRayfinClient().auth.signIn({ email, password });
    return sessionUser();
  }

  async initEmbeddedAuth(): Promise<AuthUser | null> {
    return null;
  }

  async initiateFabricLogin(): Promise<void> {
    throw new Error('Fabric SSO is not enabled for local password auth.');
  }

  async ensureSignedInWithFabric(): Promise<AuthUser> {
    throw new Error('Fabric SSO is not enabled for local password auth.');
  }
}
