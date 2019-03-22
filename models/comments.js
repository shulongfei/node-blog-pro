const marked = require('marked');
const pool = require('../lib/pool');

var userList = {
  add: 'insert into user(username, password) values(?, ?)',
  deleteById: 'delete from user where id = ?',
  update: 'update user set username=?, password=? where id=?',
  list: 'select * from user',
  getById: 'select * from user where id = ?'
};

module.exports = {
  add: function (user, callback) {
    pool.getConnection((err, conn) => {
      conn.query(userList.add, [user.username, user.password], function (error, result) {
        if (error) throw error;
        callback(result);
        conn.release();
      });
    });
  },
  list: function (callback) {
    pool.getConnection((err, conn) => {
      conn.query(userList.list, function (error, result) {
        if (error) throw error;
        callback(result);
        conn.release();
      });
    });
  },
  getById: function (id, callback) {
    pool.getConnection((err, conn) => {
      conn.query(userList.getById, id, function (error, result) {
        if (error) throw error;
        callback(result[0]);
        conn.release();
      });
    });
  },
  deleteById: function (id, callback) {
    pool.getConnection((err, conn) => {
      conn.query(userList.deleteById, id, id, function (error, result) {
        if (error) throw error;
        callback(result[0]);
        conn.release();
      });
    });
  },
  update: function (user, callback) {
    pool.getConnection((err, conn) => {
      conn.query(userList.update, [user.username, user.password, user.id], function (error, result) {
        if (error) throw error;
        callback(result[0]);
        conn.release();
      });
    });
  }
};
