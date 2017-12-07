const jwt = require('jsonwebtoken');

// JWT 토큰 생성
exports.createToken = payload => {
  const jwtOption = { expiresIn: '7d' };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.JWT_SECRET, jwtOption, (error, token) => {
      if (error) reject(error);
      resolve(token);
    });
  });
};

// JWT 토큰 검증
exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
};
