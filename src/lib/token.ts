// Token persistence for the Mock Mobile Money Service.
// Only the access token is stored client-side. The backend resolves the
// account from the token — the MSISDN is never used to fetch account data.

const TOKEN_KEY = 'momo.accessToken';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}