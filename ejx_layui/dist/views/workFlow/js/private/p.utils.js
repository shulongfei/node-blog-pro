/**
 * 项目内所有的JS小方法。<br>
 *
 * @author DJQ
 * @updateData 2015年1月15日 00:32:09
 */
var utils = $.extend({}, utils);

//	去除所有空格:  
//    str   =   str.replace(/\s+/g,"");      
//    去除两头空格:  
//    str   =   str.replace(/^\s+|\s+$/g,""); 

/**
 * 自定义Ajax 的 Post方法<br>
 * 参数：<br>
 * sUrl：地址（以‘/’打头，不需要带项目名称）<br>
 * sSid：服务ID<br>
 * oJsonData:请求数据<br>
 * fSuccess:回调函数（操作成功）<br>
 * fFail：回调函数（操作失败）<br>
 */
utils.ajaxPost = function (sUrl, sSid, oJsonData, fSuccess, fFail) {
    var sJsonData = extUtil.json2Str(oJsonData);
    $.post(extUtil.getProjectName() + sUrl + "?" + utils.createUUID(), {
        _sid: sSid,
        json: sJsonData,
    }, function (data) {
        var oRes = extUtil.str2Json(data);
        if (oRes.success) {
            fSuccess(oRes.obj);
        } else {
            // TODO 失败的动作
            if (fFail) {
                fFail(oRes);
            }
            extJQ.messagerAlert("提示",oRes.msg,'error');
        }
        extJQ.printMsg(oRes.msg);
    });
}
/**
 * 同步
 */
utils.ajaxPost1 = function (sUrl, sSid, oJsonData, fSuccess, fFail) {
    var sJsonData = extUtil.json2Str(oJsonData);
    $.ajax({
    		url:extUtil.getProjectName() + sUrl + "?" + utils.createUUID(),
    		type:"post",
    		async: false,
    		data: {
    	        _sid: sSid,
    	        json: sJsonData
    	    }, 
    	    success: function (data) {
        var oRes = extUtil.str2Json(data);
        if (oRes.success) {
            fSuccess(oRes.obj);
        } else {
            // TODO 失败的动作
            if (fFail) {
                fFail(oRes);
            }
        }
       /* extJQ.printMsg(oRes.msg);*/
    	 }
    });
}
    
utils.getCheckboxValStr = function (domId, sVal) {
	var $domCheckbox =  $("#" + domId + " input[type=checkbox]")
	var sRes = '';
	if(sVal){
		var nLen = $domCheckbox.length;
		for (var int = 0; int < nLen; int++) {
			var sIsChecked = false;
			if(sVal.charAt(int) == staticParam.flag_true){
				sIsChecked = true;
			}
			$domCheckbox[int].checked = sIsChecked;
		}
	} else {
		$domCheckbox.each(function() {
			if (this.checked) {
				sRes += staticParam.flag_true;
			} else {
				sRes += staticParam.flag_false;
			}
		});
		return sRes;
	}
}

utils.userRoleSubDatagridDeleteRow = function(dataGridIdP, dataGridIdS, rowData) {
	var x = $('#' + dataGridIdP).datagrid('getRows');
	var sIndex = [];
	for (var i in rowData) {
		// 如果目标有包含要删除的数据，则进行取消选择动作
		if (x.length > 0) {
			for (var j in x) {
				if (rowData[i].roleCode == x[j].roleCode) {
					var index = $('#' + dataGridIdP).datagrid('getRowIndex', x[j]);
					if (index > -1) {
						sIndex.push(index);
					}
				}
			}
//			var index = $('#' + dataGridIdS).datagrid('getRowIndex', rowData[i]);
//			if (index > -1) {
//				$('#' + dataGridIdS).datagrid('deleteRow', index);
//			}
		} else {
			var index = $('#' + dataGridIdS).datagrid('getRowIndex', rowData[i]);
			$('#' + dataGridIdS).datagrid('deleteRow', index);
		}
	}
	for(var h in sIndex){
		$('#' + dataGridIdP).datagrid('unselectRow', sIndex[h]);
	}
};

