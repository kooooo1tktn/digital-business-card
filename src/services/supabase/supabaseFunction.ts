import { supabase } from "./supabase";

// usersテーブルからuser_idを取得し、user_skillテーブルを経由して任意のユーザーに紐づけられたskillsテーブルのidとnameも一緒に取得する
export async function getSupabase() {
  const { data, error } = await supabase
    .from("users")
    .select(
      `user_id,name,description,github_id,qiita_id,x_id,user_skill(skills(id,name))`
    );
  if (error) {
    console.error(`Error fetching user data: ${error.message}`, error);
    throw new Error(`データ取得エラー: ${error.message}`);
  } else {
    console.log("User Data:", data);
    return data;
  }
}

// 特定のuser_idを持つユーザーのデータを取得する関数
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select(
      `user_id,name,description,github_id,qiita_id,x_id,user_skill(skills(id,name))`
    )
    .eq("user_id", userId)
    .single();
  if (error) {
    if (error.code === "PGRST116") {
      // レコードが見つからない場合のエラー
      console.error(`ユーザーが見つかりません: ${userId}`);
      throw new Error(`ユーザーが見つかりません: ${userId}`);
    }
    console.error(`Error fetching user data: ${error.message}`, error);
    throw new Error(`データ取得エラー: ${error.message}`);
  }
  if (!data) {
    // データが空の場合(通常は.single()でエラーになるはずだが、念のため)
    throw new Error(`データが見つかりません: ${userId}`);
  }
  console.log("User Data:", data);
  return data;
}
