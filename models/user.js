const mongoose = require('mongoose');
const crypto = require('crypto');

function encrypt(password) {
  return crypto.createHmac('sha512', process.env.SECRET_KEY).update(password).digest('hex');
}

// Define Schemes
const User = new mongoose.Schema({
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false }
});

// user 생성
User.statics.create = function (userid, password) {
  // 패스워드 암호화
  const user = new this({ userid, password: encrypt(password) });
  // const user = new this({ userid, password });
  // return Promise
  return user.save();
};

// user 검색
User.statics.findAll = function () {
  return this.find({});
};

// userid에 의한 user 검색
User.statics.findOneByUserid = function (userid) {
  return this.findOne({ userid });
};

// password 검증
User.methods.verify = function (password) {
  return this.password === encrypt(password);
};

// user를 admin으로 지정
User.methods.assignAdmin = function () {
  this.admin = true;
  return this.save();
};

// Create Model & Export
module.exports = mongoose.model('User', User);
