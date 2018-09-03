/**
 * JQuery自定义方法<br>
 *
 * @author DJQ
 * @updateData 2015年1月15日 00:14:38
 */
var extJQ = $.extend({}, extJQ);

/**
 * 判断节点是否存在<br>
 * $('#domId').exist()
 */
$.fn.exist = function () {
    return $(this).length >= 1;
};

/**
 * 改变jQuery的AJAX默认属性和方法
 * @requires jQuery
 *
 */
$.ajaxSetup({
    type: 'POST',
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        try {
            parent.$.messager.progress('close');
            var res = extJQ.stringToJson(XMLHttpRequest.responseText);
            parent.$.messager.alert('错误', res.msg);
        } catch (e) {
            // alert(XMLHttpRequest.responseText);
        }
    }
});

/**
 * messagerConfirm方法
 * @requires jQuery,EasyUI
 * @param title 标题
 * @param msg   提示信息
 *
 * @param fun  回调方法
 */
extJQ.messagerConfirm = function (title, msg, fun) {
    return $.messager.confirm(title, msg, fun);
};

/**
 * MessageShow
 * @requires jQuery,EasyUI
 */
extJQ.messagerShow = function (options) {
    return $.messager.show(options);
};

/**
 * MessageAlert
 * @requires jQuery,EasyUI
 */
extJQ.messagerAlert = function (title, msg, icon, fn) {
    return $.messager.alert(title, msg, icon, fn);
};

/**
 * 输出操作结果的反馈信息
 * 显示提示框
 * @param obj
 * @param successMsg "成功！"
 * @param failedMsg     "失败！"
 */
extJQ.printResponseMsg = function (obj, successMsg, failedMsg) {
    if (obj.success) {
        parent.extJQ.messagerShow({
            title: '提示',
            msg: successMsg,
            timeout: 2000
        });
    } else {
        $.messager.alert("提示", failedMsg + " : <br/>" + obj.msg);
        return;
    }
};

/**
 * 输出信息
 * 显示提示框
 * @param obj
 * @param successMsg "成功！"
 * @param failedMsg     "失败！"
 */
extJQ.printMsg = function (msg) {
    extJQ.messagerShow({
        title: '提示',
        msg: msg,
        timeout: 2000
    });
};

extJQ.printMsgCenter = function (title, msg, timeout, active) {
    extJQ.messagerShow({
        title: title,
        msg: msg,
        showType: active,
        timeout: timeout,
        style: {
            right: '',
            bottom: ''
        }
    });
};

/**
 * 对DataGrid进行insertRow方法，插入前进行存在判断
 * @requires jQuery,EasyUI
 * @requireFile tienon.ext.util.js
 */
extJQ.datagridInsertRow = function (dataGridId, rowData) {
    var x = $('#' + dataGridId).datagrid('getRows');
    var flag = !0;
    if (x.length > 0) {
        for (var i in x) {
            if (extUtil.json2Str(x[i]) == extUtil.json2Str(rowData)) {
                flag = !1;
            }
        }
    }
    if (flag) {
        $('#' + dataGridId).datagrid('appendRow', rowData);
    }
};

/**
 * 对DataGrid进行updateRow方法，更新前进行存在判断
 * @requires jQuery,EasyUI
 */
extJQ.datagridUpdateRow = function (dataGridId, rowData) {
    var x;
    x = $('#' + dataGridId).datagrid('getRows');
    if (x.length > 0) {
        $('#' + dataGridId).datagrid('updateRow', {
            index: 0, // 特有方法，只能选一个用户，故此只要更新第一个记录即可。
            row: rowData
        });
    } else {
        $('#' + dataGridId).datagrid('insertRow', {
            index: 0,
            row: rowData
        });
    }
};

/**
 * 对DataGrid进行deleteRow方法，移除前进行存在判断
 * @requires jQuery,EasyUI
 */
extJQ.datagridDeleteRow = function (dataGridId, rowData) {
    var x = $('#' + dataGridId).datagrid('getRows');
    if (x.length > 0) {
        for (i in x) {
            if (extUtil.json2Str(x[i]) == extUtil.json2Str(rowData)) {
                var index = $('#' + dataGridId).datagrid('getRowIndex', x[i]);
                $('#' + dataGridId).datagrid('deleteRow', index);
            }
        }
    }
};

/**
 * 更换主题<br>
 * TODO: 结合Cookie使用<br>
 * @requires jQuery,EasyUI
 * @param themeName
 */
extJQ.changeTheme = function (themeName) {
    var $easyuiTheme = $('#easyuiTheme');
    var url = $easyuiTheme.attr('href');
    var href = url.substring(0, url.indexOf('themes')) + 'themes/' + themeName + '/easyui.css';
    $easyuiTheme.attr('href', href);
    var $iframe = $('iframe');
    if ($iframe.length > 0) {
    	href = extUtil.getProjectName() +'/'+ href; // Iframe 窗口引用主题脚本路径
        for (var i = 0; i < $iframe.length; i++) {
            var ifr = $iframe[i];
            try {
                $(ifr).contents().find('#easyuiTheme').attr('href', href);
            } catch (e) {
                try {
                    ifr.contentWindow.document.getElementById('easyuiTheme').href = href;
                } catch (e) {
                }
            }
        }
    }
    //	$.cookie('easyuiThemeName', themeName, {
    //		expires : 7
    //	});
};


