layui.use(['form','layer','table','laytpl'],function(){
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
    //用户列表

     	
     	
     
     
     
var tableIns = table.render({
    elem: '#roleList',
    url : '/role/getRoleList',
    cellMinWidth : 95,
    page : false,
    height : "full-125",
    limits : [10,15,20,25],
    limit : 20,
    loading :true,
    contentType:"application/json;charset=utf-8",
    id : "roleListTable",
    method : 'post',
    where: null,
    request: {
    	  pageName: 'page' //页码的参数名称，默认：page
    	  ,limitName: 'rows' //每页数据量的参数名，默认：limit
    	},
    response: {
    	  statusName: 'success' //数据状态的字段名称，默认：code
    	  ,statusCode: true //成功的状态码，默认：0
    	  ,msgName: 'msg' //状态信息的字段名称，默认：msg
    	//  ,countName: 'obj/jsonData/total' //数据总数的字段名称，默认：count
    	  ,dataName: 'obj/jsonData' //数据列表的字段名称，默认：data
    	} ,
        cols : [[
            {checkbox: true, width: 60, fixed: true},
            {field: 'roleCode', title: '角色编号', width:300, align:"center"},
            {field: 'roleName', title: '角色名称', width:300, align:'center'},
            {field: 'description', title: '角色备注', Width:200},
        ]],
           even: false
          ,done: function(res, curr, count){
        	
        	 var userid=$("#userId").val();
        	 var reqdate={userId:userid};
        	  $.ajax({
        	        type: 'post',
        	        url: "/role/getRoleListByUserId",
        	        contentType: 'application/json;charset=utf-8',
        	        data:JSON.stringify(reqdate),
        	        success: function (oRes) { //返回json结果
        	    		if (oRes) {     	    			
        	    			//数据表格加载完成时调用此函数
        	                //如果是异步请求数据方式，res即为你接口返回的信息。
        	                //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度
        	                       
        	                    //设置全部数据到全局变量
        	    			    var table_data=oRes.obj.jsonData;
        	    			   
        	    			    var all_role=res.newdataName;
        	                    //在缓存中找到id ,然后设置data表格中的选中状态
        	                    //循环所有数据，找出对应关系，设置checkbox选中状态
        	                    for(var i=0;i< table_data.length;i++){
        	                    	
        	                     for(var j=0;j<all_role.length;j++){
        	                            //数据id和要勾选的id相同时checkbox选中
        	                          if(table_data[i].roleCode==all_role[j].roleCode)
        	                          {
        	                            //这里才是真正的有效勾选
        	                            all_role[j]["LAY_CHECKED"]='true';
        	                                 //找到对应数据改变勾选样式，呈现出选中效果
        	                            var index= all_role[j]['LAY_TABLE_INDEX'];
        	                            $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
        	                            $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
        	                            }
        	                       }
        	                    }
        	                    //设置全选checkbox的选中状态，只有改变LAY_CHECKED的值， table.checkStatus才能抓取到选中的状态
        	                    var checkStatus = table.checkStatus('roleList');
        	                    if(checkStatus.isAll){
        	                        $(' .layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
        	                        $('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
        	                    }
        	    		}
        	        }
        	    });
        }
    });
      

    $(".binding").click(function(){
   	 var checkStatus = table.checkStatus('roleListTable');
   	 var sidsDG=checkStatus.data;
     var addCondition ={};
	 var nodeIds = "";
		addCondition['userId'] = $('#userId').val();
		for(var s in sidsDG)
		nodeIds= nodeIds+sidsDG[s].roleCode+",";
		addCondition['roleCodes'] = nodeIds;
		$.ajax({
    		type: "post",
    		url: "/userRoleBind/insertUserRoleBind",
    		data: JSON.stringify(addCondition),
    		dataType: "json",
    		headers: {
    			'Content-Type': 'application/json;charset=utf-8'
    		},
    		success: function(o){
    			//console.log(o);
    			parent.location.reload();
    			top.layer.msg("用户角色绑定成功！");
    		},
    	});
    	
   	 return 
   	 
   })
   
    
    
    
   
    
  
 
   

})
