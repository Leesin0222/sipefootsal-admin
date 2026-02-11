import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  useDisclosure,
  useToast,
  Badge,
  Card,
  CardBody,
  VStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSchedule,
  startFirstVote,
  closeFirstVote,
  confirmSchedule,
  cancelSchedule,
  deleteSchedule,
} from "@/api/schedules";
import { getFirstVoteParticipationRate } from "@/api/schedules";
import { CancelScheduleModal } from "@/components/schedules/CancelScheduleModal";
import type { ScheduleStatus } from "@/types/api";

const statusLabels: Record<ScheduleStatus, string> = {
  PROPOSED: "제안됨",
  FIRST_VOTE_IN_PROGRESS: "1차 투표 진행중",
  FIRST_VOTE_COMPLETED: "1차 투표 완료",
  CONFIRMED: "확정됨",
  CANCELLED: "취소됨",
};

export function ScheduleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const scheduleId = id ? Number(id) : 0;
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: res, isLoading } = useQuery({
    queryKey: ["schedule", scheduleId],
    queryFn: () => getSchedule(scheduleId),
    enabled: scheduleId > 0,
  });

  const { data: rateRes } = useQuery({
    queryKey: ["schedule", scheduleId, "participation-rate"],
    queryFn: () => getFirstVoteParticipationRate(scheduleId),
    enabled: scheduleId > 0 && !!res?.data,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["schedule", scheduleId] });
    queryClient.invalidateQueries({ queryKey: ["schedules"] });
  };

  const startVoteMutation = useMutation({
    mutationFn: () => startFirstVote(scheduleId),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "1차 투표가 시작되었습니다.", status: "success" });
        invalidate();
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const closeVoteMutation = useMutation({
    mutationFn: () => closeFirstVote(scheduleId),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "1차 투표가 마감되었습니다.", status: "success" });
        invalidate();
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const confirmMutation = useMutation({
    mutationFn: () => confirmSchedule(scheduleId),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "일정이 확정되었습니다.", status: "success" });
        invalidate();
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const cancelMutation = useMutation({
    mutationFn: (reason: string) =>
      cancelSchedule(scheduleId, { cancellationReason: reason }),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "일정이 취소되었습니다.", status: "success" });
        onClose();
        invalidate();
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: () => deleteSchedule(scheduleId),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "일정이 삭제되었습니다.", status: "success" });
        navigate("/schedules");
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });

  const schedule = res?.data;
  const rate = rateRes?.data;

  if (isLoading || !schedule) {
    return (
      <Box>
        <Text>{isLoading ? "로딩 중..." : "일정을 찾을 수 없습니다."}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">일정 상세</Heading>
        <Button as="a" href="/schedules" variant="ghost" size="sm">
          목록
        </Button>
      </HStack>
      <Card mb={4}>
        <CardBody>
          <VStack align="stretch" spacing={2}>
            <HStack>
              <Badge colorScheme="blue">{statusLabels[schedule.status]}</Badge>
              {schedule.generalMemberAllowed && (
                <Badge colorScheme="green">일반회원 참여 허용</Badge>
              )}
            </HStack>
            <Text>
              <strong>날짜/시간:</strong>{" "}
              {new Date(schedule.dateTime).toLocaleString("ko-KR")}
            </Text>
            <Text>
              <strong>장소:</strong> {schedule.location}
            </Text>
            <Text>
              <strong>최소 인원:</strong> {schedule.minParticipants}
            </Text>
            <Text>
              <strong>1차 투표 마감:</strong>{" "}
              {new Date(schedule.firstVoteDeadline).toLocaleString("ko-KR")}
            </Text>
            {rate !== undefined && (
              <Text>
                <strong>1차 투표 참여율:</strong>{" "}
                {(Number(rate) * 100).toFixed(1)}%
              </Text>
            )}
            {schedule.memo && (
              <Text>
                <strong>메모:</strong> {schedule.memo}
              </Text>
            )}
            {schedule.cancellationReason && (
              <Text color="red.600">
                <strong>취소 사유:</strong> {schedule.cancellationReason}
              </Text>
            )}
          </VStack>
        </CardBody>
      </Card>
      <HStack spacing={2} flexWrap="wrap">
        {schedule.status === "PROPOSED" && (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => startVoteMutation.mutate()}
            isLoading={startVoteMutation.isPending}
          >
            1차 투표 시작
          </Button>
        )}
        {schedule.status === "FIRST_VOTE_IN_PROGRESS" && (
          <>
            <Button
              colorScheme="orange"
              size="sm"
              onClick={() => closeVoteMutation.mutate()}
              isLoading={closeVoteMutation.isPending}
            >
              1차 투표 마감
            </Button>
            <Button
              colorScheme="green"
              size="sm"
              onClick={() => confirmMutation.mutate()}
              isLoading={confirmMutation.isPending}
            >
              일정 확정
            </Button>
          </>
        )}
        {schedule.status === "FIRST_VOTE_COMPLETED" && (
          <Button
            colorScheme="green"
            size="sm"
            onClick={() => confirmMutation.mutate()}
            isLoading={confirmMutation.isPending}
          >
            일정 확정
          </Button>
        )}
        {(schedule.status === "PROPOSED" ||
          schedule.status === "FIRST_VOTE_IN_PROGRESS" ||
          schedule.status === "FIRST_VOTE_COMPLETED" ||
          schedule.status === "CONFIRMED") && (
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={onOpen}
            isLoading={cancelMutation.isPending}
          >
            취소
          </Button>
        )}
        {schedule.status !== "CANCELLED" && (
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => deleteMutation.mutate()}
            isLoading={deleteMutation.isPending}
          >
            삭제
          </Button>
        )}
      </HStack>
      <CancelScheduleModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={(reason) => cancelMutation.mutate(reason)}
        isLoading={cancelMutation.isPending}
      />
    </Box>
  );
}
