/**
 * Draw EasyUI Plugins<br>
 * 项目内所有需要显示的EasyUI组件，如：Grid数据表格，都在这里实现绘制。<br>
 *
 * @author DJQ
 * @updateData 2015年3月1日
 */
var drawPlugin = $.extend({}, drawPlugin);

function formatCurrency(num) {
	if(num){
		num = num.toString().replace(/\$|\,/g,'');
		if(isNaN(num))
			num = "0";
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num*100+0.50000000001);
		cents = num%100;
		num = Math.floor(num/100).toString();
		if(cents<10)
			cents = "0" + cents;
		for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
			num = num.substring(0,num.length-(4*i+3))+','+
			num.substring(num.length-(4*i+3));
		return "￥" + (((sign)?'':'-') + num + '.' + cents);
	} else {
		return "￥0.00";
	}
}

// 私有
function cellStyler(value, row, index) {
    if (value == '02') {
        return 'color:red;font-weight:bold;';
    }
    if (value == '03') {
        return 'color:blue;font-weight:bold;';
    }
}

function rowStyler(index, row) {
    if (row.sex == "03") {
        return 'background-color:#FFDFCE;';
    }
}

/**
 * 绘制公告列表Datagrid
 */
drawPlugin.announcementDatagrid = function (options, tool_bar) {
    var announcement_datagrid;
    announcement_datagrid = $('#' + options).datagrid({
        idField: 'npNo', 
        view: extEU.defaultView,
        striped: true,
        checkOnSelect: true,
        selectOnCheck: true,
        rownumbers: true,
        fitColumns:true,
        columns: [[
			{
			    width: '100',
			    title: '公告编号',
			    field: 'npNo'
			},
			{
			    width: '80',
			    title: '公告日期',
			    field: 'npDate',
			    sortable: true
			},
			{
			    width: '100',
			    title: '录入人员',
			    field: 'enterUser',
			    sortable: true
			},
			{
                width: '150',
                title: '公告内容',
                field: 'npContent'
            },{
    			title : '',
    			field : 'info',
    			width : 10,
    			formatter:function(value,rowObj){
    				return "<a href='javascript:void(0);' onclick='viewDetail("+extUtil.json2Str(rowObj)+");'>查看</a>";
    			}
    		}
            ]
        ],
        toolbar: '#' + tool_bar,
        onLoadSuccess: function () {
        	$('#' + options).datagrid('uncheckAll');
        },
        onSelect : function(rowIndex, rowData){
        	$('#' + options).datagrid("unselectRow",rowIndex);
        }
    });
    return announcement_datagrid;
};

/**
 * 绘制通知列表Datagrid
 */
drawPlugin.noticeDatagrid = function (options, tool_bar) {
    var notice_datagrid;
    notice_datagrid = $('#' + options).datagrid({
        idField: 'npNo',
        view: extEU.defaultView,
        striped: true,
        checkOnSelect: true,
        selectOnCheck: true,
        rownumbers: true,
        fitColumns:true,
        columns: [[
			{
			    width: '100',
			    title: '通知编号',
			    field: 'npNo'
			},
			{
			    width: '80',
			    title: '通知日期',
			    field: 'npDate',
			    sortable: true
			},
			{
			    width: '100',
			    title: '录入人员',
			    field: 'enterUser',
			    sortable: true
			},
			{
                width: '150',
                title: '通知内容',
                field: 'npContent'
            },{
    			title : '',
    			field : 'info',
    			width : 10,
    			formatter:function(value,rowObj){
    				return "<a href='javascript:void(0);' onclick='viewDetail("+extUtil.json2Str(rowObj)+");'>查看</a>";
    			}
    		}
            ]
        ],
        toolbar: '#' + tool_bar,
        onLoadSuccess: function () {
        	$('#' + options).datagrid('uncheckAll');
        },
        onSelect : function(rowIndex, rowData){
        	$('#' + options).datagrid("unselectRow",rowIndex);
        }
    });
    return notice_datagrid;
};

