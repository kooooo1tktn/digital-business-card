import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export const Register = () => {
  interface FormData {
    name: string;
    description: string;
    skills: string;
    github_id?: string;
    qiita_id?: string;
    x_id?: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });

  return (
    <>
      <Heading mb={4}>新規名刺登録</Heading>
      <Box p={4} borderWidth={1} borderRadius="lg">
        {/* 必須項目 */}
        <FormControl isRequired>
          <FormLabel fontWeight={"bold"}>お名前</FormLabel>
          <Input
            {...register("name", { required: "名前の入力は必須です" })}
            type="name"
            placeholder="山田 太郎"
          />
          <Text mb={2} textAlign={"left"} fontWeight={"medium"} color="red">
            {errors.name?.message}
          </Text>
        </FormControl>
        {/* 必須項目 */}
        <FormControl isRequired>
          <FormLabel fontWeight={"bold"}>自己紹介</FormLabel>
          <Textarea
            {...register("description", {
              required: "自己紹介の入力は必須です",
            })}
            isInvalid
            placeholder="よろしくお願いします"
          />
          <Text mb={2} textAlign={"left"} fontWeight={"medium"} color="red">
            {errors.description?.message}
          </Text>
        </FormControl>
        {/* 必須項目 */}
        <FormControl isRequired>
          <FormLabel fontWeight={"bold"}>好きな技術</FormLabel>
          <Select
            {...register("skills", { required: "好きな技術の選択は必須です" })}
            placeholder="好きな技術を選択"
          >
            <option>React</option>
            <option>TypeScript</option>
            <option>GitHub</option>
          </Select>
          <Text mb={2} textAlign={"left"} fontWeight={"medium"} color="red">
            {errors.skills?.message}
          </Text>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel fontWeight={"bold"}>GitHub ID</FormLabel>
          <Input
            {...register("github_id", {
              required: "GitHubのIDを入力してください",
              pattern: {
                value: /^[A-Za-z0-9_]+$/,
                message: "英字のみで入力してください",
              },
            })}
            type="name"
          />
          <Text mb={2} textAlign={"left"} fontWeight={"medium"} color="red">
            {errors.github_id?.message}
          </Text>
          <FormLabel fontWeight={"bold"}>Qiita ID</FormLabel>
          <Input
            {...register("qiita_id", {
              required: "QiitaのIDを入力してください",
              pattern: {
                value: /^[A-Za-z0-9_]+$/,
                message: "英字のみで入力してください",
              },
            })}
            type="name"
          />
          <Text mb={2} textAlign={"left"} fontWeight={"medium"} color="red">
            {errors.qiita_id?.message}
          </Text>
          <FormLabel fontWeight={"bold"}>X ID</FormLabel>
          <Input
            {...register("x_id", {
              required: "XのIDを入力してください",
              pattern: {
                value: /^[A-Za-z0-9_]+$/,
                message: "英字のみで入力してください",
              },
            })}
            type="name"
          />
        </FormControl>
        <Text mb={2} textAlign={"left"} fontWeight={"medium"} color="red">
          {errors.x_id?.message}
        </Text>
        <Button colorScheme="blue">登録</Button>
      </Box>
    </>
  );
};
