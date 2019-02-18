const express = require('express');
const router = express.Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;
const user = require('../models/admin');

// GET /login 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('login')
});

// POST /login 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  admin.login(req, res, next);
});

module.exports = router;
