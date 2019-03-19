const express = require('express');
const router = express.Router();
const checkNotLogin = require('../middlewares/check').checkNotLogin;
const sha1 = require('sha1');
const userModel = require('../models/user');

// GET /login 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signin');
});

// POST /login 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  const user = {
    name: req.fields.name,
    password: req.fields.password
  };
  // 校验参数
  try {
    if (!user.name.length) {
      throw new Error('请填写用户名');
    }
    if (!user.password.length) {
      throw new Error('请填写密码');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  userModel.login(user, function(result){
    if (result.length === 0) {
      req.flash('error', '用户不存在');
      return res.redirect('back');
    }
    // 检查密码是否匹配
    if (sha1(user.password) !== result[0].password) {
      req.flash('error', '用户名或密码错误');
      return res.redirect('back')
    }
    delete result[0].password;
    req.session.user = result[0];
    // 跳转到主页
    res.redirect('/posts');
  });



});



module.exports = router;