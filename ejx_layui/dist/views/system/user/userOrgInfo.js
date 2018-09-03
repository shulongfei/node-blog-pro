layui.config({
	base:"../../../layuiadmin"
}).extend({
	comExt:"/lib/comExt"
}).use(['form','layer','table','laytpl','comExt'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table,
        index = parent.layer.getFrameIndex(window.name),//获取窗口索引
        comExt = layui.comExt;
 
    //机构列表
    var tableIns = table.render({
        elem: '#orgList',
        url : '/orgInfo/getOrgInfoList',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        loading :true,
        contentType:"application/json;charset=utf-8",
        id : "userOrgTable",
        method : 'post',
        request: {
        	  pageName: 'page' //页码的参数名称，默认：page
        	  ,limitName: 'rows' //每页数据量的参数名，默认：limit
        	},
        response: {
        	  statusName: 'success' //数据状态的字段名称，默认：code
        	  ,statusCode: true //成功的状态码，默认：0
        	  ,msgName: 'msg' //状态信息的字段名称，默认：msg
        	  ,countName: 'obj/jsonData/total' //数据总数的字段名称，默认：count
        	  ,dataName: 'obj/jsonData/rows' //数据列表的字段名称，默认：data
        	} ,
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: 'orgNo', title: '机构编号', minWidth:100, sort: true ,fixed:"left"},
            {field: 'orgName', title: '机构名称', minWidth:100, align:"center"},
            {field: 'orgType', title: '机构类型',  align:'center',templet:function(d){
                return d.orgType == "01" ? "银联" : ("02" ? "商户" : "银行");
            }}
        ]]
    });
    
    //监听搜索按钮事件
    form.on('submit(searchOrgInfo)', function(data){
    	var searchCondition = {searchCondition : data.field};
    	var tableIns = table.render({
            elem: '#orgList',
            url : '/orgInfo/getOrgInfoList',
            cellMinWidth : 95,
            page : true,
            height : "full-125",
            limits : [10,15,20,25],
            limit : 10,
            loading :true,
            contentType:"application/json;charset=utf-8",
            id : "userOrgTable",
            method : 'post',
            where: searchCondition,
            request: {
            	  pageName: 'page' //页码的参数名称，默认：page
            	  ,limitName: 'rows' //每页数据量的参数名，默认：limit
            	},
            response: {
            	  statusName: 'success' //数据状态的字段名称，默认：code
            	  ,statusCode: true //成功的状态码，默认：0
            	  ,msgName: 'msg' //状态信息的字段名称，默认：msg
            	  ,countName: 'obj/jsonData/total' //数据总数的字段名称，默认：count
            	  ,dataName: 'obj/jsonData/rows' //数据列表的字段名称，默认：data
            	} ,
            cols : [[
				{type: "checkbox", fixed:"left", width:50},
				{field: 'orgNo', title: '机构编号', minWidth:100, sort: true ,fixed:"left"},
				{field: 'orgName', title: '机构名称', minWidth:100, align:"center"},
				{field: 'orgType', title: '机构类型',  align:'center',templet:function(d){
					return d.orgType == "01" ? "银联" : ("02" ? "商户" : "银行");
				}}
            ]]
        });
        return false;
    });
    
    
    var orgNoMsg = "";
    var orgNameMsg = "";
    table.on('checkbox(orgList)', function(obj){
    	orgNoMsg = obj.data.orgNo;
    	orgNameMsg = obj.data.orgName;
    });
    $('#setParent').on('click', function(){
    	parent.$('#orgName').val(orgNameMsg);
        parent.$('#orgNo').val(orgNoMsg);
        parent.layer.close(index);
    });
    
    
    
    
    
  

})
