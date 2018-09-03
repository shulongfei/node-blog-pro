/**
 @Name：layuiAdmin（iframe版） 新增页面
 @Site：http://www.layui.com/admin/
 @License：LPPL
 @addIfame（title,content,tip）
 	title: 新增页面信息
 	contnet：页面相对路径
 	tip: 页面提示信息
 */

layui.define(['jquery', 'table', 'comExt'], function(exports){ 
	
    var $ = layui.jquery,
    	table = layui.table,
    	form = layui.form;
    	
    managerObj = {
    	// 表单新增
	    add: function(title,content,tip) {
		    var index = layui.layer.open({
		      title : title,
		      // type 2表示iframe层
		      type : 2,
		      content : content,
		      success : function(layero, index){
	          	// layero当前层DOM index当前层索引
		        var body = layui.layer.getChildFrame('body', index);
		        // 延迟加载0.3秒，当页面完全展开的时候加载
		        setTimeout(function(){
		          layui.layer.tips(tip, '.layui-layer-setwin .layui-layer-close', {
		            // tips: 3 表示向下的箭头  
		            tips: 3,
		            // 提示图表显示的时间，当前设置为1秒
		            time: 1000
		          });
		        },300);
		      }
		    })
		    layui.layer.full(index);
		    window.sessionStorage.setItem("index",index);
		},

		// 表单修改
		update: function(title,content,tip,tableElem,data) {
			if(!data){
				var checkStatus = table.checkStatus(tableElem);
				if(checkStatus.data.length > 1) {
			         layer.msg("当前只能修改一条数据");
			         return;
			         }
				data = checkStatus.data[0];
			}
      		
			if(data === null || data === undefined){
				layer.msg("请选择需要修改的内容");
				return false;
			}

			var index = layer.open({
	            title : title,
	            type : 2,
	            content : content,
	            success : function(layero, index){
	                var body = layer.getChildFrame('body', index);
	                setTimeout(function(){
	                    layer.tips(tip, '.layui-layer-setwin .layui-layer-close', {
	                       // tips: 3 表示向下的箭头  
			               tips: 3,
			               // 提示图表显示的时间，当前设置为1秒
			               time: 1000
	                    });
	                },300);
	                fillInput(body,data);
	            }
	        });

	        layer.full(index);		          
			window.sessionStorage.setItem("index",index);
			// 数据存贮, 暂时不需要
			// layui.data("rowData",{key:"data",value:data});

		    function fillInput(parent,data) {
				for(var key in data){
					var id= "#"+key;
					parent.find(id).val(data[key]) ;
				}
				form.render();
			}
		},

		deleteRow: function(tableElem,url, id, data) {
			if(!data){
				//获取选中行
				var checkStatus = table.checkStatus(tableElem);
				if(checkStatus.data.length == 0) {
			         layer.msg("当前只能选择一条需要删除的内容");
			         return;
			     }
				data = checkStatus.data;
			}
			if(data === null || data === undefined){
				layer.msg("请选择需要删除的内容");
				return false;
			}
	      	var newsId = [];
	      	if(typeof data == "Array"){
	      		for(d in data){
		      		newsId.push(data[d].id);	//
		      	}
	      	}else{
	      		newsId.push(data.id);
	      	}
	      	var id ={id: newsId.join()};
           	layer.confirm('确定删除选中的内容？', {title: '提示信息'}, function (index) {
     		layui.comExt.ajax({
           		url: url,
           		data: JSON.stringify(id),
           		success: function(o){
           			layer.close(index);
           			//执行重载
				      table.reload('test-table-resetPage', { page: { curr: 1 }});
           	
           			top.layer.msg("删除成功！");
           		},
           		error:function(e){
           			//如果不需要comExt.ajax提供的error提示，需要在结尾return;
           			layer.close(index);	
           			top.layer.msg("删除失败！错误码："+e.status);
           			return ; 
           		}
           	});
           });
		},
		
		
    }
    
	// 改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
	$(window).on("resize",function(){
	  var index = window.sessionStorage.getItem("index");
	  if(!$('#layui-layer'+ index)[0]){
	    return;
	  }
	  layui.layer.full(index);
	});
 
    //输出接口
    exports('manager', managerObj);
});