/**
 * 
 * @author DJQ
 * @date 2015年12月5日
 */
var utilUI = $.extend({}, utilUI);

//节点中英文名称对照
var nodeNameJsons={
};


/*******************************************************************************
 * jsonString 转为对应xml报文
 * 导出报文配置，左右报文最终都是以xml的结构导出。
 * 1、报文节点的属性如果为空则忽略该属性，但是指定的字段无论是否为空都必须导出，比如tagName
 */

utilUI.getFormatStr = function(jsonStr) {
	return json2xml(JSON.parse(jsonStr));

	function json2xml(o, tab) {
		var msgInfo;
		var toXml = function(v) {
			var xml = "";
			if (v instanceof Array) {
				for ( var i = 0, n = v.length; i < n; i++)
					xml += toXml(v[i]);
			} else if (typeof (v) == "object") {
				var hasChild = false;
				children = v.children;
				if (msgInfo == null) {
					msgInfo = v;
				}
				xml += "<" + v.clazz + getUsefulVal(v);
				if (children != null && children.length > 0) {
					hasChild = true;
				}
				xml += hasChild ? ">" : "/>";
				if (hasChild) {
					xml += toXml(children) + "</" + v.clazz + ">";
				}
			} else {
				xml += "<" + v.clazz + getUsefulVal(v) + "/>";
			}
			return xml;
		}, xml = "";
		for ( var m in o) {
			xml += toXml(o[m], "");
		}
		xml = addHead(msgInfo, xml);
		return xml;
	}
	// 构造节点中有用的属性
	function getUsefulVal(v) {
		// 参数为要显示
		if(v.clazz=="JsonMsg" || v.clazz=="XmlMsg" || v.clazz=="ISO8583Msg" || v.clazz=="SortMsg"){
			var fids = paramUI.showMainNodeName;
		}else{
			var fids = paramUI.reportShowNodes;
		}
		return structAttr(v, fids)+structAttrPub(v, paramUI.reportMustShowNodes,true);
	}
	function addHead(msgInfo, xml) {
		if (msgInfo.clazz == null) {
			return xml;
		}
		return '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<message id="'
				+ Bid+'" mode = "' + mode + '">\n'
				+ xml
				+ '\n</message>';
	}

	/***
	 * 根据fies数组中的属性名，以及obj数据来源，拼装节点的属性；
	 * 只构造对应取值不为空的属性
	 */
	function structAttr(obj,filds) {
		return structAttrPub(obj,filds,false) ;
	}
	
	/***
	 * 根据fies数组中的属性名，以及obj数据来源，拼装节点的属性；
	 * mustShow=false只构造对应取值不为空的属性
	 * mustShow=true必须构造该数组内的属性
	 */
	function structAttrPub(obj,filds,mustShow) {
		var ret = '';
		var len = filds.length;
		// 手动指定要显示项目
		for ( var i = 0; i < len ; i++) {
			var por = filds[i];
			var val = eval('obj.' + por);
			 
			if(mustShow){
				val = typeof(val)=="undefined"?"":val;
				ret += ' ' + por + '="' + val + '"';
			}else if(val != null && val != ' '&& val != '') {
				ret += ' ' + por + '="' + val + '"';
			}
		}
		 
		return ret;
	}

};
//flow流程
/*******************************************************************************
 * jsonString 转为对应xml报文
 * 
 */
