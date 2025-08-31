# 🚀 デプロイ手順書

## 📋 概要
このプロジェクトは以下の構成でデプロイします：
- **フロントエンド（Next.js）**: Vercel/Netlify
- **バックエンド（Rails）**: AWS ECS

## 🔧 事前準備

### 1. 必要なアカウント
- [Vercel](https://vercel.com) または [Netlify](https://netlify.com)
- [AWS](https://aws.amazon.com) アカウント
- [GitHub](https://github.com) リポジトリ

### 2. 環境変数の準備
```bash
# Rails用
RAILS_MASTER_KEY=your_master_key_from_config_master_key
RAILS_ENV=production

# Next.js用
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-frontend-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-domain.aws.com
```

## 🎯 Step 1: RailsバックエンドをAWSにデプロイ

### 1.1 AWS ECSの設定

#### 1.1.1 ECRリポジトリの作成
```bash
aws ecr create-repository --repository-name sample-rails-app
```

#### 1.1.2 Dockerイメージのビルドとプッシュ
```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.ap-northeast-1.amazonaws.com

# イメージをビルド
docker build -t sample-rails-app .

# タグ付け
docker tag sample-rails-app:latest your-account-id.dkr.ecr.ap-northeast-1.amazonaws.com/sample-rails-app:latest

# プッシュ
docker push your-account-id.dkr.ecr.ap-northeast-1.amazonaws.com/sample-rails-app:latest
```

#### 1.1.3 ECSクラスターとサービスの作成
```bash
# クラスター作成
aws ecs create-cluster --cluster-name sample-rails-cluster

# タスク定義の作成
aws ecs register-task-definition --cli-input-json file://task-definition.json

# サービスの作成
aws ecs create-service --cluster sample-rails-cluster --service-name sample-rails-service --task-definition sample-rails-app:1 --desired-count 1
```

### 1.2 データベースの設定
```bash
# RDS PostgreSQLインスタンスの作成（AWS Console推奨）
# または、ECS内でPostgreSQLコンテナを使用
```

### 1.3 環境変数の設定
AWS ECSコンソールで以下の環境変数を設定：
- `RAILS_ENV=production`
- `RAILS_MASTER_KEY=your_master_key`
- `DATABASE_URL=postgresql://user:password@host:port/database`

## 🎯 Step 2: Next.jsフロントエンドをVercelにデプロイ

### 2.1 Vercelでのデプロイ

#### 2.1.1 Vercelプロジェクトの作成
1. [Vercel](https://vercel.com)にログイン
2. "New Project"をクリック
3. GitHubリポジトリを選択
4. フレームワークとして"Next.js"を選択
5. ルートディレクトリを`frontend`に設定

#### 2.1.2 環境変数の設定
Vercelのプロジェクト設定で以下を設定：
```
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-domain.aws.com
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### 2.1.3 デプロイ
```bash
# ローカルでテスト
cd frontend
npm run build
npm start

# Vercelにデプロイ
vercel --prod
```

## 🎯 Step 3: Netlifyでのデプロイ（Vercelの代替）

### 3.1 Netlifyでの設定
1. [Netlify](https://netlify.com)にログイン
2. "New site from Git"をクリック
3. GitHubリポジトリを選択
4. ビルド設定：
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/.next`

### 3.2 環境変数の設定
Netlifyの環境変数で以下を設定：
```
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.netlify.app
NEXT_PUBLIC_API_URL=https://your-backend-domain.aws.com
NEXT_PUBLIC_APP_URL=https://your-domain.netlify.app
```

## 🔗 Step 4: フロントエンドとバックエンドの連携

### 4.1 CORS設定の更新
デプロイ後、`config/initializers/cors.rb`のドメインを実際のドメインに更新：
```ruby
origins 'https://your-frontend-domain.vercel.app',
       'https://your-frontend-domain.netlify.app'
```

### 4.2 APIエンドポイントの確認
フロントエンドでAPIエンドポイントが正しく設定されていることを確認：
```typescript
// frontend/app/api/auth/[...nextauth]/route.ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

## 🧪 Step 5: 動作確認

### 5.1 バックエンドの確認
```bash
# ヘルスチェック
curl https://your-backend-domain.aws.com/up

# APIエンドポイントの確認
curl https://your-backend-domain.aws.com/api/posts
```

### 5.2 フロントエンドの確認
1. ブラウザでフロントエンドURLにアクセス
2. ユーザー登録・ログイン機能のテスト
3. 投稿機能のテスト
4. いいね機能のテスト

## 🔧 トラブルシューティング

### よくある問題
1. **CORSエラー**: フロントエンドドメインがCORS設定に含まれているか確認
2. **認証エラー**: 環境変数が正しく設定されているか確認
3. **データベース接続エラー**: DATABASE_URLが正しいか確認

### ログの確認
```bash
# AWS ECSログ
aws logs describe-log-groups
aws logs tail /ecs/sample-rails-service

# Vercelログ
vercel logs
```

## 📝 注意事項
- 本番環境では適切なセキュリティ設定を行ってください
- 定期的なバックアップを設定してください
- モニタリングとアラートを設定してください
