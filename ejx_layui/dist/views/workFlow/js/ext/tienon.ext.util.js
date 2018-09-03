/**
 * 一些固定的自定义方法<br>
 *
 * @author DJQ
 * @updateData 2015年1月15日 00:14:38
 */
var extUtil = $.extend({}, extUtil);


extUtil.watchElementById = function (sDomId, fn) {
    var x = document.getElementById(sDomId); // 用来检测文本域文字输入状态
    if (window.addEventListener) // 非ie浏览器，比如Firefox
    {
        x.addEventListener("input", fn, false);
    } else // ie浏览器
    {
        x.attachEvent("onkeyup", fn);
    }
}
/**
 * NOTICE(common.js 里有var browser浏览器信息采集, 必须先加载)
 * 判断浏览器是否是IE并且版本小于8
 *  browser.userAgent.indexOf('MSIE') > -1
 * @returns true/false
 */
extUtil.isLessThanIe8 = function () {
    return ($.browser.msie && $.browser.version < 8);
};

/**
 * 判断字符串是否为空
 */
extUtil.hasText = function (str) {
    if (typeof(str) == "string") {
        return str == null || $.trim(str) == "";
    } else {
        return str == null;
    }
};

/**
 * 增加formatString功能
 *
 * @example extUtil.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
 *
 * @returns 格式化后的字符串: '字符串第一个变量字符串第二个变量字符串'
 */
extUtil.formatString = function (str) {
    for (var i = 0; i < arguments.length - 1; i++) {
        str = str.replace("{" + i + "}", arguments[i + 1]);
    }
    return str;
};

/**
 * 禁用form表单中所有的input[文本框、复选框、单选框],select[下拉选],多行文本框[textarea]  
 */
extUtil.disableForm = function (formId,isDisabled) { 
	
    $("form[id='"+formId+"'] :text").attr("disabled",isDisabled);  
    $("form[id='"+formId+"'] textarea").attr("disabled",isDisabled);  
    $("form[id='"+formId+"'] select").attr("disabled",isDisabled);  
    $("form[id='"+formId+"'] :radio").attr("disabled",isDisabled);  
    $("form[id='"+formId+"'] :checkbox").attr("disabled",isDisabled);  
    
    var attr="disable"; 
    if(!isDisabled){  
       $("form[id='"+formId+"'] :text").removeAttr("disabled");  
       $("form[id='"+formId+"'] textarea").removeAttr("disabled");  
       $("form[id='"+formId+"'] select").removeAttr("disabled");  
       $("form[id='"+formId+"'] :radio").removeAttr("disabled");  
       $("form[id='"+formId+"'] :checkbox").removeAttr("disabled");  
       attr="enable"; 
    }  
    $("#" + formId + " .easyui-combobox").combobox(attr); 
    
    //禁用jquery easyui中的下拉选（使用input生成的comobox）  
    $("#" + formId + " input[class='combobox-f combo-f']").each(function () {  
        if (this.id) {
            $("#" + this.id).combobox(attr);  
        }  
    });  
    
    //禁用jquery easyui中的下拉选（使用select生成的comobox）  
    $("#" + formId + " select[class='combobox-f combo-f']").each(function () {  
        if (this.id) {  
            $("#" + this.id).combobox(attr);  
        }  
    });  
      
    //禁用jquery easyui中的日期组件dataBox  
    $("#" + formId + " input[class='datebox-f combo-f']").each(function () {  
        if (this.id) {  
            $("#" + this.id).datebox(attr);  
        }  
    });  
}  
/**
 * 使form中控件 可读  true 为 启用 只可读模式 false 为禁用 只可读模式
 */
extUtil.readOnlyForm = function (formId,isReadOnly) {
	//禁用jquery easyui中的下拉选（使用input生成的comobox）
	 $("#" + formId + " input[class='combobox-f combo-f textbox-f']").each(function () {  
	        if (this.id) {
	            $("#" + this.id).textbox('readonly',isReadOnly);  
	        }  
	    });  
	  //禁用 jquery easyui 中的文本框 
    $("#" + formId + " input[class='easyui-textbox textbox-f']").each(function () {  
        if (this.id) {
            $("#" + this.id).combobox('readonly',isReadOnly);  
        }  
    });  
//    
//    //禁用jquery easyui中的下拉选（使用select生成的comobox）  
//    $("#" + formId + " select[class='combobox-f combo-f']").each(function () {  
//        if (this.id) {  
//            $("#" + this.id).combobox('readonly',isReadOnly);  
//        }  
//    });  
//      
//    //禁用jquery easyui中的日期组件dataBox  
//    $("#" + formId + " input[class='datebox-f combo-f']").each(function () {  
//        if (this.id) {  
//            $("#" + this.id).datebox('readonly',isReadOnly);  
//        }  
//    });  
}  