utilUI.flowGetFormatStr = function(jsonStr) {
	return json2xml(JSON.parse(jsonStr));
	function json2xml(o, tab) {
		var msgInfo;
		//添加beanTask标签
		var toXml = function(v) {
			var xml = "";
			if (v instanceof Array) {
				for ( var i = 0, n = v.length; i < n; i++)
					xml += toXml(v[i]);
			} else if (typeof (v) == "object") {
				var hasChild = false;
				if (msgInfo == null) {
					msgInfo = v;
				}
				xml += "<" + getUsefulVal(v);
				xml += hasChild ? ">" : "/>";
			} else {
				xml += "<" + getUsefulVal(v) + "/>";
			}
			return xml;
		}, xml = "";
		//循环遍历方法节点（除去开始和结束节点）
		for ( var m=1;m<o.length-1;m++) {
			xml += toXml(o[m], "");
			
		}
		
		//添加sequenFlow标签
		var toXmlFlow = function(v) {
			var xmlFlow = "";
			if(v.targetRef.length>0){
				for(var i in v.conditionExpression){
					if(v.conditionExpression[i]!="默认"){
						xmlFlow+="<sequenceFlow sourceRef=\""+v.id+"\" targetRef=\""+v.targetRef[i]+"\">"
						+"<conditionExpression> "+v.conditionExpression[i]+" </conditionExpression>"
						+"</sequenceFlow>";
					}else{
						xmlFlow+="<sequenceFlow sourceRef=\""+v.id+"\" targetRef=\""+v.targetRef[i]+"\"/>";
					}
				}
			}
			return xmlFlow;
		}, xmlFlow = "";
		for ( var m in o) {
			xmlFlow += toXmlFlow(o[m], "");
			
		}
		xml = addHead(msgInfo, xml, xmlFlow);
		tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "").replace(
				/  /g, "");
		return xml;
	}
	// 构造节点中有用的属性
	function getUsefulVal(v) {
		console.log(v);
		// 参数为要显示
		var fids = [];
		for(var i in v){
			fids.push(i);
		}
		if(v.category =="outbound"){
			return "outboundTask"+structAttr(v, ["id","component", "name","bean","method","x","y","category","sId","cId","needReverse","reverseBean","reverseMethod","artificialData","reserveOne","reserveTwo","reserveThree","reserveFour"]);
		}
		if(v.category =="biz" || v.category=="" || v.category==null ){
			return "beanTask"+structAttr(v, ["id","component", "name","bean","method","x","y","category","sId","cId","needReverse","reverseBean","reverseMethod","reserveOne","reserveTwo","reserveThree","reserveFour"]);
		}
		
	}
	
	
	function addHead(msgInfo, xml, xmlFlow) {
		if (msgInfo.id == null) {
			return xml;
		}
		
		//开始节点坐标
		start_x=global["0"].x;
		start_y=global["0"].y;
		//结束节点坐标
		end_x=global[global.length-1].x;
		end_y=global[global.length-1].y;
		
		//process 标签内容
		Pid =global["0"].Pid;
		Name =global["0"].Name;
		NeedReverse =global["0"].NeedReverse;
		timeout =global["0"].timeout;

		return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<definitions>\n" 
				+ "<process id=\""+Pid+"\" name=\""+Name+"\" needReverse=\""+NeedReverse+"\" timeout =\""+timeout+"\">" 
				+ "<startEvent id=\"start\" name=\"交易开始\" x=\""+start_x+"\" y=\""+start_y+"\" ></startEvent>" 
				+ "<endEvent   id=\"end\"   name=\"交易结束点\" x=\""+end_x+"\" y=\""+end_y+"\" ></endEvent>" 
				+ xml
				+ xmlFlow
				+ "</process>"
				+ "</definitions>"
				/*+ "<!-- "
				+ extUtil.json2Str(global)
				+ " -->"*/;
	}

	function structAttr(obj,filds) {
		var ret = "";
		var len = filds.length;
		
		// 手动指定要显示项目
		for ( var i = 0; i < len + 1; i++) {
			var por = filds[i];
			var val = eval("obj." + por);
			
		    if(val==null){	
					val=eval("obj.content."+por);
			}
				
		    if (val != null && val != ' ') {	
		    		ret += " " + por + "=\"" + val + "\"";	
			}
		}
		// 显示属性值非空的项,不该现实的也被显示了
		
		/* for(var key in obj){ 
			 if(obj[key] instanceof Array){
					for( var i in obj[key]){
						ret+=""+key+"='"+obj[key][i]+"'"; 
					};
					//console.log(v[i]);
			}else if(typeof (obj[key]) == "object"){
					for(var j in obj[key]){
						ret+=""+j+"='"+obj[key][j]+"'";
					}
					
			}else if(obj[key]!=null&& obj[key]!=' '){
				 ret+=""+key+"='"+obj[key]+"'"; 
				 }; 
		}*/
		 
		return ret;
	}

};

//work流程
/*******************************************************************************
 * jsonString 转为对应xml报文
 * 
 */
 