/**
 * 绘制用户管理的用户列表Datagrid
 */
drawPlugin.userInfoListDatagrid = function (options, tool_bar) {
    var userInfo_list_datagrid;
    userInfo_list_datagrid = $('#' + options).datagrid({
        striped: true,
        fit: true,
        idField: 'userId',
        view: extEU.defaultView,
        frozenColumns: [
            [
                {
                	field : 'ck',
                	checkbox : true
                }, 
                {
                    width: '100',
                    title: '用户编号',
                    field: 'userId'
                },
                {
                    width: '100',
                    title: '登录名',
                    field: 'loginName'
                },
                {
                    width: '80',
                    title: '用户姓名',
                    field: 'userName'
                }
            ]
        ],
        columns: [
            [
                {
                    width: '100',
                    title: '机构编号',
                    field: 'orgNo'
                },
                {
                    width: '100',
                    title: '机构名',
                    field: 'orgName'
                },{
                    width: '100',
                    title: '联系电话',
                    field: 'phone'
                },
                {
                    width: '100',
                    title: '电子信箱',
                    field: 'email'
                },
                {
                    width: '100',
                    title: '启用日期',
                    field: 'enableDate',
                    sortable: true
                },
                {
                    width: '100',
                    title: '失效日期',
                    field: 'invalidDate',
                    sortable: true
                },
                {
                    width: '100',
                    title: '添加日期',
                    field: 'addDate',
                    sortable: true
                }/*,
                {
                    width: '80',
                    title: '审核标识',
                    field: 'enable',
                    sortable: true,
                    formatter: function (value, row) {
                        var resStr = "异常状态";
                        switch (value) {
                            case "0":
                                resStr = "未审核";
                                break;
                            case "1":
                                resStr = "已审核";
                                break;
                        }
                        return resStr;
                    }
                }*/
            ]
        ],
        toolbar: '#' + tool_bar,
        onBeforeLoad: function (param) {
            parent.$.messager.progress({
                text: '数据加载中....'
            });
        },
        onLoadSuccess: function (data) {
            parent.$.messager.progress('close');
        }
    });
    return userInfo_list_datagrid;
};

/**
 * 绘制用户管理-密码管理-用户列表Datagrid
 */
drawPlugin.userInfoListSubDatagrid = function (options, tool_bar) {
    var userInfo_list_sub_datagrid;
    userInfo_list_sub_datagrid = $('#' + options).datagrid({
        idField: 'userId', // 主键名称（记得写，不然选择行时，会有取不到的情况。且可以跨页选择。）
        view: extEU.defaultView,
        striped: true,
        fit: true, // 窗体自适应
        checkOnSelect: true,
        selectOnCheck: true,
        columns: [[
			{
			    width: '100',
			    title: '用户编号',
			    field: 'userId'
			},
			{
			    width: '100',
			    title: '登录名',
			    field: 'loginName',
			    sortable: true
			},
			{
			    width: '80',
			    title: '用户姓名',
			    field: 'userName',
			    sortable: true
			},
			{
                width: '100',
                title: '联系电话',
                field: 'phone'
            },
            {
                width: '100',
                title: '电子信箱',
                field: 'email'
            }
            ]
        ],
        toolbar: '#' + tool_bar,
        onLoadSuccess: function () {
        	$('#' + options).datagrid('uncheckAll');
        },
        onSelect : function(rowIndex, rowData){
        	$('#' + options).datagrid("unselectRow",rowIndex);
        }
    });
    return userInfo_list_sub_datagrid;
};

/**
 * 绘制用户管理的用户列表Datagrid
 */
drawPlugin.userInfoFpDatagrid = function (options, tool_bar) {
    var userInfoFp_list_datagrid;
    userInfoFp_list_datagrid = $('#' + options).datagrid({
        striped: true,
        fit: true,
        idField: 'userId',
        view: extEU.defaultView,
        columns: [
            [
                {
                	field : 'ck',
                	checkbox : true
                }, 
                {
                    width: '100',
                    title: '用户编号',
                    field: 'userId'
                },
                {
                    width: '80',
                    title: '用户姓名',
                    field: 'userName'
                },
                {
                    width: '100',
                    title: '机构编号',
                    field: 'orgNo'
                },
                {
                    width: '100',
                    title: '机构名',
                    field: 'orgName'
                }
            ]
        ],
        toolbar: '#' + tool_bar
    });
    return userInfoFp_list_datagrid;
};

