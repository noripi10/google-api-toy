# google-api-toy

## 準備

### GCP で OAuth クライアント(デスクトップ APP)を作成

### クライアント情報 JSON (credentials.json) をルートディレクトを保存

### シークレットトークンを取得する

```sh
 yarn gen
```

### 実行

```sh
yarn dev
yarn build
yarn start
```

## OAuth 認証

### 参考 gemini-cli

https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/code_assist/oauth2.ts

### 実装 src/libs/oauth.ts

- hono を使用してコールバック処理を待機・認証実行

### アプリケーションのデフォルト認証情報（ADC）を使用する場合

https://cloud.google.com/docs/authentication/application-default-credentials?hl=ja#GAC

## GoogleApi 使用方法

1. Credentials.json と Tokens.json を使用してインスタンスクライアントを作成

2. 各種 API を利用可能

参考文献

https://qiita.com/kompiro/items/8e4c4d79cbbb5a3c95f6

Google API Node.js List

https://googleapis.dev/nodejs/googleapis/latest/

Scope List

https://developers.google.com/identity/protocols/oauth2/scopes

## メモ

[handling-refresh-token](https://github.com/googleapis/google-api-nodejs-client#handling-refresh-tokens)

2/20 0 時ごろにトークンを取得
前回は OAuth の公開ステータスをテストのままで放置していたため７日間後リフレッシュトークンが無効化されてしまった
今回は本番モードに切り替え済のため無効化されないか確認する

## OAuth 帯域外（OOB） が使えなくなった

2023 年 1 月 31 日 - 既存のクライアントがすべて除外されます（除外対象のクライアントを含む）。

https://developers.google.com/identity/protocols/oauth2/resources/oob-migration?hl=ja

とりあえず規定値を localhost にしておけばリダイレクトされるが URL クエリからコピペしないとけないのが手間