utilUI.workGetFormatStr = function(jsonStr) {
	return json2xml(JSON.parse(jsonStr));
	function json2xml(o, tab) {
		//console.log(tab);
		var msgInfo;
		//添加beanTask标签
		var toXml = function(v) {
			//console.log(v);
			var xml = "";
			if (v instanceof Array) {
				for ( var i = 0, n = v.length; i < n; i++)
					xml += toXml(v[i]);
			} else if (typeof (v) == "object") {
//				var hasChild = false;
				if (msgInfo == null) {
					msgInfo = v;
				}
				xml += "<" + getUsefulVal(v);
//				xml += hasChild ? ">" : "/>";
			} else {
				xml += "<" + getUsefulVal(v) ;
			}
			return xml;
		}, xml = "";
		//循环遍历方法节点（除去开始和结束节点）
		for ( var m=1;m<o.length-1;m++) {
			xml += toXml(o[m], "");
			
		}
		
		//添加sequenFlow标签
		var toXmlFlow = function(v) {
			var xmlFlow = "";
			//console.log(v.targetRef);
			/*if(v.targetRef.length==1){
				xmlFlow+="<sequenceFlow sourceRef=\""+v.id+"\" targetRef=\""+v.targetRef+"\"/>";
			};*/
			if(v.targetRef.length>0){
				for(var i in v.conditionExpression){
					if(v.conditionExpression[i]!="默认"){
						xmlFlow+="<sequenceFlow sourceRef=\""+v.id+"\" targetRef=\""+v.targetRef[i]+"\">"
						+"<conditionExpression> "+v.conditionExpression[i]+" </conditionExpression>"
						+"</sequenceFlow>";
					}else{
						xmlFlow+="<sequenceFlow sourceRef=\""+v.id+"\" targetRef=\""+v.targetRef[i]+"\"/>";
					}
				}
			}
			return xmlFlow;
		}, xmlFlow = "";
		for ( var m in o) {
			xmlFlow += toXmlFlow(o[m], "");
			
		}
		
		xml = addHead(msgInfo, xml, xmlFlow);
		tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "").replace(
				/  /g, "");
		return xml;
	}
	// 构造节点中有用的属性
	function getUsefulVal(v) {
//		console.log(v);
		// 参数为要显示
		var fids = [];
		for(var i in v){
			fids.push(i);
		}
		if(v.category =="outbound"){
			return "outboundTask"+structAttr(v, ["id","component", "name","bean","method","x","y","category","sId","cId","needReverse","reverseBean","reverseMethod","artificialData","reserveOne","reserveTwo","reserveThree","reserveFour"])+ "/>";
		}
		if(v.category =="biz" || v.category=="" || v.category==null ){
			return "beanTask"+structAttr(v, ["id","component", "name","bean","method","x","y","category","sId","cId","needReverse","reverseBean","reverseMethod","reserveOne","reserveTwo","reserveThree","reserveFour"]) + "/>";
		}
		if(v.category =="userTask"){
			return "userTask"+structAttr1(v, ["id","name","assignee","x","y"], ["NAV_URL","C1","C2","C3","C4"]) + "</userTask>";
		}
		if(v.category =="serviceTask"){
			return "serviceTask"+structAttr(v, ["id","name","delegateExpression","x","y"]) + "/>";
		}
	}
	
	
	function addHead(msgInfo, xml, xmlFlow) {
		if (msgInfo.id == null) {
			return xml;
		}
		
//		console.log(global["0"].x);
		//开始节点坐标
		start_x=global["0"].x;
		start_y=global["0"].y;
		//结束节点坐标
		end_x=global[global.length-1].x;
		end_y=global[global.length-1].y;
		
		//process 标签内容
		console.log(global["0"]);
		Pid =global["0"].Pid;
		Name =global["0"].Name;
	
		

		return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<definitions>\n" 
				+ "<process id=\""+pId+"\" name=\""+Name+"\">" 
				+ "<startEvent id=\"start\" name=\"交易开始\" x=\""+start_x+"\" y=\""+start_y+"\" ></startEvent>" 
				+ "<endEvent   id=\"end\"   name=\"交易结束点\" x=\""+end_x+"\" y=\""+end_y+"\" ></endEvent>" 
				+ xml
				+ xmlFlow
				+ "</process>"
				+ "</definitions>"
				/*+ "<!-- "
				+ extUtil.json2Str(global)
				+ " -->"*/;
	}

	function structAttr(obj,filds) {
		var ret = "";
		var len = filds.length;
		
		// 手动指定要显示项目
		for ( var i = 0; i < len + 1; i++) {
			var por = filds[i];
			var val = eval("obj." + por);
			
		    if(val==null){	
					val=eval("obj.content."+por);
			}
				
		    if (val != null && val != ' ') {	
		    		ret += " " + por + "=\"" + val + "\"";	
			}
		}
		return ret;
	}
	/**
	 * 2017年8月24日新建，为userTask和serviceTask使用
	 */
	function structAttr1(obj,filds,childfilds) {
		var ret = "";
		var len = filds.length;
		
		// 手动指定要显示项目
		for ( var i = 0; i < len + 1; i++) {
			var por = filds[i];
			var val = eval("obj." + por);
			
		    if(val==null){	
				val=eval("obj.content."+por);
			}
				
		    if (val != null && val.trim() != '') {	
		    	ret += " " + por + "=\"" + val + "\"";	
			}
		}
		//添加子节点
		if(childfilds){
			ret += "><params";
			for ( var i = 0; i < childfilds.length + 1; i++) {
				var por = childfilds[i];
				var val = eval("obj." + por);
				
			    if(val==null && (eval("obj.params") != null || eval("obj.params") !=undefined)){	
					val=eval("obj.params."+por);
				}
					
			    if (val != null  && val.trim() != '') {	
			    	ret += " " + por + "=\"" + val + "\"";	
				}
			}
		}
		return ret + "/>";
	}
};

/**
 * 美化JSON字符串（带缩进等）
 * 
 */
utilUI.getFormatJsonStr = function(jsonStr) {
	var res = "";
	for ( var i = 0, j = 0, k = 0, ii, ele; i < jsonStr.length; i++) {// k:缩进，j:""个数
		ele = jsonStr.charAt(i);
		if (j % 2 == 0 && ele == "}") {
			k--;
			for (ii = 0; ii < k; ii++)
				ele = "    " + ele;
			ele = "\n" + ele;
		} else if (j % 2 == 0 && ele == "{") {
			ele += "\n";
			k++;
			for (ii = 0; ii < k; ii++)
				ele += "    ";
		} else if (j % 2 == 0 && ele == ",") {
			ele += "\n";
			for (ii = 0; ii < k; ii++)
				ele += "    ";
		} else if (ele == "\"")
			j++;
		res += ele;
	}
	return res;
},

/**
 * 根据放置目标的节点类型来产生自己的节点类型
 * 
 */
