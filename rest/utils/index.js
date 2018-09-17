const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const utils = {
  generateToken: function(data) {
    let created = Math.floor(Date.now() / 1000);
    let cert = fs.readFileSync(`${process.cwd()}/rsa_private_key.pem`); //私钥 输入openssl，打开openssl genrsa -out rsa_private_key.pem 2048 
    let token = jwt.sign(
      {
        data,
        exp: created + 3600 * 24
      },
      cert,
      { algorithm: "RS256" }
    );
    return token;
  },
  verifyToken: function(token) {
    let cert = fs.readFileSync(`${process.cwd()}/rsa_public_key.pem`); //公钥 输入openssl，打开openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
    let res = null;
    try {
      let result = jwt.verify(token, cert, { algorithms: ["RS256"] }) || {};
      let { exp = 0 } = result,
        current = Math.floor(Date.now() / 1000);
      if (current <= exp) {
        res = result.data || {};
      }
    } catch (e) {
    }
    return res;
  }
};

module.exports = utils;
