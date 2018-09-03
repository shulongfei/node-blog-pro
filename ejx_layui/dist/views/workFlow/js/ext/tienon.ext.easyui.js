/**
 * EasyUI 控件的扩展相关<br>
 *
 * Notice:
 * 目前适配EasyUI版本为1.3.5(向下兼容)，<br>
 * 扩展方法可能会随着后续EasyUI版本升级而得到官方的解决方案。<br>
 * 故在升级项目EasyUI版本的同时，需要适当关注官方升级变更信息。<br>
 *
 * 本脚本若无法满足具体需求，可自行变动修改。<br>
 *
 * @requires jQuery,EasyUI
 * @author DJQ
 * @updateData 2015年1月15日 00:09:54
 * @version 1.0
 */

var extEU/*nameSpace*/ = $.extend({}, extEU);

/**
 * 扩展DataGrid返回记录为0时显示"无记录"的提示<br>
 * USE:<br>
 * $('#domId').datagrid({ view: defaultView, emptyMsg: '自定义提示信息：No Records Found !'
 * });
 */
extEU.defaultView = $.extend({}, $.fn.datagrid.defaults.view, {
    onAfterRender: function (target) {
        $.fn.datagrid.defaults.view.onAfterRender.call(this, target);
        var opts = $(target).datagrid('options');
        var vc = $(target).datagrid('getPanel').children('div.datagrid-view');
        vc.children('div.datagrid-empty').remove();
        if (!$(target).datagrid('getRows').length) {
            var d = $('<div class="datagrid-empty"></div>').html(
                    opts.emptyMsg || '无记录').appendTo(vc);
            d.css({
                position: 'absolute',
                left: 0,
                top: 50,
                width: '100%',
                textAlign: 'center',
                letterSpacing: '10px',
                fontWeight: '600',
                fontSize: 'larger'
            });
        }
    }
});

/**
 * 在InsertRow插入数据后，<br>
 * 若不刷新则调取此方法将DataGrid默认无数据的视图祛除。<br>
 * @requires jQuery,EasyUI
 * @param target DataGrid的节点ID。
 */
extEU.removeDatagridDefaultView = function(target) {
	var dom1 = $('#' + target);
	var vc = dom1.datagrid('getPanel').children('div.datagrid-view');
	vc.children('div.datagrid-empty').remove();
};

/**
 * 更改easyui加载panel时的提示文字
 */
$.extend($.fn.panel.defaults, {
    loadingMessage: '页面数据加载中....'
});

/**
 * 更改easyui加载grid时的提示文字
 */
$.extend($.fn.datagrid.defaults, {
    loadMsg: '表格数据加载中....'
}); 
  
/**
 * ValidateBox扩展验证规则。<br>
 *
 * 1.例》equals:<br>
 * <input id="pwd" name="pwd" type="password" class="easyui-validatebox" data-options="required:true"> <br>
 * <input id="rpwd" name="rpwd" type="password" class="easyui-validatebox" required="required" validType="equals['#pwd']"> <br>
 * 2.例》spaceMatch：<br>
 * <input class="easyui-validatebox" data-options="required:true, validType:['spaceMatch[0]']"><br>
 * 其余几个类似使用 <br>
 * 若同时要多个规则，则在validType内以逗号区隔：validType:['spaceMatch[0]','lengthMatch[9]'] <br>
 *
 */
$.extend($.fn.validatebox.defaults.rules, {
    equals: {
        validator: function (value, param) {
            return value == $(param[0]).val();
        },
        message: '不一致，请重新输入！'
    },
    notEquals: {
        validator: function (value, param) {
            return value != $(param[0]).val();
        },
        message: '未变更，请重新输入！'
    },
    lengthMatch: {
        validator: function (value, param) {
            return value.length == param[0];
        },
        message: '要求输入{0}位！'
    },
    spaceMatch: {
        validator: function (value, param) {
            return value.indexOf(" ") == -1;
        },
        message: '不允许出现空格符！'
    },
    eqNumber: {
        validator: function (value, param) {
            if (value.length > 0) {
                return parseInt(value) > parseInt($(param[0]).val());
            }
        },
        message: '不能小于区间最小值'
    }
});

/**
 * LinkButton方法扩展（修复禁用功能，并添加启用）
 */