/**
 * 绘制用户管理的机构列表Datagrid
 */
drawPlugin.userOrgListDatagrid = function (options, tool_bar) {
    var userInfo_org_list_datagrid;
    userInfo_org_list_datagrid = $('#' + options).datagrid({
        striped: true,
        fit: true,
        idField: 'orgNo',
        checkOnSelect: true,
        selectOnCheck: true,
        singleSelect: true,
        view: extEU.defaultView,
        columns: [
            [
                {
                    width: '100',
                    title: '机构编号',
                    field: 'orgNo'
                },
                {
                    width: '100',
                    title: '机构名',
                    field: 'orgName',
                    sortable: true
                },
                {
                    width: '80',
                    title: '机构类型',
                    field: 'orgType',
                    sortable: true,
                    formatter: function (value, row) {
                        var resStr = "异常状态";
                        switch (value) {
                            case "01":
                                resStr = "银联";
                                break;
                            case "02":
                                resStr = "商户";
                                break;
                            case "03":
                                resStr = "银行";
                                break;
                        }
                        return resStr;
                    }
                }
            ]
        ],
        toolbar: '#' + tool_bar
    });
    return userInfo_org_list_datagrid;
};

/**
 * 绘制机构管理的机构列表Datagrid
 */
drawPlugin.orgInfoListDatagrid = function (options, tool_bar) {
    var orgInfo_list_datagrid;
    orgInfo_list_datagrid = $('#' + options).datagrid({
        striped: true,
        fit: true,
        idField: 'orgNo',
        checkOnSelect: true,
        selectOnCheck: true,
//        rownumbers: true,
        view: extEU.defaultView,
        columns: [
            [
				{
					field : 'ck',
					checkbox : true
				},
                {
                    width: '100',
                    title: '机构编号',
                    field: 'orgNo'
                },
                {
                    width: '100',
                    title: '机构名',
                    field: 'orgName',
                    sortable: true
                },
                {
                    width: '100',
                    title: '机构状态',
                    field: 'orgState',
                    sortable: true,
                    formatter: function (value, row) {
                        var resStr = "异常状态";
                        switch (value) {
                            case "0":
                                resStr = "停用";
                                break;
                            case "1":
                                resStr = "启用";
                                break;
                        }
                        return resStr;
                    }
                } 
            ]
        ],
        toolbar: '#' + tool_bar,
        onBeforeLoad: function (param) {
            parent.$.messager.progress({
                text: '数据加载中....'
            });
        },
        onLoadSuccess: function (data) {
            parent.$.messager.progress('close');
        }
    });
    return orgInfo_list_datagrid;
};

/**
 * 角色和服务资源的绑定
 */
drawPlugin.roleServiceResBindDatagrid = function (options, tool_bar) {
    var role_serviceResBind_Datagrid;
    role_serviceResBind_Datagrid = $('#' + options).datagrid({
        striped: true,
        fit: true,
        idField: 'id',
        checkOnSelect: true,
        selectOnCheck: true,
        view: extEU.defaultView,
        columns : [ [
				{
					field : 'id',
					checkbox : true
				},
				{
					field : 'actionId',
					title : '服务请求ID',
					width : 150
				},
				{
					field : 'serviceIds',
					title : '服务ID',
					width : 150
				},
				{
					field : 'description',
					title : '服务请求描述',
					width : 400
				} ] ],
		onLoadSuccess : function(data) {
			for ( var i in data.rows) {
				if (data.rows[i].checked === true){
					$('#' + options).datagrid('checkRow', i);
				}
			}
		},
        toolbar: '#' + tool_bar
    });
    return role_serviceResBind_Datagrid;
};

