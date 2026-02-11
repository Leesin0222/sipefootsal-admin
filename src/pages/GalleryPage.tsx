import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConfirmedSchedules } from "@/api/schedules";
import {
  getGalleryBySchedule,
  uploadGallery,
  deleteGallery,
} from "@/api/gallery";
import { apiClient } from "@/api/client";
import type { GalleryResponse } from "@/types/api";

export function GalleryPage() {
  const [scheduleId, setScheduleId] = useState<number | null>(null);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: schedulesRes } = useQuery({
    queryKey: ["schedules", "confirmed"],
    queryFn: () => getConfirmedSchedules(),
  });
  const schedules = schedulesRes?.data ?? [];

  const { data: galleryRes, isLoading } = useQuery({
    queryKey: ["gallery", scheduleId],
    queryFn: () => getGalleryBySchedule(scheduleId!),
    enabled: scheduleId != null && scheduleId > 0,
  });
  const images: GalleryResponse[] = galleryRes?.data ?? [];

  const uploadMutation = useMutation({
    mutationFn: ({ sid, file }: { sid: number; file: File }) =>
      uploadGallery(sid, file),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "업로드되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["gallery", scheduleId] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
    onError: () => toast({ title: "업로드에 실패했습니다.", status: "error" }),
  });
  const deleteMutation = useMutation({
    mutationFn: (galleryId: number) => deleteGallery(galleryId),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "삭제되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["gallery", scheduleId] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && scheduleId) {
      uploadMutation.mutate({ sid: scheduleId, file });
      e.target.value = "";
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        갤러리
      </Heading>
      <HStack mb={4} spacing={4}>
        <Text>일정 선택:</Text>
        <select
          value={scheduleId ?? ""}
          onChange={(e) =>
            setScheduleId(e.target.value ? Number(e.target.value) : null)
          }
          style={{ padding: "8px 12px", borderRadius: "6px" }}
        >
          <option value="">선택</option>
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>
              {new Date(s.dateTime).toLocaleDateString("ko-KR")} {s.location}
            </option>
          ))}
        </select>
        {scheduleId && (
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Button as="span" colorScheme="blue" size="sm">
              업로드
            </Button>
          </label>
        )}
      </HStack>
      {scheduleId && (
        <>
          {isLoading ? (
            <Text>로딩 중...</Text>
          ) : (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              {images.map((img) => (
                <Box key={img.id} position="relative">
                  <Image
                    src={
                      img.imageUrl.startsWith("http")
                        ? img.imageUrl
                        : `${apiClient.defaults.baseURL}${img.imageUrl}`
                    }
                    alt={img.description ?? ""}
                    borderRadius="md"
                    objectFit="cover"
                    h="200px"
                    w="100%"
                  />
                  <Button
                    position="absolute"
                    top={2}
                    right={2}
                    size="xs"
                    colorScheme="red"
                    onClick={() => deleteMutation.mutate(img.id)}
                    isLoading={deleteMutation.isPending}
                  >
                    삭제
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          )}
          {!isLoading && images.length === 0 && (
            <Text color="gray.500">해당 일정의 이미지가 없습니다.</Text>
          )}
        </>
      )}
      {!scheduleId && (
        <Text color="gray.500">일정을 선택하세요.</Text>
      )}
    </Box>
  );
}
