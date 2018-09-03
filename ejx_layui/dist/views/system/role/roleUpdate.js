layui.use(['form','layer'],function(){
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;

    //监听修改页面提交
    form.on("submit(updateRole)",function(data){
    	//console.log(JSON.stringify(data.field));
    	$.ajax({
    		type: "post",
    		url: "/role/updateRoleInfo",
    		data: JSON.stringify(data.field),
    		dataType: "json",
    		headers: {
    			'Content-Type': 'application/json;charset=utf-8'
    		},
    		success: function(o){
    			//console.log(o);
    			parent.location.reload();
    			top.layer.msg("用户信息修改成功！");
    		},
    	});
    	
    
    	return false;
    });

    //格式化时间
    function filterTime(val){
        if(val < 10){
            return "0" + val;
        }else{
            return val;
        }
    }
    //定时发布
    var time = new Date();
    var submitTime = time.getFullYear()+'-'+filterTime(time.getMonth()+1)+'-'+filterTime(time.getDate())+' '+filterTime(time.getHours())+':'+filterTime(time.getMinutes())+':'+filterTime(time.getSeconds());
  
    $('#close').on('click',function(){
 		layer.confirm("是否退出当前页面？",function(index){
 			//当你在iframe页面关闭自身时
			var index = parent.layer.getFrameIndex(window.name);
	 		parent.layer.close(index);
	 		layer.closeAll();
 		})
 		
 	})

    
    
})