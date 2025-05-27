import { useParams, Link } from "react-router-dom";
import { useGetUserById } from "../hooks/useSupabaseData";
import { createProfileLink } from "../utils/linkFactory";
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { SiQiita } from "react-icons/si";
import { BsTwitterX } from "react-icons/bs";

export const UserDetail = () => {
  // useParamsを使用してURLパラメータからIDを取得
  // useParamsはReact Routerのフックで、URLパラメータを取得するために使用
  // useParamsは、URLのパラメータを取得するためのフック
  const { id } = useParams<{ id: string }>();
  // React Queryを使用してデータを取得する
  // useGetUserByIdは、指定されたIDのユーザー情報を取得するカスタムフック
  // useGetUserByIdは、Supabaseからユーザー情報を取得するためのカスタムフック
  const { data, isLoading, error } = useGetUserById(id);

  // IDがundefinedか、読み込み中、またはエラーがあれば「Loading...」と表示
  if (!id || isLoading || error) return <div>Loading...</div>;
  // データがない場合も「Loading...」と表示
  if (!data) return <div>Loading...</div>;

  return (
    <Box p={5} maxWidth="800px" mx="auto">
      {/* ユーザー詳細情報 */}
      <Card mb={4}>
        <CardBody>
          <Heading as="h2" size="lg" mb={2} textAlign={"left"}>
            {data.name}
          </Heading>

          <Box mt={4}>
            <Heading as="h3" size="md" mb={2} textAlign={"left"}>
              自己紹介
            </Heading>
            <Text
              mb={4}
              textAlign={"left"}
              dangerouslySetInnerHTML={{
                __html: data.description || "自己紹介はありません",
              }}
            />
          </Box>

          {data.user_skill && data.user_skill.length > 0 && (
            <Box mt={4}>
              <Heading as="h3" size="md" mb={2} textAlign={"left"}>
                好きな技術
              </Heading>
              <Text textAlign={"left"}>
                {data.user_skill.map((skill) => skill.skills.name).join(", ")}
              </Text>
            </Box>
          )}

          <Box mt={6}>
            <Heading as="h3" size="md" mb={2} textAlign={"left"}>
              SNS
            </Heading>
            <Box display="flex" gap={4}>
              {data.github_id ? (
                <Button
                  as="a"
                  href={createProfileLink("github", data.github_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="#333"
                  variant="outline"
                  aria-label="GitHub"
                  size={"md"}
                  borderRadius={"md"}
                >
                  <FaGithub size="1.5em" color="#333" />
                </Button>
              ) : null}

              {data.qiita_id ? (
                <Button
                  as="a"
                  href={createProfileLink("qiita", data.qiita_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="green"
                  variant="outline"
                  aria-label="Qiita"
                  size={"md"}
                  borderRadius={"md"}
                >
                  <SiQiita size="1.5em" color="#55C500" />
                </Button>
              ) : null}

              {data.x_id ? (
                <Button
                  as="a"
                  href={createProfileLink("X", data.x_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="000000"
                  variant="outline"
                  aria-label="X (Twitter)"
                  size="md"
                  borderRadius="md"
                >
                  <BsTwitterX size="1.5em" color="#000000" />
                </Button>
              ) : null}
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Divider my={6} />

      {/* トップページに戻るボタン */}
      <Button as={Link} to="/" colorScheme="gray" width="full">
        戻る
      </Button>
    </Box>
  );
};
