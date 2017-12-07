const router = require('express').Router();
const User = require('../models/user');
const { createToken } = require('../lib/token');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.send('auth router');
});

/*
  signup

  POST /auth/signup
  { userid, password }
*/
router.post('/signup', (req, res) => {
  const { userid, password } = req.body;

  User.findOneByUserid(userid)
    .then(user => {
      if (user) {
        throw new Error(`${userid}는 이미 사용중입니다.`);
      } else {
        return User.create(userid, password);
      }
    })
    .then(() => res.json({ success: true }))
    .catch(err => res.status(409).json({ success: false, message: err.message }));
});

/*
  signin

  POST /auth/signin
  { userid, password }
*/
router.post('/signin', (req, res) => {
  const { userid, password } = req.body;

  // userid에 의한 user 검색
  User.findOneByUserid(userid)
    .then(user => {
      // user 미존재: 회원 미가입 사용자
      if (!user) { throw new Error('가입하지 않은 아이디입니다.'); }

      // 패스워드 체크
      if (!user.verify(password)) { throw new Error('패스워드가 일치하지 않습니다.'); }

      // userid가 존재하고 패스워드가 일치하면 토큰 발행
      return createToken({
        userid: user.userid,
        admin: user.admin
      });
    })
    .then(token => res.json({ sucess: true, token }))
    .catch(err => res.status(403).json({ sucess: false, message: err.message }));
});

/*
  header의 Authorization에 JWT 값을 설정하여 서버로 전송하면 서버는 token을 검증한 후 현재 계정의 상태를 response한다.

  GET /auth/check
  JWT Token
*/
router.get('/check', isAuthenticated, (req, res) => {
  res.json(req.decodedToken);
});

module.exports = router;
