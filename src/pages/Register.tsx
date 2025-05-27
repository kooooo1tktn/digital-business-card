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
  useToast,
  HStack,
  VStack,
  Container,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase/supabase";
import { useNavigate, Link } from "react-router-dom";
import { Skill } from "../types";

export const Register = () => {
  // useNavigateを使用してページ遷移を管理
  // useNavigateはReact Routerのフックで、ページ遷移をプログラム的に行うために使用
  const navigate = useNavigate();

  // 「好きな技術」を管理するstate
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // コンポーネントの初期表示時にスキル一覧を取得
  useEffect(() => {
    async function fetchSkills() {
      try {
        setIsLoading(true);
        // supabaseからskillsテーブルのデータを取得
        const { data, error } = await supabase.from("skills").select("*");
        // エラー処理
        if (error) {
          throw error;
        }
        // データが取得できた場合
        if (data) {
          setSkills(data);
        }
      } catch (error) {
        // エラー処理
        console.error("Error fetching skills;", error);
      } finally {
        // ローディング状態を解除
        setIsLoading(false);
      }
    }
    fetchSkills();
  }, [toast]);

  // フォームの型定義
  // FormDataはフォームのデータを型定義するためのインターフェース
  interface FormData {
    user_id: string;
    name: string;
    description: string;
    github_id?: string;
    qiita_id?: string;
    x_id?: string;
    skill_id: number;
  }

  // useFormを使用してフォームの状態を管理
  // register: フォームのフィールドを登録するための関数
  // handleSubmit: フォームの送信を処理するための関数
  // reset: フォームの値をリセットするための関数
  // formState: フォームの状態を管理するオブジェクト
  // errors: フォームのバリデーションエラーを管理するオブジェクト
  // mode: フォームのバリデーションのタイミングを指定するオプション
  // onBlur: フォームのフィールドがフォーカスを失ったときにバリデーションを実行
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ mode: "onBlur" });

  // フォームの送信処理
  const onSubmit = async (data: FormData) => {
    try {
      // 送信ボタンを押したときにローディング状態にする
      // これにより、ボタンが無効化されて二重送信を防ぐ
      setIsSubmitting(true);

      // データをコンソールに出力(デバッグ用)
      console.log("送信されたデータ:", data);

      // supabaseにデータを登録
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", data.user_id)
        .single();

      // エラーがない場合は既に存在するユーザー
      if (existingUser) {
        toast({
          title: "登録に失敗しました",
          description: "このユーザーIDは既に存在します。",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // PGRST116エラー（レコードが見つからない）以外のエラーの場合
      if (checkError && checkError.code !== "PGRST116") {
        console.error("ユーザーIDのチェック中にエラーが発生:", checkError);
        throw new Error(
          `ユーザーIDのチェック中にエラーが発生: ${checkError.message}`
        );
      }

      // usersテーブルに直接データを挿入
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({
          user_id: data.user_id,
          name: data.name,
          description: data.description,
          github_id: data.github_id || null,
          qiita_id: data.qiita_id || null,
          x_id: data.x_id || null,
        })
        .select()
        .single(); // .single()を使うことで、1件のデータのみを取得

      // ユーザー登録のエラー処理
      if (userError) {
        throw new Error(`ユーザー登録エラー: ${userError.message}`);
      }

      // user_skillテーブルにスキル情報を挿入
      const { error: skillError } = await supabase.from("user_skill").insert({
        user_id: newUser.user_id, // 新しく登録したユーザーのIDを使用
        skill_id: data.skill_id, // フォームから選択されたスキルID
      });

      // スキル登録のエラー処理
      if (skillError) {
        throw new Error(`スキル登録エラー: ${skillError.message}`);
      }

      // 成功時の処理
      toast({
        title: "登録成功",
        description: `名刺情報が登録されました。ID: ${newUser.user_id}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      reset(); // フォームをリセット
      navigate("/"); // 登録後にトップページにリダイレクト
    } catch (error) {
      // 予期しないエラーの処理
      console.error("エラーが発生しました:", error);
      toast({
        title: "エラー",
        description:
          error instanceof Error
            ? error.message
            : "予期しないエラーが発生しました",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // 最後にローディング状態を解除
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="800px" py={5}>
      <VStack spacing={4} align="stretch">
        <Heading>新規名刺登録</Heading>

        <Box p={6} borderWidth={1} borderRadius="lg" bg="white" shadow="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch">
              {/* ユーザーID入力欄 */}
              <FormControl isRequired>
                <FormLabel fontWeight={"bold"}>好きな英単語</FormLabel>
                <Input
                  {...register("user_id", {
                    required: "英単語の入力は必須です",
                  })}
                  type="text"
                  placeholder="coding"
                />
                <Text
                  mb={2}
                  textAlign={"left"}
                  fontWeight={"medium"}
                  color="red"
                >
                  {errors.user_id?.message}
                </Text>
              </FormControl>

              {/* 名前入力欄 */}
              <FormControl isRequired>
                <FormLabel fontWeight={"bold"}>お名前</FormLabel>
                <Input
                  {...register("name", { required: "名前の入力は必須です" })}
                  type="name"
                  placeholder="山田 太郎"
                />
                <Text
                  mb={2}
                  textAlign={"left"}
                  fontWeight={"medium"}
                  color="red"
                >
                  {errors.name?.message}
                </Text>
              </FormControl>

              {/* 自己紹介入力欄 */}
              <FormControl isRequired>
                <FormLabel fontWeight={"bold"}>自己紹介</FormLabel>
                <Textarea
                  {...register("description", {
                    required: "入力必須項目です",
                  })}
                  placeholder="HTMLタグが使えます"
                />
                <Text
                  mb={2}
                  textAlign={"left"}
                  fontWeight={"medium"}
                  color="red"
                >
                  {errors.description?.message}
                </Text>
              </FormControl>

              {/* 好きな技術選択欄 */}
              <FormControl isRequired>
                <FormLabel fontWeight={"bold"}>好きな技術</FormLabel>
                {isLoading ? (
                  <Text>読み込み中...</Text>
                ) : (
                  <Select
                    {...register("skill_id", {
                      valueAsNumber: true,
                      required: "入力必須項目です",
                    })}
                    placeholder="好きな技術を選択"
                  >
                    {skills.map((skill) => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </Select>
                )}
                <Text
                  mb={2}
                  textAlign={"left"}
                  fontWeight={"medium"}
                  color="red"
                >
                  {errors.skill_id?.message}
                </Text>
              </FormControl>

              {/* SNS ID入力欄 */}
              <FormControl>
                <FormLabel fontWeight={"bold"}>GitHub ID</FormLabel>
                <Input
                  {...register("github_id", {
                    pattern: {
                      value: /^[A-Za-z0-9_]+$/,
                      message: "英数字とアンダースコアのみで入力してください",
                    },
                  })}
                  type="name"
                  placeholder=""
                />
                <Text
                  mb={2}
                  textAlign={"left"}
                  fontWeight={"medium"}
                  color="red"
                >
                  {errors.github_id?.message}
                </Text>

                <FormLabel fontWeight={"bold"}>Qiita ID</FormLabel>
                <Input
                  {...register("qiita_id", {
                    pattern: {
                      value: /^[A-Za-z0-9_]+$/,
                      message: "英数字とアンダースコアのみで入力してください",
                    },
                  })}
                  type="name"
                  placeholder=""
                />
                <Text
                  mb={2}
                  textAlign={"left"}
                  fontWeight={"medium"}
                  color="red"
                >
                  {errors.qiita_id?.message}
                </Text>

                <FormLabel fontWeight={"bold"}>X ID</FormLabel>
                <Input
                  {...register("x_id", {
                    pattern: {
                      value: /^[A-Za-z0-9_]+$/,
                      message: "英数字とアンダースコアのみで入力してください",
                    },
                  })}
                  type="name"
                  placeholder="@は不要"
                />
                <Text
                  mb={2}
                  textAlign={"left"}
                  fontWeight={"medium"}
                  color="red"
                >
                  {errors.x_id?.message}
                </Text>
              </FormControl>

              {/* ボタンエリア */}
              <HStack spacing={4} mt={4}>
                <Button as={Link} to="/" colorScheme="gray" size="lg" flex="1">
                  戻る
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText="登録中..."
                  size="lg"
                  flex="1"
                >
                  登録する
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Container>
  );
};
