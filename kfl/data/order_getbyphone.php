<?php
header('Content-Type:application/json');

//取到传递来的参数
@$phone = $_REQUEST['phone'];
if(empty($phone))
{
  echo '[]';
  return;
}

//从数据库中的kf-dish表中的$start位置 读取5条数据回来
require('init.php');


$sql = "select kf_dish.img_sm,kf_order.order_time,kf_order.user_name,kf_order.oid,kf_order.did  from kf_order, kf_dish where  kf_order.phone='$phone' and kf_order.did=kf_dish.did";

$result = mysqli_query($conn,$sql);

//fetch_all(php 7.0才支持) fetch_assoc
//从数据库返回的$result取结果，返回给客户端
$output = [];
while(true){
  $row = mysqli_fetch_assoc($result);
  if(!$row)
  {
    break;
  }
  $output[] = $row;
}
echo json_encode($output);
?>