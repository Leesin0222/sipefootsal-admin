import {
  Box,
  Flex,
  Heading,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  VStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { Outlet, Link as RouterLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { Sidebar } from "@/components/Sidebar";

const navItems = [
  { to: "/", label: "대시보드" },
  { to: "/schedules", label: "일정" },
  { to: "/members", label: "회원" },
  { to: "/invite-keys", label: "초대 키" },
  { to: "/notices", label: "공지사항" },
  { to: "/gallery", label: "갤러리" },
  { to: "/settlements", label: "정산" },
  { to: "/badges", label: "뱃지" },
];

export function AppLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const sidebarOpen = isOpen;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
      <Sidebar
        items={navItems}
        isOpen={sidebarOpen}
        onClose={onClose}
      />
      <Box
        as="aside"
        w={{ base: 0, md: "240px" }}
        minW={{ md: "240px" }}
        display={{ base: "none", md: "block" }}
        bg="gray.800"
        color="white"
        py={4}
      >
        <VStack align="stretch" spacing={1} px={3}>
          <Heading size="sm" px={3} mb={2}>
            사이풋살 어드민
          </Heading>
          {navItems.map((item) => (
            <ChakraLink
              key={item.to}
              as={RouterLink}
              to={item.to}
              px={3}
              py={2}
              borderRadius="md"
              _hover={{ bg: "gray.700" }}
            >
              {item.label}
            </ChakraLink>
          ))}
        </VStack>
      </Box>
      <Box flex={1} display="flex" flexDirection="column" minW={0}>
        <Flex
          as="header"
          h="56px"
          px={4}
          align="center"
          justify="space-between"
          bg="white"
          borderBottomWidth="1px"
          borderColor="gray.200"
        >
          <IconButton
            aria-label="메뉴"
            icon={<Box as="span">☰</Box>}
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
          />
          <Box flex={1} />
          <Menu>
            <MenuButton as={Box} cursor="pointer">
              <Text fontWeight="medium">관리자</Text>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Box as="main" flex={1} p={4} overflow="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
