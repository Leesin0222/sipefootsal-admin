import { apiClient } from "./client";
import type { ApiResponse, SettlementResponse, PageResponse } from "@/types/api";

export interface SettlementCalculateRequest {
  totalCost: number;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
}

export interface SettlementUpdateRequest {
  totalCost: number;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
}

export async function getSettlements(
  page = 0,
  size = 20,
  status?: string
): Promise<ApiResponse<PageResponse<SettlementResponse>>> {
  const { data } = await apiClient.get<
    ApiResponse<PageResponse<SettlementResponse>>
  >("/api/admin/settlements", { params: { page, size, status } });
  return data;
}

export async function getSettlement(
  settlementId: number
): Promise<ApiResponse<SettlementResponse>> {
  const { data } = await apiClient.get<ApiResponse<SettlementResponse>>(
    `/api/admin/settlements/${settlementId}`
  );
  return data;
}

export async function calculateSettlement(
  scheduleId: number,
  body: SettlementCalculateRequest
): Promise<ApiResponse<SettlementResponse>> {
  const { data } = await apiClient.post<ApiResponse<SettlementResponse>>(
    `/api/admin/settlements/${scheduleId}/calculate`,
    body
  );
  return data;
}

export async function updateSettlement(
  settlementId: number,
  body: SettlementUpdateRequest
): Promise<ApiResponse<null>> {
  const { data } = await apiClient.put<ApiResponse<null>>(
    `/api/admin/settlements/${settlementId}`,
    body
  );
  return data;
}

export async function resendSettlement(
  settlementId: number
): Promise<ApiResponse<null>> {
  const { data } = await apiClient.post<ApiResponse<null>>(
    `/api/admin/settlements/${settlementId}/resend`
  );
  return data;
}

export async function getSettlementHistory(
  settlementId: number
): Promise<ApiResponse<unknown[]>> {
  const { data } = await apiClient.get<ApiResponse<unknown[]>>(
    `/api/admin/settlements/${settlementId}/history`
  );
  return data;
}
