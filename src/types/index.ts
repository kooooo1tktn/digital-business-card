// ユーザー情報の型定義
export interface User {
  user_id: string | number;
  user_skill: UserSkill[];
  // オプショナルプロパティ
  name?: string;
  description?: string;
  github_id?: string | null;
  qiita_id?: string | null;
  x_id?: string | null;
}

// スキル情報の型定義
export interface Skill {
  id: number | string;
  name: string;
}

// ユーザーとスキルを紐づける中間テーブルの型定義
export interface UserSkill {
  skills: Skill;
}
