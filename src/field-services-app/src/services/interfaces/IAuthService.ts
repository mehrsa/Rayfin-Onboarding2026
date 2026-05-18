export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface IAuthService {
  readonly fabricAuthEnabled: boolean;

  signOut(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  isAuthenticated(): Promise<boolean>;
  signInWithPassword(email: string, password: string): Promise<AuthUser>;
  signUpWithPassword(email: string, password: string): Promise<AuthUser>;
  initEmbeddedAuth(): Promise<AuthUser | null>;
  initiateFabricLogin(): Promise<void>;
  ensureSignedInWithFabric(): Promise<AuthUser>;
}
