import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Divider,
} from "@chakra-ui/react";

export const Cards = () => {
  // ユーザーID入力用の状態
  const [userId, setUserId] = useState("");
  // 入力エラー表示用の状態
  const [inputError, setInputError] = useState("");
  // ページ遷移用のフック
  const navigate = useNavigate();

  // 検索ボタンをクリックしたときの処理
  const handleSearch = () => {
    if (!userId.trim()) {
      setInputError("ユーザーIDを入力してください");
      return;
    }

    // 入力されたIDのページに遷移
    navigate(`/cards/${userId}`);
  };

  // 新規登録ボタンをクリックした時の処理
  const handleRegister = () => {
    // 新規登録ページに遷移
    navigate("/cards/register");
  };

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      <Heading as="h1" mb={6}>
        デジタル名刺アプリ
      </Heading>

      {/* ユーザーID検索フォーム */}
      <Box
        borderWidth={1}
        borderRadius="lg"
        p={4}
        mb={6}
        bg="white"
        shadow="md"
      >
        <FormControl>
          <FormLabel>ID</FormLabel>
          <VStack>
            <Input
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setInputError("");
              }}
              placeholder="ユーザーIDを入力"
            />
            <Button colorScheme="blue" onClick={handleSearch} width="full">
              名刺を見る
            </Button>
          </VStack>
          {inputError && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {inputError}
            </Text>
          )}
        </FormControl>
      </Box>

      <Divider my={6} />

      {/* 登録ページへのリンク */}
      <Box mb={6}>
        <Button
          colorScheme="green"
          onClick={handleRegister}
          size="lg"
          width="full"
        >
          新規登録はこちら
        </Button>
      </Box>
    </Box>
  );
};
