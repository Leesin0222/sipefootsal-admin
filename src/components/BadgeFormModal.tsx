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
  VStack,
} from "@chakra-ui/react";
import type { BadgeResponse, BadgeCategory, BadgeGrade } from "@/types/api";
import { BADGE_CATEGORY_LABELS, BADGE_GRADE_LABELS } from "@/types/api";

interface BadgeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (body: {
    name: string;
    description: string;
    category: string;
    grade: string;
    imageUrl?: string;
    active?: boolean;
  }) => void;
  initial?: BadgeResponse | null;
  isLoading?: boolean;
}

export function BadgeFormModal({
  isOpen,
  onClose,
  onSubmit,
  initial = null,
  isLoading = false,
}: BadgeFormModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value;
    const description = (
      form.querySelector('[name="description"]') as HTMLInputElement
    )?.value;
    const category = (
      form.querySelector('[name="category"]') as HTMLSelectElement
    )?.value;
    const grade = (form.querySelector('[name="grade"]') as HTMLSelectElement)
      ?.value;
    const imageUrl = (
      form.querySelector('[name="imageUrl"]') as HTMLInputElement
    )?.value;
    if (!name || !description || !category || !grade) return;
    onSubmit({
      name,
      description,
      category,
      grade,
      imageUrl: imageUrl || undefined,
      active: initial?.active,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{initial ? "뱃지 수정" : "뱃지 추가"}</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>이름</FormLabel>
              <Input
                name="name"
                defaultValue={initial?.name}
                placeholder="뱃지 이름"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>설명</FormLabel>
              <Input
                name="description"
                defaultValue={initial?.description}
                placeholder="설명"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>카테고리</FormLabel>
              <Select
                name="category"
                defaultValue={initial?.category ?? "COHORT_PARTICIPATION"}
              >
                {(Object.entries(BADGE_CATEGORY_LABELS) as [BadgeCategory, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>등급</FormLabel>
              <Select name="grade" defaultValue={initial?.grade ?? "BRONZE"}>
                {(Object.entries(BADGE_GRADE_LABELS) as [BadgeGrade, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>이미지 URL</FormLabel>
              <Input
                name="imageUrl"
                defaultValue={initial?.imageUrl}
                placeholder="https://..."
              />
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