/**
 * 角色和页面资源的绑定
 */
drawPlugin.rolePageResBindDatagrid = function (options, tool_bar) {
    var role_pageResBind_Datagrid;
    role_pageResBind_Datagrid = $('#' + options).datagrid({
        striped: true,
        fit: true,
        idField: 'id',
        checkOnSelect: true,
        selectOnCheck: true,
        view: extEU.defaultView,
		columns : [ [
			{
				field : 'id',
				checkbox : true
			},
			{
				field : 'displayName',
				title : '显示名称',
				width : 150
			},
			{
				field : 'functionUrl',
				title : '功能URL',
				width : 280
			}] ],
		onLoadSuccess : function(data) {
			for ( var i in data.rows) {
				if (data.rows[i].checked === true){
					$('#' + options).datagrid('checkRow', i);
				}
			}
		},
        toolbar: '#' + tool_bar
    });
    return role_pageResBind_Datagrid;
};

/**
 * 绘制菜单列表Datagrid
 */
drawPlugin.menuInfoListDatagrid = function (options, tool_bar) {
    var meunInfo_list_datagrid;
    menuInfo_list_datagrid = $('#' + options).datagrid({
        striped: true,
        fit: true,
        idField: 'id',
        view: extEU.defaultView,
        columns: [
            [
				{
				    width: '50',
				    title: '编号',
				    field: 'id',
				    checkbox : true
				},
				{
				    width: '120',
				    title: '菜单标题',
				    field: 'displayName'
				},
				{
					width: '100',
					title: '菜单图标',
					field: 'resourceName'
				},
				{
				    width: '300',
				    title: '链接地址',
				    field: 'functionUrl'
				},
                {
                    width: '80',
                    title: '启用标识',
                    field: 'status',
                    sortable: true,
                    formatter: function (value, row) {
                        var resStr = "异常状态";
                        switch (value) {
                            case "0":
                                resStr = "停用";
                                break;
                            case "1":
                                resStr = "启用";
                                break;
                        }
                        return resStr;
                    }
                },
                {
                    field: 'action',
                    title: '操作',
                    width: 120,
                    formatter: function (value, row, index) {
                        var str = '';
                        if (row.functionUrl == null) {
                            return '链接无效';
                        }
                        if (row.status == "0") {
                        	return '状态无效';
                        }
                        if (row.functionUrl != null) {
                            str = extUtil.formatString('<a href="javascript:void(0)" style="text-decoration : none;color:red" onclick="_assembleUrl(\'{0}\',\'{1}\');" title="Tab展示">Tab展示</a>', row.displayName, row.functionUrl);
                        }
                        return str;
                    }
                }
            ]
        ],
        toolbar: '#' + tool_bar,
        onBeforeLoad: function (param) {
            parent.$.messager.progress({
                text: '数据加载中....'
            });
        },
        onLoadSuccess: function (data) {
            parent.$.messager.progress('close');
        }
    });
    return menuInfo_list_datagrid;
};

/**
 * 流程进度页面（待修改）
 */
drawPlugin.processDatagrid = function (options, tool_bar) {
    var process_Datagrid;
    prcocess_Datagrid = $('#' + options).datagrid({
        striped: true,
        fit: true,
        idField: 'id',
        checkOnSelect: true,
        selectOnCheck: true,
        view: extEU.defaultView,
		columns : [ [
//			{
//				field : 'x',
//				checkbox : true
//			},
			{
				field : 'actName',
				title : '操作',
				width : 120
			},
			{
				field : 'assigneeName',
				title : '操作员',
				width : 80
			},
			{
				field : 'startTime',
				title : '开始时间',
				width : 120
			},
			{
				field : 'endTime',
				title : '截止时间',
				width : 120
			},
			{
				field : 'advice',
				title : '审批意见',
				width : 280
			}] ],
		onLoadSuccess : function(data) {
		},
        toolbar: '#' + tool_bar
    });
    return process_Datagrid;
};

/**
 * 指令列表
 */
