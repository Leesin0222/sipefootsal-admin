import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

interface CancelScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function CancelScheduleModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelScheduleModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>일정 취소</ModalHeader>
        <ModalBody>
          <Textarea
            placeholder="취소 사유 (필수)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            닫기
          </Button>
          <Button
            colorScheme="red"
            onClick={handleConfirm}
            isLoading={isLoading}
            isDisabled={!reason.trim()}
          >
            취소 확정
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
