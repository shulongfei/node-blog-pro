/**
 * Draw EasyUI Plugins<br>
 * 项目内所有需要显示的EasyUI组件，如：Grid数据表格，都在这里实现绘制。<br>
 *
 * @author JWY and LX
 * @updateData 2016年9月26日
 */

/**
 * PureMVC 配置脚本
 */
importFile("../js/puremvc-1.0.1.min.js");

// APPLICATION CONSTANTS
importFile("ejx4msg/ApplicationConstants.js");
// EVENTS
//importFile("ejx4msg/view/event/AppEvents.js");
// VIEW COMPONENTS
//importFile("ejx4msg/view/component/TodoForm.js");

// PROXY 
// importFile("ejx4msg/model/CommonProxy.js");
// importFile("ejx4msg/model/UserManageProxy.js");
// MEDIATOR 
// importFile("ejx4msg/mediator/CommonMediator.js");
// importFile("ejx4msg/mediator/UserManageMediator.js");




//流程图
importFile("ejx4msg/mediator/WorkMediator.js");
// COMAND
// importFile("ejx4msg/commands/CommonCommand.js");
// importFile("ejx4msg/commands/UserManageCommand.js");

// START COMMAND
importFile("ejx4msg/StartupCommandWork.js");
// APPLICATION 
importFile("ejx4msg/ApplicationFlowFacade.js");

var drawUI = $.extend({}, drawUI);


//FID列表
drawUI.editor_Treegrid = function(options, tool_bar) {
	tg.treegrid("expandAll");
	return tg;
};

//属性列表
drawUI.prop_Propertygrid = function(options, tool_bar) {
	var pg = $('#' + options).propertygrid({
		toolbar: '#' + tool_bar,
//		url : './data/propertygrid_data1.json',
		showGroup : true,
		scrollbarSize : 0,
		fit : true,
		height : 500,
		columns : [ [ 
			    {title : '名称',field : 'name',width : 100},
			    {title : '值',field : 'value',width : 100}
		] ],
		onSelect : function(index,row){
			// TODO NOTICE　EasyUI1.3.5的包对开启编辑的支持不友好
			$('#'+options).propertygrid("beginEdit",index);
		},
		onAfterEdit : function(index, row, changes){
		}
	});
	return pg;
};

/**
 * 定义导入增加节点方法
 */
