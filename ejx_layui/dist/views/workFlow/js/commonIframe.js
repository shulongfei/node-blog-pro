/**
 * 集中加载Iframe内所需要的JS和CSS文件。<br>
 *
 * 《脚本变量命名规范》<br>
 * s：表示字符串。例如：sName，sHtml；<br>
 * n：表示数字。例如：nPage，nTotal；<br>
 * b：表示逻辑。例如：bChecked，bHasLogin；<br>
 * a：表示数组。例如：aList，aGroup；<br>
 * r：表示正则表达式。例如：rDomain，rEmail；<br>
 * f：表示函数。例如：fGetHtml，fInit；<br>
 * e：表示EasyUI的控件对象。例如：eDatagrid；<br>
 * $：表示JQuery的对象。例如：$Name；<br>
 * o：表示以上未涉及到的其他对象，例如：oButton，oDate；<br>
 *
 * @author DJQ
 * @updateData 2015年2月3日 22:43:55
 */

var pathName = window.document.location.pathname;
var projectName/*项目名称*/ = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
if (projectName.indexOf("page") > -1 || projectName.indexOf("test") > -1){
	projectName = "";
}

// EasyUI CSS 样式
importFile(projectName + "/workFlow/js/themes/gray/easyui.css");
importFile(projectName + "/workFlow/js/themes/icon.css");

// JQuery | EasyUI
importFile(projectName + "/workFlow/js/jquery-1.9.1.js");
importFile(projectName + "/workFlow/js/jquery.easyui-1.4.4.min.js");
//importFile(projectName + "/js/jquery.easyui.min.js");
importFile(projectName + "/workFlow/js/locale/easyui-lang-zh_CN.js"); // 国际化

importFile(projectName + "/workFlow/js/support/jquery.validatebox.fixed.js");
//xy 格式化xml
importFile(projectName + "/workFlow/js/jquery.format.js");

// JavaScript 插件/脚本
importFile(projectName + "/workFlow/js/ext/tienon.ext.base.js");
importFile(projectName + "/workFlow/js/ext/tienon.ext.jquery.js");
importFile(projectName + "/workFlow/js/ext/tienon.ext.util.js");
importFile(projectName + "/workFlow/js/ext/tienon.ext.easyui.js");
importFile(projectName + "/workFlow/css/tienon.extCss.css");

// 插件库
importFile(projectName + "/workFlow/js/plugins/My97DatePicker/WdatePicker.js");
importFile(projectName + "/workFlow/js/plugins/qtip/jquery.qtip.css");
importFile(projectName + "/workFlow/js/plugins/qtip/jquery.qtip.js");
// wk 新增插件
//importFile(projectName + "/js/plugins/datagrid-dnd.js");
importFile(projectName + "/workFlow/js/plugins/jquery-easyui-ribbon/ribbon.css");
importFile(projectName + "/workFlow/js/plugins/jquery-easyui-ribbon/ribbon-icon.css");
importFile(projectName + "/workFlow/js/plugins/jquery-easyui-ribbon/jquery.ribbon.js");

// TODO UI
importFile(projectName + "/workFlow/js/plugins/dnd/treegrid-dnd.js");
importFile(projectName + "/workFlow/js/plugins/dnd/datagrid-dnd-treegrid.js");

// 私有Js脚本
importFile(projectName + "/workFlow/js/private/p.drawPlugins.js");
importFile(projectName + "/workFlow/js/private/p.utils.js");
importFile(projectName + "/workFlow/js/private/p.staticParam.js");

function importFile(argument) // 函数可以单独引入一个js或者css
{
    var file = argument;
    if (file.match(/.*\.js$/)) // 以任意开头但是以.js结尾正则表达式
    {
        document.write('<script type="text/javascript" src="' + file + '"></script>');
    } else if (file.match(/.*\.css$/)) {
        if (file.indexOf("easyui.css") > -1) { // 若为EasyUI 的样式CSS 则添加ID
            document.write('<link id="easyuiTheme" rel="stylesheet" href="'
                + file + '" type="text/css" />');
        } else {
            document.write('<link rel="stylesheet" href="' + file
                + '" type="text/css" />');
        }
    }
}