$.extend($.fn.linkbutton.methods, {
    enable: function (jq) {
        return jq.each(function () {
            var state = $.data(this, 'linkbutton');
            if ($(this).hasClass('l-btn-disabled')) {
                var itemData = state._eventsStore;
                // 恢复超链接
                if (itemData.href) {
                    $(this).attr("href", itemData.href);
                }
                // 回复点击事件
                if (itemData.onclicks) {
                    for (var j = 0; j < itemData.onclicks.length; j++) {
                        $(this).bind('click', itemData.onclicks[j]);
                    }
                }
                // 设置target为null，清空存储的事件处理程序
                itemData.target = null;
                itemData.onclicks = [];
                $(this).removeClass('l-btn-disabled');
            }
        });
    },
    disable: function (jq) {
        return jq.each(function () {
            var state = $.data(this, 'linkbutton');
            if (!state._eventsStore)
                state._eventsStore = {};
            if (!$(this).hasClass('l-btn-disabled')) {
                var eventsStore = {};
                eventsStore.target = this;
                eventsStore.onclicks = [];
                // 处理超链接
                var strHref = $(this).attr("href");
                if (strHref) {
                    eventsStore.href = strHref;
                    $(this).attr("href", "javascript:void(0)");
                }
                // 处理直接耦合绑定到onclick属性上的事件
                var onclickStr = $(this).attr("onclick");
                if (onclickStr && onclickStr != "") {
                    eventsStore.onclicks[eventsStore.onclicks.length] = new Function(onclickStr);
                    $(this).attr("onclick", "");
                }
                // 处理使用jquery绑定的事件
                var eventDatas = $(this).data("events") || $._data(this, 'events');
                if (eventDatas["click"]) {
                    var eventData = eventDatas["click"];
                    for (var i = 0; i < eventData.length; i++) {
                        if (eventData[i].namespace != "menu") {
                            eventsStore.onclicks[eventsStore.onclicks.length] = eventData[i]["handler"];
                            $(this).unbind('click', eventData[i]["handler"]);
                            i--;
                        }
                    }
                }
                state._eventsStore = eventsStore;
                $(this).addClass('l-btn-disabled');
            }
        });
    }
});

/**
 * 扩展Layout在折叠时候，添加Title到折叠的部分。 在layout的panle全局配置中,增加一个onCollapse处理title。
 * （修改为能够处理主页的layout折叠）
 */
$.extend($.fn.layout.paneldefaults, {
    onCollapse: function () {
        var layout;
        layout = $(this).parents("div.layout");
        if (!layout.length) {
            layout = $(this).parents("body.layout");
        }
        // 获取当前region的配置属性
        var opts = $(this).panel("options");
        // 获取key
        var expandKey = "expand" + opts.region.substring(0, 1).toUpperCase() + opts.region.substring(1);
        // 从layout的缓存对象中取得对应的收缩对象
        var expandPanel = layout.data("layout").panels[expandKey];
        // 针对横向和竖向的不同处理方式
        if (opts.region == "west" || opts.region == "east") {
            // 竖向的文字打竖,其实就是切割文字加br
            var split = [];
            for (var i = 0; i < opts.title.length; i++) {
                split.push(opts.title.substring(i, i + 1));
            }
            expandPanel.panel("body").addClass("panel-title").css("text-align", "center").html(split.join("<br>"));
        } else {
            expandPanel.panel("setTitle", opts.title);
        }
    }
});

/**
 * 扩展combobox选择记录，使用方法（下标由0开始）： <br>
 * $('#comboboxID').combobox('selectedIndex',0) //选中第一个
 */
$.extend($.fn.combobox.methods, {
    selectedIndex: function (jq, index) {
        if (!index) {
            index = 0;
        }
        $(jq).combobox({
            onLoadSuccess: function () {
                var opt = $(jq).combobox('options');
                var data = $(jq).combobox('getData');
                for (var i = 0; i < data.length; i++) {
                    if (i == index) {
                        $(jq).combobox('select', eval('data[index].' + opt.valueField));
                        break;
                    }
                }
            }
        });
    }
});

/**
 * 包含Iframe的界面容器在关闭时回收内存，界面使用iframe嵌入网页时的内存泄漏问题
 */
var iframeCollectGarbage = function () {
    var frame = $('iframe', this);
    try {
        if (frame.length > 0) {
            for (var i = 0; i < frame.length; i++) {
                frame[i].src = '';
                frame[i].contentWindow.document.write('');
                frame[i].contentWindow.close();
            }
            frame.remove();
            if (navigator.userAgent.indexOf("MSIE") > 0) {// IE特有回收内存方法
                try {
                    CollectGarbage();
                } catch (e) {
                }
            }
        }
    } catch (e) {
    }
}

