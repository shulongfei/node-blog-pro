layui.config({
	base:"../../../layuiadmin"
}).extend({
	comExt:"/lib/comExt"
}).use(['form','layer','table','comExt','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    var searchCondition="";
     function aad() {
    	var roleCode=$("#userId").val();
    	searchCondition={searchCondition:{roleCode:roleCode}};
    	return null;
	}
     
     
     $("#updatepwd").click(function(){
    	 
    	 layer.confirm('确认修改选中用户密码？', {icon: 3, title:'提示'}, function(index){
      	   var oUserInfoRows =parent.rolepwd;
           var aUserIds = [];
     	   for (var i = 0; i < oUserInfoRows.length; i++) {
     	   aUserIds.push(oUserInfoRows[i].userId);// 保存到ids数组中
            }
     	    //获取密码
     	    var adminPwd =$("#adminPwd").val();
     	    var userPwd =$(".userPwd").val();
          var userPwd_sub=$(".userPwd_sub").val();
          if(userPwd==userPwd_sub){
          	var updatePwdCondition = {adminPwd:adminPwd,userPwd:userPwd,userPwdSub:userPwd_sub};
          	    var userinfo=layui.data('loginInfo').loginInfo;
     	    	updatePwdCondition.userId = userinfo.userId;
     		    updatePwdCondition.userIds = aUserIds.join(",");
     		    console.log(updatePwdCondition);
   		$.ajax({
      		type: "post",
      		url: "/userInfo/updateUserPwdByAdmin",
      		data: JSON.stringify(updatePwdCondition),
      		dataType: "json",
      		headers: {
      			'Content-Type': 'application/json;charset=utf-8'
      		},
      		success: function(o){
      		     if(o.success==true){
      		        	top.layer.msg("密码修改成功！"); 
      		     }else{
      		    	top.layer.msg(o.msg); 
      		     }
      		
      		},
      	});
         	    
          	
          }else{
          	layer.msg("两次输入的密码不一致，请重新输入！");
          	return
          }
     	 });
    	 
    	 

     })
      
     
     
    
        $('#close').on('click',function(){
 		layer.confirm("是否退出当前页面？",function(index){
 			//当你在iframe页面关闭自身时
			var index = parent.layer.getFrameIndex(window.name);
	 		parent.layer.close(index);
	 		layer.closeAll();
 		})
 		
 	})
    
   
    
  
 
   

})
