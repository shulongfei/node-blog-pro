layui.config({
	base:"../../../layuiadmin"
}).extend({
	comExt:"/lib/comExt"
}).use(['form','comExt','layer'],function(){
	var layer=layui.layer;
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        comExt = layui.comExt,
        admin = layui.admin,
    form.on("submit(addUser)",function(data){
    	var userData = JSON.stringify(data.field);
    	//console.log(userData);
    	
    	comExt.ajax({
            url: "/userInfo/insertUserInfo",
            data: userData,
            success: function(o){
            	console.log(o);
            	parent.location.reload();
            	layer.msg("操作成功");
                     },
        });
    	
        return false;
    });
   
    //登录名检测
    $(document).on('click','#userName',function(){
    	var checkLoginName = $('input[name="loginName"]').val();
    	if(checkLoginName.length ==0){
    		layer.msg('请输入有效内容！');
    		return;
    	}else{
    	var oReqData/*请求数据*/ = {
                  loginName: checkLoginName
              };
    	comExt.ajax({
            url: "/userInfo/getUserInfoByName",
            data: JSON.stringify(oReqData),
            success: function(o){
            	if (!o.success) {
            		return;
				} else {
					 layer.msg(o.msg);
				}
            },
        });
    	}
    });
    
   //ID检测
    $(document).on('click','#userID',function(){
    	var checkLoginId= $('input[name="userId"]').val();
    	if(checkLoginId.length ==0){
    		layer.msg('请输入有效内容！');
    		return;
    	}else{
    	  var oReqData/*请求数据*/ = {
    			  userId: checkLoginId
              };
    	comExt.ajax({
            url: "/userInfo/getUserInfoById",
            data: JSON.stringify(oReqData),
            success: function(o){
            	if (!o.success) {
            		return;
				} else {
					 layer.msg(o.msg);
				}
            },
        });
    	}
    });
    
    $("#orgInfo_btn").click(function(){
    	orgInfo();
    })
    
    //添加机构
    function orgInfo(edit){
        var index = layui.layer.open({
            type: 2,
            area: ['700px', '450px'],
            fixed: false,
            maxmin: true,
            content : "userOrgInfo.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
            }
        })
       // layui.layer.full(index);
        window.sessionStorage.setItem("index",index);
    }
    
    
    
    
    
    //监听修改页面提交
    form.on("submit(updateAdd)",function(data){
    	comExt.ajax({
    		url: "/userInfo/editUserInfo",
    		data: JSON.stringify(data.field),
    		success: function(o){
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

})