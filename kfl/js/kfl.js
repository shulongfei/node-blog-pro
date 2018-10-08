/**
 * Created by bjwsl-001 on 2017/7/3.
 */

var app = angular.module('kfl', ['ng', 'ngRoute']);


//配置路由词典
app.config(function ($routeProvider) {
  $routeProvider
    .when('/kflStart', {
      templateUrl: 'tpl/start.html'
    })
    .when('/kflMain', {
      templateUrl: 'tpl/main.html',
      controller: 'mainCtrl'
    })
    .when('/kflDetail/:did', {
      templateUrl: 'tpl/detail.html',
      controller: 'detailCtrl'
    })
    .when('/kflOrder/:id', {
      templateUrl: 'tpl/order.html',
      controller: 'orderCtrl'
    })
    .when('/kflMyOrder', {
      templateUrl: 'tpl/myOrder.html',
      controller: 'myOrderCtrl'
    })
    .otherwise({redirectTo: '/kflStart'})
});


app.controller('bodyCtrl', ['$scope', '$location',

  function ($scope, $location) {
    $scope.jump = function (desPath) {
      $location.path(desPath);
    }
  }

]);

app.controller('mainCtrl', ['$scope', '$http',
  function ($scope, $http) {
    $scope.hasMore = true;
    $scope.kw = '';//将用户的输入绑定到该变量中

    //取得列表的数据显示
    $http
      .get('data/dish_getbypage.php')
      .success(function (data) {
        // console.log(data);
        $scope.dishList = data;
      });

    //定义一个加载更多的方法
    $scope.loadMore = function () {
      $http
        .get('data/dish_getbypage.php?start=' +
        $scope.dishList.length)
        .success(function (data) {

          if (data.length < 5) {
            //没有更多数据了
            $scope.hasMore = false;
          }

          //将取到的新的数组和老的数组拼在一起
          $scope.dishList = $scope.dishList.concat(data);

        })
    }

    //根据用户输入的值 搜索
    $scope.$watch('kw', function () {
      if ($scope.kw.length > 0) {
        //发起网络请求 dish_getbykw.php
        $http
          .get('data/dish_getbykw.php?kw=' + $scope.kw)
          .success(function (data) {
            console.log(data);
            if (data.length > 0) {
              $scope.dishList = data;
            }
          })
      }

    })

  }
]);

app.controller('detailCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {

  $http
    .get('data/dish_getbyid.php?did=' + $routeParams.did)
    .success(function (data) {
      console.log(data);
      $scope.dish = data[0];
    })

}])

app.controller('orderCtrl',
  ['$scope', '$routeParams', '$http', '$httpParamSerializerJQLike',
    function ($scope, $routeParams, $http, $httpParamSerializerJQLike) {
      console.log($routeParams);
      $scope.order = {
        user_name: '',
        sex: 1,
        phone: '',
        addr: '',
        did: $routeParams.id
      }
      //$httpParamSerializerJQLike()

      $scope.submitOrder = function () {
        //得到当前用户输入的信息
        console.log($scope.order);
        var result = $httpParamSerializerJQLike($scope.order);
        console.log(result);

        //将数据发给服务器
        $http.get('data/order_add.php?' + result)
          .success(function (data) {
            console.log(data);
            if (data.msg == 'success') {
              $scope.orderResult = "下单成功，订单编号为" + data.oid;
              sessionStorage.setItem('phone', $scope.order.phone)
            }
            else {
              $scope.orderResult = "下单失败";
            }

          })
      }

    }]);

app.controller('myOrderCtrl', ['$scope', '$http', function ($scope, $http) {

  //获取存在本地的手机号
  var userPhone =
    sessionStorage.getItem('phone');
  //console.log(userPhone);

  //发起网络请求获取该手机号对应的订单信息
  $http
    .get('data/order_getbyphone.php?phone=' + userPhone)
    .success(function (data) {
      //console.log(data);

      //拿到对象数组绑定到视图
      $scope.orderList = data;
    })

}])
