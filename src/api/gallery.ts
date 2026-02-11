import { apiClient } from "./client";
import type { ApiResponse, GalleryResponse, PageResponse } from "@/types/api";

export async function getGalleryBySchedule(
  scheduleId: number
): Promise<ApiResponse<GalleryResponse[]>> {
  const { data } = await apiClient.get<ApiResponse<GalleryResponse[]>>(
    `/api/gallery/schedule/${scheduleId}`
  );
  return data;
}

export async function getGalleryBySchedulePaged(
  scheduleId: number,
  page = 0,
  size = 20
): Promise<ApiResponse<PageResponse<GalleryResponse>>> {
  const { data } = await apiClient.get<
    ApiResponse<PageResponse<GalleryResponse>>
  >(`/api/gallery/schedule/${scheduleId}/paged`, {
    params: { page, size },
  });
  return data;
}

export async function uploadGallery(
  scheduleId: number,
  file: File
): Promise<ApiResponse<GalleryResponse>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("scheduleId", String(scheduleId));
  const { data } = await apiClient.post<ApiResponse<GalleryResponse>>(
    "/api/gallery/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return data;
}

export async function deleteGallery(
  galleryId: number
): Promise<ApiResponse<null>> {
  const { data } = await apiClient.delete<ApiResponse<null>>(
    `/api/gallery/${galleryId}`
  );
  return data;
}

export async function updateGalleryDescription(
  galleryId: number,
  description: string
): Promise<ApiResponse<GalleryResponse>> {
  const { data } = await apiClient.put<ApiResponse<GalleryResponse>>(
    `/api/gallery/${galleryId}/description`,
    { description }
  );
  return data;
}
