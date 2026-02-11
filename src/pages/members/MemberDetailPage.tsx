import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Select,
  Switch,
  useToast,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMember,
  updateFutsalLevel,
  updateCurrentCohort,
  updateRole,
} from "@/api/members";
import type { FutsalLevel, UserRole } from "@/types/api";

const levelOptions: { value: FutsalLevel; label: string }[] = [
  { value: "ROOKIE", label: "루키" },
  { value: "PLAYMAKER", label: "플레이메이커" },
  { value: "STRIKER", label: "스트라이커" },
  { value: "MAESTRO", label: "마에스트로" },
  { value: "LEGEND", label: "레전드" },
];
const roleOptions: { value: UserRole; label: string }[] = [
  { value: "MEMBER", label: "회원" },
  { value: "ADMIN", label: "관리자" },
];

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? Number(id) : 0;
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: res, isLoading } = useQuery({
    queryKey: ["member", userId],
    queryFn: () => getMember(userId),
    enabled: userId > 0,
  });

  const updateLevelMutation = useMutation({
    mutationFn: (futsalLevel: string) =>
      updateFutsalLevel(userId, futsalLevel),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "레벨이 변경되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["member", userId] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const updateCohortMutation = useMutation({
    mutationFn: (isCurrentCohort: boolean) =>
      updateCurrentCohort(userId, isCurrentCohort),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "기수 정보가 변경되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["member", userId] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });
  const updateRoleMutation = useMutation({
    mutationFn: (role: string) => updateRole(userId, role),
    onSuccess: (r) => {
      if (r.success) {
        toast({ title: "역할이 변경되었습니다.", status: "success" });
        queryClient.invalidateQueries({ queryKey: ["member", userId] });
      } else toast({ title: r.message || "실패", status: "error" });
    },
  });

  const user = res?.data;

  if (isLoading || !user) {
    return (
      <Box>
        <Text>{isLoading ? "로딩 중..." : "회원을 찾을 수 없습니다."}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">회원 상세</Heading>
        <Button variant="ghost" size="sm" onClick={() => navigate("/members")}>
          목록
        </Button>
      </HStack>
      <Card mb={4}>
        <CardBody>
          <VStack align="stretch" spacing={3}>
            <Text><strong>이름:</strong> {user.name}</Text>
            <Text><strong>이메일:</strong> {user.email}</Text>
            <Text><strong>거주지:</strong> {user.residence}</Text>
            <Text><strong>기수:</strong> {user.cohort}</Text>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>풋살 레벨</FormLabel>
              <Select
                w="200px"
                value={user.futsalLevel}
                onChange={(e) =>
                  updateLevelMutation.mutate(e.target.value)
                }
                isDisabled={updateLevelMutation.isPending}
              >
                {levelOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>현재 운영 기수</FormLabel>
              <Switch
                isChecked={user.isCurrentCohort}
                onChange={(e) =>
                  updateCohortMutation.mutate(e.target.checked)
                }
                isDisabled={updateCohortMutation.isPending}
              />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>역할</FormLabel>
              <Select
                w="150px"
                value={user.role}
                onChange={(e) =>
                  updateRoleMutation.mutate(e.target.value)
                }
                isDisabled={updateRoleMutation.isPending}
              >
                {roleOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
