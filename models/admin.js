const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');

const pool = require('../lib/pool');

module.exports = {
  // 用户登录
  login: function (req, res) {
    const name = req.fields.name;
    const password = req.fields.password;
    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写用户名');
      }
      if (!password.length) {
        throw new Error('请填写密码');
      }
    } catch (e) {
      req.flash('error', e.message);
      return res.redirect('back');
    }
    pool.getConnection((err, conn) => {
      conn.query('select * from user where user.name = ?', [name], (err, result) => {
        res.setHeader('Content-Type', 'text/html;charset=UTF-8');
        if (result.length === 0) {
          req.flash('error', '用户不存在');
          return res.redirect('back');
        }
        console.log(password.length);
        console.log(sha1(123456));
        console.log(result[0].password);
        // 检查密码是否匹配
        if (sha1(password) !== result[0].password) {
          req.flash('error', '用户名或密码错误');
          return res.redirect('back')
        }
        delete result[0].password;
        console.log(result[0]);
        req.session.user = result[0];
        // 跳转到主页
        res.redirect('/posts');
        conn.release();
      });
    });
  },
  // 注册
  register: function (req, res) {
    const name = req.fields.name;
    const gender = req.fields.gender;
    const bio = req.fields.bio;
    const avatar = req.files.avatar.path.split(path.sep).pop();
    let password = req.fields.password;
    const repassword = req.fields.repassword;

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
    // 用户信息写入数据库
    pool.getConnection((err, conn) => {
      conn.query('select * from user where user.name = ?', [name], (err, result) => {
        res.setHeader('Content-Type', 'text/html;charset=UTF-8');
        if (result.length !== 0) {
          // 注册失败，异步删除上传的头像
          fs.unlink(req.files.avatar.path, function (err) {
            if (err) throw err;
            console.log('成功')
          });
          req.flash('error', '用户已存在');
          conn.release();
          return res.redirect('back');
        } else {
          conn.query('INSERT INTO user VALUES(NULL,?,?,?,?,?)', [name, password, gender, bio, avatar], (err, result) => {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            console.log(11111);
            // 删除密码这种敏感信息，将用户信息存入 session
            delete user.password;
            req.session.user = user;
            // 写入 flash
            req.flash('success', '注册成功');
            conn.release();
            // 跳转到首页
            res.redirect('/posts');
          });
        }
      });
    });
  },
  createArticle: function (req, res) {
    const author_id = req.session.user.id;
    const author = req.session.user.name;
    const title = req.fields.title;
    const content = req.fields.content;
    // 校验参数
    try {
      if (!title.length) {
        throw new Error('请填写标题')
      }
      if (!content.length) {
        throw new Error('请填写内容')
      }
    } catch (e) {
      req.flash('error', e.message);
      return res.redirect('back')
    }
    pool.getConnection((err, conn) => {
      conn.query('INSERT INTO article VALUES(NULL,?,?,?,?,NULL)', [author_id, author, title, content], (err, result) => {
        res.setHeader('Content-Type', 'text/html;charset=UTF-8');
        // 写入 flash
        req.flash('success', '添加成功');
        conn.release();
        // 跳转到主页面
        res.redirect('/posts');
      });
    });
  }

};
