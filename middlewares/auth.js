const { verifyToken } = require('../lib/token');

exports.isAuthenticated = (req, res, next) => {
  // 토큰 취득
  const token = req.body.token || req.query.token || req.headers.authorization;
  // const token = req.body.token || req.query.token || req.headers.authorization.split(' ')[1];

  // 토큰 미존재: 로그인하지 않은 사용자
  if (!token) {
    return res.status(403).json({ success: false, message: '토큰이 존재하지 않습니다.' });
  }

  // 토큰 검증
  verifyToken(token)
    .then(decodedToken => {
      req.decodedToken = decodedToken;
      next();
    })
    .catch(err => res.status(403).json({ success: false, message: err.message }));
};