add_nodeJs=function(imager,oData,x,y){
//		console.log(oData);
		
		 if(oData.needReverse=="flase"){
			 oData.reverseBean="";
			 oData.reverseMethod="";
		 }
		//var oData=$('#' + datagridDom).treegrid('getSelected');
	if(imager !="Circle-Start" && imager !="Circle-End"){
		if(oData==null){			
			$.messager.alert("提示", "没有数据！");
			return;
		}
		toId=oData.id;
		content =oData.name;
		component =oData.component;
	}else if(imager=="Circle-Start"){
		toId="start";
		content="开始";
		timeout=oData.timeout;
	}else{
		toId="end";
		content="结束";
	}
	
	//检验节点是否重复
	
//	var divs=$("#flow_msg_editor_div div.shape");
//	if(divs.length>0){
//		for ( var i in divs) {
//			var divId =divs[i].id;
//			if(toId==divId){
//				$.messager.alert("提示", "此节点已存在！");
//				return;
//			}
//		}
//	}
  //添加节点
	
	if(imager=="Circle-Start"){
		content="开始";
	}
	
	if(imager=="Circle-End"){
		content="结束";
	}
	instance = window.jsp;
	
	 if(imager == "Circle-Start"||imager == "Circle-End"){
	    	$('#' + msgEditDiv).append(" <div class='shape easyui-draggable' data-options='onDrag:onDrag' data_shape=" + imager + " id=" + toId + " style='top: " + y + "px;left: " + x + "px;'>"+ content + "</span></div>");
	    }else{
	    	
	    	$('#' + msgEditDiv).append(" <div class='shape easyui-draggable' data-options='onDrag:onDrag' data_shape=" + imager + " id=" + toId + " style='top: " + y + "px;left: " + x + "px;'><span class='company'>"+"『"+component+"』"+"</span><span class='service'>" + content + "</span></div>");
	    }
	switch (imager) {
	case "Circle-Start":
		$('#' + toId)[0].setAttribute("needReverse",oData.NeedReverse);//冲正
		$('#' + toId)[0].setAttribute("timeout",oData.timeout);//超时时间
		bpmUtils._addEndpoints(toId,["BottomCenter"], [""]);
		break;
	case "Circle-End":
		bpmUtils._addEndpoints(toId,[""], ["TopCenter"]);
		break;
	case "Rectangle":
		//设置div属性
		$('#'+toId)[0].setAttribute("method", oData.method);
		$('#'+toId)[0].setAttribute("bean", oData.bean);
    	$('#' + toId)[0].setAttribute("needReverse",oData.needReverse);//冲正
    	$('#' + toId)[0].setAttribute("reverseBean",oData.reverseBean);//冲正方法
    	$('#' + toId)[0].setAttribute("reverseMethod",oData.reverseMethod);//冲正类
		bpmUtils._addEndpoints(toId,["BottomCenter"], ["TopCenter"]);
		break;
	case "Rectangle_WH":
		//设置div属性
		$('#'+toId)[0].setAttribute("method", oData.method);
		$('#'+toId)[0].setAttribute("bean", oData.bean);
		$('#' + toId)[0].setAttribute("needReverse",oData.needReverse);//冲正
    	$('#' + toId)[0].setAttribute("reverseBean",oData.reverseBean);//冲正方法
    	$('#' + toId)[0].setAttribute("reverseMethod",oData.reverseMethod);//冲正类
    	$('#' + toId)[0].setAttribute("artificialData",oData.artificialData);//仿真数据
		bpmUtils._addEndpoints(toId,["BottomCenter"], ["TopCenter"]);
		break;
	default:
		break;
	}
	//增加json对象
	var json_node={};
	
	json_node.conditionExpression=[];
	json_node.reqMsgId="";
	json_node.resMsgId="";
	
	json_node.id=toId;
	json_node.sId=oData.sId;
	json_node.cId=oData.cId;
    json_node.needReverse =oData.needReverse;
    json_node.timeout =oData.timeout;
    json_node.artificialData =oData.artificialData;
    json_node.reverseBean =oData.reverseBean;
    json_node.reverseMethod =oData.reverseMethod;
	//在json对象中加入json对象
	var content_node={};
	//节点描述
	content_node.name=content;
	json_node.content=content_node;
	json_node.component=oData.component;
	
	//给json对象添加一个targetRef属性数组
	json_node.targetRef=[];
	//将结束节点放在最后
	if(imager=="Circle-End"){
		global.push(json_node);
	}
	//将开始节点放在第一位
	if(imager=="Circle-Start"){
		json_node.Pid=oData.Pid;
		json_node.Name=oData.Name;
		json_node.NeedReverse=oData.NeedReverse;
		global.unshift(json_node);
	}
	//将方法节点放到第2位
	if(imager=="Rectangle"){
		json_node.category ="biz";
		content_node.bean=oData.bean;
		content_node.method=oData.method;
		global.splice(1,0,json_node);
	}
	if(imager=="Rectangle_WH"){
		json_node.category ="outbound";
		content_node.bean=oData.bean;
		content_node.method=oData.method;
		content_node.need_reverse=oData.need_reverse;
		content_node.reverse_cid=oData.reverse_cid;
		content_node.reverse_sid=oData.reverse_sid;
		json_node.artificialData =oData.artificialData;
		global.splice(1,0,json_node);
	}
	
    instance.draggable(jsPlumb.getSelector(".shape"), { grid: [40, 40] });

    //锚点移动
//instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });
	instance.bind("connection", function (connInfo, originalEvent) {
		bpmUtils.init(connInfo.connection);
    });

};