/**
 * 比如我们要遍历数组中的每一个元素，引用foreach函数.
 * var testArray = [1,2,3,4,5,1,2,'w'];
 * extJQ.foreach(testArray, function(i){
 * 　		alert(i);
 * });
 */
extJQ.foreach = function (obj, insp) {
    if (obj == null && obj.constructor != Array) {
        return [];
    }
    var i = 0, len = obj.length, r = [];
    while (i < len) {
        var x = insp(obj[i], i);
        if (x !== null) {
            r[r.length] = x;
        }
        i++;
    }
    return r;
};

/**
 *  引用ArrayWithout的例子
 *  var testArray = [1,2,3,4,5,1,2,'w'];
 *  var result = extJQ.ArrayWithout(testArray, 1, 3);
 *  // var result = ArrayWithout(testArray, [1, 4]);
 *  alert(result) //[2,4,5,2]
 */
extJQ.ArrayWithout = function () {
    if (arguments.length < 2) {
        return arguments.length == 1 ? arguments[0] : null;
    }
    var results = [];
    var aa = arguments[0];
    if (aa === null || aa.constructor != Array) {
        return null;
    }
    if (arguments[1].constructor == Array) {
        var args = [];
        args[0] = aa;
        extJQ.foreach(arguments[1], function (v, i) {
            args[i + 1] = v;
        });
    } else {
        args = arguments;
    }
    for (var i = 0; i < aa.length; i++) {
        var isWithout = true;
        for (var j = 1; j < args.length; j++) {
            if (aa[i] == args[j]) {
                isWithout = false;
                break;
            }
        }
        if (isWithout) {
            results.push(aa[i]);
        }
    }
    return results;
};

/**
 * 将Display被置为"none"的DOM节点，祛除Display。
 * #解决EasyUI延迟渲染，所造成的HTML的DOM节点在页面加载显示时，先无样式形式展示，后才EasyUI渲染。#
 * SOLUTION：
 * 将DOM节点先display，再在EasyUI渲染DOM节点的前一步进行取消Display操作。
 * USE：
 * <div id='dom1' style="display='none'";/>
 * <div id='dom2' style="display='none'";/>
 * extJQ.removeDisplay('dom1,dom2');
 *
 * @requires jQuery,EasyUI
 * @param domIdList Dom节点的ID串，以逗号分隔。
 */
extJQ.removeDisplay = function (domIdList) {
    var domIds = domIdList.split(',');
    for (var i = 0; i < domIds.length; i++) {
        if (!($.trim(domIds[i] == ''))) {
            $('#' + domIds[i])[0].style.dispaly = "";
        }
    }
};

/**
 * 在InsertRow插入数据后，<br>
 * 若不刷新则调取此方法将DataGrid默认无数据的视图祛除。<br>
 * @requires jQuery,EasyUI
 * @param target DataGrid的节点ID。
 */
extJQ.removeDatagridDefaultView = function (target) {
    var dom1 = $('#' + target);
    var vc = dom1.datagrid('getPanel').children('div.datagrid-view');
    vc.children('div.datagrid-empty').remove();
};

/**
 * 清空datagrid内显示的数据<br>
 * 注意: uncheckAll 和 unselectAll 所造成的影响。<br>
 * @requires jQuery,EasyUI
 * @param target DataGrid节点;
 * @param target2 Pagination节点;
 */
extJQ.removeDatagridBody = function (dataGridId, paginationId) {
    var dataGrid = $('#' + dataGridId);
    var pagination = $('#' + paginationId);
    extJQ.removeDatagridDefaultView(dataGridId);
    var vc = dataGrid.datagrid('getPanel').children('div.datagrid-view').children('div.datagrid-view2').children('div.datagrid-body');
    vc.children('table.datagrid-btable').remove();
    pagination.pagination('refresh', {
        total: 0,
        pageNumber: 1
    });
};

/**
 * 扩展dialog的onClose关闭事件,进行destroy.
 * @requires jQuery,EasyUI
 * @param options
 */
extJQ.dialog = function (options) {
    var opts = $.extend({
        modal: true,
        onClose: function () {
            $(this).dialog('destroy');
        }
    }, options);
    return $('<div/>').dialog(opts);
};

/**
 *  扩展window的onClose关闭事件,进行destroy.
 * @requires jQuery,EasyUI
 *
 * @param options
 */
extJQ.window = function (options) {
    var opts = $.extend({
        onClose: function () {
            $(this).window('destroy');
        }
    }, options);
    return $('<div/>').window(opts);
};
