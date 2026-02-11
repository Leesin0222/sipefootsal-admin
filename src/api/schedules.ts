import { apiClient } from "./client";
import type { ApiResponse, ScheduleResponse } from "@/types/api";

export interface ScheduleCreateRequest {
  dateTime: string;
  location: string;
  minParticipants: number;
  firstVoteDeadline: string;
  memo?: string;
  generalMemberAllowed: boolean;
}

export interface ScheduleUpdateRequest {
  dateTime?: string;
  location?: string;
  minParticipants?: number;
  firstVoteDeadline?: string;
  memo?: string;
  generalMemberAllowed?: boolean;
}

export interface ScheduleCancelRequest {
  cancellationReason: string;
}

export async function getSchedulesByStatus(
  status: string
): Promise<ApiResponse<ScheduleResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse[]>>(
    `/api/schedules/status/${status}`
  );
  return data;
}

export async function getSchedule(id: number): Promise<ApiResponse<ScheduleResponse>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse>>(
    `/api/schedules/${id}`
  );
  return data;
}

export async function getActiveFirstVoteSchedules(): Promise<
  ApiResponse<ScheduleResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse[]>>(
    "/api/schedules/active-first-vote"
  );
  return data;
}

export async function getConfirmedSchedules(): Promise<
  ApiResponse<ScheduleResponse[]>
> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse[]>>(
    "/api/schedules/confirmed"
  );
  return data;
}

export async function getSchedulesDateRange(
  dateFrom: string,
  dateTo: string
): Promise<ApiResponse<ScheduleResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<ScheduleResponse[]>>(
    "/api/schedules/date-range",
    { params: { dateFrom, dateTo } }
  );
  return data;
}

export async function createSchedule(
  body: ScheduleCreateRequest
): Promise<ApiResponse<ScheduleResponse>> {
  const { data } = await apiClient.post<ApiResponse<ScheduleResponse>>(
    "/api/schedules",
    body
  );
  return data;
}

export async function updateSchedule(
  id: number,
  body: ScheduleUpdateRequest
): Promise<ApiResponse<ScheduleResponse>> {
  const { data } = await apiClient.put<ApiResponse<ScheduleResponse>>(
    `/api/schedules/${id}`,
    body
  );
  return data;
}

export async function deleteSchedule(id: number): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(
    `/api/schedules/${id}`
  );
  return data;
}

export async function startFirstVote(
  scheduleId: number
): Promise<ApiResponse<ScheduleResponse>> {
  const { data } = await apiClient.post<ApiResponse<ScheduleResponse>>(
    `/api/schedules/${scheduleId}/start-first-vote`
  );
  return data;
}

export async function closeFirstVote(
  scheduleId: number
): Promise<ApiResponse<ScheduleResponse>> {
  const { data } = await apiClient.post<ApiResponse<ScheduleResponse>>(
    `/api/schedules/${scheduleId}/close-first-vote`
  );
  return data;
}

export async function confirmSchedule(
  scheduleId: number
): Promise<ApiResponse<ScheduleResponse>> {
  const { data } = await apiClient.post<ApiResponse<ScheduleResponse>>(
    `/api/schedules/${scheduleId}/confirm`
  );
  return data;
}

export async function cancelSchedule(
  scheduleId: number,
  body: ScheduleCancelRequest
): Promise<ApiResponse<ScheduleResponse>> {
  const { data } = await apiClient.post<ApiResponse<ScheduleResponse>>(
    `/api/schedules/${scheduleId}/cancel`,
    body
  );
  return data;
}

export async function getFirstVoteParticipationRate(
  scheduleId: number
): Promise<ApiResponse<number>> {
  const { data } = await apiClient.get<ApiResponse<number>>(
    `/api/schedules/${scheduleId}/first-vote-participation-rate`
  );
  return data;
}
