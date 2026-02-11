import { apiClient } from "./client";
import type { ApiResponse, BadgeResponse } from "@/types/api";

export interface BadgeCreateRequest {
  name: string;
  description: string;
  category: string;
  grade: string;
  imageUrl?: string;
}

export interface BadgeUpdateRequest {
  name?: string;
  description?: string;
  category?: string;
  grade?: string;
  imageUrl?: string;
  active?: boolean;
}

export async function getBadges(): Promise<ApiResponse<BadgeResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<BadgeResponse[]>>(
    "/api/badges"
  );
  return data;
}

export async function getBadge(
  badgeId: number
): Promise<ApiResponse<BadgeResponse>> {
  const { data } = await apiClient.get<ApiResponse<BadgeResponse>>(
    `/api/badges/${badgeId}`
  );
  return data;
}

export async function createBadge(
  body: BadgeCreateRequest
): Promise<ApiResponse<BadgeResponse>> {
  const { data } = await apiClient.post<ApiResponse<BadgeResponse>>(
    "/api/badges",
    body
  );
  return data;
}

export async function updateBadge(
  badgeId: number,
  body: BadgeUpdateRequest
): Promise<ApiResponse<BadgeResponse>> {
  const { data } = await apiClient.put<ApiResponse<BadgeResponse>>(
    `/api/badges/${badgeId}`,
    body
  );
  return data;
}

export async function deleteBadge(badgeId: number): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(
    `/api/badges/${badgeId}`
  );
  return data;
}

export async function activateBadge(
  badgeId: number
): Promise<ApiResponse<BadgeResponse>> {
  const { data } = await apiClient.post<ApiResponse<BadgeResponse>>(
    `/api/badges/${badgeId}/activate`
  );
  return data;
}

export async function grantBadgeToUser(
  badgeId: number,
  userId: number
): Promise<ApiResponse<null>> {
  const { data } = await apiClient.post<ApiResponse<null>>(
    `/api/badges/${badgeId}/grant/${userId}`
  );
  return data;
}
