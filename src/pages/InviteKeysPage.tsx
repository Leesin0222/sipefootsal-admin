import { useState } from "react";
import {
  Badge,
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
  getInviteKeys,
  getInviteKeyStats,
  createInviteKey,
  expireInviteKey,
  deleteInviteKey,
  type InviteKeyItem,
} from "@/api/inviteKeys";
import { InviteKeyCreateModal } from "@/components/InviteKeyCreateModal";

export function InviteKeysPage() {
  const [filter, setFilter] = useState<"all" | "active" | "used" | "expired">("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: keysRes } = useQuery({
    queryKey: ["admin", "invite-keys"],
    queryFn: () => getInviteKeys(),
  });
  const { data: statsRes } = useQuery({
    queryKey: ["admin", "invite-keys", "stats"],
    queryFn: () => getInviteKeyStats(),
  });

  const createMutation = useMutation({
    mutationFn: () => createInviteKey(),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "초대 키가 생성되었습니다.", status: "success" });
        onClose();
        queryClient.invalidateQueries({ queryKey: ["admin", "invite-keys"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const expireMutation = useMutation({
    mutationFn: (keyValue: string) => expireInviteKey(keyValue),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "만료 처리되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["admin", "invite-keys"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (keyValue: string) => deleteInviteKey(keyValue),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "삭제되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["admin", "invite-keys"] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });

  const keys = keysRes?.data ?? [];
  const stats = statsRes?.data;
  const used = (k: InviteKeyItem) => k.used ?? k.isUsed ?? false;
  const expiredAt = (k: InviteKeyItem) => k.expiredAt;
  const filteredKeys =
    filter === "all"
      ? keys
      : keys.filter((k) => {
          if (filter === "active") return !used(k) && new Date(expiredAt(k)) > new Date();
          if (filter === "used") return used(k);
          if (filter === "expired") return !used(k) && new Date(expiredAt(k)) <= new Date();
          return true;
        });

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">초대 키</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          키 생성
        </Button>
      </HStack>
      {stats && (
        <HStack spacing={6} mb={4}>
          <Text>활성: <strong>{stats.active}</strong></Text>
          <Text>사용됨: <strong>{stats.used}</strong></Text>
          <Text>만료: <strong>{stats.expired}</strong></Text>
        </HStack>
      )}
      <HStack mb={4} spacing={2}>
        {(["all", "active", "used", "expired"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "solid" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "전체" : f === "active" ? "활성" : f === "used" ? "사용됨" : "만료"}
          </Button>
        ))}
      </HStack>
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
        <Table size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>키</Th>
              <Th>만료일</Th>
              <Th>상태</Th>
              <Th>생성일</Th>
              <Th>액션</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredKeys.map((k) => {
              const keyVal = k.keyValue;
              const isUsed = used(k);
              const expAt = expiredAt(k);
              const isExpired = new Date(expAt) <= new Date();
              return (
                <Tr key={keyVal}>
                  <Td fontFamily="mono">{keyVal}</Td>
                  <Td>{new Date(expAt).toLocaleDateString("ko-KR")}</Td>
                  <Td>
                    {isUsed ? (
                      <Badge colorScheme="gray">사용됨</Badge>
                    ) : isExpired ? (
                      <Badge colorScheme="red">만료</Badge>
                    ) : (
                      <Badge colorScheme="green">활성</Badge>
                    )}
                  </Td>
                  <Td>{new Date(k.createdAt).toLocaleDateString("ko-KR")}</Td>
                  <Td>
                    {!isUsed && !isExpired && (
                      <HStack spacing={2}>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => expireMutation.mutate(keyVal)}
                          isLoading={expireMutation.isPending}
                        >
                          만료
                        </Button>
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => deleteMutation.mutate(keyVal)}
                          isLoading={deleteMutation.isPending}
                        >
                          삭제
                        </Button>
                      </HStack>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        {filteredKeys.length === 0 && (
          <Text p={4} color="gray.500">
            초대 키가 없습니다.
          </Text>
        )}
      </Box>
      <InviteKeyCreateModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => createMutation.mutate()}
        isLoading={createMutation.isPending}
      />
    </Box>
  );
}
