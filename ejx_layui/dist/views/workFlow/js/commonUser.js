/**
 * 集中加载项目内所有的JS和CSS文件。<br>
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
 * @updateDate 2015年2月3日 22:31:25
 */
var browser/*浏览器信息采集*/ = {
    appCodeName: navigator.appCodeName,// 浏览器代码名称
    appName: navigator.appName,// 浏览器的名称
    appVersion: navigator.appVersion,// 浏览器的平台和版本信息
    cookieEnabled: navigator.cookieEnabled,// 浏览器中是否启用cookie的布尔值
    platform: navigator.platform,// 运行浏览器的操作系统平台
    userAgent: navigator.userAgent, // 由客户机发送服务器的 user-agent 头部的值
    isIe: false,
    ieVersion: '',
    isChrome: false,
    isFirefox: false
};
if (browser.userAgent.indexOf('MSIE') > -1) {
    // IE浏览器
    browser.isIe = true;
    if (browser.userAgent.indexOf('MSIE 10') > -1) {
        // IE10
        browser.ieVersion = 10;
    } else if (browser.userAgent.indexOf('MSIE 9') > -1) {
        // IE9
        browser.ieVersion = 9;
    } else if (browser.userAgent.indexOf('MSIE 8') > -1) {
        // IE8
        browser.ieVersion = 8;
    } else if (browser.userAgent.indexOf('MSIE 7') > -1) {
        // IE7
        browser.ieVersion = 7;
    } else if (browser.userAgent.indexOf('MSIE 6') > -1) {
        // IE6
        browser.ieVersion = 6;
    } else {

    }
} else if (browser.userAgent.indexOf('Chrome') > -1) {
    // 谷歌浏览器
    browser.isChrome = true;
} else if (browser.userAgent.indexOf('Firefox') > -1) {
    // 火狐浏览器
    browser.isFirefox = true;
} else {
    // 其他浏览器
}

// EasyUI CSS 样式
importFile("js/themes/gray/easyui.css");
importFile("js/themes/icon.css");

// JQuery EasyUI / PureMVC 
importFile("js/jquery-1.9.1.js");
importFile("js/jquery.easyui-1.3.5.min.js");
importFile("js/locale/easyui-lang-zh_CN.js"); //国际化
importFile("js/puremvc-1.0.1.min.js");

importFile("js/support/jquery.cookie.js");
importFile("js/support/jquery.validatebox.fixed.js");

// JavaScript 插件/脚本
importFile("js/ext/tienon.ext.base.js");
importFile("js/ext/tienon.ext.jquery.js");
importFile("js/ext/tienon.ext.util.js");
importFile("js/ext/tienon.ext.easyui.js");
importFile("css/tienon.extCss.css");

// 插件库 
importFile("js/plugins/jquery-easyui-portal/portal.css");
importFile("js/plugins/jquery-easyui-portal/jquery.portal.js");
importFile("js/plugins/My97DatePicker/WdatePicker.js");
importFile("js/plugins/qtip/jquery.qtip.css");
importFile("js/plugins/qtip/jquery.qtip.js");

// 私有Js脚本 （绘制EasyUI组件工具类；项目特有工具类）
importFile("js/private/p.drawPlugins.js");
importFile("js/private/p.utils.js");
importFile("js/private/p.staticParam.js");

/**
 * PureMVC 配置脚本
 */
// APPLICATION CONSTANTS
importFile("frameworkUser/ApplicationConstants.js");
// EVENTS
importFile("frameworkUser/view/event/AppEvents.js");
// VIEW COMPONENTS
importFile("frameworkUser/view/component/TodoForm.js");

// PROXY 
importFile("frameworkUser/model/proxy/CommonProxy.js");
importFile("frameworkUser/model/proxy/UserManageProxy.js");

// MEDIATOR 
importFile("frameworkUser/view/mediator/CommonMediator.js");
importFile("frameworkUser/view/mediator/UserManageMediator.js");

// COMAND
importFile("frameworkUser/controller/commands/CommonCommand.js");
importFile("frameworkUser/controller/commands/UserManageCommand.js");

// START COMMAND
importFile("frameworkUser/controller/boostraps/PrepControllerCommand.js");
importFile("frameworkUser/controller/boostraps/PrepModelCommand.js");
importFile("frameworkUser/controller/boostraps/PrepViewCommand.js");
importFile("frameworkUser/controller/StartupCommand.js");

// APPLICATION
importFile("frameworkUser/ApplicationFacade.js");

function importFile(argument) // 函数可以单独引入一个js或者css
{
    var file = argument;
    if (file.match(/.*\.js$/)) // 以任意开头但是以.js结尾正则表达式
    {
        document.write('<script type="text/javascript" src="' + file + '"></script>');
    }
    else if (file.match(/.*\.css$/)) {
        if (file.indexOf("easyui.css") > -1) { // 若为EasyUI 的样式CSS 则添加ID
            document.write('<link id="easyuiTheme" rel="stylesheet" href="' + file + '" type="text/css" />');
        } else {
            document.write('<link rel="stylesheet" href="' + file + '" type="text/css" />');
        }
    }
}


