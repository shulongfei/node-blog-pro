<?php
header('Content-Type:application/json');

//取到传递来的参数
@$start = $_REQUEST['start'];
if(empty($start))
{
  $start = 0;
}

//从数据库中的kf-dish表中的$start位置 读取5条数据回来
require('init.php');


$sql = "select did,price,img_sm,material,name from kf_dish limit $start,5";

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