import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  HStack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSettlement,
  resendSettlement,
  getSettlementHistory,
} from "@/api/settlements";

export function SettlementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const settlementId = id ? Number(id) : 0;
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ["settlement", settlementId],
    queryFn: () => getSettlement(settlementId),
    enabled: settlementId > 0,
  });

  const { data: historyRes } = useQuery({
    queryKey: ["settlement", settlementId, "history"],
    queryFn: () => getSettlementHistory(settlementId),
    enabled: settlementId > 0 && !!res?.data,
  });

  const resendMutation = useMutation({
    mutationFn: () => resendSettlement(settlementId),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "정산 메시지가 재발송되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["settlement", settlementId] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });

  const settlement = res?.data;
  const history = (historyRes?.data ?? []) as Array<{
    id?: number;
    userId?: number;
    amount?: number;
    penalty?: number;
    status?: string;
  }>;

  if (isLoading || !settlement) {
    return (
      <Box>
        <Text>{isLoading ? "로딩 중..." : "정산을 찾을 수 없습니다."}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">정산 상세</Heading>
        <Button variant="ghost" size="sm" onClick={() => navigate("/settlements")}>
          목록
        </Button>
      </HStack>
      <Card mb={4}>
        <CardBody>
          <VStack align="stretch" spacing={2}>
            <Text><strong>일정 ID:</strong> {settlement.scheduleId}</Text>
            <Text><strong>총 비용:</strong> {Number(settlement.totalCost).toLocaleString()}원</Text>
            <Text><strong>은행:</strong> {settlement.bankName}</Text>
            <Text><strong>계좌번호:</strong> {settlement.accountNumber}</Text>
            <Text><strong>예금주:</strong> {settlement.accountHolder}</Text>
            <Text><strong>상태:</strong> {settlement.status}</Text>
            <Text><strong>생성일:</strong> {new Date(settlement.createdAt).toLocaleString("ko-KR")}</Text>
          </VStack>
        </CardBody>
      </Card>
      <HStack spacing={2} mb={4}>
        <Button
          colorScheme="blue"
          size="sm"
          onClick={() => resendMutation.mutate()}
          isLoading={resendMutation.isPending}
        >
          정산 메시지 재발송
        </Button>
      </HStack>
      {history.length > 0 && (
        <Card>
          <CardBody>
            <Heading size="sm" mb={3}>
              정산 이력
            </Heading>
            <Box as="ul" listStyleType="none" m={0} p={0}>
              {history.map((h, i) => (
                <Box key={h.id ?? i} as="li" py={2} borderBottomWidth="1px">
                  사용자 {h.userId}: {Number(h.amount ?? 0).toLocaleString()}원
                  {h.penalty ? ` (벌금 ${Number(h.penalty).toLocaleString()}원)` : ""} - {h.status}
                </Box>
              ))}
            </Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}
