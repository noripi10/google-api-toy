# google-api-toy

## Preset

1. GCP で OAuth クライアント(デスクトップ APP)を作成

2. JSON をダウンロード

3. シークレットトークンを取得する

```sh
yarn gen
```

4. ブラウザで認証後、取得コードをコピーして tokens.json ファイルを生成

## How to googleapi

1. Credentials.json と Tokens.json を使用してインスタンスクライアントを作成

2. 各種 API を利用可能

# MEMO

[handling-refresh-token](https://github.com/googleapis/google-api-nodejs-client#handling-refresh-tokens)

2/20 0 時ごろにトークンを取得
前回は OAuth の公開ステータスをテストのままで放置していたため７日間後リフレッシュトークンが無効化されてしまった
今回は本番モードに切り替え済のため無効化されないか確認する

# OAuth 帯域外（OOB） が使えなくなった

2023 年 1 月 31 日 - 既存のクライアントがすべて除外されます（除外対象のクライアントを含む）。

https://developers.google.com/identity/protocols/oauth2/resources/oob-migration?hl=ja

とりあえず規定値を localhost にしておけばリダイレクトされるが URL クエリからコピペしないとけないのが手間
