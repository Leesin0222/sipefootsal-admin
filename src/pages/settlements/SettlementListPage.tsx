import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSettlements } from "@/api/settlements";
import type { SettlementResponse } from "@/types/api";

export function SettlementListPage() {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const size = 20;

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin", "settlements", page, statusFilter],
    queryFn: () => getSettlements(page, size, statusFilter || undefined),
  });

  const pageData = res?.data;
  const settlements: SettlementResponse[] = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        정산
      </Heading>
      <HStack mb={4} spacing={4}>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          style={{ padding: "8px 12px", borderRadius: "6px" }}
        >
          <option value="">전체</option>
          <option value="PENDING">대기</option>
          <option value="SENT">발송완료</option>
          <option value="COMPLETED">완료</option>
        </select>
      </HStack>
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
        {isLoading ? (
          <Text p={4}>로딩 중...</Text>
        ) : (
          <Table size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>ID</Th>
                <Th>일정 ID</Th>
                <Th>총 비용</Th>
                <Th>계좌</Th>
                <Th>상태</Th>
                <Th>생성일</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {settlements.map((s) => (
                <Tr key={s.id}>
                  <Td>{s.id}</Td>
                  <Td>{s.scheduleId}</Td>
                  <Td>{Number(s.totalCost).toLocaleString()}원</Td>
                  <Td>{s.bankName} {s.accountNumber}</Td>
                  <Td>{s.status}</Td>
                  <Td>{new Date(s.createdAt).toLocaleDateString("ko-KR")}</Td>
                  <Td>
                    <Button
                      as={Link}
                      to={`/settlements/${s.id}`}
                      size="sm"
                      variant="link"
                    >
                      상세
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {!isLoading && settlements.length === 0 && (
          <Text p={4} color="gray.500">
            정산 내역이 없습니다.
          </Text>
        )}
        {totalPages > 1 && (
          <HStack p={4} justify="center" spacing={2}>
            <Button
              size="sm"
              disabled={page <= 0}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </Button>
            <Text>{page + 1} / {totalPages}</Text>
            <Button
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </Button>
          </HStack>
        )}
      </Box>
    </Box>
  );
}
