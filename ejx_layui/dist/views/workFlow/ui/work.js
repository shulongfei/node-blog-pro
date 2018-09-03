/**
 * @author JWY and LX
 * @date 2016年9月26日
 */
jsPlumb.ready(function() {
	
	
	getGlobalIndex = function (id){
    	if(global){
    		for(i = 0; i < global.length; i++){
        		var temp = global[i];
        		if(temp && temp.id == id){
        			return i;
        		}
        	}
    	}
    	return 0;
    }
    var instance = window.jsp = jsPlumb.getInstance({
        Endpoint: ["Dot", {
            radius: 2
        }],
        Connector: "StateMachine",
        HoverPaintStyle: {
            strokeStyle: "#1e8151",
            lineWidth: 9
        },
        //拖动时鼠标停留在该元素上显示指针，通过css控制,
        ConnectionOverlays: [["Arrow", {
            location: 1,
            visible: true,
            id: "ARROW",
            events: {
            	click: function() {
            	//	paintStyle:bpmUtils.basicType
            		//点击流程连线箭头则可触发此处单击事件
                    console.log("you clicked on the arrow overlay");
                }
            }
        }], ["Label", {
            location: 0.6,
            id: "label",
            cssClass: "aLabel",
            events: {
                //线上的数据
                tap: function(a) {
                	$.messager.prompt('输入', ' 请输入条件内容', function(r){
                		var result="";
                		if (r != "" || r != undefined ){
                			 result = r;
                			 if (result==null || result=="") {
                                 result = a.label;
                             } else {
                                 //获取线上条件框源端点所在节点节点ID
                                 var condition_upId = a.component.endpoints["0"].elementId;
                                 //获取线上条件框锚点所在节点节点ID
                                 var condition_tId = a.component.endpoints["1"].elementId;
                                 //将条件内容存到上级节点内
                                 for (var i in global) {
                                     if (global[i].id == condition_upId) {
                                         //获取文本框输入的值在conditionExpression数组中的位置
                                         var index = $.inArray(result, global[i].conditionExpression);
                                         var loc = $.inArray(condition_tId, global[i].targetRef);
                                         //如果输入值不存在conditionExpression中则添加
                                         if (index == -1) {
                                             global[i].conditionExpression.splice(loc, 1, result);
                                             //a.label = result
                                            //如果输入值存在conditionExpression数组中且不为默认则提示
                                         } else if(result !="默认" && index != -1){
                                         	result = a.label;
                                             $.messager.alert("提示", "条件内容必须唯一！");
                                         }
                                     }
                                 }
                             }
                		}
                		a.setLabel(result);
                	});
                	//在弹出的输入框内显示分支条件的内容
                	$(".messager-input").val(a.labelText);
                }
            }
        }]],

        Container: "canvas"
    });

    //图片
    var shapes = jsPlumb.getSelector(".shape");
    instance.draggable(shapes);
/*
    instance.bind("connectionDrag", function (connection) {
       alert("aaa");
    });*/
    //单击选中连线
    instance.bind("click",
    	    function(conn, originalEvent) {
    	        conn.toggleType("basic");
    	    });
    //双击删除连线
    instance.bind("dblclick",
    function(conn, originalEvent) {
    	 conn.toggleType("basic");
    	 var msg =confirm("确定删除连线：" + conn.sourceId + "->" + conn.targetId + "?");
    	if (msg == true){
    		 instance.detach(conn);
    		  for (var i in global) {
    	            //判断源点和目标点是否相连
    	            if (global[i].id == conn.targetId) {
    	                for (var j in global) {
    	                    //判断global中id是源点id的对象
    	                	  if (global[j].id == conn.sourceId) {
    	  		                //删除连线
    	  		                    //获取目标id的下标
    	  		                    var index = $.inArray(conn.targetId, global[j].targetRef);
    	  		                    //删除指定下标值
    	  		                    global[j].targetRef.splice(index, 1);
    	  		                    global[j].conditionExpression.splice(index, 1);
    	  		            }
    	                }
    	            }
    	        }
    	}
    });
    instance.bind("connectionDrag",
    function(connection) {
		for (var i in global) {
		    //判断源点和目标点是否相连
		    if (global[i].id == connection.targetId) {
		        for (var j in global) {
		            //判断global中id是源点id的对象
		            if (global[j].id == connection.sourceId) {
		                //删除连线
		                if (connection.target != null) {
		                    //获取目标id的下标
		                    var index = $.inArray(connection.targetId, global[j].targetRef);
		                    //删除指定下标值
		                    global[j].targetRef.splice(index, 1);
		                    global[j].conditionExpression.splice(index, 1);
		                } 
		            }
		        }
		
		    }
		}
    });
    
    instance.bind("connectionDragStop",
    function(connection) {
        for (var i in global) {
            //判断源点和目标点是否相连
            if (global[i].id == connection.targetId) {
                for (var j in global) {
                    //判断global中id是源点id的对象
                    if (global[j].id == connection.sourceId) {
                        //删除连线
                        if (connection.target == null) {
                            //获取目标id的下标
                            var index = $.inArray(connection.targetId, global[j].targetRef);
                            //删除指定下标值
                        } else {
                            //将值放进目标数组中
                            global[j].targetRef.push(connection.targetId);
                            //将默认值放进条件数组
                            global[j].conditionExpression.push("默认");
                        }
                    }
                }
            }
        }
    });

    instance.bind("connectionMoved",
    function(params) {
    });

    jsPlumb.fire("jsPlumbDemoLoaded", instance);
    
    var basicType = {
            connector: "StateMachine",
            paintStyle: { strokeStyle: "black", lineWidth: 1 },
            hoverPaintStyle: { strokeStyle: "blue" },
            overlays: [
                "Arrow"
            ]
        };
        instance.registerConnectionType("basic", basicType);

});

