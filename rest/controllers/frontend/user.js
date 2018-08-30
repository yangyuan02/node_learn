const UserModel = require("../../models/user/user.model");

const fs = require("fs")

const path = require("path")

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
    return ctx.success({ msg: "登录成功" });
  }
  //文件上传
  static async upload(ctx) {
    const file = ctx.request.files;
    const reader = fs.createReadStream(file.filename.path);
    let filePath = path.join(__dirname, "public/upload/") + `${file.filename.name}`;
    // 创建可写流
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    return ctx.success({ msg: "上传成功" });
  }
}

module.exports = UserController;
