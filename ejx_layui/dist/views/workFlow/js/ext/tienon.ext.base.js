/**
 * Base方法<br>
 *
 * @author DJQ
 * @updateData 2015年1月15日 00:14:38
 */
var extBase = $.extend({}, extBase);

/**
 * 屏蔽右键
 */
//$(document).bind('contextmenu', function() {
//	 return false;
//});
/**
 * 禁止复制
 */
//$(document).bind('selectstart', function() {
//	 return false;
//});
/**
 * 禁用退格键Backspace
 */
function banBackSpace(e) {
    var ev = e || window.event;//获取event对象
    var obj = ev.target || ev.srcElement;//获取事件源
    var t = obj.type || obj.getAttribute('type');//获取事件源类型
    //获取作为判断条件的事件类型
    var vReadOnly = obj.readOnly;
    var vDisabled = obj.disabled;
    //处理undefined值情况
    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
    vDisabled = (vDisabled == undefined) ? true : vDisabled;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readOnly属性为true或disabled属性为true的，则退格键失效
    var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
    //判断
    if (flag2 || flag1)
        return false
}
//禁止退格键 作用于Firefox、Opera
document.onkeypress = banBackSpace;
//禁止退格键 作用于IE、Chrome
document.onkeydown = banBackSpace;