import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  VStack,
} from "@chakra-ui/react";
import type { ScheduleCreateRequest } from "@/api/schedules";

interface ScheduleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (body: ScheduleCreateRequest) => void;
  isLoading?: boolean;
}

export function ScheduleFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: ScheduleFormModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const dateTime =
      (form.querySelector('[name="dateTime"]') as HTMLInputElement)?.value || "";
    const location =
      (form.querySelector('[name="location"]') as HTMLInputElement)?.value || "";
    const minParticipants = Number(
      (form.querySelector('[name="minParticipants"]') as HTMLInputElement)?.value || 1
    );
    const firstVoteDeadline =
      (form.querySelector('[name="firstVoteDeadline"]') as HTMLInputElement)?.value ||
      "";
    const memo =
      (form.querySelector('[name="memo"]') as HTMLInputElement)?.value || "";
    const generalMemberAllowed =
      (form.querySelector('[name="generalMemberAllowed"]') as HTMLInputElement)?.checked ??
      false;
    if (!dateTime || !location || !firstVoteDeadline) return;
    onSubmit({
      dateTime: new Date(dateTime).toISOString(),
      location,
      minParticipants,
      firstVoteDeadline: new Date(firstVoteDeadline).toISOString(),
      memo: memo || undefined,
      generalMemberAllowed,
    });
  };

  const now = new Date();
  const defaultDateTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  const defaultDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>일정 추가</ModalHeader>
          <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>날짜/시간</FormLabel>
              <Input
                name="dateTime"
                type="datetime-local"
                defaultValue={defaultDateTime}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>장소</FormLabel>
              <Input name="location" placeholder="장소" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>최소 인원</FormLabel>
              <Input
                name="minParticipants"
                type="number"
                min={1}
                defaultValue={1}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>1차 투표 마감일</FormLabel>
              <Input
                name="firstVoteDeadline"
                type="datetime-local"
                defaultValue={defaultDeadline}
              />
            </FormControl>
            <FormControl>
              <FormLabel>메모</FormLabel>
              <Input name="memo" placeholder="메모 (선택)" />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>일반 회원 참여 허용</FormLabel>
              <Switch name="generalMemberAllowed" defaultChecked={false} />
            </FormControl>
          </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              취소
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              저장
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
