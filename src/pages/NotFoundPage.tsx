import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Box textAlign="center" py={16}>
      <Heading size="2xl" mb={4}>
        404
      </Heading>
      <Text mb={6}>페이지를 찾을 수 없습니다.</Text>
      <Button as={Link} to="/" colorScheme="blue">
        대시보드로
      </Button>
    </Box>
  );
}
