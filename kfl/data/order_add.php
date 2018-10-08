<?php
header('Content-Type:application/json');

//取到传递来的参数
@$user_name = $_REQUEST['user_name'];
@$sex = $_REQUEST['sex'];
@$phone = $_REQUEST['phone'];
@$addr = $_REQUEST['addr'];
@$did = $_REQUEST['did'];
//判断是否所有的参数都传递过来
if(empty($user_name) || empty($sex) || empty($phone) || empty($addr) || empty($did))
{
 echo '[]';
 return;
}
//接收到订单时的时间戳
$order_time = time()*1000;

require('init.php');


$sql = "insert into kf_order values(null,'$phone','$user_name','$sex','$order_time','$addr','$did')";

$result = mysqli_query($conn,$sql);

//fetch_all(php 7.0才支持) fetch_assoc
//从数据库返回的$result取结果，返回给客户端
$output = [];


if($result)
{
  $arr['msg'] = 'success';
  $arr['oid'] =  mysqli_insert_id( $conn );
}
else
{
  $arr['msg'] = 'error';
}

echo json_encode($arr);


?>