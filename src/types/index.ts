// Centralized API types — mirror the Mock Mobile Money Service OpenAPI contract.

export type Provider = 'MVOLA' | 'ORANGE_MONEY';

export type AccountStatus = 'ACTIVE' | 'BLOCKED' | 'CLOSED' | string;

export type TransactionType = 'PAYMENT' | 'TOPUP' | 'RESET' | 'REFUND';

export type TransactionStatus = 'SUCCESS' | 'FAILED';

export interface RegisterRequest {
  provider: Provider;
  password: string;
}

export interface RegisterResponse {
  msisdn: string;
  provider: Provider;
  balance: number;
  currency: string;
  status?: AccountStatus;
  // The backend may return the generated password — we never display or store it.
  password?: string;
}

export interface LoginRequest {
  msisdn: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AccountResponse {
  msisdn: string;
  provider: Provider;
  balance: number;
  currency: string;
  status: AccountStatus;
}

export interface BalanceResponse {
  balance: number;
  currency: string;
}

export interface TopUpRequest {
  amount: number;
}

export interface TransactionResponse {
  id?: string;
  reference: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
  currency?: string;
}

export interface AccountTransactionListResponse {
  transactions: TransactionResponse[];
  total?: number;
}

export interface ErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
}