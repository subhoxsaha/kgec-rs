import { GoogleUserProfile } from '../types';

export const GOOGLE_OAUTH_CLIENT_ID =
  '86237358756-0m791v0vtcs84obtl5g09rdo3cltq37u.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
            error_callback?: (error: any) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

/**
 * Loads the Google Identity Services SDK if not already loaded on window
 */
function loadGoogleGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window environment required for Google authentication.'));
      return;
    }

    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-gsi-script') as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Google Identity Services library.'))
      );
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not connect to Google Identity Services.'));
    document.head.appendChild(script);
  });
}

/**
 * Triggers genuine Google Identity Services OAuth 2.0 flow to authenticate user via Google
 * Rejects with a clear error if user cancels or authentication fails.
 * Does not return any mock or false data.
 */
export async function triggerGoogleOAuth(): Promise<GoogleUserProfile> {
  await loadGoogleGsiScript();

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Identity Services is unavailable. Please check your network connection.');
  }

  return new Promise((resolve, reject) => {
    try {
      const client = window.google!.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_OAUTH_CLIENT_ID,
        scope: 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(tokenResponse.error_description || tokenResponse.error));
            return;
          }

          if (!tokenResponse.access_token) {
            reject(new Error('No access token received from Google.'));
            return;
          }

          try {
            // Fetch verified user profile directly from Google UserInfo endpoint
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!userInfoRes.ok) {
              const errText = await userInfoRes.text();
              throw new Error(`Failed to retrieve profile from Google: ${errText || userInfoRes.statusText}`);
            }

            const userInfo = await userInfoRes.json();
            const profile: GoogleUserProfile = {
              id: userInfo.sub,
              sub: userInfo.sub,
              name: userInfo.name || userInfo.email?.split('@')[0] || 'Google User',
              email: userInfo.email || '',
              picture: userInfo.picture,
              given_name: userInfo.given_name,
              family_name: userInfo.family_name,
              verified_email: userInfo.email_verified,
            };

            resolve(profile);
          } catch (err: any) {
            reject(new Error(err?.message || 'Failed to authenticate Google user profile.'));
          }
        },
        error_callback: (err) => {
          const errMsg = err?.message || err?.type || 'Google Sign-In canceled or interrupted.';
          reject(new Error(errMsg));
        },
      });

      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      reject(new Error(err?.message || 'Failed to initialize Google authentication client.'));
    }
  });
}