utilUI.getLeafClazz = function(sParam) {
	var aLeafClazz = paramUI.leafClazz.split(",");
	for ( var i in aLeafClazz) {
		if (sParam.indexOf(aLeafClazz[i]) > -1) {
			return paramUI.leafNode[aLeafClazz[i]];
		}
	}
}

/**
 * TODO 此方法为全局搜索，需要变更为在动作触发的目标树内进行搜索
 * 
 * 目标节点主键是否已经存在
 */
utilUI.checkIdField = function($Obj, oData) {
	var opts = $Obj.treegrid("options");
	if ($Obj.treegrid('find', oData[opts.idField])) { // 当关键点不是主键时候
		return false;
	} else {
		return true;
	}
}

/**
 * 获取节点需要添加的位置信息
 * 
 */
utilUI.getPosition = function() {
	var sBtnDiv = "msg_body_center"; // DIV范围视情况缩小

	var sPosition;
	$("#" + sBtnDiv).find("input:radio").each(function(index, element) {
		//console.log(element.id);
		if ($("#" + element.id).prop("checked") == true) {
			sPosition = $("#" + element.id).val();
		}
	});
	
	return sPosition;
}

/**
 * 根据规则对面板某范围内的按钮和单选框进行启用和禁用
 * 
 * @param sClazz
 *            节点类型
 * @param aRule
 *            规则 Notice ： prop true
 */
utilUI.doRule = function(sClazz, aRule) {
	var sBtnDiv = "msg_body_center"; // DIV范围视情况缩小

	$("#" + sBtnDiv + " .easyui-linkbutton").each(function(index, element) {
		$("#" + element.id).linkbutton('enable');
		var bBase = utilUI.compare(aRule["Base"], element.id);
		var bClazz = utilUI.compare(aRule[sClazz]["clazz"], element.id);
		var bNode = utilUI.compare(aRule[sClazz]["node"], element.id);
		if (!bBase && !bClazz && !bNode) {
			$("#" + element.id).linkbutton('disable');
		}
	});

	var flag = true;
	$("#" + sBtnDiv).find("input:radio").each(function(index, element) {
		$("#" + element.id).removeAttr("checked");
		$("#" + element.id).removeAttr("disabled");
		var bPosition = utilUI.compare(aRule[sClazz]["position"], element.id);
		if (bPosition) {
			if (flag == true) {
				$("#" + element.id).prop("checked", flag);
			}
			flag = false;
		} else {
			$("#" + element.id).attr("disabled", "disabled");
			$("#" + element.id).prop("checked", false);
		}
	});

};

/**
 * 比较元素 aX：数组 sX：字符
 */
utilUI.compare = function(aX, sX) {
	aX = aX.split(",");
	for ( var i in aX) {
		if (aX[i] == sX)
			return true;
	}
}
/**
 * TODO Private 私有方法 查询字段属于对象中的哪个组，并把组内容返回<br>
 * 
 * @param aX
 *            对象{key:val}<br>
 * @param sX
 *            字符参数<br>
 * @param bFlag
 *            返回数据区分：<br>
 *            true | key<br>
 *            false| val<br>
 */
utilUI.compareXX = function(aX, sX, bFlag) {
	for ( var i in aX) {
		if (utilUI.compare(aX[i], sX)) {
			if (bFlag) {
				return i;
			} else {
				return aX[i];
			}
		}
	}
}

/**
 * 创建json对象 参数：aStr = 数组，sProp = 属性，sVal = 值 aStr = {"name": "xx", "sex": "m"};
 */
utilUI.createJson = function(aStr, sProp, sVal) {
	// 如果 sVal 被忽略
	if (typeof sVal === "undefined") {
		// 删除属性
		delete aStr[sProp];
	} else {
		// 添加 或 修改
		aStr[sProp] = sVal;
	}
};

/**
 * 祛除数组中的无效数据
 */
utilUI.delEmptyItem = function(arr) {
	for ( var i = 0, len = arr.length; i < len; i++) {
		if (!arr[i] || arr[i] == '') {
			arr.splice(i, 1);
			len--;
			i--;
		}
	}
	return arr;
};

/**
 * 报文
 * 组装Propertygrid的Json数据 TODO 注意参数 paramUI内的变量
 */
