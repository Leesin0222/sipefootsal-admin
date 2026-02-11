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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNoticesPaged,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticeStatus,
} from "@/api/notices";
import { NoticeFormModal } from "@/components/NoticeFormModal";
import type { NoticeResponse } from "@/types/api";

export function NoticesPage() {
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<NoticeResponse | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const size = 10;

  const { data: res, isLoading } = useQuery({
    queryKey: ["notices", "paged", page],
    queryFn: () => getNoticesPaged(page, size),
  });

  const createMutation = useMutation({
    mutationFn: (body: { title: string; content: string; importance: string }) =>
      createNotice(body),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "공지가 작성되었습니다.", status: "success" });
        onClose();
        queryClient.invalidateQueries({ queryKey: ["notices"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: { title?: string; content?: string; importance?: string };
    }) => updateNotice(id, body),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "공지가 수정되었습니다.", status: "success" });
        setEditing(null);
        queryClient.invalidateQueries({ queryKey: ["notices"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteNotice(id),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "공지가 삭제되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["notices"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const toggleMutation = useMutation({
    mutationFn: (id: number) => toggleNoticeStatus(id),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "상태가 변경되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["notices"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });

  const pageData = res?.data;
  const notices: NoticeResponse[] = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">공지사항</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          공지 작성
        </Button>
      </HStack>
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
        {isLoading ? (
          <Text p={4}>로딩 중...</Text>
        ) : (
          <Table size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>제목</Th>
                <Th>중요도</Th>
                <Th>상태</Th>
                <Th>작성일</Th>
                <Th>액션</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notices.map((n) => (
                <Tr key={n.id}>
                  <Td>{n.title}</Td>
                  <Td>{n.importance}</Td>
                  <Td>{n.status}</Td>
                  <Td>{new Date(n.createdAt).toLocaleDateString("ko-KR")}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="xs"
                        variant="link"
                        onClick={() => setEditing(n)}
                      >
                        수정
                      </Button>
                      <Button
                        size="xs"
                        variant="link"
                        onClick={() => toggleMutation.mutate(n.id)}
                        isLoading={toggleMutation.isPending}
                      >
                        상태 토글
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="link"
                        onClick={() => deleteMutation.mutate(n.id)}
                        isLoading={deleteMutation.isPending}
                      >
                        삭제
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
        {!isLoading && notices.length === 0 && (
          <Text p={4} color="gray.500">
            공지가 없습니다.
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
      <NoticeFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={(body) => createMutation.mutate(body)}
        isLoading={createMutation.isPending}
      />
      {editing && (
        <NoticeFormModal
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          initial={editing}
          onSubmit={(body) =>
            updateMutation.mutate({ id: editing.id, body })
          }
          isLoading={updateMutation.isPending}
        />
      )}
    </Box>
  );
}
