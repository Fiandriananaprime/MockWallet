import { apiClient } from './client';
import type {
  MvolaActionResponse,
  MvolaAuthorizeRequest,
  MvolaIncomingRequestsResponse,
  MvolaPaymentDetails,
  OrangeIncomingRequestsResponse,
  OrangePaymentConfirmRequest,
  OrangePaymentConfirmResponse,
  OrangePaymentDetails,
} from '@/types';

export async function getOrangePaymentDetails(payToken: string): Promise<OrangePaymentDetails> {
  const { data } = await apiClient.get<OrangePaymentDetails>(
    `/orange/pay/${encodeURIComponent(payToken)}/details`,
  );
  return data;
}

export async function confirmOrangePayment(
  payToken: string,
  payload: OrangePaymentConfirmRequest,
): Promise<OrangePaymentConfirmResponse> {
  const { data } = await apiClient.post<OrangePaymentConfirmResponse>(
    `/orange/pay/${encodeURIComponent(payToken)}/confirm`,
    payload,
  );
  return data;
}

export async function getMvolaIncomingRequests(): Promise<MvolaIncomingRequestsResponse> {
  const { data } = await apiClient.get<MvolaIncomingRequestsResponse>('/mvola/app/requests');
  return data;
}

export async function getOrangeIncomingRequests(): Promise<OrangeIncomingRequestsResponse> {
  const { data } = await apiClient.get<OrangeIncomingRequestsResponse>('/orange/app/requests');
  return data;
}

export async function authorizeMvolaRequest(
  serverCorrelationId: string,
  payload: MvolaAuthorizeRequest,
): Promise<MvolaActionResponse> {
  const { data } = await apiClient.post<MvolaActionResponse>(
    `/mvola/pay/${encodeURIComponent(serverCorrelationId)}/confirm`,
    payload,
  );
  return data;
}

export async function getMvolaPaymentDetails(serverCorrelationId: string): Promise<MvolaPaymentDetails> {
  const { data } = await apiClient.get<MvolaPaymentDetails>(
    `/mvola/pay/${encodeURIComponent(serverCorrelationId)}/details`,
  );
  return data;
}

export async function rejectMvolaRequest(serverCorrelationId: string): Promise<MvolaActionResponse> {
  const { data } = await apiClient.post<MvolaActionResponse>(
    `/mvola/app/requests/${encodeURIComponent(serverCorrelationId)}/reject`,
    {},
  );
  return data;
}
