import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface InviteKeyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function InviteKeyCreateModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: InviteKeyCreateModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>초대 키 생성</ModalHeader>
        <ModalBody>
          새 초대 키를 1개 생성합니다. 생성 후 목록에서 확인할 수 있습니다.
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="blue" onClick={onConfirm} isLoading={isLoading}>
            생성
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
