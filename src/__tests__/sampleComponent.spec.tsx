// filepath: /Users/home/digital-business-card/src/__tests__/sampleComponent.spec.tsx
import { render, screen } from "@testing-library/react";
import { Id } from "../id";
import { useParams } from "react-router-dom";
import { useGetUserById } from "../hooks/useSupabaseData";

// React Router のモック
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));

// カスタムフックのモック
jest.mock("../hooks/useSupabaseData", () => ({
  useGetUserById: jest.fn(),
}));

describe("Id コンポーネント", () => {
  // テスト前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ローディング状態を表示する", () => {
    // useParamsのモック実装
    (useParams as jest.Mock).mockReturnValue({ id: "test-id" });
    // useGetUserByIdのモック実装（ローディング中）
    (useGetUserById as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<Id />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("エラー時にローディングを表示する", () => {
    // useParamsのモック実装
    (useParams as jest.Mock).mockReturnValue({ id: "test-id" });
    // useGetUserByIdのモック実装（エラー発生）
    (useGetUserById as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("テストエラー"),
    });

    render(<Id />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("IDがない場合にローディングを表示する", () => {
    // useParamsのモック実装（idなし）
    (useParams as jest.Mock).mockReturnValue({});
    // useGetUserByIdのモック実装
    (useGetUserById as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<Id />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("ユーザーデータを表示する", () => {
    // テスト用のユーザーデータ
    const mockUser = {
      user_id: "sample-id",
      name: "サンプルユーザー",
      description: "これはテスト用の説明文です",
      github_id: "sample-github",
      qiita_id: "sample-qiita",
      x_id: "sample-x",
      user_skill: [
        { skills: { id: 1, name: "React" } },
      ],
    };

    // useParamsのモック実装
    (useParams as jest.Mock).mockReturnValue({ id: "sample-id" });
    // useGetUserByIdのモック実装（データ取得完了）
    (useGetUserById as jest.Mock).mockReturnValue({
      data: mockUser,
      isLoading: false,
      error: null,
    });

    render(<Id />);
    // ユーザー情報が表示されていることを確認
    expect(screen.getByText(`${mockUser.name}`)).toBeInTheDocument();
    expect(
      screen.getByText(`自己紹介`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockUser.description)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`GitHub`)
    ).toBeInTheDocument();
    expect(screen.getByText(`Qiita`)).toBeInTheDocument();
    expect(screen.getByText(`X`)).toBeInTheDocument();

    // スキル情報も表示されていることを確認
    expect(screen.getByText(`好きな技術: React`)).toBeInTheDocument();
  });
});
