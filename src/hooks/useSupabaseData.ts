import { useQuery } from "@tanstack/react-query";
import { User } from "../types";
import { getSupabase, getUserById } from "../services/supabase/supabaseFunction";

// ユーザーデータを取得するためのカスタムフック
export function useGetUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const rawData = await getSupabase();
      return rawData as unknown as User[];
    },
  });
}

// 特定IDのユーザーデータを取得するカスタムフック
export function useGetUserById(userId: string | undefined) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) {
        // IDが未定義の場合は処理を中断
        throw new Error("ユーザーIDが指定されていません");
      }
      const userData = await getUserById(userId);
      // データが取得できなかった場合もエラーとする(supabaseFunction.tsで処理)
      return userData as unknown as User;
    },
    // userIdが存在する場合のみをクエリを実行(undefined or nullの場合は実行しない)
    enabled: !!userId,
    // ネットワークエラーなどの場合に自動でリトライする回数
    retry: 1,
  });
}
