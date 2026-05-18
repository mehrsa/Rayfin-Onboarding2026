import { AuthUser, IAuthService } from '../interfaces/IAuthService';

import { getRayfinClient } from './RayfinClientService';
import {
  FabricAuthConfig,
  RayfinFabricAuthService,
} from './RayfinFabricAuthService';

/**
 * Auth service that delegates to Fabric Entra authentication.
 */
export class RayfinAuthService implements IAuthService {
  private readonly fabricAuth: RayfinFabricAuthService;

  constructor(config: FabricAuthConfig) {
    this.fabricAuth = new RayfinFabricAuthService(config);
  }

  get fabricAuthEnabled(): boolean {
    return true;
  }

  async signOut(): Promise<void> {
    try {
      const client = getRayfinClient();
      await client.auth.signOut();
    } catch (error) {
      console.error('RayfinAuthService signOut error:', error);
      throw new Error('Logout failed.');
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const client = getRayfinClient();
      const session = client.auth.getSession();

      if (!session.isAuthenticated || !session.user) {
        return null;
      }

      return {
        id: session.user.id,
        email: session.user.email,
        name: session.user.email.split('@')[0],
      };
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const client = getRayfinClient();
      const session = client.auth.getSession();
      return session.isAuthenticated;
    } catch {
      return false;
    }
  }

  async signInWithPassword(): Promise<AuthUser> {
    throw new Error('Password sign-in is only available for local development.');
  }

  async signUpWithPassword(): Promise<AuthUser> {
    throw new Error('Password sign-up is only available for local development.');
  }

  async initEmbeddedAuth(): Promise<AuthUser | null> {
    return this.fabricAuth.initEmbeddedAuth();
  }

  async initiateFabricLogin(): Promise<void> {
    return this.fabricAuth.initiateFabricLogin();
  }

  async ensureSignedInWithFabric(): Promise<AuthUser> {
    return this.fabricAuth.ensureSignedInWithFabric();
  }
}
