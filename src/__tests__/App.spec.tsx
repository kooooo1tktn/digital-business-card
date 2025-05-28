import { fireEvent, render, screen } from "@testing-library/react";
import { UserDetail } from "../pages/UserDetail";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserById } from "../hooks/useSupabaseData";
import { useForm } from "react-hook-form";
import { Register } from "../pages/Register";
import * as supabaseModule from "../services/supabase/supabase";
import { Cards } from "../pages/Cards";

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

    type FormData = {
      name: string;
      description: string;
      github_id: string;
      qiita_id: string;
      x_id: string;
      skill_id: number;
    };

    // フォーム送信を実際に実行するモック
    let formSubmitCallback: ((data: FormData) => Promise<void>) | undefined;

    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(() => ({})),
      handleSubmit: jest.fn((callback) => {
        formSubmitCallback = callback;
        return jest.fn((e) => {
          e?.preventDefault?.();
          return callback({
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
                data: { user_id: "test-user-id", name: "テストユーザー" },
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

    // formSubmitCallbackが初期化されているかチェック
    if (!formSubmitCallback) {
      throw new Error("formSubmitCallback was not initialized");
    }

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

  // IDが未入力時にエラ-メッセージが表示されることを確認
  it("IDが未入力の場合、エラーメッセージが表示される", () => {
    // useFormのモック実装
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      formState: {
        errors: {
          user_id: { type: "required", message: "英単語の入力は必須です" },
        },
      },
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

    // エラ-メッセージが表示されていることを確認
    expect(screen.getByText("英単語の入力は必須です")).toBeInTheDocument();
  });

  // 名前が未入力時にエラーメッセージが表示されることを確認
  it("名前が未入力の場合、エラ-メッセージが表示される", () => {
    // useFormのモック実装
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      formState: {
        errors: {
          name: { type: "required", message: "名前の入力は必須です" },
        },
      },
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

    // エラーメッセージが表示されていることを確認
    expect(screen.getByText("名前の入力は必須です")).toBeInTheDocument();
  });

  // 自己紹介が未入力時にエラーメッセージが表示されることを確認
  it("自己紹介が未入力の場合、エラーメッセージが表示される", () => {
    // useFormのモック実装
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      formState: {
        errors: {
          description: {
            type: "required",
            message: "自己紹介の入力は必須です",
          },
        },
      },
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

    // エラーメッセージが表示されていることを確認
    expect(screen.getByText("自己紹介の入力は必須です")).toBeInTheDocument();
  });

  // オプション未選択時にエラーメッセージが表示されること確認
  it("オプション未選択の場合、エラーメッセージが表示される", () => {
    // useFormのモック実装
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(),
      reset: jest.fn(),
      formState: {
        errors: {
          skill_id: { type: "required", message: "入力必須項目です" },
        },
      },
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

    // エラーメッセージが表示されていることを確認
    expect(screen.getByText("入力必須項目です")).toBeInTheDocument();
  });

  describe("トップページの確認", () => {
    it("タイトルが表示されている", () => {
      render(<Cards />);
      // タイトルが表示されていることを確認
      expect(screen.getByText("デジタル名刺アプリ")).toBeInTheDocument();
    });
    // IDを入力してボタンを押すと/cards/:idに遷移する(useNavigateのパスをみる)
    it("IDを入力してボタンを押すと/cards/:idに遷移する", () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

      render(<Cards />);

      // ID入力フィールドを取得
      const userIdInput = screen.getByPlaceholderText("ユーザーIDを入力");
      // 検索ボタンを取得
      const searchButton = screen.getByText("名刺を見る");

      // IDを入力
      fireEvent.change(userIdInput, { target: { value: "sample-id" } });
      // 検索ボタンをクリック
      fireEvent.click(searchButton);

      // /cards/sample-idに遷移することを確認
      expect(mockNavigate).toHaveBeenCalledWith("/cards/sample-id");
    });

    // IDを未入力でボタンを押すとエラーメッセージが表示される
    it("IDを未入力でボタンを押すとエラーメッセージが表示される", () => {
      render(<Cards />);

      // 検索ボタンを取得
      const searchButton = screen.getByText("名刺を見る");

      // 検索ボタンをクリック
      fireEvent.click(searchButton);

      // エラーメッセージが表示されていることを確認
      expect(
        screen.getByText("ユーザーIDを入力してください")
      ).toBeInTheDocument();
    });

    // 新規登録はこちらを押すと/cards/registerに遷移する
    it("新規登録はこちらを押すと/cards/registerに遷移する", () => {
      const mockNavigate = jest.fn();
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

      render(<Cards />);

      // 新規登録リンクを取得
      const registerLink = screen.getByText("新規登録はこちら");

      // リンクをクリック
      fireEvent.click(registerLink);

      // /cards/registerに遷移することを確認
      expect(mockNavigate).toHaveBeenCalledWith("/cards/register");
    });
  });
});
