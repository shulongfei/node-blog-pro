const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

// const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signin')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name
  // const password = req.fields.password

  console.log(name);
})

module.exports = router
