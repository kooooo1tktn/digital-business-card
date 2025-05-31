import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// 環境変数を読み込み
dotenv.config();

// Supabaseクライアントの作成
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

/**
 * 前日の日付を取得する関数
 * @returns 前日の日付文字列 (YYYY-MM-DD形式)
 */
function getYesterday(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split("T")[0];
}

/**
 * 前日に作成されたユーザーデータを削除する関数
 */
async function deletePreviousDayData() {
  try {
    const yesterday = getYesterday();
    console.log(`${yesterday}に作成されたデータを削除開始...`);

    // 前日に作成されたuser_skillデータを削除
    const { error: userSkillError } = await supabase
      .from("user_skill")
      .delete()

    if (userSkillError) {
      console.error("user_skill削除エラー:", userSkillError);
      throw userSkillError;
    }
    console.log("user_skillデータの削除が完了しました");

    // 前日に作成されたusersデータを削除
    const { error: usersError } = await supabase
      .from("users")
      .delete()

    if (usersError) {
      console.error("users削除エラー:", usersError);
      throw usersError;
    }

    console.log("usersデータの削除が完了しました");
    console.log(`${yesterday}のデータ削除処理が正常に完了しました`);
  } catch (error) {
    console.error("バッチ処理でエラーが発生しました", error);
    process.exit(1);
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log("=== 前日データ削除バッチ処理開始 ===");
  console.log(`実行時刻: ${new Date().toISOString()}`);

  await deletePreviousDayData();

  console.log("=== バッチ処理完了 ===");
  process.exit(0);
}

// スクリプトが直接実行された場合のみmain関数を実行
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
