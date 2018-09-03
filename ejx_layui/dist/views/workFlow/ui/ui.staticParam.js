/**
 * UI内静态变量。<br>
 *
 * @author DJQ
 * @updateData 2015年12月6日
 */
var paramUI = $.extend({}, staticParam);

paramUI.sep = '<div class="menu-sep"></div>'; // 分割符

/**
 * 报文根节点类型
 * 
 */
paramUI.rootClazz = "Xml报文,网银报文,Json报文";

/**
 * 拖拽规则
 * key 为放置后的节点类型
 * value 为目标对象的节点类型列表(放置后的节点类型需要在此值内存在)
 */
paramUI.leafNodeRule = {
		"Xml节点" : "Xml节点,Xml标签",
		"Xml属性" : "Xml节点,Xml属性",
		"IsoField" : "网银报文,IsoField",
		"有序定长域" : "顺序报文,有序定长域",
		"对象字段" : "Json报文,对象容器,对象字段",
};

/**
 * 新增时候的默认数据<br>
 * fid，clazz不在此<br>
 * 以字符串形式进行储存
 */
paramUI.defData1 = {
		"name":" ",
		"poolvar":" ",
		"xx":" ",
		"desc":" ",
		"field":""
	};
paramUI.defData = 
	//公共变量
	'{"fid":"","name":"","poolvar":"","indefinite":"true","corevar":"","desc":""'+
	',"testValue":"","propGet":"0","propValue":"","propOut":"0","propExpr":""'+
	',"propRegex":"","id":"","mode":"","lenmode":"","arglen":""'+
	',"argfid":"","argalign":"","argfill":""'+
	//Xml报文
	',"tagName":"","corevar":""'+
	//网银报文
	',"field":"","messageType":"","messageEncoding":"GBK"'+
	//顺序报文
	',"lenstyle":""'+
	//其他（特殊处理属性）
	',"propMode":"207","propValueIsBcd":"false"'+
	'}';

//paramUI.defData_In = 
//	//公共变量
//	'{"fid":"","name":"","poolvar":"","indefinite":"true","desc":""'+
//	',"testValue":"","propGet":"0","propValue":"","propOut":"0","propExpr":""'+
//	',"propRegex":"","id":"","mode":"","lenmode":"","arglen":""'+
//	',"argfid":"","argalign":"","argfill":""'+
//	//Xml报文
//	',"tagName":""'+
//	//网银报文
//	',"field":"","messageType":"","messageEncoding":"GBK"'+
//	//顺序报文
//	',"lenstyle":""'+
//	//其他（特殊处理属性）
//	',"propMode":"207","propValueIsBcd":"false"'+
//	'}';
/**
 * 节点属性展示使用<br>
 * 组装Propertygrid的Json数据<br>
 * 确保报文的TreeGrid中包含下列所有节点<br>
 * 防止无法修改和填充数据到特定的字段
 */ 
var msgPubPro = "id@报文id,mode@报文方向@combobox|in:输入|out:输出";
paramUI.xmlProp = {
};
/**
 * 流程属性展示使用
 * 
 */
paramUI.xmlPropStart = {
		"基本属性" : "id@节点ID@readonly,name@节点名称@readonly"	
	};
paramUI.xmlPropUserTask = {
		"基本属性" : "id@节点ID@readonly,name@节点名称,assignee@任务执行人",
		"自定义参数(Params)" : "NAV_URL@NAV URL,C1@参数1,C2@参数2,C3@参数3,C4@参数4",
	};
paramUI.xmlPropServiceTask = {
		"基本属性" : "id@节点ID@readonly,name@节点名称,delegateExpression@委托表达式"
	};
paramUI.xmlPropEnd = {
		"基本属性" : "id@节点ID@readonly,name@节点名称@readonly"
	};
paramUI.xmlPropFlow = {
		"基本属性" : "fid@流程编号@readonly,fname@流程名称@readonly"
	};
// 报文导出时节点需要显示的属性，属性为空也会显示;* 这里的数据不能与paramUI.showNodeName重复
paramUI.reportMustShowNodes = ["tagName"];
// 报文导出时节点需要显示的属性，属性为空则不显示
paramUI.reportShowNodes = ["fid","desc","tag","corevar","indefinite","poolvar","fieId","lenmode","arglen","argfid","argfill","propGet","propOut","id","mode"];
//定义导出报文根节点显示的属性
paramUI.showMainNodeName = ["fid"];
		 

