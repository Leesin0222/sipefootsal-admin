import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { ApiResponse } from "@/types/api";

export function DashboardPage() {
  const { data: userCount } = useQuery({
    queryKey: ["admin", "users", "count"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<number>>("/api/admin/users/count");
      return data.success ? data.data ?? 0 : 0;
    },
  });

  const { data: inviteStats } = useQuery({
    queryKey: ["admin", "invite-keys", "stats"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<{ active: number; used: number; expired: number }>>(
        "/api/admin/invite-keys/stats"
      );
      return data.success ? data.data : { active: 0, used: 0, expired: 0 };
    },
  });

  const { data: activeSchedules } = useQuery({
    queryKey: ["schedules", "active-first-vote"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<unknown[]>>(
        "/api/schedules/active-first-vote"
      );
      return data.success ? (data.data ?? []).length : 0;
    },
  });

  return (
    <Box>
      <Heading size="lg" mb={6}>
        대시보드
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <Stat bg="white" p={4} borderRadius="md" boxShadow="sm">
          <StatLabel>총 회원 수</StatLabel>
          <StatNumber>{userCount ?? "-"}</StatNumber>
        </Stat>
        <Stat bg="white" p={4} borderRadius="md" boxShadow="sm">
          <StatLabel>1차 투표 진행 중인 일정</StatLabel>
          <StatNumber>{activeSchedules ?? "-"}</StatNumber>
        </Stat>
        <Stat bg="white" p={4} borderRadius="md" boxShadow="sm">
          <StatLabel>활성 초대 키</StatLabel>
          <StatNumber>{inviteStats?.active ?? "-"}</StatNumber>
          <Text fontSize="sm" color="gray.600">
            사용됨: {inviteStats?.used ?? "-"} / 만료: {inviteStats?.expired ?? "-"}
          </Text>
        </Stat>
      </SimpleGrid>
    </Box>
  );
}
