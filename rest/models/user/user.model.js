/*
* @ author sessionboy 
* @ github https://github.com/sessionboy
* @ website http://sinn.boyagirl.com
* @ use 用户schema
*/ 
const mongoose = require("../mongodb").mongoose;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 用户名
  tel: { type: String, required: true }, // 用户名
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports=mongoose.model('User', UserSchema);