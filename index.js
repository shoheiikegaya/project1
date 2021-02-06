
//参考URL
//https://qiita.com/sa9ra4ma/items/67edf18067eb64a0bf40

//1
// expressモジュールを読み込む
const express = require('express');
const jwt = require("jsonwebtoken");
var config = require('./config');
const dbAcc = require('./dbAccess.js');
const hash = require('./hashCreator');

const PORT = 3000;

// expressアプリを生成する
const app = express();

//express.json()とは
//Body-Parserを基にExpressに組み込まれた機能です、クライアントから送信されたデータを、req.body経由で会得、操作できます。
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//2鍵
//const SECRET_KEY = "abcdefg";
const SECRET_KEY = config.secret;

//3JWT発行API
app.post('/login', async (req, res) => {

  //name:ikegaya
  //password:password1
  const objHash = new hash(req.body.password);
  bufHash = objHash.hashCreate();
  //console.log('bufHash=' + bufHash);

  let reqName=req.body.name;
  let reqPassword=bufHash;

  const dbInstance = new dbAcc();
  let result = await dbInstance.asyncPromiseLoginChk(reqName);
  //console.log(result);
  let bufName=result.Name;
  let bufPassword=result.Password;

  // validation
  if (reqName!=bufName) {
    res.json({
      success: false,
      message: 'User not found.',
      token: null
    });
    return;
  }
  if (reqPassword!=bufPassword) {
    res.json({
      success: false,
      message: 'Password is wrong.',
      token: null
    });
    return;
  }



  // 動作確認用に全ユーザーログインOK
  const payload = {
      user: req.body.user
      //user: 'ikegaya'
  };
  const option = {
      expiresIn: '1m'
      //expiresIn: '24h'
  }
  const token = jwt.sign(payload, SECRET_KEY, option);
  res.json({
      message: "create token",
      token: token
  });
});


//4認証用ミドルウェア
const auth = (req, res, next) => {
  // リクエストヘッダーからトークンの取得
  let token = '';
  if (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
  } else {
      return next('token none');
  }

  // トークンの検証
  jwt.verify(token, SECRET_KEY, function(err, decoded) {
      if (err) {
          // 認証NGの場合
          next(err.message);
      } else {
          // 認証OKの場合
          req.decoded = decoded;
          next();
      }
  });
}



//5認証必須API
app.get('/user', auth, (req, res) => {
  res.send(200, `your name is ${req.decoded.user}!`);
});

//6エラーハンドリング
app.use((err, req, res, next)=>{
  res.send(500, err)
})


// ルート（http://localhost/）にアクセスしてきたときに「Hello」を返す
app.get('/', (req, res) => res.send('Hello test'));

// ポート3000でサーバを立てる
//app.listen(3000, () => console.log('Listening on port 3000'));
//Heroku へデプロイした際は、ポートは process.env.PORT が適用される
app.listen(process.env.PORT || PORT, () => console.log('Listening on port 3000'));