utilUI.createPropertygridJson = function(sType, oBody) {
	var aRes = {};
	var aRows = [];
	var sType = sType.toString();
	var sBase = "基础属性";
	var sSep1 = ",";
	var sSep2 = "@";
	var sSep3 = "|";
	var sSep4 = ":";
	if (paramUI.xmlProp[sBase]) { // 组装公共部分
		var aXmlBase = utilUI.delEmptyItem(paramUI.xmlProp[sBase].split(sSep1));
		_pushArr(aRows, aXmlBase, oBody, sBase);
	}
	if (paramUI.xmlProp[sType]) { // 组装私有部分
		var aXmlType = utilUI.delEmptyItem(paramUI.xmlProp[sType].split(sSep1));
		_pushArr(aRows, aXmlType, oBody, sType);
	}
	
	// 拼装total和rows属性
	utilUI.createJson(aRes, "total", aRows.length);
	utilUI.createJson(aRes, "rows", aRows);
	return aRes;

	function _pushArr(aRows, aArr, oObj, sType) {
		for ( var i in aArr) {
			var aRow = {};
			var sName = aArr[i].split(sSep2)[1];
			var sVal = aArr[i].split(sSep2)[0];
			var isCheckBox;
			var sEditor;
			try {
				sEditor = aArr[i].split(sSep2)[2];
			} catch (e) {}
			var sKey = oObj[sVal];
				utilUI.createJson(aRow, "name", sName);
				utilUI.createJson(aRow, "key", sVal.toString()); // 保存键，用以回传
				if(sKey){
					utilUI.createJson(aRow, "value", sKey.toString());
				}
				utilUI.createJson(aRow, "group", sType);
				if (typeof sEditor != "undefined" && sEditor != null) {
					var edts = sEditor.split(sSep3);//数据类型定义
					var eType = edts[0];// 编辑器类型
					var options = {};
					switch (eType) {
					case "combobox":
						options.multiple = false;
						var d = [];
						for ( var i = 1; i < edts.length; i++) {
							if(eType[i]!=null){
								var kv = {};
								kv["value"] = edts[i].split(sSep4)[0];
								kv["text"] = edts[i].split(sSep4)[1];
								d.push(kv);
							}
						}
						options.data = d;
						options.editable = false;
						sEditor = {};
						sEditor["type"] = eType;
						sEditor["options"] = options;
						break;

					}
				}else{
					sEditor="text";
				}

				utilUI.createJson(aRow, "editor", sEditor);
				aRows.push(aRow);
		}
	}
};

/**
 * 流程：
 * 组装Propertygrid的Json数据 TODO 注意参数 paramUI内的变量
 */
utilUI.createPropertygridJson1 = function(sType, oBody) {
	var aRes = {};
	var aRows = [];
	var sType = "";
	var sBase = "基础属性";
	var sSep1 = ",";
	var sSep2 = "@";
	var sSep3 = "|";
	var sSep4 = ":";
	if (paramUI.xmlProp1[sBase]) { // 组装公共部分
		var aXmlBase = utilUI.delEmptyItem(paramUI.xmlProp1[sBase].split(sSep1));
		_pushArr(aRows, aXmlBase, oBody, sBase);
	}
	if (paramUI.xmlProp1[sType]) { // 组装私有部分
		var aXmlType = utilUI.delEmptyItem(paramUI.xmlProp1[sType].split(sSep1));
		_pushArr(aRows, aXmlType, oBody, sType);
	}
	// 拼装total和rows属性
	utilUI.createJson(aRes, "total", aRows.length);
	utilUI.createJson(aRes, "rows", aRows);
	return aRes;

	function _pushArr(aRows, aArr, oObj, sType) {
		for ( var i in aArr) {
			var aRow = {};
			var sName = aArr[i].split(sSep2)[1];
			var sVal = aArr[i].split(sSep2)[0];
			var isCheckBox;
			var sEditor;
			try {
				sEditor = aArr[i].split(sSep2)[2];
			} catch (e) {}
			var sKey = oObj[sVal];
				utilUI.createJson(aRow, "name", sName);
				utilUI.createJson(aRow, "key", sVal.toString()); // 保存键，用以回传
				if(sKey){
					utilUI.createJson(aRow, "value", sKey.toString());
				}
				utilUI.createJson(aRow, "group", sType);
				if (typeof sEditor != "undefined" && sEditor != null) {
					var edts = sEditor.split(sSep3);//数据类型定义
					var eType = edts[0];// 编辑器类型
					var options = {};
					switch (eType) {
					case "combobox":
						options.multiple = false;
						var d = [];
						for ( var i = 1; i < edts.length; i++) {
							if(eType[i]!=null){
								var kv = {};
								kv["value"] = edts[i].split(sSep4)[0];
								kv["text"] = edts[i].split(sSep4)[1];
								d.push(kv);
							}
						}
						options.data = d;
						options.editable = false;
						sEditor = {};
						sEditor["type"] = eType;
						sEditor["options"] = options;
						break;

					}
				}else{
					sEditor="text";
				}

				utilUI.createJson(aRow, "editor", sEditor);
				aRows.push(aRow);
		}
	}
};
/**
 * 流程：Start
 * 组装Propertygrid的Json数据 TODO 注意参数 paramUI内的变量
 */
