# デジタル名刺アプリ 💳

## このアプリでできること 🎯
- あなたの名刺情報を簡単に登録できます
- 他の人のIDで名刺を検索・閲覧できます
- GitHub、Qiita、X(Twitter)のプロフィールリンクを表示できます
- 好きな技術を選んで登録できます

## アプリの使い方 📱

### 1. 名刺を見る
1. トップページでユーザーIDを入力
2. 「名刺を見る」をクリック
3. その人の名刺情報が表示されます！

### 2. 新しく名刺を作る
1. 「新規登録はこちら」をクリック
2. 好きな英単語（ID）を入力
3. 名前、自己紹介を書く
4. 好きな技術を選ぶ
5. SNSのIDを入力（任意）
6. 「登録する」で完了！

## アプリを動かすために必要なもの 🔨
- パソコンにNode.jsをインストール（バージョン20以上）
- npmをインストール

## アプリの準備方法 🚀

### 1. アプリをパソコンに取り込む
```bash
git clone <repository-url>
cd digital-business-card
```

### 2. 必要な設定をする
`.env`というファイルを作って、中に以下の情報を書く：
```bash
VITE_SUPABASE_URL=あなたのSupabase URL
VITE_SUPABASE_ANON_KEY=あなたのSupabase キー
```

### 3. アプリを起動する

#### 準備する
```bash
npm install
```

#### 起動する
```bash
npm run dev
```
これで http://localhost:5173 にアクセスすると使えます！

#### テストをする
```bash
npm test
```

#### アプリを公開用に準備する
```bash
npm run build
```

#### バッチ処理を実行する（前日のデータ削除）
```bash
npm run batch:delete
```

## 使っている技術 ⚡

### フロントエンド
- **React 19** - ユーザーインターフェース
- **TypeScript** - 型安全なJavaScript
- **Vite** - 高速ビルドツール
- **Chakra UI** - 見た目を整えるライブラリ
- **React Router** - ページ切り替え
- **TanStack Query** - データ取得・管理

### バックエンド
- **Supabase** - データベース・認証

### テスト
- **Jest** - テストツール
- **React Testing Library** - React専用テストツール

### デプロイ
- **Firebase Hosting** - ウェブサイト公開
- **GitHub Actions** - 自動デプロイ

## フォルダの構成 📁
```
src/
├── components/        # パーツ（使い回せる部品）
├── hooks/            # データ取得用の機能
├── pages/            # 各ページ
│   ├── Cards.tsx     # トップページ（検索）
│   ├── UserDetail.tsx # 名刺詳細ページ
│   └── Register.tsx  # 新規登録ページ
├── routes/           # ページ切り替えの設定
├── services/         # データベース連携
├── styles/           # 見た目の設定
├── types/            # データの型定義
└── utils/            # 便利な機能
```

## 自動でやってくれること 🤖

### 毎日のデータ削除（バッチ処理）
- 毎朝6時に前日作ったデータを自動削除
- GitHub Actionsで自動実行

### 自動デプロイ
- コードをpushすると自動でテスト実行
- テストが通ると自動でウェブサイトに反映

## トラブルシューティング 🔧

### アプリが起動しない場合
1. Node.jsのバージョンを確認（20以上必要）
2. `.env`ファイルの設定を確認
3. `npm install`をもう一度実行

### データベースエラーが出る場合
1. Supabaseの設定を確認
2. 環境変数が正しく設定されているか確認