$.fn.window.defaults.onBeforeDestroy = iframeCollectGarbage;
$.fn.panel.defaults.onBeforeDestroy = iframeCollectGarbage;

/**
 * 取消easyui默认开启的parser, 在页面加载之前，先开启一个进度条, 然后在页面所有easyui组件渲染完毕后，关闭进度条.
 */
$.parser.auto = false;
$(function () {
    $.messager.progress({
        text: '页面加载中....',
        interval: 100
    });
    $.parser.parse(window.document);
    window.setTimeout(function () {
        $.messager.progress('close');
        if (self != parent) {
            window.setTimeout(function () {
                try {
                    parent.$.messager.progress('close');
                } catch (e) {
                }
            }, 500);
        }
    }, 1);
    $.parser.auto = true;
});

/**
 * 避免验证tip屏幕跑偏
 */
var removeEasyuiTipFunction = function () {
    window.setTimeout(function () {
        $('div.validatebox-tip').remove();
    }, 0);
};
$.fn.panel.defaults.onClose = removeEasyuiTipFunction;
$.fn.window.defaults.onClose = removeEasyuiTipFunction;
$.fn.dialog.defaults.onClose = removeEasyuiTipFunction;

/**
 * 防止panel/window/dialog组件超出浏览器边界
 *
 * @param left
 * @param top
 */
var easyuiPanelOnMove = function (left, top) {
    var l = left;
    var t = top;
    if (l < 1) {
        l = 1;
    }
    if (t < 1) {
        t = 1;
    }
    var width = parseInt($(this).parent().css('width')) + 14;
    var height = parseInt($(this).parent().css('height')) + 14;
    var right = l + width;
    var buttom = t + height;
    var browserWidth = $(window).width();
    var browserHeight = $(window).height();
    if (right > browserWidth) {
        l = browserWidth - width;
    }
    if (buttom > browserHeight) {
        t = browserHeight - height;
    }
    $(this).parent().css({/* 修正面板位置 */
        left: l,
        top: t
    });
};
$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
$.fn.window.defaults.onMove = easyuiPanelOnMove;
$.fn.panel.defaults.onMove = easyuiPanelOnMove;

/**
 * 通用错误提示<br>
 * 用于datagrid/treegrid/tree/combogrid/combobox/form加载数据出错时的操作
 *
 */
extEU.onLoadError = {
    onLoadError: function (XMLHttpRequest) {
        if (parent.$ && parent.$.messager) {
            parent.$.messager.progress('close');
            parent.$.messager.alert('加载错误', XMLHttpRequest.responseText);
        } else {
            $.messager.progress('close');
            $.messager.alert('加载错误', XMLHttpRequest.responseText);
        }
    }
};
$.extend($.fn.datagrid.defaults, extEU.onLoadError);
$.extend($.fn.treegrid.defaults, extEU.onLoadError);
$.extend($.fn.tree.defaults, extEU.onLoadError);
$.extend($.fn.combogrid.defaults, extEU.onLoadError);
$.extend($.fn.combobox.defaults, extEU.onLoadError);
$.extend($.fn.form.defaults, extEU.onLoadError);

/**
 * 为datagrid、treegrid增加表头菜单，用于显示或隐藏列，注意：冻结列不在此菜单中
 */