utilUI.createPropertygridJsonStart = function(sType, oBody) {
	var aRes = {};
	var aRows = [];
	var sType = "自定义参数(Params)";
	var sBase = "基本属性";
	var sSep1 = ",";
	var sSep2 = "@";
	var sSep3 = "|";
	var sSep4 = ":";
	if (paramUI.xmlPropStart[sBase]) { // 组装基本属性
		var aXmlBase = utilUI.delEmptyItem(paramUI.xmlPropStart[sBase].split(sSep1));
		_pushArr(aRows, aXmlBase, oBody, sBase);
	}
	if (paramUI.xmlPropStart[sType]) { // 组装自定义参数
		var aXmlType = utilUI.delEmptyItem(paramUI.xmlPropStart[sType].split(sSep1));
		_pushArr(aRows, aXmlType, oBody, sType);
	}
	// 拼装total和rows属性
	utilUI.createJson(aRes, "total", aRows.length);
	utilUI.createJson(aRes, "rows", aRows);
	return aRes;

	function _pushArr(aRows, aArr, oObj, sType) {
		for ( var i in aArr) {
			var aRow = {};
			var sName = aArr[i].split(sSep2)[1];
			var sVal = aArr[i].split(sSep2)[0];
			var isCheckBox;
			var sEditor;
			try {
				sEditor = aArr[i].split(sSep2)[2];
			} catch (e) {}
			var sKey = oObj[sVal];
				utilUI.createJson(aRow, "name", sName);
				utilUI.createJson(aRow, "key", sVal.toString()); // 保存键，用以回传
				if(sKey){
					utilUI.createJson(aRow, "value", sKey.toString());
				}
				utilUI.createJson(aRow, "group", sType);
				if (typeof sEditor != "undefined" && sEditor != null) {
					var edts = sEditor.split(sSep3);//数据类型定义
					var eType = edts[0];// 编辑器类型
					var options = {};
					switch (eType) {
					case "combobox":
						options.multiple = false;
						var d = [];
						for ( var i = 1; i < edts.length; i++) {
							if(eType[i]!=null){
								var kv = {};
								kv["value"] = edts[i].split(sSep4)[0];
								kv["text"] = edts[i].split(sSep4)[1];
								d.push(kv);
							}
						}
						options.data = d;
						options.editable = false;
						sEditor = {};
						sEditor["type"] = eType;
						sEditor["options"] = options;
						break;

					}
				}else{
					sEditor="text";
				}

				utilUI.createJson(aRow, "editor", sEditor);
				aRows.push(aRow);
		}
	}
};
/**
 * 流程：End
 * 组装Propertygrid的Json数据 TODO 注意参数 paramUI内的变量
 */
utilUI.createPropertygridJsonEnd = function(sType, oBody) {
	var aRes = {};
	var aRows = [];
	var sType = "";
	var sBase = "基本属性";
	var sSep1 = ",";
	var sSep2 = "@";
	var sSep3 = "|";
	var sSep4 = ":";
	if (paramUI.xmlPropEnd[sBase]) { // 组装基本属性
		var aXmlBase = utilUI.delEmptyItem(paramUI.xmlPropEnd[sBase].split(sSep1));
		_pushArr(aRows, aXmlBase, oBody, sBase);
	}
	if (paramUI.xmlPropEnd[sType]) { // 组装自定义参数
		var aXmlType = utilUI.delEmptyItem(paramUI.xmlPropEnd[sType].split(sSep1));
		_pushArr(aRows, aXmlType, oBody, sType);
	}
	// 拼装total和rows属性
	utilUI.createJson(aRes, "total", aRows.length);
	utilUI.createJson(aRes, "rows", aRows);
	return aRes;

	function _pushArr(aRows, aArr, oObj, sType) {
		for ( var i in aArr) {
			var aRow = {};
			var sName = aArr[i].split(sSep2)[1];
			var sVal = aArr[i].split(sSep2)[0];
			var isCheckBox;
			var sEditor;
			try {
				sEditor = aArr[i].split(sSep2)[2];
			} catch (e) {}
			var sKey = oObj[sVal];
				utilUI.createJson(aRow, "name", sName);
				utilUI.createJson(aRow, "key", sVal.toString()); // 保存键，用以回传
				if(sKey){
					utilUI.createJson(aRow, "value", sKey.toString());
				}
				utilUI.createJson(aRow, "group", sType);
				if (typeof sEditor != "undefined" && sEditor != null) {
					var edts = sEditor.split(sSep3);//数据类型定义
					var eType = edts[0];// 编辑器类型
					var options = {};
					switch (eType) {
					case "combobox":
						options.multiple = false;
						var d = [];
						for ( var i = 1; i < edts.length; i++) {
							if(eType[i]!=null){
								var kv = {};
								kv["value"] = edts[i].split(sSep4)[0];
								kv["text"] = edts[i].split(sSep4)[1];
								d.push(kv);
							}
						}
						options.data = d;
						options.editable = false;
						sEditor = {};
						sEditor["type"] = eType;
						sEditor["options"] = options;
						break;

					}
				}else{
					sEditor="text";
				}

				utilUI.createJson(aRow, "editor", sEditor);
				aRows.push(aRow);
		}
	}
};
/**
 * 流程：流程参数显示
 * 组装Propertygrid的Json数据 TODO 注意参数 paramUI内的变量
 */