drawPlugin.orderDatagrid = function (options, tool_bar) {
    var order_Datagrid;
    order_Datagrid = $('#' + options).datagrid({
		fitColumns : true,
		striped : true,
		checkOnSelect : true,
		view: extEU.defaultView,
		columns : [ [ {
			field : 'ck',
			checkbox : true
		}, {
			field : 'trOrigin',
			title : '指令来源',
			width : 100,
			formatter: function (value, row) {
		        var resStr = "-";
		        switch (value) {
		            case "0":
		                resStr = "手工";
		                break;
		            case "1":
		                resStr = "传真";
		                break;
		            case "2":
		            	resStr = "电子";
		            	break;
		            case "3":
		            	resStr = "系统";
		            	break;
		            case "4":
		            	resStr = "清算联动";
		            	break;
		            case "5":
		            	resStr = "场内";
		            	break;
		        }
		        return resStr;
		    }
		}, {
			field : 'direction',
			title : '收付方向',
			width : 100,
			formatter: function (value, row) {
		        var resStr = "-";
		        switch (value) {
		            case "0":
		                resStr = "收";
		                break;
		            case "1":
		                resStr = "付";
		                break;
		        }
		        return resStr;
		    }
		}, {
			field : 'prodName',
			title : '产品名称',
			width : 100
		}, {
			field : 'amt',
			title : '发生额',
			width : 100 ,
			align:'right',
			halign:'left',
			formatter: function (value, row) {
				return formatCurrency(row.amt);
		        }
		}, {
			field : 'actNo',
			title : '账号',
			width : 100
		}, {
			field : 'anaActNo',
			title : '对手账号',
			width : 100
		}, {
			field : 'state',
			title : '指令状态',
			width : 100,
			formatter: function (value, row) {
		        var resStr = "-";
		        switch (value) {
		            case "0":
		                resStr = "新建";
		                break;
		            case "1":
		            	resStr = "退回至传真管理";
		            	break;
		            case "2":
		            	resStr = "退回至电子指令管理";
		            	break;
		            case "3":
		            	resStr = "录入已经办";
		            	break;
		            case "4":
		            	resStr = "录入已审核";
		            	break;
		            case "5":
		            	resStr = "退回至录入经办";
		            	break;
		            case "6":
		            	resStr = "退回至录入待审核";
		            	break;
		            case "7":
		            	resStr = "投资监督已经办";
		            	break;
		            case "8":
		            	resStr = "投资监督已审核";
		            	break;
		            case "9":
		            	resStr = "退回至投资监督待经办";
		            	break;
		            case "10":
		            	resStr = "退回至投资监督待审核";
		            	break;
		            case "11":
		            	resStr = "核算已经办";
		            	break;
		            case "12":
		            	resStr = "核算已审核";
		            	break;
		            case "13":
		            	resStr = "退回至核算待经办";
		            	break;
		            case "14":
		            	resStr = "退回至核算待审核";
		            	break;
		            case "15":
		            	resStr = "清算已经办";
		            	break;
		            case "16":
		            	resStr = "清算已审核";
		            	break;
		            case "17":
		            	resStr = "退回至清算待经办";
		            	break;
		        }
		        return resStr;
		    }
		}, 
		{
			field : 'fax',
			title : '传真编号',
			width : 100,
			formatter: function (value, row) {
				if(value){
					return value;
				}
				return "-";
			}
		}
		] ],
		onLoadSuccess : function(data) {
		},
        toolbar: '#' + tool_bar
    });
    return order_Datagrid;
};

