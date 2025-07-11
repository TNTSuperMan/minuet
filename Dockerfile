# ベースイメージとしてBunの公式イメージを使用
FROM oven/bun:latest

# 作業ディレクトリを設定
WORKDIR /app

# プロジェクトのファイルをコンテナにコピー
COPY . .

# アプリケーションのポートを公開 (必要に応じて変更)
EXPOSE 3000

# コンテナ起動時に 'bun dev' を実行
CMD ["bun", "dev"]
