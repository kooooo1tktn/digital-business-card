import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";

export const Register = () => {
  return (
    <>
      <Heading mb={4}>新規名刺登録</Heading>
      <Box p={4} borderWidth={1} borderRadius="lg">
        <FormControl isRequired>
          <FormLabel fontWeight={"bold"}>お名前</FormLabel>
          <Input type="name" placeholder="山田 太郎" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontWeight={"bold"}>自己紹介</FormLabel>
          <Textarea isInvalid placeholder="よろしくお願いします" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontWeight={"bold"}>好きな技術</FormLabel>
          <Select placeholder="好きな技術を選択">
            <option>React</option>
            <option>TypeScript</option>
            <option>GitHub</option>
          </Select>
        </FormControl>
        <FormControl mb={4}>
          <FormLabel fontWeight={"bold"}>GitHub ID</FormLabel>
          <Input type="name" />
          <FormLabel fontWeight={"bold"}>Qiita ID</FormLabel>
          <Input type="name" />
          <FormLabel fontWeight={"bold"}>X ID</FormLabel>
          <Input type="name" />
        </FormControl>
        <Button colorScheme="blue">登録</Button>
      </Box>
    </>
  );
};
