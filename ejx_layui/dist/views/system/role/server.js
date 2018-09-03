layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    var searchCondition="";
     function aad() {
    	var roleCode=$("#roleCode").val();
    	searchCondition={searchCondition:{roleCode:roleCode}};
    	console.log(searchCondition);
    	return searchCondition;
	}
    //用户列表
    var tableIns = table.render({
        elem: '#roleList',
        url : '/roleResource/listServices',
        cellMinWidth : 40,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        contentType:"application/json;charset=utf-8",
        id : "serverListTable",
        method : 'post',
        where: aad(),
        request: {
        	  pageName: 'page' //页码的参数名称，默认：page
        	  ,limitName: 'rows' //每页数据量的参数名，默认：limit
        	  
        	},
        response: {
        	   statusName: 'success' //数据状态的字段名称，默认：code
        	  ,statusCode: true //成功的状态码，默认：0
        	  ,msgName: 'msg' //状态信息的字段名称，默认：msg
        	  ,countName: 'obj/total' //数据总数的字段名称，默认：count
        	  ,dataName: 'obj/rows' //数据列表的字段名称，默认：data
        	} ,
        cols : [[
            {checkbox: true, width: 60, fixed: true},
            {field: 'actionId', title: '服务请求ID', width:300, align:"center"},
            {field: 'serviceIds', title: '服务ID', width:300, align:'center'},
            {field: 'description', title: '服务请求描述', Width:200},
        ]],
        even: true
        ,done: function(res, curr, count){
        	
        	//https://www.cnblogs.com/yysbolg/p/8805959.html
        	
            //数据表格加载完成时调用此函数
            //如果是异步请求数据方式，res即为你接口返回的信息。
            //如果是直接赋值的方式，res即为：{data: [], count: 99} data为当前页数据、count为数据总长度

                //设置全部数据到全局变量
                table_data=res.obj.rows;
        	console.log(table_data);
        	
                //在缓存中找到id ,然后设置data表格中的选中状态
                //循环所有数据，找出对应关系，设置checkbox选中状态
                for(var i=0;i< table_data.length;i++){
                        //数据id和要勾选的id相同时checkbox选中
                        if(table_data[i].checked)
                        {
                        	 
                            //这里才是真正的有效勾选
                        	table_data[i]["LAY_CHECKED"]='true';
                            //找到对应数据改变勾选样式，呈现出选中效果
                            var index= table_data[i]['LAY_TABLE_INDEX'];
                            console.log(index+"====");
                            $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                            $('.layui-table-fixed-l tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                        }
                    
                }
                //设置全选checkbox的选中状态，只有改变LAY_CHECKED的值， table.checkStatus才能抓取到选中的状态
                var checkStatus = table.checkStatus('roleList');
                if(checkStatus.isAll){
                    $(' .layui-table-header th[data-field="0"] input[type="checkbox"]').prop('checked', true);
                    $('.layui-table-header th[data-field="0"] input[type="checkbox"]').next().addClass('layui-form-checked');
                }
        }
    });
      

    $(".binding").click(function(){
   	 var checkStatus = table.checkStatus('serverListTable');
   	 var sidsDG=checkStatus.data;
   	 console.log(sidsDG);
     var addCondition ={};
	 var nodeIds = "";
		addCondition['roleCode'] = $('#roleCode').val();
		for(var s in sidsDG)
		nodeIds= nodeIds+sidsDG[s].id+",";
		
	 var resourceType = '1';
		addCondition['resourceType'] = resourceType;
		addCondition['resourceIds'] = nodeIds;
		console.log(addCondition);
		
		$.ajax({
    		type: "post",
    		url: "/roleResource/bindResourceForRole",
    		data: JSON.stringify(addCondition),
    		dataType: "json",
    		headers: {
    			'Content-Type': 'application/json;charset=utf-8'
    		},
    		success: function(o){
    			if(o.success==true){
    				top.layer.msg("服务绑定成功！");
                	
            	}else{
            		layer.msg(o.msg);
            	}
    			
    		},
    	});
    	
   	 return 
   	 
   })
   
    
    
    
   
    
  
 
   

})