/**
 * orderManage | taskManage
 * DataGrid加载数据，并且实现排序功能和分页功能
 * @param respData 响应数据，用于回填Datagrid
 * @param datagridId
 * @param paginationId
 * @param searchCon 搜索条件：数据请求和分页请求
 * @param mediatorObj Mediator对象
 * @param notice 通知变量
 */
utils.loadSortPaginationDataGrid = function (respData, datagridId, paginationId, searchCon, mediatorObj, notice) {
    $('#' + datagridId).datagrid('unselectAll');
    $('#' + datagridId).datagrid('uncheckAll');
    $('#' + datagridId).datagrid('loadData', respData.rows);
    $('#' + datagridId).datagrid({
        onSortColumn: function (sort, order) {
            var paginationParam = $('#' + paginationId).pagination("options");
            var pageSize = paginationParam.pageSize;
            var searchCondition = searchCon;
            //点击排序重新刷新到第一页
            $('#' + paginationId).pagination('refresh', {
                pageNumber: 1
            });
            var data = {
                pageGrid: utils.createPageGrid(searchCondition, null, pageSize)
            };
            mediatorObj.sendNotification(notice, data);
        }
    });
    $('#' + paginationId).pagination({
        pageList: [10, 20, 30],
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var searchCondition = searchCon;
            var data = {
                pageGrid: utils.createPageGrid(searchCondition, pageNumber, pageSize)
            };
            // 发送分页请求
            mediatorObj.sendNotification(notice, data);
            $(this).pagination('loaded');
        },
        onChangePageSize: function (pageSize) {
            var searchCondition = searchCon;
            var data = {
                pageGrid: utils.createPageGrid(searchCondition, null, pageSize)
            };
            // 发送分页请求
            mediatorObj.sendNotification(notice, data);
        }
    }).pagination('refresh', {
        total: respData.total
    });
};

/**
 * 新增记录后，为解决Index错乱问题，进行重新DataGrid的Reload操作。
 */
utils.reloadDataGrid = function (dataGridId, paginationId) {
    var pageSize/* 分页条内规定的页记录数 */ = $('#' + paginationId).pagination("options").pageSize;
    var rows/* 实际页记录数 */ = $('#' + dataGridId).datagrid('getRows');
    if (rows.length > pageSize) {
        $('#' + dataGridId).datagrid('deleteRow', rows.length - 1);
    }
    var newRows = $('#' + dataGridId).datagrid('getRows');
    $('#' + dataGridId).datagrid('loadData', newRows);
};

/**
 * 分页请求数据的封装
 */
utils.createPageGrid = function (searchCondition, page, rows) {
    var defaultPage = '1';
    var defaultRows = '10';
    if (page == null)
        page = defaultPage;
    if (rows == null)
        rows = defaultRows;
    if (searchCondition == null)
        searchCondition = {};
    var pageGrid/* 分页数据 */ = {
        page: page, // 页码
        rows: rows, // 每页记录数
        searchCondition: searchCondition // 条件
    };
    return pageGrid;
};

/**
 * 清空Grid数据，进行初始化。
 */
utils.clearGrid = function (dataGrid, pagination) {
    $('#' + dataGrid).datagrid('loadData', {total: 0, rows: []});
    $('#' + pagination).pagination('refresh', {
        total: 0,
        pageNumber: 0
    });
};

/**
 * 循环生成按钮HTML
 */
utils.createButtonS = function(btnsId, btnDef, o ) {
	var aBtns = [];
	for ( var i in o) {
		var sBtn = utils.createButtonA(o[i].resourceCode, o[i].resourceName,o[i].displayName, null);
		aBtns.push(sBtn);
	}
	return utils.createButtonDiv(btnsId, aBtns.concat(btnDef));
}