utilUI.createPropertygridJsonFlow = function(sType, oBody) {
	var aRes = {};
	var aRows = [];
	var sType = "";
	var sBase = "基本属性";
	var sSep1 = ",";
	var sSep2 = "@";
	var sSep3 = "|";
	var sSep4 = ":";
	if (paramUI.xmlPropFlow[sBase]) { // 组装基本属性
		var aXmlBase = utilUI.delEmptyItem(paramUI.xmlPropFlow[sBase].split(sSep1));
		_pushArr(aRows, aXmlBase, oBody, sBase);
	}
	// 拼装total和rows属性
	utilUI.createJson(aRes, "total", aRows.length);
	utilUI.createJson(aRes, "rows", aRows);
	return aRes;

	function _pushArr(aRows, aArr, oObj, sType) {
		for ( var i in aArr) {
			var aRow = {};
			var sName = aArr[i].split(sSep2)[1];
			var sVal = aArr[i].split(sSep2)[0];
			var isCheckBox;
			var sEditor;
			try {
				sEditor = aArr[i].split(sSep2)[2];
			} catch (e) {}
			var sKey = oObj[sVal];
				utilUI.createJson(aRow, "name", sName);
				utilUI.createJson(aRow, "key", sVal.toString()); // 保存键，用以回传
				if(sKey){
					utilUI.createJson(aRow, "value", sKey.toString());
				}
				utilUI.createJson(aRow, "group", sType);
				if (typeof sEditor != "undefined" && sEditor != null) {
					var edts = sEditor.split(sSep3);//数据类型定义
					var eType = edts[0];// 编辑器类型
					var options = {};
					switch (eType) {
					case "combobox":
						options.multiple = false;
						var d = [];
						for ( var i = 1; i < edts.length; i++) {
							if(eType[i]!=null){
								var kv = {};
								kv["value"] = edts[i].split(sSep4)[0];
								kv["text"] = edts[i].split(sSep4)[1];
								d.push(kv);
							}
						}
						options.data = d;
						options.editable = false;
						sEditor = {};
						sEditor["type"] = eType;
						sEditor["options"] = options;
						break;

					}
				}else{
					sEditor="text";
				}

				utilUI.createJson(aRow, "editor", sEditor);
				aRows.push(aRow);
		}
	}
};
/**
 * 流程：userTask
 * 组装Propertygrid的Json数据 TODO 注意参数 paramUI内的变量
 */
utilUI.createPropertygridJsonUserTask = function(sType, oBody) {
	var aRes = {};
	var aRows = [];
	var sType = "自定义参数(Params)";
	var sBase = "基本属性";
	var sSep1 = ",";
	var sSep2 = "@";
	var sSep3 = "|";
	var sSep4 = ":";
	if (paramUI.xmlPropUserTask[sBase]) { // 组装基本属性
		var aXmlBase = utilUI.delEmptyItem(paramUI.xmlPropUserTask[sBase].split(sSep1));
		_pushArr(aRows, aXmlBase, oBody, sBase);
	}
	if (paramUI.xmlPropUserTask[sType]) { // 组装自定义参数
		var aXmlType = utilUI.delEmptyItem(paramUI.xmlPropUserTask[sType].split(sSep1));
		_pushArr(aRows, aXmlType, oBody, sType);
	}
	// 拼装total和rows属性
	utilUI.createJson(aRes, "total", aRows.length);
	utilUI.createJson(aRes, "rows", aRows);
	return aRes;

	function _pushArr(aRows, aArr, oObj, sType) {
		for ( var i in aArr) {
			var aRow = {};
			var sName = aArr[i].split(sSep2)[1];
			var sVal = aArr[i].split(sSep2)[0];
			var isCheckBox;
			var sEditor;
			try {
				sEditor = aArr[i].split(sSep2)[2];
			} catch (e) {}
			var sKey = oObj[sVal];
				utilUI.createJson(aRow, "name", sName);
				utilUI.createJson(aRow, "key", sVal.toString()); // 保存键，用以回传
				if(sKey){
					utilUI.createJson(aRow, "value", sKey.toString());
				}
				utilUI.createJson(aRow, "group", sType);
				if (typeof sEditor != "undefined" && sEditor != null) {
					var edts = sEditor.split(sSep3);//数据类型定义
					var eType = edts[0];// 编辑器类型
					var options = {};
					switch (eType) {
					case "combobox":
						options.multiple = false;
						var d = [];
						for ( var i = 1; i < edts.length; i++) {
							if(eType[i]!=null){
								var kv = {};
								kv["value"] = edts[i].split(sSep4)[0];
								kv["text"] = edts[i].split(sSep4)[1];
								d.push(kv);
							}
						}
						options.data = d;
						options.editable = false;
						sEditor = {};
						sEditor["type"] = eType;
						sEditor["options"] = options;
						break;

					}
				}else{
					sEditor="text";
				}

				utilUI.createJson(aRow, "editor", sEditor);
				aRows.push(aRow);
		}
	}
};
/**
 * 流程：
 * 组装Propertygrid的Json数据 TODO 注意参数 paramUI内的变量
 */