/**
 * ajax 获取页面内容
 */
extUtil.getPageContent = function (url) {
    var content = "";
    $.ajax({
        url: url,
        async: false,
        type: 'get',
        success: function (data) {
            content = data;
        }
    });
    return content;
};

/**
 * 字符串以xxx开头,调用方式
 */
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};

/**
 * 字符串以xxx结尾
 */
String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
};

/**
 * 增加命名空间功能
 * 使用方法：extUtil.ns('jQuery.bbb.ccc','jQuery.eee.fff');
 */
extUtil.ns = function () {
    var o = {}, d;
    for (var i = 0; i < arguments.length; i++) {
        d = arguments[i].split(".");
        o = window[d[0]] = window[d[0]] || {};
        for (var k = 0; k < d.slice(1).length; k++) {
            o = o[d[k + 1]] = o[d[k + 1]] || {};
        }
    }
    return o;
};

/**
 *
 * 格式化日期时间
 *
 * @param format
 * @returns
 */
Date.prototype.format = function (format) {
    if (isNaN(this.getMonth())) {
        return '';
    }
    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }
    var o = {
        "M+": this.getMonth() + 1, /* month */
        "d+": this.getDate(), /* day */
        "h+": this.getHours(), /* hour */
        "m+": this.getMinutes(), /* minute */
        "s+": this.getSeconds(), /* second */
        "q+": Math.floor((this.getMonth() + 3) / 3), /* quarter */
        "S": this.getMilliseconds()
        /* millisecond */
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/**
 * 获得URL参数
 * @returns 对应名称的值
 */
extUtil.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

/**
 * 获得pathName
 * @returns 项目名称
 */
extUtil.getPathName = function () {
    var pathName = window.document.location.pathname;
    return pathName;
};

/**
 * 获得项目projectName
 * @returns 项目名称
 */
extUtil.getProjectName = function () {
    var pathName = window.document.location.pathname;
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    if (projectName.indexOf(staticParam.page_path_root) > -1){
    	projectName = "";
    }
    return projectName;
};

/**
 * 生成UUID
 * @returns UUID字符串
 */
extUtil.random4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
extUtil.UUID = function () {
    return (extUtil.random4() + extUtil.random4() + "-" + extUtil.random4() + "-" + extUtil.random4() + "-" + extUtil.random4() + "-" + extUtil.random4() + extUtil.random4() + extUtil.random4());
};

/**
 * 将form表单元素的值序列化成对象
 * Exp： extUtil.serializeObject($('#formID').form());
 */
extUtil.serializeObject = function (form) {
    var o = {};
    $.each(form.serializeArray(), function (index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + "," + this['value'];
        } else {
            o[this['name']] = this['value'];
        }
    });
    return o;
};

/**
 * 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
 * @returns Array
 */
extUtil.str2List = function (value) {
    if (value != undefined && value != '') {
        var values = [];
        var t = value.split(',');
        for (var i = 0; i < t.length; i++) {
            values.push('' + t[i]);
            /* 避免他将ID当成数字 */
        }
        return values;
    } else {
        return [];
    }
};

/**
 * 字符串转换为JSON
 */
extUtil.str2Json = function (o) {
    try {
        var res = $.parseJSON(o);
        return res;
    } catch (e) {
        $.messager.alert("错误", "数据解析失败:" + o);
    }
};

/**
 * JSON转换成字符串
 */
extUtil.json2Str = function (o) {
    var r = [];
    if (o == null)
        return null;
    if (typeof o == "string")
        return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "number")
        return "\"" + o + "\"";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
                r.push("\"" + i + "\"" + ":" + extUtil.json2Str(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++)
                r.push(extUtil.json2Str(o[i]));
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
};