drawPlugin.orderTemplateDatagrid = function (options, tool_bar) {
	var orderTemplate_Datagrid;
	orderTemplate_Datagrid = $('#' + options).datagrid({
		fitColumns : true,
		striped : true,
		checkOnSelect : true,
		view: extEU.defaultView,
		columns : [ [
		{
			field:'id',
			title:'模板编号',
			width:20,
			checkbox : true
		},
		{
			field:'name',
			title:'模板名称',
			width:110
		}, {
			field : 'direction',
			title : '收付方向',
			width : 80,
			formatter: function (value, row) {
				var resStr = "-";
				switch (value) {
				case "0":
					resStr = "收";
					break;
				case "1":
					resStr = "付";
					break;
				}
				return resStr;
			}
		}, {
			field : 'prodName',
			title : '产品名称',
			width : 100
		}, {
			field : 'amt',
			title : '发生额',
			width : 100 ,
			align:'right',
			halign:'left',
			formatter: function (value, row) {
				return formatCurrency(row.amt);
			}
		}, {
			field : 'actNo',
			title : '账号',
			width : 100
		}, {
			field : 'anaActNo',
			title : '对手账号',
			width : 100
		}, {
			field:'transferMode',
			title:'支付方式',
			width:100,
			formatter: function (value, row) {
                var resStr = "-";
                switch (value) {
                    case "1":
                        resStr = "手工";
                        break;
                    case "2":
                    	resStr = "核心直连";
                    	break;
                }
                return resStr;
            }
		}, {
			field:'bankFlag',
			title:'行内外标志',
			width:100,
			formatter: function (value, row) {
                var resStr = "-";
                switch (value) {
                    case "1":
                        resStr = "行内";
                        break;
                    case "2":
                        resStr = "行外";
                        break;
                }
                return resStr;
            }
		}, {
			field:'cityFlag',
			title:'同城标志',
			width:80,
			formatter: function (value, row) {
                var resStr = "-";
                switch (value) {
                    case "1":
                        resStr = "是";
                        break;
                    case "2":
                        resStr = "否";
                        break;
                }
                return resStr;
            }
		}, {
			field:'checkState',
			title:'审核状态',
			width:80,
			formatter: function (value, row) {
                var resStr = "-";
                switch (value) {
                    case 0:
                        resStr = "未审核";
                        break;
                    case 1:
                        resStr = "已审核";
                        break;
                    case 2:
                        resStr = "反审核";
                        break;
                }
                return resStr;
            }
		}, {
		    title: '指令时间',
		    field: 'trDate',
		    width: 100
		}
		] ],
		onLoadSuccess : function(data) {
		},
		toolbar: '#' + tool_bar
	});
	return orderTemplate_Datagrid;
};

/**
 * 指令列表
 */