/**
 * 生成单选框的HTML数据。
 * @param 
 * 	id: 单选框ID
 * 	name：一致才为一组
 *  value: 单选框值
 * 	title：单选框文字
 * 	display：是否选中
 */
utils.createRadio = function(id, name, value, title, checked) {
//	<input type="radio" name="identity" value="parent" checked="checked" />学生 
//	<input type="radio" name="identity" value="before" />教师 
//	<input type="radio" name="identity" value="after" />管理员
	if (checked) {
		checked = 'checked';
	} else {
		checked = 'null';
	}
	var res = "";
	res += '<input type="radio" id="'
			+ id
			+ '" name="'
			+ name
			+ '" value="'
			+ value
			+ '" checked="'
			+ checked
			+ '">' + title + '</input>';
	return res;
};

/**
 * 生成按钮的HTML数据。
 * @param 
 * 	id: 按钮ID
 * 	icon：按钮图标
 * 	title：按钮文字
 * 	display：是否隐藏
 *  plain:是否以隆起的形态展示
 */
utils.createButtonA = function(id, icon, title, display, plain) {
	if (display) {
		display = 'none';
	} else {
		display = 'null';
	}
	if(!plain){
		plain = true;
	}
	var res = "";
	res += '<a id="'
			+ id
			+ '" style="display: '
			+ display
			+ ';" href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:\' '
			+ icon + '\',plain:\''+ plain +'\'">' + title + '</a>';
	return res;
};

/**
 * 生成包含按钮的DIV页面数据。
 * @param
 * type calss类型:dialog-button|datagrid-toolbar
 */
utils.createButtonDiv = function(id, htmlArray, type, px) {
	var style = "";
	var clazz = ""; 
	if (type == 'datagrid'){
		clazz = ' class = "datagrid-toolbar"';
		style = ' style = "padding: 5px; height: auto;"';
	}else{
		clazz = ' class = "dialog-button"'; // 默认为dialog的按钮
		if (px > 0) {
			style = ' style = "padding-right:' + px + 'px"';
		}
	}
	var html = '<div id="' + id + '"'+ clazz + style + ' >';	
	for ( var key in htmlArray) {
		html += htmlArray[key];
	}
	html += '</div>';
	return html;
};

utils.random4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
utils.createUUID = function () {
    return (utils.random4() + utils.random4() + "-" + utils.random4() + "-" + utils.random4() + "-" + utils.random4() + utils.random4());
};

/**
 * 增加Tab页面<br>
 * tabDom 需要添加tab的现有tab对象（重要）；<br> 
 * showModel tab页面内容展示模式,见p.staticParam.js内定义的2种形式（重要）；<br>
 * id tab页面的ID；<br>
 * text tab页面的标题，用于判断是否已经存在和刷新等（重要）；<br> 
 * iconCls tab页面的图标；<br>
 * uri tab页面的引用地址（重要）；<br>
 * tParam 父页面向子页面（iFrame）传递的参数。子页面的取参方法为【 window.tParam 】；<br>
 */
