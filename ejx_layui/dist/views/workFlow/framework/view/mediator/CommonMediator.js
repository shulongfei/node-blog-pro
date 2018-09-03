var uri;
puremvc.define({
	name : 'ejx4ui.view.mediator.CommonMediator',
	parent : puremvc.Mediator
}, {
	
	listNotificationInterests : function() {
		return [ 
			ejx4ui.AppConstants.COMMON_SESSION_DATA_RESPONSE,	// 加载接入树
			ejx4ui.AppConstants.COMMON_MAINTABS_ADD_RESPONSE,	// 响应Tab页面加载
			ejx4ui.AppConstants.COMMON_PASSWORD_UPDATE_RESPONSE, // 响应个人密码修改
			ejx4ui.AppConstants.COMMON_COMPONENT_RESPONSE,//组件返回树
			ejx4ui.AppConstants.COMMON_OUT_RESPONSE,//接出返回树
			ejx4ui.AppConstants.COMMON_CLOSE_TAB_REQUEST,//关闭组件树
			ejx4ui.AppConstants.COMMON_CLOSE_WINDOW_REQUEST,//关闭重复窗口
			ejx4ui.AppConstants.COMMON_ALIVE_TAB_RESPONSE//选中存活的窗口
			
		];
	},
	onRegister : function() {//页面右上角功能点击事件
		commonMediatorObj = this;
		$(document).on('click', '#north_pfMenu_help', function() {
			var node={};
			var attributes={};
			attributes.model=1;
			attributes.uri="ui/help.html";
			node.attributes=attributes;
			node.checked=false;
			node.iconCls="icon-service";
			node.need_reverse=0;
			node.state="open";
			node.text="帮助文档";
			node.id="1000";
			commonMediatorObj.sendNotification(ejx4ui.AppConstants.COMMON_MAINTABS_ADD_REQUEST, node);;
		});
		$(document).on('click', '#dic_maintenance', function() {
			//alert("ww");
			var node={};
			var attributes={};
			attributes.model=1;
			attributes.uri="ui/ iframe_dicMsg.html";
			node.attributes=attributes;
			node.checked=false;
			node.iconCls="icon-service";
			node.need_reverse=0;
			node.state="open";
			node.text="数据字典维护";
			node.id="1001";
			commonMediatorObj.sendNotification(ejx4ui.AppConstants.COMMON_MAINTABS_ADD_REQUEST, node);
		});
	},
	
	handleNotification : function(node) {
		var nodes;
		
		var body = node.getBody();
		switch (node.getName()) {
		/**
		 * 加载用户功能菜单<br>
		 * 菜单点击事件：打开菜单Tab页面
		 */
		//接入
		case ejx4ui.AppConstants.COMMON_SESSION_DATA_RESPONSE:
			var resultMap = body.treeData;
			//console.log(resultMap)
			$('#layout_west_inboundTree').tree({
				data:resultMap,
				onDblClick : function(node) {
					//接入双击 节点树   当节点类型为 process时，打开流程配置界面
					var ebp_node_type = node.ebp_node_type;
					if(ebp_node_type=="process"){
							//console.log(node);
							var ebpNode1=node;
							var Text_str = ebpNode1.text;
						       var b = Text_str.split("(");
						       for (var i = 0; i < b.length; i++) {
									var text=b[0]; 
							}
							ebpNode1.text=text+"(交易序列)";
//							console.log(node);
							commonMediatorObj.sendNotification(ejx4ui.AppConstants.COMMON_MAINTABS_ADD_REQUEST, ebpNode1);
							node=ebpNode1;
						}
					},
					onClick:function(node){//单击事件
					if ($('#layout_west_inboundTree').tree('isLeaf', node.target)) {
						//如果是叶子节点且为报文类型 则将node赋值到全局变量ebpNode1中 
						//在树的右击事件中调用ebpNode1------west_inputRequest.html
						var ebp_node_type = node.ebp_node_type;
						if(ebp_node_type=="process"){
							//node.text="123"+node.text;
							ebpNode1 = node;//得到报文node
						}
						$("#inboundProperty").hide();//隐藏接入属性按钮
					}else{
							if (node.state == 'closed') {
								$('#layout_west_inboundTree').tree('expand', node.target);
							} else {
								$('#layout_west_inboundTree').tree('collapse', node.target);
							}
							$("#inboundProperty").show();//显示接入属性按钮
					}
				}
			});
		break;
		//接出
		case ejx4ui.AppConstants.COMMON_OUT_RESPONSE:
			var resultMap = body.treeData;
			$('#layout_west_outboundTree').tree({
				data : resultMap,
				onClick : function(node) { /* 菜单点击事件：打开菜单Tab页面 */
					if ($('#layout_west_outboundTree').tree('isLeaf', node.target)) {
						//如果是叶子节点且为报文类型 则将node赋值到全局变量ebpNode1中 
						//在树的右击事件中调用ebpNode1------west_inputRequest.html
						ebpNode2 = node;//得到报文node
						$("#outBoundProperty").hide();//隐藏接入属性按钮
					}else{
						//如果不是叶子节点 则 扩展 或者 收起
						if (node.state == 'closed') {
							$('#layout_west_outboundTree').tree('expand', node.target);
						} else {
							$('#layout_west_outboundTree').tree('collapse', node.target);
						}
						$("#outBoundProperty").show();//显示接入属性按钮
					}
					//commonMediatorObj.sendNotification(ejx4ui.AppConstants.COMMON_MAINTABS_ADD_REQUEST, node);
				}
			});
		break;
		
		
		//组件
		case ejx4ui.AppConstants.COMMON_COMPONENT_RESPONSE:
			var resultMap = body.treeData;
			$('#layout_west_componentTree').tree({
				data: resultMap,
				onClick : function(node) { /* 菜单点击事件：打开菜单Tab页面 */
					if (!$('#layout_west_componentTree').tree('isLeaf', node.target)) {
						if (node.state == 'closed') {
							$('#layout_west_componentTree').tree('expand', node.target);
						} else {
							$('#layout_west_componentTree').tree('collapse', node.target);
						}
					}
					//commonMediatorObj.sendNotification(ejx4ui.AppConstants.COMMON_MAINTABS_ADD_REQUEST, node);
				}
			
			});
			
		break;
		/**
		 * 加载菜单的Tab页面<br>
		 * 添加Tabs，具体页面内的事件与功能，交由页面根据自身需要功能进行加载
		 * Tab页面若已经打开，则跳转到并选中该Tab。<br>
		 */
		case ejx4ui.AppConstants.COMMON_MAINTABS_ADD_RESPONSE:
			// 若tab页已存活，则选中，否则打开tab
			
			if ($('#layout_center_tabs').tabs('exists', body.text)) {
				//$('#layout_center_tabs').tabs('select', body.text);
				facade.sendNotification(ejx4ui.AppConstants.COMMON_ALIVE_TAB_RESPONSE, {'text':body.text});
			} else {
				var $centerTabs = $('#layout_center_tabs');
				var sHref/*默认为出错页面的链接*/ = 'pages/error/err.html'+ "?" + utils.createUUID();
				if(body.attributes){
					var sWebModel/*展示模式*/ = body.attributes.model;
					if(sWebModel){
						//var sHref1 = body.attributes.uri + "?" + utils.createUUID();
						var sHref1 = body.attributes.uri;
						if(sHref1){
							if(sWebModel == staticParam.webModel_iframe){ // iframe
								var sContent = '<iframe src="'+sHref1+'" allowTransparency="true" style="border: 0; width: 100%; height: 99%;" frameBorder="0"></iframe>';  
								$centerTabs.tabs('add', {
									id : body.id,
									title : body.text,
									closable : true,
									iconCls : body.iconCls,
									content : sContent,
									/*tools : [ {
										iconCls : 'icon-mini-refresh',
										handler : function() {
											console.log(body.text);
											refreshTab(body.text);
										}
									} ]*/
								});
								return;
							} else if(sWebModel == staticParam.webModel_pureMVC){ // href
								sHref = sHref1;
							}
						}
						$('#layout_center_tabs').tabs('add', {
							id : body.id,
							title : body.text,
							closable : true,
							iconCls : body.iconCls,
							href : sHref,
							tools : [ {
								iconCls : 'icon-mini-refresh',
								handler : function() {
									refreshTab(body.text);
								}
							} ]
						});
					}
				}
			}
			break;
		case ejx4ui.AppConstants.OMMON_PASSWORD_UPDATE_RESPONSE:
			userPwdEditDialog.dialog('close');
			break;
		case ejx4ui.AppConstants.COMMON_CLOSE_TAB_REQUEST:
			//$('#layout_center_tabs').tabs('close',body.text);
			var tab = $('#layout_center_tabs').tabs('getSelected');
			
			var index = $('#layout_center_tabs').tabs('getTabIndex',tab);
			$('#layout_center_tabs').tabs('close',index);
			//$('#layout_center_tabs').tabs('close',body.id);
			break;
		case ejx4ui.AppConstants.COMMON_CLOSE_WINDOW_REQUEST://根据窗口Id关闭窗口
			$('#layout_center_tabs').tabs('close',body.id);
			break;
		case ejx4ui.AppConstants.COMMON_ALIVE_TAB_RESPONSE:
			$('#layout_center_tabs').tabs('select',body.text);
			break;
		}
	}
}, {
	NAME : 'CommonMediator'
});
