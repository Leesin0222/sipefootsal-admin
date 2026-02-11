import { apiClient } from "./client";
import type { ApiResponse, UserResponse, PageResponse } from "@/types/api";

export interface UserUpdateRequest {
  name?: string;
  gender?: string;
  residence?: string;
  cohort?: string;
}

export async function getMembersPaged(
  page = 0,
  size = 20,
  params?: Record<string, string>
): Promise<ApiResponse<PageResponse<UserResponse>>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<UserResponse>>>(
    "/api/admin/users/paged",
    { params: { page, size, ...params } }
  );
  return data;
}

export async function getMember(
  userId: number
): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.get<ApiResponse<UserResponse>>(
    `/api/admin/users/${userId}`
  );
  return data;
}

export async function updateMember(
  userId: number,
  body: UserUpdateRequest
): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.put<ApiResponse<UserResponse>>(
    `/api/admin/users/${userId}`,
    body
  );
  return data;
}

export async function updateFutsalLevel(
  userId: number,
  futsalLevel: string
): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.put<ApiResponse<UserResponse>>(
    `/api/admin/users/${userId}/futsal-level`,
    { futsalLevel }
  );
  return data;
}

export async function updateCurrentCohort(
  userId: number,
  isCurrentCohort: boolean
): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.put<ApiResponse<UserResponse>>(
    `/api/admin/users/${userId}/current-cohort`,
    { isCurrentCohort }
  );
  return data;
}

export async function updateRole(
  userId: number,
  role: string
): Promise<ApiResponse<UserResponse>> {
  const { data } = await apiClient.put<ApiResponse<UserResponse>>(
    `/api/admin/users/${userId}/role`,
    { role }
  );
  return data;
}

export async function getMemberCount(): Promise<ApiResponse<number>> {
  const { data } = await apiClient.get<ApiResponse<number>>(
    "/api/admin/users/count"
  );
  return data;
}

export async function searchMembers(
  query: string,
  page = 0,
  size = 20
): Promise<ApiResponse<PageResponse<UserResponse>>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<UserResponse>>>(
    "/api/admin/users/search/name",
    { params: { name: query, page, size } }
  );
  return data;
}
