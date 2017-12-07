const router = require('express').Router();
const User = require('../models/user');

/*
  모든 사용자 검색

  GET /users
  JWT Token / admin
*/
router.get('/', (req, res) => {
  console.log('[GET /users]', req.decodedToken);

  // if (!req.decodedToken.admin) {
  //   return res.status(403).send({ success: false, error: 'admin이 아닙니다.' });
  // }
  if (!req.decodedToken) {
    return res.status(403).send({ success: false, error: '토큰이 없습니다.' });
  }
  User.findAll().then(users => res.json(users));
});

module.exports = router;
