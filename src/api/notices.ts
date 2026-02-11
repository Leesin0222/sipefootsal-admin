import { apiClient } from "./client";
import type { ApiResponse, NoticeResponse, PageResponse } from "@/types/api";

export interface NoticeCreateRequest {
  title: string;
  content: string;
  importance: string;
}

export interface NoticeUpdateRequest {
  title?: string;
  content?: string;
  importance?: string;
}

export async function getNoticesPaged(
  page = 0,
  size = 10,
  params?: Record<string, string>
): Promise<ApiResponse<PageResponse<NoticeResponse>>> {
  const { data } = await apiClient.get<
    ApiResponse<PageResponse<NoticeResponse>>
  >("/api/notices/paged", { params: { page, size, ...params } });
  return data;
}

export async function getNotice(
  noticeId: number
): Promise<ApiResponse<NoticeResponse>> {
  const { data } = await apiClient.get<ApiResponse<NoticeResponse>>(
    `/api/notices/${noticeId}`
  );
  return data;
}

export async function createNotice(
  body: NoticeCreateRequest
): Promise<ApiResponse<NoticeResponse>> {
  const { data } = await apiClient.post<ApiResponse<NoticeResponse>>(
    "/api/notices",
    body
  );
  return data;
}

export async function updateNotice(
  noticeId: number,
  body: NoticeUpdateRequest
): Promise<ApiResponse<NoticeResponse>> {
  const { data } = await apiClient.put<ApiResponse<NoticeResponse>>(
    `/api/notices/${noticeId}`,
    body
  );
  return data;
}

export async function deleteNotice(
  noticeId: number
): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(
    `/api/notices/${noticeId}`
  );
  return data;
}

export async function toggleNoticeStatus(
  noticeId: number
): Promise<ApiResponse<NoticeResponse>> {
  const { data } = await apiClient.put<ApiResponse<NoticeResponse>>(
    `/api/notices/${noticeId}/toggle-status`
  );
  return data;
}
