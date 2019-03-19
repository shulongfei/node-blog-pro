/**
 *数据库连接池模块
 */
const mysql = require('mysql');

var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'blog',
  port: 3306,
  connectionLimit: 2
});

module.exports = pool;