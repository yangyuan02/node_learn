const UserModel = require("../../models/user/user.model");
const utils = require("../../utils/index");
const fs = require("fs");

const path = require("path");

class UserController {
  //用户注册
  static async register(ctx) {
    const { name, password, tel } = ctx.request.body;
    if (!name || !password || !tel) {
      return ctx.error({ msg: "缺少参数" });
    }
    const ishas = await UserModel.findOne({ name });
    if (ishas) {
      return ctx.error({ msg: "该用户已经存在" });
    }
    const result = await UserModel.create({ name, password, tel });
    if (!result) {
      return ctx.error({ msg: "注册失败!" });
    }
    return ctx.success({ msg: "注册成功" });
  }
  //用户登录
  static async login(ctx) {
    const { name, password } = ctx.request.body;
    if (!name || !password) {
      return ctx.error({ msg: "缺少参数" });
    }
    const ishas = await UserModel.findOne({ name, password });
    if (!ishas) {
      return ctx.error({ msg: "账户或密码错误" });
    }
    let token = utils.generateToken({ name });
    return ctx.success({ msg: "登录成功", data: { token } });
  }
  static async users(ctx) {
    //获取用户
    const { token } = ctx.header;
    if (token) {
      if (utils.verifyToken(token)) {
        const list = await UserModel.find();
        if (!list) {
          return ctx.error({ msg: "获取用户列表失败" });
        }
        return ctx.success({ msg: "登录成功", data: { list } });
      } else {
        return ctx.error({ msg: "token已过期" });
      }
    } else {
      return ctx.error({ msg: "缺少参数" });
    }
  }
  static async updataUser(ctx) {
    const { token } = ctx.header;
    const { name, tel, newTel } = ctx.request.body;
    const conditions = { name, tel };
    if (token) {
      if (utils.verifyToken(token)) {
        UserModel.update(conditions, { $set: { tel: newTel } }, (error) => {//callback return 不出去j
          if (error) {
            console.log(error);
          } else {
            console.log("Updata success")
          }
        });
      } else {
        return ctx.error({ msg: "token已过期" });
      }
    } else {
      return ctx.error({ msg: "缺少参数" });
    }
  }
  //文件上传
  static async upload(ctx) {
    const file = ctx.request.files;
    const reader = fs.createReadStream(file.filename.path);
    let filePath = `${process.cwd()}/public/upload/${file.filename.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    return ctx.success({ msg: "上传成功" });
  }
}

module.exports = UserController;
