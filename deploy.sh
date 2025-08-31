#!/bin/bash

# 🚀 デプロイスクリプト
# 使用方法: ./deploy.sh [vercel|netlify] [aws-region]

set -e

FRONTEND_PLATFORM=${1:-vercel}
AWS_REGION=${2:-ap-northeast-1}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-"your-account-id"}

echo "🚀 デプロイを開始します..."
echo "フロントエンド: $FRONTEND_PLATFORM"
echo "AWS リージョン: $AWS_REGION"

# 環境変数の確認
if [ -z "$RAILS_MASTER_KEY" ]; then
    echo "❌ RAILS_MASTER_KEYが設定されていません"
    exit 1
fi

if [ -z "$AWS_ACCOUNT_ID" ] || [ "$AWS_ACCOUNT_ID" = "your-account-id" ]; then
    echo "❌ AWS_ACCOUNT_IDが設定されていません"
    exit 1
fi

# Step 1: RailsバックエンドをAWSにデプロイ
echo "📦 RailsバックエンドをAWSにデプロイ中..."

# ECRリポジトリの作成（存在しない場合）
aws ecr describe-repositories --repository-names sample-rails-app --region $AWS_REGION || \
aws ecr create-repository --repository-name sample-rails-app --region $AWS_REGION

# ECRにログイン
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Dockerイメージをビルド
echo "🐳 Dockerイメージをビルド中..."
docker build -t sample-rails-app .

# タグ付け
docker tag sample-rails-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/sample-rails-app:latest

# プッシュ
echo "📤 ECRにプッシュ中..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/sample-rails-app:latest

# ECSクラスターの作成（存在しない場合）
aws ecs describe-clusters --clusters sample-rails-cluster --region $AWS_REGION || \
aws ecs create-cluster --cluster-name sample-rails-cluster --region $AWS_REGION

# タスク定義の更新
echo "📋 タスク定義を更新中..."
aws ecs register-task-definition --cli-input-json file://task-definition.json --region $AWS_REGION

# サービスの作成/更新
echo "🔧 サービスを更新中..."
aws ecs update-service --cluster sample-rails-cluster --service sample-rails-service --task-definition sample-rails-app --region $AWS_REGION || \
aws ecs create-service --cluster sample-rails-cluster --service-name sample-rails-service --task-definition sample-rails-app:1 --desired-count 1 --region $AWS_REGION

echo "✅ Railsバックエンドのデプロイが完了しました"

# Step 2: Next.jsフロントエンドをデプロイ
echo "🎨 Next.jsフロントエンドを${FRONTEND_PLATFORM}にデプロイ中..."

cd frontend

if [ "$FRONTEND_PLATFORM" = "vercel" ]; then
    # Vercelでのデプロイ
    if command -v vercel &> /dev/null; then
        echo "📤 Vercelにデプロイ中..."
        vercel --prod --yes
    else
        echo "⚠️ Vercel CLIがインストールされていません"
        echo "npm install -g vercel を実行してください"
    fi
elif [ "$FRONTEND_PLATFORM" = "netlify" ]; then
    # Netlifyでのデプロイ
    if command -v netlify &> /dev/null; then
        echo "📤 Netlifyにデプロイ中..."
        npm run build
        netlify deploy --prod --dir=.next
    else
        echo "⚠️ Netlify CLIがインストールされていません"
        echo "npm install -g netlify-cli を実行してください"
    fi
else
    echo "❌ サポートされていないフロントエンドプラットフォーム: $FRONTEND_PLATFORM"
    exit 1
fi

cd ..

echo "✅ デプロイが完了しました！"
echo ""
echo "📋 次のステップ:"
echo "1. 環境変数を設定してください"
echo "2. CORS設定を更新してください"
echo "3. 動作確認を行ってください"
echo ""
echo "詳細は DEPLOYMENT.md を参照してください"
