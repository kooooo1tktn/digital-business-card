import { render, screen } from "@testing-library/react";
import { UserDetail } from "../pages/UserDetail";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserById } from "../hooks/useSupabaseData";
import { useForm } from "react-hook-form";
import { Register } from "../pages/Register";
import * as supabaseModule from "../services/supabase/supabase";

// React Router のモック
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
  Link: jest.fn().mockImplementation(({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  )),
}));

// React Hook Form のモック
jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

// カスタムフックのモック
jest.mock("../hooks/useSupabaseData", () => ({
  useGetUserById: jest.fn(),
}));

describe("名刺カードの確認", () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ユーザーデータが表示されている", () => {
    // テスト用のユーザーデータ
    const mockUser = {
      user_id: "sample-id",
      name: "サンプルユーザー",
      description: "これはテスト用の説明文です",
      github_id: "sample-github",
      qiita_id: "sample-qiita",
      x_id: "sample-x",
      user_skill: [{ skills: { id: 1, name: "React" } }],
    };

    // useParamsのモック実装
    (useParams as jest.Mock).mockReturnValue({ id: "sample-id" });

    // useGetUserByIdのモック実装（データ取得完了）
    (useGetUserById as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    });

    render(<UserDetail />);
    // 名前が表示されていることを確認
    expect(screen.getByText(`${mockUser.name}`)).toBeInTheDocument();
    // 自己紹介が表示されていることを確認
    expect(screen.getByText(`自己紹介`)).toBeInTheDocument();
    expect(screen.getByText(mockUser.description)).toBeInTheDocument();
    // 好きな技術が表示されていることを確認
    expect(screen.getByText(`好きな技術`)).toBeInTheDocument();
    expect(
      screen.getByText(mockUser.user_skill[0].skills.name)
    ).toBeInTheDocument();
    expect(screen.getByText(`SNS`)).toBeInTheDocument();
    // GitHubアイコンが正しく表示されていることを確認
    const githubLink = screen.getByLabelText("GitHub").closest("a");
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/sample-github"
    );
    // Qiitaアイコンが正しく表示されていることを確認
    const qiitaLink = screen.getByLabelText("Qiita").closest("a");
    expect(qiitaLink).toBeInTheDocument();
    expect(qiitaLink).toHaveAttribute("href", "https://qiita.com/sample-qiita");
    // Xアイコンが正しく表示されていることを確認
    const xLink = screen.getByLabelText("X (Twitter)").closest("a");
    expect(xLink).toBeInTheDocument();
    expect(xLink).toHaveAttribute("href", "https://twitter.com/sample-x");
  });

  it("戻るボタンをクリックすると/に遷移する", () => {
    // テスト用のユーザーデータ（既存の mockUser オブジェクトを再利用するか、再定義する）
    const mockUser = {
      user_id: "sample-id",
      name: "サンプルユーザー",
      description: "これはテスト用の説明文です",
      github_id: "sample-github",
      qiita_id: "sample-qiita",
      x_id: "sample-x",
      user_skill: [{ skills: { id: 1, name: "React" } }],
    };

    // useParamsのモック実装
    (useParams as jest.Mock).mockReturnValue({ id: "sample-id" });

    // useGetUserByIdのモック実装（有効なデータを返す）
    (useGetUserById as jest.Mock).mockReturnValue({
      data: mockUser, // null ではなく mockUser を設定
      isLoading: false,
      error: null,
    });

    render(<UserDetail />);
    // 戻るボタンが表示されていることを確認
    const backButton = screen.getByText("戻る");
    expect(backButton).toBeInTheDocument();

    // ボタンがクリックされたときの挙動を確認
    const linkElement = backButton.closest("a");
    expect(linkElement).toHaveAttribute("href", "/");
  });
});

describe("名刺登録ページの確認", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("タイトルが表示されている", () => {
    // useFormのモック実装
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      formState: { errors: {} },
    });

    // useNavigateのモック実装
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());

    // スキルデータのモック
    jest.spyOn(supabaseModule.supabase, "from").mockImplementation(() => {
      const mockBuilder = {
        select: jest.fn().mockReturnValue({
          data: [{ id: 1, name: "React" }],
          error: null,
        }),
      };
      return mockBuilder as unknown as ReturnType<
        typeof supabaseModule.supabase.from
      >;
    });

    render(<Register />);

    // タイトルが表示されていることを確認
    expect(screen.getByText("新規名刺登録")).toBeInTheDocument();
  });

  it("全項目入力して登録ボタンを押すと/に遷移する", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // フォーム送信を実際に実行するモック
    let formSubmitCallback: any;

    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(() => ({})),
      handleSubmit: jest.fn((callback) => {
        formSubmitCallback = callback;
        return jest.fn((e) => {
          e?.preventDefault?.();
          return formSubmitCallback({
            name: "テストユーザー",
            description: "テスト説明",
            github_id: "test-github",
            qiita_id: "test-qiita",
            x_id: "test-x",
            skill_id: 1,
          });
        });
      }),
      reset: jest.fn(),
      formState: { errors: {} },
      watch: jest.fn(),
      setValue: jest.fn(),
      getValues: jest.fn(),
    });

    // スキルデータ取得のモック
    jest.spyOn(supabaseModule.supabase, "from").mockImplementation((table) => {
      if (table === "skills") {
        return {
          select: jest.fn().mockReturnValue({
            data: [{ id: 1, name: "React" }],
            error: null,
          }),
        } as unknown as ReturnType<typeof supabaseModule.supabase.from>;
      }

      if (table === "users") {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { code: "PGRST116" }, // ユーザーが存在しない
              }),
            }),
          }),
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { user_id: "test-user-id" },
                error: null,
              }),
            }),
          }),
        } as unknown as ReturnType<typeof supabaseModule.supabase.from>;
      }

      if (table === "user_skill") {
        return {
          insert: jest.fn().mockResolvedValue({
            data: [{ user_id: "test-user-id", skill_id: 1 }],
            error: null,
          }),
        } as unknown as ReturnType<typeof supabaseModule.supabase.from>;
      }

      return {} as unknown as ReturnType<typeof supabaseModule.supabase.from>;
    });

    render(<Register />);

    // フォーム送信を直接実行
    await formSubmitCallback({
      name: "テストユーザー",
      description: "テスト説明",
      github_id: "test-github",
      qiita_id: "test-qiita",
      x_id: "test-x",
      skill_id: 1,
    });

    // 非同期処理の完了を待つ
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
