import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSchedulesByStatus,
  getSchedulesDateRange,
  createSchedule,
  type ScheduleCreateRequest,
} from "@/api/schedules";
import type { ScheduleResponse, ScheduleStatus } from "@/types/api";
import { ScheduleFormModal } from "@/components/schedules/ScheduleFormModal";

const statusLabels: Record<ScheduleStatus, string> = {
  PROPOSED: "제안됨",
  FIRST_VOTE_IN_PROGRESS: "1차 투표 진행중",
  FIRST_VOTE_COMPLETED: "1차 투표 완료",
  CONFIRMED: "확정됨",
  CANCELLED: "취소됨",
};

export function ScheduleListPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ["schedules", "status", statusFilter || "all"],
    queryFn: () =>
      statusFilter
        ? getSchedulesByStatus(statusFilter)
        : getSchedulesDateRange(
            new Date(0).toISOString().slice(0, 10),
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              .toISOString()
              .slice(0, 10)
          ),
  });

  const createMutation = useMutation({
    mutationFn: (body: ScheduleCreateRequest) => createSchedule(body),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "일정이 생성되었습니다.", status: "success" });
        onClose();
        queryClient.invalidateQueries({ queryKey: ["schedules"] });
      } else {
        toast({ title: r.message || "생성 실패", status: "error" });
      }
    },
    onError: () => toast({ title: "일정 생성에 실패했습니다.", status: "error" }),
  });

  const schedules: ScheduleResponse[] = res?.success && res.data ? res.data : [];

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">일정</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          일정 추가
        </Button>
      </HStack>
      <HStack mb={4} spacing={4}>
        <Select
          w="200px"
          placeholder="상태 필터"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </HStack>
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
        {isLoading ? (
          <Text p={4}>로딩 중...</Text>
        ) : (
          <Table size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>날짜/시간</Th>
                <Th>장소</Th>
                <Th>상태</Th>
                <Th>1차 마감</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {schedules.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    {new Date(s.dateTime).toLocaleString("ko-KR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Td>
                  <Td>{s.location}</Td>
                  <Td>
                    <Badge colorScheme={s.status === "CONFIRMED" ? "green" : "gray"}>
                      {statusLabels[s.status]}
                    </Badge>
                  </Td>
                  <Td>
                    {new Date(s.firstVoteDeadline).toLocaleString("ko-KR", {
                      dateStyle: "short",
                    })}
                  </Td>
                  <Td>
                    <Button as={Link} to={`/schedules/${s.id}`} size="sm" variant="link">
                      상세
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {!isLoading && schedules.length === 0 && (
          <Text p={4} color="gray.500">
            일정이 없습니다.
          </Text>
        )}
      </Box>
      <ScheduleFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={(body) => createMutation.mutate(body)}
        isLoading={createMutation.isPending}
      />
    </Box>
  );
}
