import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
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
import { getMembersPaged, searchMembers } from "@/api/members";
import type { UserResponse } from "@/types/api";

const roleLabels: Record<string, string> = { MEMBER: "회원", ADMIN: "관리자" };
const levelLabels: Record<string, string> = {
  ROOKIE: "루키",
  PLAYMAKER: "플레이메이커",
  STRIKER: "스트라이커",
  MAESTRO: "마에스트로",
  LEGEND: "레전드",
};

export function MemberListPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const size = 20;

  const { data: res, isLoading } = useQuery({
    queryKey: ["admin", "users", "paged", page, search],
    queryFn: () =>
      search.trim()
        ? searchMembers(search, page, size)
        : getMembersPaged(page, size),
  });

  const pageData = res?.data;
  const members: UserResponse[] = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;

  return (
    <Box>
      <Heading size="lg" mb={6}>
        회원
      </Heading>
      <HStack mb={4} spacing={4}>
        <Input
          placeholder="이름 검색"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          w="300px"
        />
      </HStack>
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
        {isLoading ? (
          <Text p={4}>로딩 중...</Text>
        ) : (
          <Table size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>이름</Th>
                <Th>이메일</Th>
                <Th>레벨</Th>
                <Th>기수</Th>
                <Th>현재 기수</Th>
                <Th>역할</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {members.map((m) => (
                <Tr key={m.id}>
                  <Td>{m.name}</Td>
                  <Td>{m.maskedEmail ?? m.email}</Td>
                  <Td>{levelLabels[m.futsalLevel] ?? m.futsalLevel}</Td>
                  <Td>{m.cohort}</Td>
                  <Td>{m.isCurrentCohort ? "Y" : "N"}</Td>
                  <Td>{roleLabels[m.role] ?? m.role}</Td>
                  <Td>
                    <Button
                      as={Link}
                      to={`/members/${m.id}`}
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
        {!isLoading && members.length === 0 && (
          <Text p={4} color="gray.500">
            회원이 없습니다.
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
            <Text>
              {page + 1} / {totalPages}
            </Text>
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
