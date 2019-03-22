const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;
const PostModel = require('../models/posts');

// GET /posts 所有用户或者特定用户的文章页
//   eg: GET /posts?author=xxx
router.get('/', function (req, res, next) {
  const authorId = req.query.author;
  if (authorId) {
    PostModel.getPostsId(authorId, function (posts) {
      res.render('posts', {
        posts: posts
      })
    })
  } else {
    PostModel.getPosts(function (posts) {
      res.render('posts', {
        posts: posts
      })
    })
  }
});

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
  const author_id = req.session.user.id;
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
  let article = {
    author_id: author_id,
    title: title,
    content: content
  };
  PostModel.createArticle(article, function (result) {
    // 获取插入该篇文章的id
    article.id = result.insertId;
    req.flash('success', '发表成功');
    // 发表成功后跳转到该文章页
    res.redirect(`/posts/${article.id }`);
  });
});

// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res, next) {
  // res.send('发表文章页')
  res.render('create')
});

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
  const articleId = req.params.postId;
  PostModel.getArticleId(articleId, function (post) {
    if (!post) {
      // throw new Error('该文章不存在');
      req.flash('error', '该文章不存在');
    }
    PostModel.incPv(articleId);
    res.render('post', {
      post: post
    })
  });
});

// GET /posts/:articleId/edit 更新文章页
router.get('/:articleId/edit', checkLogin, function (req, res, next) {
  // res.send('更新文章页');
  const articleId = req.params.articleId;
  const authorId = req.session.user.id;
  PostModel.getArticleId(articleId, function (post) {
    if (!post) {
      // throw new Error('该文章不存在');
      req.flash('error', '该文章不存在');
    }
    if (post.author_id.toString() !== authorId.toString()) {
      throw new Error('没有权限');
    }
    res.render('edit', {
      post: post
    });
  });
});

// POST /posts/:articleId/edit 更新一篇文章
router.post('/:articleId/edit', checkLogin, function (req, res, next) {
  // res.send('更新文章');
  const articleId = req.params.articleId;
  const authorId = req.session.user.id;
  const title = req.fields.title;
  const content = req.fields.content;

  let article = {
    articleId: articleId,
    title: title,
    content: content
  };

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
  PostModel.getArticleId(articleId, function (post) {
    if (!post) {
      // throw new Error('该文章不存在');
      req.flash('error', '该文章不存在');
    }
    if (post.author_id.toString() !== authorId.toString()) {
      throw new Error('没有权限');
    }
    PostModel.updateArticle(article, function () {
      req.flash('success', '编辑文章成功');
      // 编辑成功后跳转到上一页
      res.redirect(`/posts/${articleId}`)
    });
  });
});

// GET /posts/:articleId/remove 删除一篇文章
router.get('/:articleId/remove', checkLogin, function (req, res, next) {
  // res.send('删除文章');
  const articleId = req.params.articleId;
  const authorId = req.session.user.id;
  PostModel.getArticleId(articleId, function (post) {
    if (!post) {
      // throw new Error('该文章不存在');
      req.flash('error', '该文章不存在');
    }
    if (post.author_id.toString() !== authorId.toString()) {
      throw new Error('没有权限');
    }
    PostModel.delPost(articleId, function () {
      req.flash('success', '删除文章成功');
      // 删除成功后跳转到主页
      res.redirect('/posts');
    });
  });
});

module.exports = router;