var bpmUtils = $.extend({},bpmUtils);


bpmUtils.basicType = {
		
    connector: "StateMachine",//线条形状
    paintStyle: {
        strokeStyle: "blue", //点击线条颜色变红
        lineWidth: 1
    },
    
    hoverPaintStyle: {
        strokeStyle: "blue"//鼠标移入线条变蓝色
    },
    
    overlays: ["Arrow"]
};

bpmUtils.connectorPaintStyle = { //默认连线样式
    lineWidth: 1,
    strokeStyle: "red",
    joinstyle: "round",
    outlineColor: "white",
    outlineWidth: 1
};

bpmUtils.connectorHoverStyle = { //移入
    lineWidth: 1,
    strokeStyle: "blue",
    outlineWidth: 1,
    outlineColor: "white"
};

bpmUtils.endpointHoverStyle = { //结束端点样式
    fillStyle: "#216477",
    strokeStyle: "#216477"
};

bpmUtils.sourceEndpoint = { //源端点
    endpoint: "Dot",
    paintStyle: {
        strokeStyle: "#7AB50C",
        fillStyle: "transparent",
        radius: 6,
        lineWidth: 3
    },
    isSource: true,
    maxConnections: 999,
    connector: ["Flowchart", {
        stub: [4, 22],
        gap: 10,
        cornerRadius: 5,
        alwaysRespectStubs: true
    }],
    connectorStyle: bpmUtils.connectorPaintStyle,
    hoverPaintStyle: bpmUtils.endpointHoverStyle,
    connectorHoverStyle: bpmUtils.connectorHoverStyle,
    dragOptions: {},
    overlays: [["Label", {
        location: [0.5, 1.5],
        label: "Drag",
        cssClass: "endpointSourceLabel",
        visible: false
    }]]
};

bpmUtils.targetEndpoint = { //目标端点
    endpoint: "Dot",
    paintStyle: {
        fillStyle: "#7AB02C",
        radius: 6
    },
    hoverPaintStyle: bpmUtils.endpointHoverStyle,
    maxConnections: 999,// 设置连接点最多可以连接几条线
    dropOptions: {
        hoverClass: "hover",
        activeClass: "active"
    },
    isTarget: true,//是否可以放置（连线终点）
    overlays: [["Label", {
        location: [0.5, -0.5],
        label: "Drop",
        cssClass: "endpointTargetLabel",
        visible: false
    }]]
},
bpmUtils.init = function(connection) {
    connection.setEditable(true);
    connection.getOverlay("label").setLabel("默认");
    //遍历gloobal
    for(var i=0;i<global.length;i++){
    	//找到源点数据
    	if(global[i].id==connection.sourceId){
    		//遍历目标点
    		for(var j=0;j<global[i].targetRef.length;j++){
    			if(global[i].targetRef[j]==connection.targetId){
    				connection.getOverlay("label").setLabel(global[i].conditionExpression[j]);
    			}
    		}
    	}
    }
    
};

