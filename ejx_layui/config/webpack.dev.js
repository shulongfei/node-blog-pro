const path = require("path");
// var ip = 'http://localhost:8080';
var ip = 'http://192.168.1.119:8080';

module.exports = {

  // 可配置在package.json文件里面
  mode: 'development',

  // 入口文件配置 
  entry:{
    // 里买mian是可以随便写的
    main:'./src/index.js',
  },

  // 出口文件的配置
  output: {},

  // 模块： 解读css 模块如何转换，压缩
  module:{},

  // 插件：用于生产模块和各项功能
  plugins:[],

  // 配置webpack开发服务功能
  devServer:{

    // 设置基本目录结构
    contentBase:path.resolve(__dirname, '../dist'),

    // 服务器的IP地址，可以使用IP也可以使用localhost
    host: 'localhost',

    // 配置服务端口号
    port: 8888,

    // 服务端压缩是否开启
    compress: true,

    // 启动服务时自动打开浏览器
    open : true,
   
    // 热加载，使页面自动刷新
    inline: true,

    //服务器代理配置项
    proxy: {
      
      // '/api': {
      //   target: 'http://localhost:8080', // 接口的域名
      //   secure: false,  // 如果是https接口，需要配置这个参数
      //   changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      //   pathRewrite: {'^/api': ''}
      // }
      
      "/login/loginSystem": {
        target: ip,
        secure:true,
        changeOrigin:true,
      },
      "/servlet": {
        target: ip,
        secure:true,
        changeOrigin:true,
      },
      
      "/maintree/getMainMenu": {
        target: ip,
        secure:true,
        changeOrigin:true,
      },
      "/session/getSessionDat": {
        target: ip,
        secure:true,
        changeOrigin:true,
      },


      "/pageResource": {
        target: ip,
        secure:true,
        changeOrigin:true,
      },
      "/userInfo": {
        target: ip,
        secure:true,
        changeOrigin:true,
      },
      "/role": {
        target: ip,
        secure:true,
        changeOrigin:true,
      },
      "/orgInfo": {
        target: ip,
        secure:true,
        changeOrigin:true,
      },
      
      
    }
  }
}