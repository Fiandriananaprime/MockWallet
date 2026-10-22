// Centralized API types — mirror the Mock Mobile Money Service OpenAPI contract.

export type Provider = 'MVOLA' | 'ORANGE_MONEY';

export type AccountStatus = 'ACTIVE' | 'BLOCKED' | 'CLOSED' | string;

export type TransactionType = 'PAYMENT' | 'TOPUP' | 'RESET' | 'REFUND';

export type TransactionStatus = 'SUCCESS' | 'FAILED';

export interface RegisterRequest {
  provider: Provider;
  password: string;
  pin: string;
  confirmPin: string;
  displayName?: string;
}

export interface RegisterResponse {
  msisdn: string;
  provider: Provider;
  balance: number;
  currency: string;
  status?: AccountStatus;
  pinConfigured: boolean;
  displayName: string | null;
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
  displayName: string | null;
  provider: Provider;
  balance: number;
  currency: string;
  status: AccountStatus;
  pinConfigured: boolean;
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

export interface OrangePaymentDetails {
  receiverMsisdn: string;
  receiverName: string | null;
  amount: number;
  currency: string;
  orderId: string;
  reference: string;
  status: string;
  expiresAt: string;
}

export interface OrangePaymentConfirmRequest {
  pin: string;
}

export interface OrangePaymentConfirmResponse {
  status: string;
}

export interface PendingPaymentRequest {
  provider: Provider;
  serverCorrelationId: string;
  receiverMsisdn: string;
  receiverName: string | null;
  amount: number;
  currency: string;
  reference: string;
  expiresAt: string;
  status: 'pending' | 'INITIATED';
  paymentUrl: string;
}

export interface MvolaIncomingRequest {
  serverCorrelationId: string;
  receiverMsisdn: string;
  receiverName: string | null;
  amount: number;
  currency: string;
  reference: string;
  expiresAt: string;
  status: 'pending';
  paymentUrl: string;
}

export interface MvolaIncomingRequestsResponse {
  requests: MvolaIncomingRequest[];
}

export interface MvolaAuthorizeRequest {
  pin: string;
}

export interface MvolaPaymentDetails {
  serverCorrelationId: string;
  receiverMsisdn: string;
  receiverName: string | null;
  amount: number;
  currency: string;
  reference: string;
  expiresAt: string;
  status: string;
}

export interface OrangeIncomingRequestsResponse {
  requests: Array<{
    payToken: string;
    receiverMsisdn: string;
    receiverName: string | null;
    amount: number;
    currency: string;
    reference: string;
    expiresAt: string;
    status: 'INITIATED';
    paymentUrl: string;
  }>;
}

export interface MvolaActionResponse {
  status: string;
}

export interface PhoneVerificationNotification {
  id: string;
  type: 'PHONE_VERIFICATION';
  title: string;
  clientName: string;
  phoneNumber: string;
  message: string;
  otp: string;
  createdAt: string;
  expiresAt: string;
}