//方法节点信息
bpmUtils._addEndpoints = function(toId, sourceAnchors, targetAnchors) {
    //添加起始端点    
    if (sourceAnchors != "") {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint(toId, bpmUtils.sourceEndpoint, {
                anchor: sourceAnchors[i],
                uuid: sourceUUID
            });

        }
    }
    //单击选中节点
    $('#' + toId).bind("click",
    function(e) {
    	//console.log(e);
        $("#flow_msg_editor_div div").removeClass("selected");
        $('#' + toId).addClass("selected");
        //选中节点后在节点属性编辑框内所展示的数据
        var oData = {};
        oData["id"] = $(this).context.id; // ID为类型
        oData["name"] = $(this).text(); // ID为类型
        oData["bean"]=$(this)[0].getAttribute("bean");
        oData["method"]=$(this)[0].getAttribute("method");
        oData["needReverse"]=$(this)[0].getAttribute("needReverse");
        oData["reverseBean"]=$(this)[0].getAttribute("reverseBean");
        oData["reverseMethod"]=$(this)[0].getAttribute("reverseMethod");
        oData["timeout"]=$(this)[0].getAttribute("timeout");
        oData["artificialData"]=$(this)[0].getAttribute("artificialData");
        msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW, oData);
    });
    //添加目标端点
    if (targetAnchors != "") {

        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(toId, bpmUtils.targetEndpoint, {
                anchor: targetAnchors[j],
                uuid: targetUUID
            });
        }
    }

};

