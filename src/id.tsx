import { useParams } from "react-router-dom";
import { useGetUserById } from "./hooks/useSupabaseData";

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
          <div>
            <p>名前: {data.name}</p>
            <p>自己紹介: {data.description}</p>
            {data.user_skill?.map((skill) => {
              return <p key={skill.skills.id}>スキル: {skill.skills.name}</p>;
            })}
            <p>GitHub: {data.github_id}</p>
            <p>Qiita: {data.qiita_id}</p>
            <p>X: {data.x_id}</p>
          </div>
        </div>
      </div>
    </>
  );
};
