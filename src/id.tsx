import { useParams } from "react-router-dom";
import { useGetUserById } from "./hooks/useSupabaseData";
import { createProfileLink } from "./utils/linkFactory";
import { Card, CardBody, Text } from "@chakra-ui/react";

export const Id = () => {
  const { id } = useParams<{ id: string }>();
  // React Queryを使用してデータを取得する
  const { data, isLoading, error } = useGetUserById(id);
  // IDがundefinedか、読み込み中、またはエラーがあれば「Loading...」と表示
  if (!id || isLoading || error) return <div>Loading...</div>;
  // データがない場合も「Loading...」と表示
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <div>
        <div key={data.user_id}>
          <Card>
            <CardBody>
              <Text>{data.name}</Text>
              <Text>自己紹介</Text>
              <div
                dangerouslySetInnerHTML={{ __html: data.description || "" }}
              />
              {data.user_skill?.map((skill) => {
                return (
                  <p key={skill.skills.id}>好きな技術: {skill.skills.name}</p>
                );
              })}
              <Text>
                {" "}
                {data.github_id ? (
                  <a
                    href={createProfileLink("github", data.github_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                ) : (
                  "なし"
                )}
              </Text>
              <Text>
                {" "}
                {data.qiita_id ? (
                  <a
                    href={createProfileLink("qiita", data.qiita_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Qiita
                  </a>
                ) : (
                  "なし"
                )}
              </Text>
              <Text>
                {" "}
                {data.x_id ? (
                  <a
                    href={createProfileLink("X", data.x_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    X
                  </a>
                ) : (
                  "なし"
                )}
              </Text>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};