//方法节点信息
bpmUtils._addEndpointsStart = function(toId, sourceAnchors, targetAnchors) {
    //添加起始端点    
    if (sourceAnchors != "") {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint(toId, bpmUtils.sourceEndpoint, {
                anchor: sourceAnchors[i],
                uuid: sourceUUID
            });

        }
    }
    //单击选中节点
    $('#' + toId).bind("click",
    function(e) {
        $("#flow_msg_editor_div div").removeClass("selected");
        $('#' + toId).addClass("selected");
        //选中节点后在节点属性编辑框内所展示的数据
        var oData = {};
        oData["fid"]=$(this)[0].getAttribute("fid");
        oData["fname"]=$(this)[0].getAttribute("fname");
        oData["id"] = $(this).context.id; //流程ID
        oData["name"] = $(this).text(); //流程名称
        
        msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_START, oData);
    });
    //添加目标端点
    if (targetAnchors != "") {
        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(toId, bpmUtils.targetEndpoint, {
                anchor: targetAnchors[j],
                uuid: targetUUID
            });
        }
    }
};
//方法节点信息
bpmUtils._addEndpointsEnd = function(toId, sourceAnchors, targetAnchors) {
    //添加起始端点    
    if (sourceAnchors != "") {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint(toId, bpmUtils.sourceEndpoint, {
                anchor: sourceAnchors[i],
                uuid: sourceUUID
            });

        }
    }
    //单击选中节点
    $('#' + toId).bind("click",
    function(e) {
        $("#flow_msg_editor_div div").removeClass("selected");
        $('#' + toId).addClass("selected");
        //选中节点后在节点属性编辑框内所展示的数据
        var oData = {};
        oData["fid"]=$(this)[0].getAttribute("fid");
        oData["fname"]=$(this)[0].getAttribute("fname");
        oData["id"] = $(this).context.id; //流程ID
        oData["name"] = $(this).text(); //流程名称
        
        msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_END, oData);
    });
    //添加目标端点
    if (targetAnchors != "") {

        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(toId, bpmUtils.targetEndpoint, {
                anchor: targetAnchors[j],
                uuid: targetUUID
            });
        }
    }

};
//UserTask方法节点信息
var nameIndex = 0;
bpmUtils._addEndpointsUserTask = function(toId, sourceAnchors, targetAnchors, userTaskName) {
    //添加起始端点    
    if (sourceAnchors != "") {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint(toId, bpmUtils.sourceEndpoint, {
                anchor: sourceAnchors[i],
                uuid: sourceUUID
            });
        }
    }
    //单击选中节点
    $('#' + toId).bind("click",
    function(e) {
        $("#flow_msg_editor_div div").removeClass("selected");
        $('#' + toId).addClass("selected");
        //选中节点后在节点属性编辑框内所展示的数据
        var oData = {};
        oData["fid"]=$(this)[0].getAttribute("fid");//流程id
        oData["fname"]=$(this)[0].getAttribute("fname");//流程名称
        oData["id"] = $(this).context.id; //节点ID
        var i = getGlobalIndex(oData["id"]);//有oData["id"]的数组的索引
        var strName = $("#" + oData["id"] + " span:first-child").text().replace("『","").replace("』","");
        oData["name"] = global[i].name = strName; //节点名称
        oData["assignee"] = global[i].assignee; //任务执行人
        
        oData["NAV_URL"] = global[i].params.NAV_URL; 
        oData["C1"] = global[i].params.C1; 
        oData["C2"] = global[i].params.C2; 
        oData["C3"] = global[i].params.C3; 
        oData["C4"] = global[i].params.C4; 
        
        msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_USERTASK, oData);
    });
    //添加目标端点
    if (targetAnchors != "") {

        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(toId, bpmUtils.targetEndpoint, {
                anchor: targetAnchors[j],
                uuid: targetUUID
            });
        }
    }
    var taskName = "";
    if(userTaskName){
    	taskName = userTaskName;
    }else{
    	taskName = ("userTask" + nameIndex);
    }
    var string = "<span class='company'>『" + taskName + "』</span>" + 
    "<span class='service'>" + toId + "</span>";
    nameIndex ++;
    $('#' + toId).html(string);
};
//ServiceTask方法节点信息
bpmUtils._addEndpointsServiceTask = function(toId, sourceAnchors, targetAnchors, serviceTaskName) {
    //添加起始端点    
    if (sourceAnchors != "") {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint(toId, bpmUtils.sourceEndpoint, {
                anchor: sourceAnchors[i],
                uuid: sourceUUID
            });

        }
    }
    //单击选中节点
    $('#' + toId).bind("click",
    function(e) {
    	//console.log(e);
        $("#flow_msg_editor_div div").removeClass("selected");
        $('#' + toId).addClass("selected");
        //选中节点后在节点属性编辑框内所展示的数据
        var oData = {};
        oData["fid"]=$(this)[0].getAttribute("fid");//流程id
        oData["fname"]=$(this)[0].getAttribute("fname");//流程名称
        oData["id"] = $(this).context.id; //节点ID
        var i = getGlobalIndex(oData["id"]);//有oData["id"]的数组的索引
        var strName = $("#" + oData["id"] + " span:first-child").text().replace("『","").replace("』","");
        oData["name"] = global[i].name = strName; //节点名称
        oData["delegateExpression"] = global[i].delegateExpression; //委托表达式
        
        msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_SERVICETASK, oData);
    });
    //添加目标端点
    if (targetAnchors != "") {

        for (var j = 0; j < targetAnchors.length; j++) {
            var targetUUID = toId + targetAnchors[j];
            instance.addEndpoint(toId, bpmUtils.targetEndpoint, {
                anchor: targetAnchors[j],
                uuid: targetUUID
            });
        }
    }
    var taskName = "";
    if(serviceTaskName){
    	taskName = serviceTaskName;
    }else{
    	taskName = ("serviceTask" + nameIndex);
    }
    var string = "<span class='company'>『" + taskName + "』</span>" + 
    "<span class='service'>" + toId + "</span>";
    nameIndex ++;
    $('#' + toId).html(string);
};

var LoadFlowInfo = function(){
	//console.log(e);
    //选中节点后在节点属性编辑框内所展示的数据
    var oData = {};
//    oData["fid"] = global[0].fid;//流程id
//    oData["fname"] = global[0].fname;//流程名称
    oData["fid"] = flowinfo.fid;//流程id
    oData["fname"] = flowinfo.fname;//流程名称

    
    msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_FLOW, oData);
};
