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
  Select,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import type { NoticeResponse } from "@/types/api";

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (body: {
    title: string;
    content: string;
    importance: string;
  }) => void;
  initial?: NoticeResponse | null;
  isLoading?: boolean;
}

export function NoticeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initial = null,
  isLoading = false,
}: NoticeFormModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.querySelector('[name="title"]') as HTMLInputElement)
      ?.value;
    const content = (
      form.querySelector('[name="content"]') as HTMLTextAreaElement
    )?.value;
    const importance = (
      form.querySelector('[name="importance"]') as HTMLSelectElement
    )?.value;
    if (!title || !content || !importance) return;
    onSubmit({ title, content, importance });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{initial ? "공지 수정" : "공지 작성"}</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>제목</FormLabel>
              <Input
                name="title"
                defaultValue={initial?.title}
                placeholder="제목"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>내용</FormLabel>
              <Textarea
                name="content"
                defaultValue={initial?.content}
                placeholder="내용"
                rows={6}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>중요도</FormLabel>
              <Select
                name="importance"
                defaultValue={initial?.importance ?? "NORMAL"}
              >
                <option value="LOW">낮음</option>
                <option value="NORMAL">보통</option>
                <option value="HIGH">높음</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="blue" type="submit" isLoading={isLoading}>
            {initial ? "수정" : "저장"}
          </Button>
        </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
