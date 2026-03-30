import type { SSOProviderConfig } from './types';

export function createSSOProvider(config: SSOProviderConfig) {
  const { provider, clientId, redirectUri, scopes = ['openid', 'email', 'profile'] } = config;

  if (!provider?.trim() || !clientId?.trim() || !redirectUri?.trim()) {
    throw new Error('Provider, clientId, and redirectUri are required');
  }

  function getAuthorizationUrl(state?: string): string {
    if (config.authorizationUrl) {
      const url = new URL(config.authorizationUrl);
      url.searchParams.set('client_id', clientId);
      url.searchParams.set('redirect_uri', redirectUri);
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('scope', scopes.join(' '));
      if (state) url.searchParams.set('state', state);
      return url.toString();
    }
    // Default providers
    const providerUrls: Record<string, string> = {
      google: 'https://accounts.google.com/o/oauth2/v2/auth',
      github: 'https://github.com/login/oauth/authorize',
      microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    };
    const baseUrl = providerUrls[provider] ?? '';
    const url = new URL(baseUrl);
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scopes.join(' '));
    if (state) url.searchParams.set('state', state);
    return url.toString();
  }

  function initiateLogin(state?: string): void {
    if (typeof window === 'undefined') {
      console.warn('initiateLogin called in non-browser environment');
      return;
    }
    window.location.href = getAuthorizationUrl(state);
  }

  function getProvider(): string {
    return provider;
  }

  return { getAuthorizationUrl, initiateLogin, getProvider };
}
