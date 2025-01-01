# OAuth Aurhotization Code Flow

## 概要

エンジニアアゴラの[Cognitoを使って学ぶAuthorization Code Flow](https://www.engineer-agora.com/post/20241230-oauth-authorization-flow)のソースコード

Cognitoとexpressを使って、Authorization Code Flowを学習するための記事を書いた。

## Webアプリの説明

### 起動方法

1. .envファイルを用意する

ローカルのルートディレクトリに.envファイルを作成し、各種設定値を記載する

```
// Cognitoの情報
COGNITO_REGION=ap-northeast-1
COGNITO_USER_POOL_ID=[your-user-pool-id]
COGNITO_CLIENT_ID=[your-client-id]
COGNITO_CLIENT_SECRET=[your-client-secret]
COGNITO_DOMAIN=https://[your-domain].auth.ap-northeast-1.amazoncognito.com
// Cognitoで設定の必要あり
REDIRECT_URI=http://localhost:8000/callback
// Cognitoで設定の必要あり
LOGOUT_REDIRECT_URI=http://localhost:8000/
```

2. ライブラリのインストール

以下コマンドを実行してライブラリをインストールする

```
npm install
```

3. アプリを起動する

以下どちらかのコマンドでWebアプリを起動する

```
npm run start
```

or

```
node index.js
```

## Webアプリの説明

Webアプリには4つのエンドポイントがある

1. ルートエンドポイント: index.htmlを表示し、ログインボタンとログアウトボタンを表示する
2. ログインエンドポイント: Cognitoの認可エンドポイントにリダイレクトする
3. コールバックエンドポイント: Cognitoからリダイレクトされ、認可コードを各種トークンと交換する
4. ログアウトエンドポイント: Cognitoのログアウトエンドポイントにリダイレクトする