/**
 *  节点控制规则
 *  大节点：Base 基础服务的按钮
 *  clazz：可选报文类型<br>
 *  node：可选报文节点<br>
 *  position：可选节点位置<br>
 * 	位置有：parent|after|before
 */
paramUI.nodeRule = {
		"Base" : "msg_toolbar_btn_remove,msg_toolbar_btn_down,msg_toolbar_btn_up,msg_toolbar_btn_inbound,msg_toolbar_btn_outbound,msg_toolbar_btn_error,flow_msg_toolbar_btn_close", // 基础需要展示的按钮
		"Xml报文" : {
			"clazz" :"Xml报文",
			"node" : "Xml标签",
			"position" : "parent"
		},
		"Xml标签" : {
			"clazz" :"循环报文,Xml报文",
			"node" : "Xml标签,Xml节点,Xml属性",
			"position" : "parent"
		},
		"Xml节点" : {
			"clazz" :"循环报文,Xml报文,顺序报文",
			"node" : "Xml节点",
			"position" : "after,before"
		},
		"Xml属性" : {
			"clazz" :"循环报文,Xml报文",
			"node" : "Xml属性",
			"position" : "after,before"
		},
		"网银报文" : {
			"clazz" :"网银报文,循环报文",
			"node" : "IsoField,有序定长域",
			"position" : "parent"
		},
		"IsoField" : {
			"clazz" :"网银报文,顺序报文,循环报文",
			"node" : "IsoField",
			"position" : "parent,after,before"
		},
		"循环报文" : {
			"clazz" :"循环报文",
			"node" : "Xml标签,Xml节点,IsoField,有序定长域,数组字段,对象容器,对象字段,数组容器",//循环与扩展支持的子节点 在此添加
			"position" : "parent"
		},
		/*"循环报文" : {
			"clazz" :"数组容器",
			"node" : "数组字段",//循环与扩展支持的子节点 在此添加
			"position" : "parent"
		},*/
		"顺序报文" : {
			"clazz" :"顺序报文",
			"node" : "有序定长域",
			"position" : "parent"
		},
		"有序定长域" : {
			"clazz" : "顺序报文,循环报文",
			"node" : "有序定长域",
			"position" : "parent,after,before"
		},
		"If" : {
			"clazz" :"Xml报文,网银报文,顺序报文,循环报文",
			"node" : "If,Xml节点,IsoField",
			"position" : "after,before"
		},
		"If" : {
			"clazz" :"Xml报文,网银报文,顺序报文,循环报文",
			"node" : "If,Xml标签",
			"position" : "parent"
		},
		"Json报文" : {
			"clazz" :"Json报文,Xml报文,顺序报文",
			"node" : "对象容器,数组容器",
			"position" : "parent"
		},
		"对象容器" : {
			"clazz" :"对象容器,循环报文",
			"node" : "对象字段,数组容器",
			"position" : "parent,after,before"
		},
		"对象字段" : {
			"clazz" :"对象字段,循环报文",
			"node" : "对象字段,数组容器",
			"position" : "after,before"
		},
		"数组容器" : {
			"clazz" :"循环报文",
			"node" : "循环报文,数组字段",
			"position" : "parent"
		},
		"数组字段" : {
			"clazz" :"数组字段",
			"node" : "数组字段",
			"position" : "after,before"
		},
		"数组字段" : {
			"clazz" :"循环报文",
			"node" : "数组字段",
			"position" : "after,parent"
		},
};

/**
 * 报文风格下的按钮，也是生成后按钮的ID    /显示节点编辑框按钮控制
 */
paramUI.xmlBtns = "Xml标签,Xml节点,Xml属性";
paramUI.iSO8583Btns = "IsoField";
paramUI.顺序报文Btns = "有序定长域";
paramUI.cycleBtns = "Xml标签,Xml节点,IsoField,有序定长域,数组字段,对象容器,对象字段,数组容器";
paramUI.JsonMsgBtns = "对象容器,数组容器,对象字段,数组字段";
paramUI.clazzBtns = { // 根据报文类型分组,配置相应报文支持的所有节点名称
		Xml报文 : paramUI.xmlBtns,
		网银报文 : paramUI.iSO8583Btns,
		顺序报文 : paramUI.顺序报文Btns,
		循环报文 : paramUI.cycleBtns,
		Json报文 : paramUI.JsonMsgBtns
};
