import { RayfinClient } from '@microsoft/rayfin-client';

import type { FieldServiceSchema } from '../../../rayfin/data/schema';

/**
 * A singleton service that manages the RayfinClient instance
 */
export class RayfinClientService {
  private static instance: RayfinClientService | null = null;
  private _client: RayfinClient<FieldServiceSchema> | null = null;

  private constructor() {}

  /**
   * Get the singleton instance of RayfinClientService
   */
  public static getInstance(): RayfinClientService {
    if (!RayfinClientService.instance) {
      RayfinClientService.instance = new RayfinClientService();
    }
    return RayfinClientService.instance;
  }

  /**
   * Initialize the RayfinClient with the provided base URL and publishable key
   *
   * @param baseUrl The base URL of the Rayfin API
   * @param publishableKey The publishable key for service-level authentication
   * @param projectId Optional Rayfin project identifier (set by rayfin up)
   * @returns The initialized RayfinClient instance
   */
  public initialize(
    baseUrl: string,
    publishableKey: string,
    projectId?: string
  ): RayfinClient<FieldServiceSchema> {
    if (!this._client) {
      console.log(`🔧 Initializing Rayfin client with baseUrl: ${baseUrl}`);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Origin: window.location.origin,
      };

      // include managed hosting moniker if projectId is provided (set by rayfin up)
      if (projectId) {
        headers['x-ms-workload-resource-moniker'] = projectId;
      }

      this._client = new RayfinClient<FieldServiceSchema>({
        baseUrl: baseUrl,
        publishableKey: publishableKey,
        useProxy: false,
        headers,
        authStorage: true,
      });

      console.log(
        `✅ Rayfin client configured for direct API calls to ${baseUrl}`
      );
    }

    return this._client;
  }

  /**
   * Get the RayfinClient instance
   * @throws Error if the client is not initialized
   */
  public getClient(): RayfinClient<FieldServiceSchema> {
    if (!this._client) {
      throw new Error('RayfinClient not initialized. Call initialize() first.');
    }
    return this._client;
  }

  /**
   * Check if the client is initialized
   */
  public isInitialized(): boolean {
    return this._client !== null;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  public static reset(): void {
    RayfinClientService.instance = null;
  }
}

/**
 * Helper function to get the RayfinClient instance
 * @throws Error if the client is not initialized
 */
export function getRayfinClient(): RayfinClient<FieldServiceSchema> {
  return RayfinClientService.getInstance().getClient();
}
