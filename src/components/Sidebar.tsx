import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
}

interface SidebarProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ items, isOpen, onClose }: SidebarProps) {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">사이풋살 어드민</DrawerHeader>
        <DrawerBody>
          <VStack align="stretch" spacing={1}>
            {items.map((item) => (
              <ChakraLink
                key={item.to}
                as={RouterLink}
                to={item.to}
                px={3}
                py={2}
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
                onClick={onClose}
              >
                {item.label}
              </ChakraLink>
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
