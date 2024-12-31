require('dotenv').config(); // dotenvを使って環境変数をロード
const express = require('express');
const querystring = require('querystring');
const app = express();
const PORT = 8000;

// Cognitoのエンドポイント
const AUTH_URL = `${process.env.COGNITO_DOMAIN}/oauth2/authorize`;
const TOKEN_URL = `${process.env.COGNITO_DOMAIN}/oauth2/token`;

// 静的ファイルの提供
app.use(express.static('public'));

// ルートエンドポイントでindex.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 1. ログインリクエスト
app.get('/login', (req, res) => {
  const loginUrl = `${AUTH_URL}?${querystring.stringify({
    response_type: 'code',
    client_id: process.env.COGNITO_CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    scope: 'openid profile',
  })}`;

  console.log(`loginUrl: ${loginUrl}`);
  res.redirect(loginUrl);
});

// コールバック処理
app.get('/callback', async (req, res) => {

  // リダイレクト時にIdPから返された認可コードをクエリパラメータから取得
  const code = req.query.code;

  // 認可コードがない場合はエラーを返す
  if (!code) {
    return res.status(400).send('Authorization code is missing');
  } else {
    console.log(`Received code: ${code}`);
  }

  // 受け取った認可コードをIdPに送信してアクセストークンと交換する
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.COGNITO_CLIENT_ID,
      client_secret: process.env.COGNITO_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      code,
    }),
  });

  if (!response.ok) {
    return res.status(500).send('Failed to exchange authorization code for access token');
  }

  const data = await response.json();
  console.log('%o', data);

  res.redirect('http://localhost:8000/');

});

// ログアウトエンドポイント
app.get('/logout', (req, res) => {
  const logoutUrl = `${process.env.COGNITO_DOMAIN}/logout?${querystring.stringify({
    client_id: process.env.COGNITO_CLIENT_ID,
    logout_uri: process.env.LOGOUT_REDIRECT_URI,
  })}`;
  res.redirect(logoutUrl);
});


// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});