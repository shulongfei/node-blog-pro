	puremvc.define({
	    name: 'ejx4msg.view.mediator.WorkMediator',
	    parent: puremvc.Mediator
	},
	{
	    listNotificationInterests: function() {
	        return [ejx4msg.AppConstants.FLOW_PRO_DATA_SHOW, // 节点属性显示
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_UPDATE, // 更新节点内容
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIALOG_SHOW, // 添加按钮到面板的对话框
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_IDFIELD_SET, // 添加按钮到面板
	                ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_UPDATE, // 展示报文字符串的对话框
	                ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_UP_SHOW, // 导入报文对话框
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW, // 展示动态Div数据
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_START, // 展示开始节点动态Div数据
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_END, // 展示开始节点动态Div数据
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_USERTASK, // 展示用户节点动态Div数据
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_SERVICETASK,// 展示业务节点动态Div数据
	                ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_FLOW, //展示流程参数数据
	                ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_SEARCH //展示流程报文
	        ];
	    },
	    onRegister: function() {
	        msgMediator = this;
	        // DOM 节点变量
	        msgEditDiv = "flow_msg_editor_div";
	
	        propertygridDom = "flow_prop_pg1";//节点参数表格id
	        propertygridDomFlow = "flow_prop_pg2";//流程参数表格id
	        //datagridDom = "flow_fid_dg";
	        nodeBtnsDiv = "node_toolbar_div";
	        //sTreegridIdFieldHref = "iframe_msg_idfield.html";
	        sTreegridContentHref = "iframe_msg_content.html";
	
	        // DOM 转为 EasyUI 控件
	        var pg = drawUI.prop_Propertygrid(propertygridDom, 'flow_prop_toolbar');
	        drawUI.prop_Propertygrid(propertygridDomFlow, '');
	        msgIdField = tree_Node.id; // "fid"
	        msgTextField = tree_Node.text; // "clazz"
	
	        // 绘制属性栏工具条的按钮
	        var sPropToolBarDiv = "flow_prop_toolbar_div"; // 对应HTML内承接按钮组的DIV
	        var sPropToolBarId = "flow_prop_toolbar"; // 生成ToolBar的ID，供组件使用
	        var sPropBtnCancel = utils.createButtonA("flow_prop_toolbar_btn_cancel", "icon-undo", "撤销");
	        var sPropBtnSubmit = utils.createButtonA("flow_prop_toolbar_btn_submit", "icon-save", "更新");
	        var oPropBtns = [sPropBtnCancel, sPropBtnSubmit];
	        var sPropBtnsHtml = utils.createButtonDiv(sPropToolBarId, oPropBtns, "datagrid");
	        $("#" + sPropToolBarDiv).append(sPropBtnsHtml);
	        $.parser.parse("#" + sPropToolBarDiv);
	        _propToolBarBtnMehods(); // 为按钮设定触发事件事件
	        // 绘制报文栏工具条的按钮
	        var sMsgToolBarDiv = "flow_work_toolbar_div"; // 对应HTML内承接按钮组的DIV
	        var sMsgToolBarId = "flow_work_toolbar"; // 生成ToolBar的ID，供组件使用
	        var sMsgBtnCancel = utils.createButtonA("flow_msg_toolbar_btn_remove", "icon-remove", "移除");
		    var sMsgBtnDown = utils.createButtonA("flow_msg_toolbar_btn_down", "icon-down", "导入");
		    var sMsgBtnSave = utils.createButtonA("flow_msg_toolbar_btn_up", "icon-save", "保存");
		    var sMsgBtnShow = utils.createButtonA("flow_msg_toolbar_btn_show", "icon-search", "查看报文");
		    var sMsgBtnRemoveAll = utils.createButtonA("removeAll", "icon-no", "清屏");
		    var sMsgUpdatePid = utils.createButtonA("UpdatePid", "icon-reload", "修改流程编码");
	
	        var oMsgBtns = [sMsgBtnDown, "|", sMsgBtnCancel, "|", sMsgBtnRemoveAll, "|", sMsgBtnSave, "|", sMsgBtnShow,"|" ,sMsgUpdatePid];
	        var sMsgBtnsHtml = utils.createButtonDiv(sMsgToolBarId, oMsgBtns, "datagrid");
	        
	        var sMsgToolBarId2 = "flow_work_toolbar2";
	        var sMsgBtnCircleStart = utils.createButtonA("Circle-Start", "icon-add", "startEvent");
	        //var sMsgBtnRectangle = utils.createButtonA("Rectangle", "icon-add", "Rectangle");
	        var userTask = utils.createButtonA("userTask", "icon-add", "userTask");
	        var serviceTask = utils.createButtonA("serviceTask", "icon-add", "serviceTask");
	        
	        var sMsgBtnCircleEnd = utils.createButtonA("Circle-End", "icon-add", "entEvent");
	        var oMsgBtns2 = [sMsgBtnCircleStart, "<Br><Br><Br>", sMsgBtnCircleEnd,
	                         "<Br><Br><Br>",userTask,"<Br><Br><Br>",serviceTask];
	        var sMsgBtnsHtml2 = utils.createButtonDiv(sMsgToolBarId2, oMsgBtns2, "datagrid");
	        
	        $("#" + sMsgToolBarDiv).append(sMsgBtnsHtml);
	        $("#" + nodeBtnsDiv).append(sMsgBtnsHtml2);
	        $.parser.parse("#" + sMsgToolBarDiv);
	        _createNodeBtns
	        _msgToolBarBtnMehods(); // 为按钮设定触发事件事件
	    },
	
	    handleNotification: function(note) {
	        var body = note.getBody();
	        switch (note.getName()) {
	        case ejx4msg.AppConstants.FLOW_PRO_DATA_SHOW:
	
	            var jRes = utilUI.createPropertygridJson1(body[msgTextField], body);
	            $('#' + propertygridDom).propertygrid('loadData', jRes);
	            break;
	            
	            //处理动态生成div
	        case ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW:
	            var jRes = utilUI.createPropertygridJson1(body[msgIdField], body);
	            $('#' + propertygridDom).propertygrid('loadData', jRes);
	            break;
	        case ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_START:
	            var jRes = utilUI.createPropertygridJsonStart(body[msgIdField], body);
	            $('#' + propertygridDom).propertygrid('loadData', jRes);
	            break;
	        case ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_END:
	            var jRes = utilUI.createPropertygridJsonEnd(body[msgIdField], body);
	            $('#' + propertygridDom).propertygrid('loadData', jRes);
	            break;
	        case ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_USERTASK:
	            var jRes = utilUI.createPropertygridJsonUserTask(body[msgIdField], body);
	            $('#' + propertygridDom).propertygrid('loadData', jRes);
	            break;
	        case ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_SERVICETASK:
	            var jRes = utilUI.createPropertygridJsonServiceTask(body[msgIdField], body);
	            $('#' + propertygridDom).propertygrid('loadData', jRes);
	            break;
	        case ejx4msg.AppConstants.FLOW_MESSAGE_DATA_DIV_SHOW_FLOW:
	            var jRes = utilUI.createPropertygridJsonFlow(body[msgIdField], body);
	            $('#' + propertygridDomFlow).propertygrid('loadData', jRes);
	            break;
	        case ejx4msg.AppConstants.FLOW_MESSAGE_DATA_UPDATE:
	            var id = $('#flow_msg_editor_div div.selected')[0].id;
	            if (body[msgIdField] != id && body[msgIdField] != null) {
	                $.messager.alert("提示", "id不能改变！");
	                _cancel();
	                return;
	            }
	            var str1;//流程配置窗口中节点 company
	            var str2 = id;//流程配置窗口中节点 service
	            //遍历global
	            for (var j in global) {
	                if (global[j].id == id) {
	                    //遍历改变过的值
	                    for (var i in body) {
	                        if (i == "clazz") {
	                            global[j].content.name = body[i];
	                        } else if (i == "NAV_URL") {
	                            global[j].params.NAV_URL = body[i];
	                        } else if (i == "C1") {
	                            global[j].params.C1 = body[i];
	                        } else if (i == "C2") {
	                            global[j].params.C2 = body[i];
	                        } else if (i == "C3") {
	                            global[j].params.C3 = body[i];
	                        }else if (i == "C4") {
	                            global[j].params.C4 = body[i];
	                        }else if (i == "name") {
	                            global[j].name = body[i];
	                            str1 = global[j].name;
	                        }else if (i == "assignee") {
	                            global[j].assignee = body[i];
	                        }else {
	                            global[j][i] = body[i];
	                        }
	                    }
	                }
	            }
	            if(str1){
	            	var string = "<span class='company'>『" + str1 + "』</span>" + 
		            "<span class='service'>" + str2 + "</span>";
		            $('#' + id).html(string);	
	            }
//	            $('#' + id).text(body[msgTextField]);
	            break;
	
	        case ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_UPDATE:
	            msgIdFiedDialog = extJQ.dialog({
	                title: '流程(XML格式)',
	                href: sTreegridContentHref,
	                width: 900,
	                height: 400,
	                buttons: [{
	                    text: '确定',
	                    iconCls: 'icon-ok',
	                    handler: function() {
	                    	msgIdFiedDialog.dialog('close');
	                        window.close();
	                    }
	                }],
	                onLoad: function() {
	                	//获取保存框内的数据内容
	                	var save_Box=utilUI.workGetFormatStr(extUtil.json2Str(global));
	                	Process_Data=save_Box;
	                	if (newType == "2") {
							pId=procKey;
						//	pName=procName;
							
						}
	                	//console.log(pName);
	                	//发送请求储存数据
	                	utils.ajaxPost(staticParam.action_reqPath_main,"inputManagerService_insert",{
	                		"newType" :newType,
	                		"sId" :sId,
	                		"procKey":pId,
	            			"name":pName,
	            			"resourceData":Process_Data
	            		},
	            			function(o){
	            		}
	                	); 
	                	
	                	// Load Data
	                    $('#content').val(utilUI.workGetFormatStr(body)); // Load Data
	                    $('#content').format({method: 'xml'}); //格式化
	                }
	            });
	            break;
	            //展示报文数据
	        case ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_SEARCH:
	        	msgIdFiedDialog = extJQ.dialog({
	        		title: '流程(XML格式)',
	        		href: sTreegridContentHref,
	        		width: 900,
	        		height: 400,
	        		buttons: [{
	        			text: '确定',
	        			iconCls: 'icon-ok',
	        			handler: function() {
	        				msgIdFiedDialog.dialog('close');
	        				window.close();
	        			}
	        		}],
	        		onLoad: function() {
	        			//获取保存框内的数据内容
	        			var save_Box=utilUI.workGetFormatStr(extUtil.json2Str(global));
	        			Process_Data=save_Box;
	        			if (newType == "2") {
	        				pId=procKey;
	        				//	pName=procName;
	        				
	        			}
	        			// Load Data
	        			$('#content').val(utilUI.workGetFormatStr(body)); // Load Data
	        			$('#content').format({method: 'xml'}); //格式化
	        		}
	        	});
	        	break;
	        	//流程导入
	        case ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_UP_SHOW:
//	        	加载数据
	            msgIdFiedDialog = extJQ.dialog({
	                title: '流程导入',
	                href: sTreegridContentHref,
	                width: 800,
	                height: 400,
	                buttons: [{
	                    text: '确认',
	                    iconCls: 'icon-ok',
	                    handler: function() {
	                    	var divs = $("#flow_msg_editor_div div.shape");
              	            for (var i = 0; i < divs.length; i++) {
              	                var id = divs[i].id;
              	                instance.detachAllConnections(id);
              	                instance.removeAllEndpoints(id);
              	                $('#' + id).remove();
              	            }
	              	            global = [];
	              	            flowinfo = {};
	              	            nameIndex = 0;
	              	          var content = $('#content').val();
		                    	add_Xml(content);
	                    	msgIdFiedDialog.dialog('close');
	                    }
	                },
	                {
	                    text: '关闭',
	                    iconCls: 'icon-cancel',
	                    handler: function() {
	                        msgIdFiedDialog.dialog('close');
	                    }
	                }],
	                onLoad: function() {
	                }
	            });
	            break;
	        }
	    }
	},
	{
	    NAME: 'WorkMediator'
	});
	/**
	 * 绘制按钮，绑定事件,节点类型
	 * @param btns
	 * @param icon
	 * @param o
	 */
	function _createNodeBtns(btns, icon) {
		$("#" + nodeBtnsDiv).empty(); // 清空div内旧数据
		var aNode = utilUI.delEmptyItem(btns.split(","));
		var aNodes = [];
		for ( var i in aNode) {
			aNodes.push("<div>"
					+ utils.createButtonA(aNode[i], icon, aNode[i])
					+ "</div>");
			// 按钮事件
			$(document).off("click", '#' + aNode[i]); // 移除绑定的事件，解决按钮事件重复
		}
		$("#" + nodeBtnsDiv).append(utils.createButtonDiv("djq", aNodes, "datagrid"));
		$.parser.parse("#" + nodeBtnsDiv);
		// 解决按钮禁用后，事件未禁用的问题
		for (var i in aNode) {
			$('#' + aNode[i]).bind( "click", function() {
				var oData = {};
				oData[msgTextField] = this.id;
				//修改发送的请求完成对应弹框加载
				msgMediator.sendNotification(ejx4msg.AppConstants.MSG_MESSAGE_DATA_DIALOG_SHOW, oData);
			});
		}
	};
	/**
	 * 撤销按钮事件设定
	 */
	var _cancel = function() {
	    $('#' + propertygridDom).propertygrid('rejectChanges');
	};
	
	//定义json全局变量
	var global = [];
	var flowinfo = {};//流程信息全局变量： fif-流程编号  fname-流程名称
	
	
	var Need_reverse="";
	var Reverse_sid="";
	var Reverse_cid="";
	var artificialData="";
	//获取点击树节点的ID
	var sId=utils.getParameter("id");
	//console.log(sId);
	//var cId=utils.getParameter("cid");
	var pId="";
	var pName="";
	var newType="";
	var procKey=sId.split(":")[0];
	var procName=utils.getParameter("name");
	
	
	
    if(sId== ""){
  		 newType = "1";//如果请求页面传递的id为空，则直接新增流程
  	}else {
  		 newType = "2";//如果请求页面传递的id为不空，则跟新版本号后再新增流程
  	}
	var tree_Node="";
  	//导入XML报文方法
  	function add_Xml(content){
  		
  		 //xml 转json
        var js = utilUI.xmlStr2json(content);
        var x = "";
        var y = "";
        var oData;
        js[0].children.push(pId);
        for (var i in js[0].children) {
        	
            //oData节点数据数组
            oData = js[0].children[i];
            //处理节点坐标
        	if (oData.x==undefined || oData.x=="") {
        		x="10";
			} else {
				//获取X坐标
				x = oData.x.replace("px", "");
			}
        	
        	if (oData.y==undefined || oData.y=="") {
				 y=i*90+'' ;
			} else {
				//获取Y点坐标
				y = oData.y.replace("px", "");
			}
            
            //导入开始节点
            if (oData.clazz == "startEvent") {
            	oData.Pid = js["0"].id;
            	oData.Name = js["0"].name;
            	if(newType == "1"){
            		pId=js["0"].id;
            	}else if (newType == "2") {
            		pId=procKey;
				}
            	pName=js["0"].name;
            	
       //     	oData.NeedReverse = js["0"].needReverse;
       //     	oData.timeout = js["0"].timeout;
            	oData.ArtificialData = js["0"].ArtificialData;
            	
               add_nodeJs("Circle-Start", oData, x, y, "Circle-Start");
            }
            //导入结束节点
            if (oData.clazz == "endEvent") {
            	
                add_nodeJs("Circle-End", oData, x, y, "Circle-End");
            }
            //导入方法节点
            if (oData.clazz == "beanTask") {
            	
                
                add_nodeJs("Rectangle", oData, x, y, "Rectangle");
            }
            if (oData.clazz == "userTask") {
                //获取方法节点x,y坐标
          
                
                add_nodeJs("Rectangle", oData, x, y, "userTask");
            }
            if (oData.clazz == "serviceTask") {
                //获取方法节点x,y坐标
              
                
                add_nodeJs("Rectangle", oData, x, y, "serviceTask");
            }
            //导入外呼节点
            if (oData.clazz == "outboundTask") {
            	
                add_nodeJs("Rectangle_WH", oData, x, y, "Rectangle_WH");
            }
            if (oData.clazz == "sequenceFlow") {
            	//console.log(global);
                for (var j in global) {
                    //判断数据Id和global中Id是否相同
                    if (oData.sourceRef == global[j].id) {
                        //将值放进对应的目标数组中
                        global[j].targetRef.push(oData.targetRef);

                        if (oData.children != null && oData.children != "") {
                            //将条件放进数组
                            global[j].conditionExpression.push(oData.children[0].children[0]);
                        } else {
                            //将默认值放进条件数组
                            global[j].conditionExpression.push("默认");
                        }
                    }
                }
                instance.connect({
                    uuids: [oData.sourceRef + "BottomCenter", oData.targetRef + "TopCenter"],
                    editable: true
                });
                if (oData.children != null && oData.children != "") {
                }
            }

        }
       
  	}                  
  	
	/**
	 * 定义增加节方法
	 */
	var add_node = function(imager, x, y, name) {
		if(name != "Circle-Start" && global.length == 0) {
			$.messager.alert("提示", "请添加开始节点！","warning");
            return;
		}
		
		var oData =tree_Node;
	    if (imager != "Circle-Start" && imager != "Circle-End") {
	        if (oData == null) {
	            $.messager.alert("提示", "请选择节点！","warning");
	            return;
	        }
	        toId = "node"+global.length;//节点编号
	        component=tree_Node.component_name;//节点主机名称
	        content = tree_Node.text;//节点名称
	        category=tree_Node.category;//节点类型
	    } else if (imager == "Circle-Start") {
	        toId = "start";
	        component="";
	        content = "开始";
	    } else {
	    	component="";
	        toId = "end";
	        content = "结束";
	    }
	
	    //检验节点是否重复
	    var divs = $("#flow_msg_editor_div div.shape");
	    if (divs.length > 0) {
	        for (var i in divs) {
	            var divId = divs[i].sId;
	            if (sId == divId) {
	                $.messager.alert("提示", "此节点已存在！","warning");
	                return;
	            }
	        }
	    }
	    //添加节点
	    if (imager == "Circle-Start") {
	    	component="";
	        content = "开始";
	       // timeout="60";
	    }
	
	    if (imager == "Circle-End") {
	    	component="";
	        content = "结束";
	    }
	    instance = window.jsp;
	
	    if(imager == "Circle-Start"||imager == "Circle-End"){
	    	$('#' + msgEditDiv).append(" <div class='shape easyui-draggable' data-options='onDrag:onDrag' data_shape=" + imager + " id=" + toId + " style='top: " + y + "px;left: " + x + "px;'>"+ content + "</span></div>");
	    }else{
	    	$('#' + msgEditDiv).append(" <div class='shape easyui-draggable' data-options='onDrag:onDrag' data_shape=" + imager + " id=" + toId + " style='top: " + y + "px;left: " + x + "px;'><span class='company'>"+"『"+component+"』"+"</span><span class='service'>" + content + "</span></div>");
	    }
	  
	   // consile.log(pName);
	    //增加json对象
	    var json_node = {};
	    json_node.category=name;//节点类型
	    json_node.id =toId;//节点id
	    json_node.fid =pId;//流程id
	    json_node.fname =pName;//流程名称
	    switch (name) {
	    case "Circle-Start":
	    	$('#' + toId)[0].setAttribute("fid", pId);//流程编号
	    	$('#' + toId)[0].setAttribute("fname",flowinfo.fname);//流程名称
	        bpmUtils._addEndpointsStart(toId, ["BottomCenter"], [""]);
	        break;
	    case "Circle-End":
	    	$('#' + toId)[0].setAttribute("fid", pId);//流程编号
	    	$('#' + toId)[0].setAttribute("fname",flowinfo.fname);//流程名称
	        bpmUtils._addEndpointsEnd(toId, [""], ["TopCenter"]);
	        break;
	    case "Rectangle":
	        //增加属性
	    	$('#' + toId)[0].setAttribute("bean", oData.bean);//节点类
	    	$('#' + toId)[0].setAttribute("method",oData.ebp_node_data);//节点方法
	   // 	$('#' + toId)[0].setAttribute("needReverse",Need_reverse);//冲正
	    	$('#' + toId)[0].setAttribute("reverseBean",Reverse_sid);//冲正方法
	    	$('#' + toId)[0].setAttribute("reverseMethod",Reverse_cid);//冲正类
	        bpmUtils._addEndpoints(toId, ["BottomCenter"], ["TopCenter"]);
	        break;
	    case "userTask":
	        //增加属性
	    	$('#' + toId)[0].setAttribute("fid", pId);//流程编号
	    	$('#' + toId)[0].setAttribute("fname",flowinfo.fname);//流程名称
	    	$('#' + toId)[0].setAttribute("id", toId);//节点id
	    	$('#' + toId)[0].setAttribute("name",'');//节点名称
	    	$('#' + toId)[0].setAttribute("assignee",'');//任务执行人
	        bpmUtils._addEndpointsUserTask(toId, ["BottomCenter"], ["TopCenter"]);
	        //生成xml报文使用
	        json_node.name = flowinfo.name;
	        json_node.assignee = flowinfo.assignee;
	        json_node.params = {};
	        json_node.params.NAV_URL = "";
	        json_node.params.C1 = "";
	        json_node.params.C2 = "";
	        json_node.params.C3 = "";
	        json_node.params.C4 = "";
	        break;
	    case "serviceTask":
	        //增加属性
	    	$('#' + toId)[0].setAttribute("fid", pId);//流程编号
	    	$('#' + toId)[0].setAttribute("fname",flowinfo.fname);//流程名
	    	$('#' + toId)[0].setAttribute("name", "");//节点可读名称
	    	$('#' + toId)[0].setAttribute("delegateExpression", "");//委托表达式
	        bpmUtils._addEndpointsServiceTask(toId, ["BottomCenter"], ["TopCenter"]);
	        //生成xml报文使用
	        json_node.name = flowinfo.name;
	        json_node.delegateExpression = flowinfo.delegateExpression;
	        break;
	    case "Rectangle_WH":
	    	$('#' + toId)[0].setAttribute("bean", oData.bean);
	        $('#' + toId)[0].setAttribute("method",oData.ebp_node_data );
	   // 	$('#' + toId)[0].setAttribute("needReverse",Need_reverse);//冲正
	    	$('#' + toId)[0].setAttribute("reverseBean",Reverse_sid);//冲正sid
	    	$('#' + toId)[0].setAttribute("reverseMethod",Reverse_cid);//冲正类cid
	    	$('#' + toId)[0].setAttribute("artificialData",artificialData);//仿真数据
	        bpmUtils._addEndpoints(toId, ["BottomCenter"], ["TopCenter"]);
	        break;
	    default:
	        break;
	    }
	    json_node.conditionExpression = [];
	    
	    json_node.sId =tree_Node.id;
	    json_node.cId =tree_Node.cid;
//	    json_node.category =tree_Node.category;
	    json_node.component =tree_Node.component_name;
	//    json_node.needReverse =Need_reverse;
	 //   json_node.timeout =timeout;
	    json_node.artificialData = artificialData;
	    json_node.reverseBean =tree_Node.reverse_sid;
	    json_node.reverseMethod =tree_Node.reverse_cid;
	    //在json对象中加入json对象
	    var content_node = {};
	    //节点描述
	    content_node.name = content;
	    json_node.content = content_node;
	
	    //给json对象添加一个targetRef属性数组
	    json_node.targetRef = [];
	    //将结束节点放在最后
	    if (imager == "Circle-End") {
	        global.push(json_node);
	    }
	    //将开始节点放在第一位
	    if (imager == "Circle-Start") {
	        global.unshift(json_node);
	    }
	    //将方法节点放到第2位
	    if (imager == "Rectangle") {
	        content_node.bean = oData.bean;
	        content_node.method =oData.ebp_node_data;
	        global.splice(1, 0, json_node);
	    }
	    if (imager == "Rectangle_WH") {
	    	  content_node.bean = oData.bean;
		      content_node.method =oData.ebp_node_data;
	        global.splice(1, 0, json_node);
	    }
	
	    instance.draggable(jsPlumb.getSelector(".shape"), {
	        grid: [40, 40]
	    });
	
	    //锚点移动
	    instance.bind("connection",
	    function(connInfo, originalEvent) {
	        bpmUtils.init(connInfo.connection);
	    });
	
	};
	/**
	 * 提交与撤销按钮事件
	 */
	function _propToolBarBtnMehods() {
	    $('#flow_prop_toolbar_btn_cancel').bind('click', _cancel());
	
	    $('#flow_prop_toolbar_btn_submit').bind('click',
	    function() {
	        var rows = $('#' + propertygridDom).propertygrid('getChanges');
	
	        var aData = {};
	        for (var i in rows) {
	            var sKey = rows[i].key;
	            var sVal = rows[i].value;
	            utilUI.createJson(aData, sKey, sVal);
	        }
	        msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_DATA_UPDATE, aData);
	    });
	};
	/**
	 * 报文栏的按钮事件设定
	 */
	function _msgToolBarBtnMehods() {
	    //节点拖动范围限制
	    $('#zero').bind('click',
	    function() {
	        var divs = $("#flow_msg_editor_div div");
	        for (var i in divs) {
	            for (var j in global) {
	                if (divs[i].id == global[j].id) {
	                    var x = divs[i].style.left;
	                    var y = divs[i].style.top;
	                    if (x.substring(0, 1) == "-" || y.substring(0, 1) == "-") {
	                        divs[i].style.left = 0;
	                        divs[i].style.top = 0;
	                    }
	                }
	            }
	        }
	    });
	
	    //导入
	    $('#flow_msg_toolbar_btn_down').bind('click',
	    function() {
	        msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_UP_SHOW);
	    });
	    //保存流程报文
	    $('#flow_msg_toolbar_btn_up').bind('click',
	    function() {
	        //将div的x,y坐标存入json
	        var divs = $("#flow_msg_editor_div div.shape");
	        //定义一个数组用来接收tagetRef对象
	        var tagetRefs = [];
	        //存tagetRef里面的值
	        var everyTaget = "";
	        for (var k in global) {
	            everyTaget = global[k].targetRef;
	            for (var h in everyTaget) {
	                tagetRefs.push(everyTaget[h]);
	            }
	        }
	        var m = 0;
	        var n = 0;
	        for (var i = 0; i < divs.length; i++) {
	            //判断是否存在上级节点
	            if (i > 0) {
	                var loc = $.inArray(divs[i].id, tagetRefs);
	                if (loc < 0) {
	                    $.messager.alert("警告", "存在未连线节点，请检查！");
	                    return;
	                }
	            }
	            //判断是否有开始节点
	            if ("Circle-Start" == $('#' + divs[i].id).attr("data_shape")) {
	                m++;
	
	            }
	            //判断是否有结束节点
	            if ("Circle-End" == $('#' + divs[i].id).attr("data_shape")) {
	                n++;
	            }
	            //遍历global把节点坐标添加到Div对应Json
	            for (var j = 0; j < global.length; j++) {
	
	                if (divs[i].id == global[j].id) {
	                    global[j].x = divs[i].style.left;
	                    global[j].y = divs[i].style.top;
	                }
	                //判断是否存在下级节点
	                if (j != global.length - 1) {
	                    if (global[j].targetRef == null || global[j].targetRef == "") {
	                        $.messager.alert("警告", "节点流程异常，请检查！");
	                        return;
	                    }
	                }
	
	            }
	        }
	        //判断是否有开始节点
	        if (m != 1) {
	            $.messager.alert("提示", "没有开始节点！");
	            return;
	        }
	        //判断是否有结束节点
	        if (n != 1) {
	            $.messager.alert("提示", "没有结束节点！");
	            return;
	        }
	      	for ( var i in global) {
        		if(global[i].conditionExpression.length >1){
        			for ( var j in global[i].conditionExpression) {
						var condition=$.inArray("默认",global[i].conditionExpression);
    					if(condition != -1){
    						 $.messager.alert("提示", "流程存在分支，分支条件不能为“默认”！");
    				            return;
    					}
					}	
        		}
			}
	        msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_UPDATE, JSON.stringify(global));
	    });
	    //展示流程报文
	    $('#flow_msg_toolbar_btn_show').bind('click',
	    		function() {
	    	//将div的x,y坐标存入json
	    	var divs = $("#flow_msg_editor_div div.shape");
	    	//定义一个数组用来接收tagetRef对象
	    	var tagetRefs = [];
	    	//存tagetRef里面的值
	    	var everyTaget = "";
	    	for (var k in global) {
	    		everyTaget = global[k].targetRef;
	    		for (var h in everyTaget) {
	    			tagetRefs.push(everyTaget[h]);
	    		}
	    	}
	    
	    	msgMediator.sendNotification(ejx4msg.AppConstants.FLOW_MESSAGE_CONTENT_DIALOG_SEARCH, JSON.stringify(global));
	    });
	//键值
	    $("#msgContentEdit_div").keydown(function(event) {
	        var keyCode = event.keyCode;
	        //根据keycode判断按下的是哪个键
	    });
	    
	    
	    
	    //增加开始节点
	    $('#Circle-Start').bind('click',
	    function() {
	        var divs = $("#flow_msg_editor_div div.shape");
	       //保证开始节点的唯一性
	        if (divs.length > 0) {
	            for (var i = 0; i < divs.length; i++) {
	                var myId = divs[i].id;
	                if ("Circle-Start" == $('#' + myId).attr("data_shape")) {
	                    $.messager.alert("提示", "开始节点必须唯一！");
	                    return;
	                }
	            }
	        }
	        //加载流程配置
	        var addFlowDialog = $('#addflow').dialog({
	        	title : '配置流程信息',
				href : 'iwork_flow_addflow.html',
				width : 280,
				height : 140,
				buttons : [
						{
							text : '保存',
							iconCls : 'icon-add',
							handler : function() {
								if($("#fid").val() == null || $("#fid").val().trim() == ''
									|| $("#fname").val() == null || $("#fname").val().trim() == ''){
									$.messager.alert("提示", "请输入流程编号和流程名称！","warning");
									return;
								}
								flowinfo = {'fid':$("#fid").val(),'fname':$("#fname").val()};
								if(newType == "1"){
									pId=flowinfo.fid;
									pName=flowinfo.fname;
									
								}else if (newType == "2") {
									pId=procKey;
								}
								 addFlowDialog.dialog('close');
								//添加开始节点
						        add_node("Circle-Start", "10", "100", "Circle-Start");
								global["0"].Pid=pId;
								global["0"].Name=pName;
						    	instance = window.jsp;
							}
						}, {
							text : '关闭',
							iconCls : 'icon-cancel',
							handler : function() {
								addFlowDialog.dialog('close');
							}
						} ]
	        }); 
	    });
	    //修改流程编码
	    $('#UpdatePid').bind('click',
	    		function() {
	    	//加载流程配置
	    	var addFlowDialog = $('#addflow').dialog({
	    		title : '修改流程信息',
	    		href : 'iwork_flow_addflow.html',
	    		width : 280,
	    		height : 140,
	    		buttons : [
	    		           {
	    		        	   text : '保存',
	    		        	   iconCls : 'icon-add',
	    		        	   handler : function() {
	    		        		   if($("#fid").val() == null || $("#fid").val().trim() == ''
	    		        			   || $("#fname").val() == null || $("#fname").val().trim() == ''){
	    		        			   $.messager.alert("提示", "请输入流程编号和流程名称！","warning");
	    		        			   return;
	    		        		   }
	    		        		   flowinfo = {'fid':$("#fid").val(),'fname':$("#fname").val()};
	    		        		   pName=flowinfo.fname;
	    		        		   if(newType == "1"){
	    		        			   pId=flowinfo.fid;
	    		        			   
	    		        		   }else if (newType == "2") {
	    		        			   pId=procKey;
	    		        		   }
	    		        		   addFlowDialog.dialog('close');
	    		        		   //添加开始节点
	    		        		   global["0"].Pid=pId;
	    		        		   global["0"].Name=pName;
	    		        		   instance = window.jsp;
	    		        	   }
	    		           }, {
	    		        	   text : '关闭',
	    		        	   iconCls : 'icon-cancel',
	    		        	   handler : function() {
	    		        		   addFlowDialog.dialog('close');
	    		        	   }
	    		           } ]
	    	}); 
	    });
	    //增加结束节点
	    $('#Circle-End').bind('click',
	    function() {
	        var divs = $("#flow_msg_editor_div div.shape");
	        //判断是否有开始节点
	        if (divs.length == 0) {
	            $.messager.alert("提示", "请先添加开始节点！");
	            return;
	        }
	        //判断节点唯一性
	        if (divs.length > 0) {
	            for (var i = 0; i < divs.length; i++) {
	                var myId = divs[i].id;
	                if ("Circle-End" == $('#' + myId).attr("data_shape")) {
	                    $.messager.alert("提示", "结束节点必须唯一！");
	                    return;
	                }
	            }
	        }
	        add_node(this.id, "10", "200", this.id);
	    });
	    $('#Rectangle').bind('click',
	    	    function() {
	    	        add_node(this.id, "10", "200", this.id);
	    	    });
	    $('#userTask').bind('click',
	    	    function() {
	    	        add_node("Rectangle", "10", "200", this.id);
	    	    });
	    $('#serviceTask').bind('click',
	    	    function() {
	    	        add_node("Rectangle", "10", "200" , this.id);
	    	    });
	    //清空
	    $('#removeAll').bind('click',
	    function() {
	        var divs = $("#flow_msg_editor_div div.shape");
	        $.messager.confirm('确认', '是否要清空当前操作区的节点?', function(v) {
	        if (v) {
	            for (var i = 0; i < divs.length; i++) {
	                var id = divs[i].id;
	                instance.detachAllConnections(id);
	                instance.removeAllEndpoints(id);
	                $('#' + id).remove();
	            }
	            global = [];
	            flowinfo = {};
	            nameIndex = 0;
	        }
	        });
	    });
	   
	
	    //删除
	    $('#flow_msg_toolbar_btn_remove').bind('click',
	    	function()  {
	    	if($('#flow_msg_editor_div div.selected')[0]==undefined){
        		$.messager.alert("提示", "请选择节点！");
        		return;
        		}else{
        			$.messager.confirm('确认', '是否要删除当前选中的节点?', function(v){
        				if (v) {
        					var id = $('#flow_msg_editor_div div.selected')[0].id;
        					if (id == "start") {
        						$.messager.alert("提示", "开始节点不能删除！");
        						return;
        				}
	        
	            instance.detachAllConnections(id);
	            instance.removeAllEndpoints(id);
	            $('#' + id).remove();
	            //清空节点属性栏
	            $('#node_attribute table').empty();
	            for (var i in global) {
	                //如果id存在对象的targetRef对应的数组中，则删除
	                if ($.inArray(id, global[i].targetRef) >= 0) {
	                    global[i].targetRef.splice($.inArray(id, global[i].targetRef), 1);
	                    //删除条件数组中的对应值
	                    global[i].conditionExpression.splice($.inArray(id, global[i].targetRef), 1);
	                }
	                if (global[i].id == id) {
	                    //获取数组中指定值的下标
	                    var index = $.inArray(global[i], global);
	                    global.splice(index, 1);
	                };
	            }
	        }
	    	});
        		}
	    });
	    
	    /**
	     * 定义导入增加节点方法
	     */
	    add_nodeJs=function(imager,oData,x,y,name){
	    	/*	
	    		 if(oData.needReverse=="flase"){
	    			 oData.reverseBean="";
	    			 oData.reverseMethod="";
	    		 }*/
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
	    	
//	    	var divs=$("#flow_msg_editor_div div.shape");
//	    	if(divs.length>0){
//	    		for ( var i in divs) {
//	    			var divId =divs[i].id;
//	    			if(toId==divId){
//	    				$.messager.alert("提示", "此节点已存在！");
//	    				return;
//	    			}
//	    		}
//	    	}
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
	    	//增加json对象
	 	    var json_node = {};
	 	    json_node.category=name;//节点类型
	 	    json_node.id =toId;//节点id
	 	    
	    	switch (name) {
	    	case "Circle-Start":
//		    	$('#' + toId)[0].setAttribute("fid", oData.Pid);//流程编号
//		    	$('#' + toId)[0].setAttribute("fname",oData.Name);//流程名称
		    	json_node.fid = pId;//流程id
		 	    json_node.fname = oData.Name;//流程名称
		 	    flowinfo.fid=pId;
		 	    flowinfo.fname = pName;
		        bpmUtils._addEndpointsStart(toId, ["BottomCenter"], [""]);
		        break;
		    case "Circle-End":
		    	$('#' + toId)[0].setAttribute("fid", pId);//流程编号
		    	$('#' + toId)[0].setAttribute("fname",global[0].Name);//流程名称
		    	json_node.fid = pId;//流程id
		 	    json_node.fname = global[0].Name;//流程名称
		        bpmUtils._addEndpointsEnd(toId, [""], ["TopCenter"]);
		        break;
		    case "Rectangle":
		        //增加属性
		    	$('#' + toId)[0].setAttribute("bean", oData.bean);//节点类
		    	$('#' + toId)[0].setAttribute("method",oData.method);//节点方法
		    //	$('#' + toId)[0].setAttribute("needReverse",oData.needReverse);//冲正
		    	$('#' + toId)[0].setAttribute("reverseBean",oData.reverseBean);//冲正方法
		    	$('#' + toId)[0].setAttribute("reverseMethod",oData.reverseMethod);//冲正类
		        bpmUtils._addEndpoints(toId, ["BottomCenter"], ["TopCenter"]);
		        break;
		    case "userTask":
		        //增加属性
		    	$('#' + toId)[0].setAttribute("fid", pId);//流程编号
		    	$('#' + toId)[0].setAttribute("fname",global[0].Name);//流程名称
		    	$('#' + toId)[0].setAttribute("id", oData.id);//节点id
		    	$('#' + toId)[0].setAttribute("name",oData.name);//节点名称
		    	$('#' + toId)[0].setAttribute("assignee",oData.assignee);//任务执行人
		        bpmUtils._addEndpointsUserTask(toId, ["BottomCenter"], ["TopCenter"], oData.name);
		        //生成xml报文使用
		        json_node.fid = pId;//流程id
		 	    json_node.fname = global[0].Name;//流程名称
		        json_node.name = oData.name;
		        json_node.assignee = oData.assignee;
		        json_node.params = {};
		        var children = oData.children;
		        if(children && children[0]){
		        	json_node.params.NAV_URL =  children[0].NAV_URL;
			        json_node.params.C1 =  children[0].C1;
			        json_node.params.C2 =  children[0].C2;
			        json_node.params.C3 =  children[0].C3;
			        json_node.params.C4 =  children[0].C4;
		        }
		        break;
		    case "serviceTask":
		        //增加属性
		    	$('#' + toId)[0].setAttribute("fid", pId);//流程编号
		    	$('#' + toId)[0].setAttribute("fname",global[0].Name);//流程名
		    	$('#' + toId)[0].setAttribute("name", oData.name);//节点可读名称
		    	$('#' + toId)[0].setAttribute("delegateExpression", oData.delegateExpression);//委托表达式
		        bpmUtils._addEndpointsServiceTask(toId, ["BottomCenter"], ["TopCenter"], oData.name);
		        //生成xml报文使用
		        json_node.fid = pId;//流程id
		 	    json_node.fname = global[0].Name;//流程名称
		        json_node.name = oData.name;
		        json_node.delegateExpression = oData.delegateExpression;
		        break;
		    case "Rectangle_WH":
		    	$('#'+toId)[0].setAttribute("method", oData.method);
				$('#'+toId)[0].setAttribute("bean", oData.bean);
			//	$('#' + toId)[0].setAttribute("needReverse",oData.needReverse);//冲正
		    	$('#' + toId)[0].setAttribute("reverseBean",oData.reverseBean);//冲正方法
		    	$('#' + toId)[0].setAttribute("reverseMethod",oData.reverseMethod);//冲正类
		    	$('#' + toId)[0].setAttribute("artificialData",oData.artificialData);//仿真数据
				bpmUtils._addEndpoints(toId,["BottomCenter"], ["TopCenter"]);
		        break;
		    default:
		        break;
	    	}
	    	json_node.conditionExpression=[];
	    	json_node.reqMsgId="";
	    	json_node.resMsgId="";
	    	
	    	json_node.id=toId;
	    	json_node.sId=oData.sId;
	    	json_node.cId=oData.cId;
	    //    json_node.needReverse =oData.needReverse;
	  //      json_node.timeout =oData.timeout;
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
	    	//	json_node.NeedReverse=oData.NeedReverse;
	    		global.unshift(json_node);
	    	}
	    	//将方法节点放到第2位
	    	if(imager=="Rectangle"){
//	    		json_node.category ="biz";
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
	  //关闭
	    $('#flow_msg_toolbar_btn_close').bind('click',
	    function() {
	    	parent.refreshComponentTree({"treeType":""});
	    });	    
	};