utils.addTabs = function(tabDom, showModel, id, text, iconCls, uri, tParam) {
	
	var errUri/* 默认为出错页面的链接 */= 'pages/error/err.html';
	var uuid/* 随机数生成 */ = utils.createUUID();
	var id = id || uuid; // 无数据则设为UUID
	var text = text || uuid; // 无数据则设为UUID
	var uri = uri || errUri; // 无数据则设为出错页面
	var showModel = showModel || staticParam.webModel_iframe; // 无数据则引用模式为iframe
	var iconCls = iconCls || "icon-ok"; // 无数据则设默认图标
	
	if (tabDom.tabs('exists', text)) { // 若tab页已存活，则选中，否则打开tab
		tabDom.tabs('select', text);
	} else {
		var $centerTabs = tabDom;
		var sHref/* tab页面引用链接地址 */= uri + "?" + uuid;
		if (showModel == staticParam.webModel_iframe) { // iframe模式加载
			var sContent = '<iframe id="'
					+ id
					+ '" src="'
					+ sHref
					+ '" allowTransparency="true" style="border: 0; width: 100%; height: 99%;" frameBorder="0"></iframe>';
			$centerTabs.tabs('add', {
				title : text,
				closable : true,
				iconCls : iconCls,
				content : sContent,
				tools : [ {
					iconCls : 'icon-mini-refresh',
					handler : function() {
						refreshTab(text);
					}
				} ]
			});
			// 需要从父亲处取得iframe对象来进行操作
			parent.$('#' + id, window.parent.document)[0].contentWindow.tParam = tParam;
			return id; // 返回ID
		}
		$centerTabs.tabs('add', {
			id : id,
			title : text,
			closable : true,
			iconCls : iconCls,
			href : sHref,
			tools : [ {
				iconCls : 'icon-mini-refresh',
				handler : function() {
					refreshTab(text);
				}
			} ]
		});
	}
	return id; // 返回ID
}



/**
 * 绘制从后台取数据的基本Combobox下拉框<br>
 * comboboxDom 需要操作的DOM对象（重要）；<br>
 * valueField combobox的valueField，为显示文本数据所对应的属性，一般作为传递到后台的数据ID（重要）；<br>
 * textField combobox的textField，一般作为下拉框给用户直观看到的文本数据；<br>
 * ##以上2个字段，需要和后台从来的数据字段名称一致，否则无法加载数据！##<br>
 * sUrl：地址（以‘/’打头，不需要带项目名称）<br>
 * sSid：服务ID<br>
 */
utils.basicCombobox = function (comboboxDom, valueField, textField, sUrl, sSid) {
	comboboxDom.combobox({
    	valueField: valueField, // 需与后台数据对应
        textField: textField,	// 需与后台数据对应
        multiple:false, // 是否多选
        editable:false, // 是否可编辑
        onShowPanel : function (){
			var x = comboboxDom.combobox('getData');
			if (x.length > 0){ // 只在未加载过数据时，才发送加载请求
				return;
			}
        	var data = {
    				pageGrid: utils.createPageGrid(null, null, null)
    			};
        	utils.ajaxPost(sUrl, sSid, data.pageGrid, 
					function (o) {
        			// 注意 Combobox 需要的数据格式和 Datagrid 不一致。其只需要rows内的数据；
        				var items = o.jsonData.rows;
//						var items = $.map(o.jsonData.rows, function(item){
//							return {
//								valueField : item.valueField,
//								textField : item.textField
//								};
//						});
						comboboxDom.combobox('loadData',items);
			           }
			);
        }
    });
}

utils.getParameter = function (param)
{
	var query = window.location.search;
	var iLen = param.length;
	var iStart = query.indexOf(param);
	if (iStart == -1){
	   return ""
	 };
	iStart += iLen + 1;
	var iEnd = query.indexOf("&", iStart);
	if (iEnd == -1)
	return query.substring(iStart);
	return query.substring(iStart, iEnd);
	}


/**
 *文件下载方法
 */
utils.downloadFileByName = function () {
	var type,fileName,filePath;
	type = arguments[0];
	fileName = arguments[1];
	var url = extUtil.getProjectName()+"/FileDownloadByNameServlet?type=" + type+"&fileName="+encodeURIComponent(fileName);
	if(arguments.length==3){
		filePath = arguments[2];
		url += "&filePath="+encodeURIComponent(filePath);
	}
	url += "&uuid="+utils.createUUID();
	if("2"== type){
		return url;
	}
window.location.href = url;
};

/**
 *下载pdf工具
 */
utils.downloadPdfTool = function () {
	var url = extUtil.getProjectName()+"/downLoadPdfToolServlet?fileName=pdf.exe";
window.location.href = url;
};