const path = require('path');
const sha1 = require('sha1');
const fs = require('fs');
const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;
const userModel = require('../models/user');

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {

  const name = req.fields.name;
  const gender = req.fields.gender;
  const bio = req.fields.bio;
  const avatar = req.files.avatar.path.split(path.sep).pop();
  const repassword = req.fields.repassword;
  let password = req.fields.password;

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符')
    }
  } catch (e) {
    req.flash('error', e.message);
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path, function (err) {
      if (err) throw err;
      console.log('成功')
    });
    return res.redirect('back');
  }

  // 明文密码加密
  password = sha1(password);
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  };
  userModel.getName(user, function(result){
    if (result.length !== 0) {
      // 注册失败，异步删除上传的头像
      fs.unlink(req.files.avatar.path, function (err) {
        if (err) throw err;
        console.log('成功')
      });
      req.flash('error', '用户已存在');
      return res.redirect('back');
    } else {
      userModel.register(user, function (result) {
        console.log(result);
        // 删除密码这种敏感信息，将用户信息存入 session
        delete user.password;
        // 获取id进行设置
        user.id = result.insertId;
        req.session.user = user;
        // 写入 flash
        req.flash('success', '注册成功');
        // 跳转到首页
        res.redirect('/posts');

      })
    }
  });

});

module.exports = router;