utilUI.createPropertygridJsonServiceTask = function(sType, oBody) {
	var aRes = {};
	var aRows = [];
	var sType = "";
	var sBase = "基本属性";
	var sSep1 = ",";
	var sSep2 = "@";
	var sSep3 = "|";
	var sSep4 = ":";
	if (paramUI.xmlPropServiceTask[sBase]) { // 组装公共部分
		var aXmlBase = utilUI.delEmptyItem(paramUI.xmlPropServiceTask[sBase].split(sSep1));
		_pushArr(aRows, aXmlBase, oBody, sBase);
	}
	if (paramUI.xmlPropServiceTask[sType]) { // 组装私有部分
		var aXmlType = utilUI.delEmptyItem(paramUI.xmlPropServiceTask[sType].split(sSep1));
		_pushArr(aRows, aXmlType, oBody, sType);
	}
	// 拼装total和rows属性
	utilUI.createJson(aRes, "total", aRows.length);
	utilUI.createJson(aRes, "rows", aRows);
	return aRes;

	function _pushArr(aRows, aArr, oObj, sType) {
		for ( var i in aArr) {
			var aRow = {};
			var sName = aArr[i].split(sSep2)[1];
			var sVal = aArr[i].split(sSep2)[0];
			var isCheckBox;
			var sEditor;
			try {
				sEditor = aArr[i].split(sSep2)[2];
			} catch (e) {}
			var sKey = oObj[sVal];
				utilUI.createJson(aRow, "name", sName);
				utilUI.createJson(aRow, "key", sVal.toString()); // 保存键，用以回传
				if(sKey){
					utilUI.createJson(aRow, "value", sKey.toString());
				}
				utilUI.createJson(aRow, "group", sType);
				if (typeof sEditor != "undefined" && sEditor != null) {
					var edts = sEditor.split(sSep3);//数据类型定义
					var eType = edts[0];// 编辑器类型
					var options = {};
					switch (eType) {
					case "combobox":
						options.multiple = false;
						var d = [];
						for ( var i = 1; i < edts.length; i++) {
							if(eType[i]!=null){
								var kv = {};
								kv["value"] = edts[i].split(sSep4)[0];
								kv["text"] = edts[i].split(sSep4)[1];
								d.push(kv);
							}
						}
						options.data = d;
						options.editable = false;
						sEditor = {};
						sEditor["type"] = eType;
						sEditor["options"] = options;
						break;

					}
				}else{
					sEditor="text";
				}

				utilUI.createJson(aRow, "editor", sEditor);
				aRows.push(aRow);
		}
	}
};
/*******************************************************************************
 * xml报文转为对应jsond对象
 */
utilUI.xmlStr2json = function(xml) {
	xml = xml.replace(/\t|\n/g, " ");
	xml = xml.replace(/  /g, " ");
	//xml = xml.replace(/\\n/g, "");

	console.log(stringToXml(xml));
	js = xmlToJson(stringToXml(xml));
	console.log(js);
	re = [];
	re[0] = js.children[0].children[0];
	return re;
	// Changes XML to JSON
	function xmlToJson(xml, clazz) {
		
		// Create the return object
		var obj = {};

		if (xml.nodeType == 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
				// obj["@attributes"] = {};
				if (clazz != "undefined") {
					obj['clazz'] = clazz;
				}
				for ( var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj[attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) { // text
			obj = xml.nodeValue;
			
			//console.log(xml.nodeName);
//			if (xml.nodeName == "conditionExpression") {
//				
//				console.log(obj);
//			}
		}


		// do children
		if (xml.hasChildNodes()) {
			obj["children"] = [];
			for ( var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof (obj[nodeName]) == "undefined") {
					clazz = nodeName;
					var sub = xmlToJson(item, clazz);
					if(typeof (sub) == "string"){
//						console.log(sub);
						if (xml.nodeName == "conditionExpression") {
							obj["children"].push(sub);
						}
					}else{
						obj["children"].push(sub);
					}

				} else {
					if (typeof (obj[nodeName].length) == "undefined") {
						var old = obj[nodeName];
						obj[nodeName] = [];
						if(typeof (old) != "String"){
							obj[nodeName].push(old);
						}
					}
					var sub = xmlToJson(item);
					if(typeof (sub) != "String"){
						obj[nodeName].push(sub);
					}
				}
			}
		}
		return obj;
	};

	// 将字符串转化成dom对象;string转换为xml
	function stringToXml(xmlString) {
		var xmlDoc;
		if (typeof xmlString == "string") {
			if (document.implementation.createDocument) {
				var parser = new DOMParser();
				xmlDoc = parser.parseFromString(xmlString, "text/xml");
				console.log(xmlDoc);
			} else if (window.ActiveXObject) {
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlString);
			}
		} else {
			console.log("1111");
			xmlDoc = xmlString;
		}
		return xmlDoc;
	}
};

/*******************************************************************************
 * 报文标签格式转换
 * type:转换类型，1-显示格式，2-数据库格式
 */
utilUI.schemaNodeTypeNameFmt = function(data,type){
	for(var v in nodeNameJsons){
		$.each(nodeNameJsons[v], function(i, item) {
			if(type==1){
				data=data.replace(new RegExp(item.name,"gm"),item.title);
			}else{
				data=data.replace(new RegExp(item.title,"gm"),item.name);
			}
	    });
	}
	return data;
};

utilUI.getBodyName = function(name){
	for(var v in nodeNameJsons){
		$.each(nodeNameJsons[v], function(i, item) {
			if(name==item.title){
				name = item.name;
			}
		});
	}
	return name;
};
