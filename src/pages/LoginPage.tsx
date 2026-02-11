import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  sendVerificationEmail,
  verifyEmail,
  login,
} from "@/api/auth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code" | "login">("email");
  const [sentEmail, setSentEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const sendEmailMutation = useMutation({
    mutationFn: () => sendVerificationEmail(email),
    onSuccess: (res) => {
      if (res.success) {
        setSentEmail(email);
        setStep("code");
        toast({ title: "인증번호가 발송되었습니다.", status: "success" });
      } else {
        toast({ title: res.message || "발송 실패", status: "error" });
      }
    },
    onError: () => {
      toast({ title: "이메일 발송에 실패했습니다.", status: "error" });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: () => verifyEmail(email, code),
    onSuccess: (res) => {
      if (res.success) {
        setStep("login");
        toast({ title: "인증이 완료되었습니다.", status: "success" });
      } else {
        toast({ title: res.message || "인증 실패", status: "error" });
      }
    },
    onError: () => {
      toast({ title: "인증번호 확인에 실패했습니다.", status: "error" });
    },
  });

  const loginMutation = useMutation({
    mutationFn: () => login(email, code),
    onSuccess: (res) => {
      if (res.success) {
        toast({ title: "로그인되었습니다.", status: "success" });
        navigate(from, { replace: true });
      } else {
        toast({ title: res.message || "로그인 실패", status: "error" });
      }
    },
    onError: () => {
      toast({ title: "로그인에 실패했습니다.", status: "error" });
    },
  });

  const handleSendCode = () => {
    if (!email.trim()) {
      toast({ title: "이메일을 입력하세요.", status: "warning" });
      return;
    }
    sendEmailMutation.mutate();
  };

  const handleVerify = () => {
    if (!code.trim()) {
      toast({ title: "인증번호를 입력하세요.", status: "warning" });
      return;
    }
    verifyMutation.mutate();
  };

  const handleLogin = () => {
    loginMutation.mutate();
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Card w="full" maxW="400px">
        <CardBody>
          <Heading size="md" mb={4}>
            사이풋살 어드민 로그인
          </Heading>
          <Stack spacing={4}>
            {step === "email" && (
              <>
                <Box>
                  <Text mb={2}>이메일</Text>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
                <Button
                  colorScheme="blue"
                  onClick={handleSendCode}
                  isLoading={sendEmailMutation.isPending}
                >
                  인증번호 발송
                </Button>
              </>
            )}
            {step === "code" && (
              <>
                <Text fontSize="sm" color="gray.600">
                  {sentEmail} 로 인증번호를 발송했습니다.
                </Text>
                <Box>
                  <Text mb={2}>인증번호</Text>
                  <Input
                    placeholder="6자리 인증번호"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </Box>
                <Button
                  colorScheme="blue"
                  onClick={handleVerify}
                  isLoading={verifyMutation.isPending}
                >
                  인증하기
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setStep("email")}>
                  이메일 변경
                </Button>
              </>
            )}
            {step === "login" && (
              <>
                <Text fontSize="sm" color="gray.600">
                  인증이 완료되었습니다. 로그인하세요.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={handleLogin}
                  isLoading={loginMutation.isPending}
                >
                  로그인
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setStep("email")}>
                  다른 계정으로
                </Button>
              </>
            )}
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