var createGridHeaderContextMenu = function (e, field) {
    e.preventDefault();
    var grid = $(this);
    /* grid本身 */
    var headerContextMenu = this.headerContextMenu;
    /* grid上的列头菜单对象 */
    if (!headerContextMenu) {
        var tmenu = $('<div style="width:100px;"></div>').appendTo('body');
        var fields = grid.datagrid('getColumnFields');
        for (var i = 0; i < fields.length; i++) {
            var fildOption = grid.datagrid('getColumnOption', fields[i]);
            if (!fildOption.hidden) {
                $('<div iconCls="icon-ok" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            } else {
                $('<div iconCls="icon-empty" field="' + fields[i] + '"/>').html(fildOption.title).appendTo(tmenu);
            }
        }
        headerContextMenu = this.headerContextMenu = tmenu.menu({
            onClick: function (item) {
                var field = $(item.target).attr('field');
                if (item.iconCls == 'icon-ok') {
                    grid.datagrid('hideColumn', field);
                    $(this).menu('setIcon', {
                        target: item.target,
                        iconCls: 'icon-empty'
                    });
                } else {
                    grid.datagrid('showColumn', field);
                    $(this).menu('setIcon', {
                        target: item.target,
                        iconCls: 'icon-ok'
                    });
                }
            }
        });
    }
    headerContextMenu.menu('show', {
        left: e.pageX,
        top: e.pageY
    });
};
$.fn.datagrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;
$.fn.treegrid.defaults.onHeaderContextMenu = createGridHeaderContextMenu;

/**
 * grid扩展方法tooltip 基于Easyui 1.3.3，可用于Easyui1.3.3+ 使用说明: 在easyui.min.js之后导入本js
 * 代码案例: $("#dg").datagrid('tooltip'); 所有列
 * $("#dg").datagrid('tooltip',['productid','listprice']); 指定列
 */
var gridTooltipOptions = {
    tooltip: function (jq, fields) {
        return jq.each(function () {
            var panel = $(this).datagrid('getPanel');
            if (fields && typeof fields == 'object' && fields.sort) {
                $.each(fields, function () {
                    var field = this;
                    bindEvent($('.datagrid-body td[field=' + field + '] .datagrid-cell', panel));
                });
            } else {
                bindEvent($(".datagrid-body .datagrid-cell", panel));
            }
        });

        function bindEvent(jqs) {
            jqs.mouseover(function () {
                var content = $(this).html();
                if (content.replace(/(^\s*)|(\s*$)/g, '').length > 5) {
                    $(this).tooltip({
                        content: content,
                        trackMouse: true,
                        position: 'bottom',
                        onHide: function () {
                            $(this).tooltip('destroy');
                        },
                        onUpdate: function (p) {
                            var tip = $(this).tooltip('tip');
                            if (parseInt(tip.css('width')) > 500) {
                                tip.css('width', 500);
                            }
                        }
                    }).tooltip('show');
                }
            });
        }
    }
};

$.extend($.fn.datagrid.methods, gridTooltipOptions);
$.extend($.fn.treegrid.methods, gridTooltipOptions);

/**
 * 扩展tree，使其支持平滑数据格式
 */
$.fn.tree.defaults.loadFilter = function (data, parent) {
    var opt = $(this).data().tree.options;
    var idFiled, textFiled, parentField;
    if (opt.parentField) {
        idFiled = opt.idFiled || 'id';
        textFiled = opt.textFiled || 'text';
        parentField = opt.parentField;
        var i, l, treeData = [], tmpMap = [];
        for (i = 0, l = data.length; i < l; i++) {
            tmpMap[data[i][idFiled]] = data[i];
        }
        for (i = 0, l = data.length; i < l; i++) {
            if (tmpMap[data[i][parentField]] && data[i][idFiled] != data[i][parentField]) {
                if (!tmpMap[data[i][parentField]]['children'])
                    tmpMap[data[i][parentField]]['children'] = [];
                data[i]['text'] = data[i][textFiled];
                tmpMap[data[i][parentField]]['children'].push(data[i]);
            } else {
                data[i]['text'] = data[i][textFiled];
                treeData.push(data[i]);
            }
        }
        return treeData;
    }
    return data;
};

/**
 * 扩展treegrid，使其支持平滑数据格式
 */
$.fn.treegrid.defaults.loadFilter = function (data, parentId) {
    var opt = $(this).data().treegrid.options;
    var idFiled, textFiled, parentField;
    if (opt.parentField) {
        idFiled = opt.idFiled || 'id';
        textFiled = opt.textFiled || 'text';
        parentField = opt.parentField;
        var i, l, treeData = [], tmpMap = [];
        for (i = 0, l = data.length; i < l; i++) {
            tmpMap[data[i][idFiled]] = data[i];
        }
        for (i = 0, l = data.length; i < l; i++) {
            if (tmpMap[data[i][parentField]] && data[i][idFiled] != data[i][parentField]) {
                if (!tmpMap[data[i][parentField]]['children'])
                    tmpMap[data[i][parentField]]['children'] = [];
                data[i]['text'] = data[i][textFiled];
                tmpMap[data[i][parentField]]['children'].push(data[i]);
            } else {
                data[i]['text'] = data[i][textFiled];
                treeData.push(data[i]);
            }
        }
        return treeData;
    }
    return data;
};

/**
 * 扩展combotree，使其支持平滑数据格式
 */
$.fn.combotree.defaults.loadFilter = $.fn.tree.defaults.loadFilter;