const pool = require('../lib/pool');
// 用户模块会用到的sql
const sqlObj = {
  login: 'select * from user where user.name = ?',
  getName: 'select * from user where user.name = ?',
  register: 'INSERT INTO user VALUES(NULL,?,?,?,?,?)'
};

module.exports = {

  login: function (user, callback) {
    pool.getConnection((error, conn) => {
      conn.query(sqlObj.login, [user.name], function (error, result) {
        if (error) throw error;
        callback(result);
        conn.release();
      });
    });
  },

  getName: function (user, callback) {
    pool.getConnection((error, conn) => {
      conn.query(sqlObj.getName, [user.name], function (error, result) {
        if (error) throw error;
        callback(result);
        conn.release();
      });
    });
  },

  register: function (user, callback) {
    pool.getConnection((error, conn) => {
      conn.query(sqlObj.register, [user.name, user.password, user.gender, user.bio, user.avatar], (error, result) => {
        if (error) throw error;
        console.log(result);
        callback(result);
        conn.release();
      });
    });
  },

};