drawPlugin.orderWithTransferStateDatagrid = function (options, tool_bar) {
    var order_Datagrid;
    order_Datagrid = $('#' + options).datagrid({
	fitColumns : true,
	striped : true,
	checkOnSelect : true,
	view: extEU.defaultView,
	columns : [ [ {
		field : 'ck',
		checkbox : true
	}, {
		field : 'trOrigin',
		title : '指令来源',
		width : 100,
		formatter: function (value, row) {
	        var resStr = "-";
	        switch (value) {
	            case "0":
	                resStr = "手工";
	                break;
	            case "1":
	                resStr = "传真";
	                break;
	            case "2":
	            	resStr = "电子";
	            	break;
	            case "3":
	            	resStr = "系统";
	            	break;
	            case "4":
	            	resStr = "清算联动";
	            	break;
	            case "5":
	            	resStr = "场内";
	            	break;
	        }
	        return resStr;
	    }
	}, {
		field : 'direction',
		title : '收付方向',
		width : 100,
		formatter: function (value, row) {
	        var resStr = "-";
	        switch (value) {
	            case "0":
	                resStr = "收";
	                break;
	            case "1":
	                resStr = "付";
	                break;
	        }
	        return resStr;
	    }
	}, {
		field : 'prodName',
		title : '产品名称',
		width : 100
	}, {
		field : 'amt',
		title : '发生额',
		width : 100 ,
		align:'right',
		halign:'left',
		formatter: function (value, row) {
	        return formatCurrency(row.amt);
	        }
	}, {
		field : 'actNo',
		title : '账号',
		width : 100
	}, {
		field : 'anaActNo',
		title : '对手账号',
		width : 100
	}, {
		field : 'state',
		title : '指令状态',
		width : 100,
		formatter: function (value, row) {
	        var resStr = "-";
	        switch (value) {
		        case "0":
	                resStr = "新建";
	                break;
	            case "1":
	            	resStr = "退回至传真管理";
	            	break;
	            case "2":
	            	resStr = "退回至电子指令管理";
	            	break;
	            case "3":
	            	resStr = "录入已经办";
	            	break;
	            case "4":
	            	resStr = "录入已审核";
	            	break;
	            case "5":
	            	resStr = "退回至录入经办";
	            	break;
	            case "6":
	            	resStr = "退回至录入待审核";
	            	break;
	            case "7":
	            	resStr = "投资监督已经办";
	            	break;
	            case "8":
	            	resStr = "投资监督已审核";
	            	break;
	            case "9":
	            	resStr = "退回至投资监督待经办";
	            	break;
	            case "10":
	            	resStr = "退回至投资监督待审核";
	            	break;
	            case "11":
	            	resStr = "核算已经办";
	            	break;
	            case "12":
	            	resStr = "核算已审核";
	            	break;
	            case "13":
	            	resStr = "退回至核算待经办";
	            	break;
	            case "14":
	            	resStr = "退回至核算待审核";
	            	break;
	            case "15":
	            	resStr = "清算已经办";
	            	break;
	            case "16":
	            	resStr = "清算已审核";
	            	break;
	            case "17":
	            	resStr = "退回至清算待经办";
	            	break;
	        }
	        return resStr;
	    	}
	}, {
		field : 'transferState',
		title : '支付状态',
		width : 100,
		formatter: function (value, row) {
	        var resStr = "-";
	        switch (value) {
	            case "0":
	                resStr = "未支付";
	                break;
	            case "1":
	            	resStr = "已支付";
	            	break;
	        }
	        return resStr;
		}
	},{
		field : 'asmFlag',
		title : '是否关联指令',
		width : 100,
		formatter: function (value, row) {
	        var resStr = "-";
	        switch (value) {
	            case "0":
	                resStr = "是";
	                break;
	            case "1":
	            	resStr = "否";
	            	break;
	        }
	        return resStr;
	    }
	} ] ],
	 toolbar: '#' + tool_bar
});
    return order_Datagrid;
}

/**
 * 传真列表
 */
drawPlugin.faxDatagrid = function (options, tool_bar) {
    var fax_Datagrid;
    fax_Datagrid = $('#' + options).datagrid({
	fitColumns : true,
	striped : true,
	checkOnSelect : true,
	view: extEU.defaultView,
	columns : [ [ {
		field : 'ck',
		checkbox : true
	}, {
		field : 'id',
		title : '传真编号',
		width : 100
	}, {
		field : 'oldFile',
		title : '文件名称',
		width : 100
	}, {
		field : 'userName',
		title : '管理者',
		width : 100
	}, {
		field : 'st',
		title : '推送日期',
		width : 100,
        formatter: function (value, row) {
            var date = new Date(value).format("yyyy-MM-dd hh:mm:ss");
            if (value == undefined) {
                return "";
            }
            return date.toLocaleString();
        }
	}, {
		field : 'state',
		title : '状态',
		width : 100,
		formatter: function (value, row) {
	        var resStr = "-";
	        switch (value) {
	            case "0":
	                resStr = "未处理";
	                break;
	            case "1":
	            	resStr = "已处理";
	            	break;
	            case "2":
	            	resStr = "已作废";
	            	break;
	        }
	        return resStr;
	    	}
	}, {
		field : 'orderId',
		title : '指令编号',
		width : 100
	},{
		field : 'recType',
		title : '记录类型',
		width : 100,
		formatter: function (value, row) {
	        var resStr = "-";
	        switch (value) {
	            case "0":
	                resStr = "指令";
	                break;
	            case "1":
	            	resStr = "附件";
	            	break;
	        }
	        return resStr;
	    }
	} ] ],
	 toolbar: '#' + tool_bar
});
    return fax_Datagrid;
}