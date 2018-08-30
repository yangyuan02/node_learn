const UserController  = require('../controllers/frontend.export.js');

const router = require('koa-router')();

router.post("/api/user/register", UserController.register);
router.post("/api/user/login", UserController.login);
router.post("/api/user/upload", UserController.upload);

module.exports = router;

