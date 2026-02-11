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
  getBadges,
  createBadge,
  updateBadge,
  deleteBadge,
  activateBadge,
} from "@/api/badges";
import { BadgeFormModal } from "@/components/BadgeFormModal";
import type { BadgeResponse } from "@/types/api";
import { BADGE_CATEGORY_LABELS, BADGE_GRADE_LABELS } from "@/types/api";

export function BadgesPage() {
  const [editing, setEditing] = useState<BadgeResponse | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ["badges"],
    queryFn: () => getBadges(),
  });

  const createMutation = useMutation({
    mutationFn: (body: {
      name: string;
      description: string;
      category: string;
      grade: string;
      imageUrl?: string;
    }) => createBadge(body),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "뱃지가 생성되었습니다.", status: "success" });
        onClose();
        queryClient.invalidateQueries({ queryKey: ["badges"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: { name?: string; description?: string; category?: string; grade?: string; imageUrl?: string; active?: boolean };
    }) => updateBadge(id, body),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "뱃지가 수정되었습니다.", status: "success" });
        setEditing(null);
        queryClient.invalidateQueries({ queryKey: ["badges"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
    onError: (err: { response?: { status: number }; message?: string }) => {
      if (err.response?.status === 404) {
        setEditing(null);
        queryClient.invalidateQueries({ queryKey: ["badges"] });
        toast({
          title: "뱃지가 삭제되었거나 존재하지 않습니다. 목록을 새로고침했습니다.",
          status: "warning",
        });
      } else {
        toast({ title: (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "수정에 실패했습니다.", status: "error" });
      }
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteBadge(id),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "뱃지가 삭제되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["badges"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const activateMutation = useMutation({
    mutationFn: (id: number) => activateBadge(id),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "뱃지가 활성화되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["badges"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });

  // 백엔드가 Page<Badge> 반환 시 data.content, 배열 반환 시 data 그대로 사용
  const raw = res?.data;
  const badges: BadgeResponse[] = Array.isArray(raw)
    ? raw
    : (raw && typeof raw === "object" && "content" in raw
        ? (raw as { content: BadgeResponse[] }).content
        : []);

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">뱃지</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          뱃지 추가
        </Button>
      </HStack>
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
        {isLoading ? (
          <Text p={4}>로딩 중...</Text>
        ) : (
          <Table size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>이름</Th>
                <Th>설명</Th>
                <Th>카테고리</Th>
                <Th>등급</Th>
                <Th>활성</Th>
                <Th>액션</Th>
              </Tr>
            </Thead>
            <Tbody>
              {badges.map((b) => (
                <Tr key={b.id}>
                  <Td>{b.name}</Td>
                  <Td>{b.description}</Td>
                  <Td>{BADGE_CATEGORY_LABELS[b.category as keyof typeof BADGE_CATEGORY_LABELS] ?? b.category}</Td>
                  <Td>{BADGE_GRADE_LABELS[b.grade as keyof typeof BADGE_GRADE_LABELS] ?? b.grade}</Td>
                  <Td>{b.active ? "Y" : "N"}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button size="xs" variant="link" onClick={() => setEditing(b)}>
                        수정
                      </Button>
                      {!b.active && (
                        <Button
                          size="xs"
                          variant="link"
                          onClick={() => activateMutation.mutate(b.id)}
                          isLoading={activateMutation.isPending}
                        >
                          활성화
                        </Button>
                      )}
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="link"
                        onClick={() => deleteMutation.mutate(b.id)}
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
        {!isLoading && badges.length === 0 && (
          <Text p={4} color="gray.500">
            뱃지가 없습니다.
          </Text>
        )}
      </Box>
      <BadgeFormModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={(body) => createMutation.mutate(body)}
        isLoading={createMutation.isPending}
      />
      {editing && (
        <BadgeFormModal
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          initial={editing}
          onSubmit={(body) => updateMutation.mutate({ id: editing.id, body })}
          isLoading={updateMutation.isPending}
        />
      )}
    </Box>
  );
}
