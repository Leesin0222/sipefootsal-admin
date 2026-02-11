import { apiClient } from "./client";
import type { ApiResponse } from "@/types/api";

export interface InviteKeyItem {
  id?: number;
  keyValue: string;
  expiredAt: string;
  isUsed?: boolean;
  used?: boolean;
  usedAt: string | null;
  createdAt: string;
}

export interface InviteKeyStats {
  active?: number;
  used?: number;
  expired?: number;
}

export async function getInviteKeys(): Promise<ApiResponse<InviteKeyItem[]>> {
  const { data } = await apiClient.get<ApiResponse<InviteKeyItem[]>>(
    "/api/admin/invite-keys"
  );
  return data;
}

export async function getActiveInviteKeys(): Promise<
  ApiResponse<InviteKeyItem[]>
> {
  const { data } = await apiClient.get<ApiResponse<InviteKeyItem[]>>(
    "/api/admin/invite-keys/active"
  );
  return data;
}

export async function createInviteKey(): Promise<ApiResponse<string>> {
  const { data } = await apiClient.post<ApiResponse<string>>(
    "/api/admin/invite-keys"
  );
  return data;
}

export async function expireInviteKey(
  keyValue: string
): Promise<ApiResponse<null>> {
  const { data } = await apiClient.put<ApiResponse<null>>(
    `/api/admin/invite-keys/${encodeURIComponent(keyValue)}/expire`
  );
  return data;
}

export async function deleteInviteKey(keyValue: string): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(
    `/api/admin/invite-keys/${encodeURIComponent(keyValue)}`
  );
  return data;
}

export async function getInviteKeyStats(): Promise<
  ApiResponse<InviteKeyStats>
> {
  const { data } = await apiClient.get<ApiResponse<InviteKeyStats>>(
    "/api/admin/invite-keys/stats"
  );
  return data;
}
