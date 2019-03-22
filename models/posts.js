const marked = require('marked');
const pool = require('../lib/pool');

var postsSql= {
  getPosts: 'select * from user,article where user.id = article.author_id',
  getPostsId: 'select * from user,article where user.id = article.author_id and author_id = ?',
  createArticle: 'INSERT INTO article VALUES(NULL,?,?,?,now(),0)',
  getArticleId: 'select * from user,article where user.id = article.author_id and article.article_id = ?',
  incPv: 'UPDATE article SET pv = pv + 1 where article_id = ?',
  delPost: 'DELETE FROM article where article.article_id = ?',
  updateArticle: 'UPDATE article SET article.title = ?, article.content = ? where article.article_id = ?'
};

module.exports = {
  // 按创建时间降序获取所有用户文章
  getPosts: function (callback) {
    pool.getConnection((err, conn) => {
      conn.query(postsSql.getPosts, function (error, result) {
        if (error) throw error;
        callback(result);
        conn.release();
      });
    });
  },

  // 获取某个特定用户的所有文章
  getPostsId: function (authorId, callback) {
    pool.getConnection((err, conn) => {
      conn.query(postsSql.getPostsId,[authorId], function (error, result) {
        if (error) throw error;
        callback(result);
        conn.release();
      });
    });
  },

  // 创建一篇文章
  createArticle: function (article, callback) {
    pool.getConnection((err, conn) => {
      conn.query(postsSql.createArticle,
        [article.author_id, article.title, article.content],  function (error, result) {
          if (error) throw error;
          callback(result);
          conn.release();
      });
    });
  },

  // 获取一篇特定的文章
  getArticleId: function(articleId, callback) {
    pool.getConnection((err, conn) => {
      conn.query(postsSql.getArticleId, [articleId],  function (error, result) {
          if (error) throw error;
          callback(result[0]);
          conn.release();
        });
    });
  },

  // 更新用户访问量
  incPv: function (articleId) {
    pool.getConnection((err, conn) => {
      conn.query(postsSql.incPv, [articleId],  function (error, result) {
        if (error) throw error;
        conn.release();
      });
    });
  },

  // 删除文章
  delPost: function(articleId,callback) {
    pool.getConnection((err, conn) => {
      conn.query(postsSql.delPost, [articleId],  function (error, result) {
        if (error) throw error;
        callback(result);
        conn.release();
      });
    });
  },
  
  updateArticle: function (article, callback) {
    pool.getConnection((err, conn) => {
      conn.query(postsSql.updateArticle, [article.title, article.content, article.articleId],  function (error, result) {
        if (error) throw error;
        callback(result);
        conn.release();
      });
    });
  }

};
