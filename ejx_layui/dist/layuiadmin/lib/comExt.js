layui.define(['jquery','layer'],function(exports){
	"use strict";
	var $ = layui.jquery,
    layer = layui.layer,
	comExt = function(){
		 this.config = {
		            elem: undefined, //容器
		            data: undefined, //数据源
		            url: undefined, //数据源地址
		            type: 'GET', //读取方式
		            cached: false //是否使用缓存
		        };
	      };
      
	      
	
	 comExt.prototype.set = function (options) {
	      var that = this;
	      that.config.data = undefined;
	      $.comExtend(true, that.config, options);
	      return that;
	  };
	  
    //ajax
	comExt.prototype.ajax = function(e){
        var waiting = layer.msg('加载中', {
            icon: 16,
              shade: 0.01
            });
        var options = $.extend(
            {
                async:true,
                url:"",
                type:"post",
                contentType:'application/json;charset=utf-8',
                dataType:'json',
                timeout:30000
              },e);
          
        $.ajax($.extend(options,{
		        	beforSend:function(){
		                "function" == typeof e.beforSend && e.beforSend(params);
		              },
		        	success:function(data){
		              layer.close(waiting);
		              if(data.success == true){
			                
		              }else if(data.success == false){
		            	  if(data.msg){
		            		  layer.msg(data.msg);
		            	  }
		              }
		              "function" == typeof e.success && e.success(data);
		            },
		            error:function(xhr,textStatus,errorThrown){
		              layer.close(waiting);
		              var msg = "error",
		              status = xhr.status+"",
		              val;
		              switch(textStatus){
		              	case "timeout" :  
		              		msg = "请求超时";break;
		              	case "abort" :  
		              		msg = "请求中止，请检查网络";break;
		              	case "parsererror" :  
		              		msg = "返回数据解析错误";break;
		              	default:
		              		if(status.slice(0,1) == "4"){
		              			msg = "客户端异常，错误状态码：" + status;
		              		}else if(status.slice(0,1) == "5"){
		              			msg = "服务器异常，错误状态码：" + status;
		              		}
		              		break;
		              }
		              "function" == typeof e.error && (val = e.error());
		              //如果不需要默认的error提示，请在自定义的error内return false;
		              if(val == false){
		            	  return ;
		              }else if(val && val !== undefined){
		            	  msg = val;
		              }
		              layer.msg(msg);
		            },
        }))
      }
	
	/**
	 * form 表单数据返显
	 * @params parent jquery Object 父级Dom 
	 * @params data Object
	 * @params form layui Object
	 */
	comExt.prototype.fillInput = function(parent,data,form){
		for(var key in data){
			var id= "#"+key,
			 	arr =['checkbox','radio'];
			var type =parent.find(id + " input").attr('type');
			if(type && arr.indexOf(type)>-1){
				id += "  input"; 
				var inputs = parent.find(id);
				$.each(inputs,function(i,elem){
					elem.checked = false;
				})
				if(data[key].length>1){
					data[key] = data[key].split(",");
					layui.each(data[key],function(i,item){
						inputs[item].checked = true ;
					})
				}else {
					 var index = data[key];
					inputs[index].checked = true ;
				}
			}else{
				parent.find(id).val(data[key]) ;
			}
		}
		form.render();
	}
	
	//页面添加水印
	comExt.prototype.water = function(font,settings){
		    //默认设置  
		    var defaultSettings={  
		        watermark_txt:"默认水印",  
		        watermark_x:100,//水印起始位置x轴坐标  
		        watermark_y:20,//水印起始位置Y轴坐标  
		        watermark_rows:20,//水印行数  
		        watermark_cols:20,//水印列数  
		        watermark_x_space:100,//水印x轴间隔  
		        watermark_y_space:50,//水印y轴间隔  
		        watermark_color:'#000000',//水印字体颜色  
		        watermark_alpha:0.3,//水印透明度  
		        watermark_fontsize:'18px',//水印字体大小  
		        watermark_font:'微软雅黑',//水印字体  
		        watermark_width:120,//水印宽度  
		        watermark_height:80,//水印长度  
		        watermark_angle:45//水印倾斜度数  
		    };  
		    //采用配置项替换默认值，作用类似jquery.extend  
		    if(arguments.length===1&&typeof arguments[0] ==="object" )  
		    {  
		        var src=arguments[0]||{};  
		        for(key in src)  
		        {  
		            if(src[key]&&defaultSettings[key]&&src[key]===defaultSettings[key])  
		                continue;  
		            else if(src[key])  
		                defaultSettings[key]=src[key];  
		        }  
		    }  
		  
		    var oTemp = document.createDocumentFragment();  
		  
		    //获取页面最大宽度  
		    var page_width = Math.max(document.body.scrollWidth,document.body.clientWidth);  
		    //获取页面最大长度  
		    var page_height = Math.max(document.body.scrollHeight,document.body.clientHeight);  
		  
		    //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔  
		    if (defaultSettings.watermark_cols == 0 ||  
		   　　　　(parseInt(defaultSettings.watermark_x   
		　　　　+ defaultSettings.watermark_width *defaultSettings.watermark_cols   
		　　　　+ defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1))   
		　　　　> page_width)) {  
		        defaultSettings.watermark_cols =   
		　　　　　　parseInt((page_width  
		　　　　　　　　　　-defaultSettings.watermark_x  
		　　　　　　　　　　+defaultSettings.watermark_x_space)   
		　　　　　　　　　　/ (defaultSettings.watermark_width   
		　　　　　　　　　　+ defaultSettings.watermark_x_space));  
		        defaultSettings.watermark_x_space =   
		　　　　　　parseInt((page_width   
		　　　　　　　　　　- defaultSettings.watermark_x   
		　　　　　　　　　　- defaultSettings.watermark_width   
		　　　　　　　　　　* defaultSettings.watermark_cols)   
		　　　　　　　　　　/ (defaultSettings.watermark_cols - 1));  
		    }  
		    //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔  
		    if (defaultSettings.watermark_rows == 0 ||  
		   　　　　(parseInt(defaultSettings.watermark_y   
		　　　　+ defaultSettings.watermark_height * defaultSettings.watermark_rows   
		　　　　+ defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1))   
		　　　　> page_height)) {  
		        defaultSettings.watermark_rows =   
		　　　　　　parseInt((defaultSettings.watermark_y_space   
		　　　　　　　　　　　+ page_height - defaultSettings.watermark_y)   
		　　　　　　　　　　　/ (defaultSettings.watermark_height + defaultSettings.watermark_y_space));  
		        defaultSettings.watermark_y_space =   
		　　　　　　parseInt((page_height   
		　　　　　　　　　　- defaultSettings.watermark_y   
		　　　　　　　　　　- defaultSettings.watermark_height   
		　　　　　　　　　　* defaultSettings.watermark_rows)   
		　　　　　　　　　/ (defaultSettings.watermark_rows - 1));  
		    }  
		    var x;  
		    var y;  
		    for (var i = 0; i < defaultSettings.watermark_rows; i++) {  
		        y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;  
		        for (var j = 0; j < defaultSettings.watermark_cols; j++) {  
		            x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;  
		  
		            var mask_div = document.createElement('div');  
		            mask_div.id = 'mask_div' + i + j;  
		            mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));  
		            //设置水印div倾斜显示  
		            mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";  
		            mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";  
		            mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";  
		            mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";  
		            mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";  
		            mask_div.style.visibility = "";  
		            mask_div.style.position = "absolute";  
		            mask_div.style.left = x + 'px';  
		            mask_div.style.top = y + 'px';  
		            mask_div.style.overflow = "hidden";  
		            mask_div.style.zIndex = "9999";  
		            mask_div.style.pointerEvents = 'none';  
		            //mask_div.style.border="solid #eee 1px";  
		            mask_div.style.opacity = defaultSettings.watermark_alpha;  
		            mask_div.style.fontSize = defaultSettings.watermark_fontsize;  
		            mask_div.style.fontFamily = defaultSettings.watermark_font;  
		            mask_div.style.color = defaultSettings.watermark_color;  
		            mask_div.style.textAlign = "center";  
		            mask_div.style.width = defaultSettings.watermark_width + 'px';  
		            mask_div.style.height = defaultSettings.watermark_height + 'px';  
		            mask_div.style.display = "block";  
		            oTemp.appendChild(mask_div);  
		        }
		    }
		    document.body.appendChild(oTemp);  
	}
	
	
	
	comExt.prototype.updateSelect = function(data){
		for(var key in data){
			var html ="";
			$.each(data[key],function(i,item){
				html += "<option value='"+ item.value +"'>"+item.text+"</option>";
			});
			var id= "#"+key;
			$(id).append(html);
		}
	}
	
	comExt.prototype.verify = function(){
		layui.use(['form'],function(){
			$('form').on('blur','*[ext-verify]',function(e){
				var _this = this,reg,result = false;
				var verify = {
						identity:[/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ , "身份证号码格式不正确"],
						phone: [/^1\d{10}$/, "请输入正确的手机号"],
						range:['',"请输入规定范围内的数字"]
						},
					msg = "信息填写有误";
				var val = $(_this).val();
				var regName = $(_this).attr('ext-verify');
				if(val === "" )
					return ;	
				
				if(verify[regName]){
					reg = verify[regName][0];
					if(verify[regName][1]){
						msg = verify[regName][1];
					}
					result = reg.test(val);
				}else if(regName.indexOf("range")>-1){
					var range = regName;
					range = range.split("(");
					range = range[1].split(")");
					range = range[0].split(",");
					var min,max;
					if(range[0])
					min = Number(range[0]);
					if(range[1])
					max = Number(range[1]);
					if(min && max){
						if(max<=min){
							console.log("请设置range正确范围");
						}else if(val >= min && val <= max){
							result = true;
						}
					}else if(max && !min){
						while(val <= max){
							result = true;
						}
					}else if(min && !max){
						while(val >= min){
							result = true;
						}
					}
					
					msg = verify.range[1];
				}else{
					reg =new RegExp(regName);
					result = reg.test(val);
				}
				if(!result){
					layer.msg(msg,{icon:2});
					$(_this).addClass("layui-form-danger"); 
					_this.focus();
				}
				})
		})
	}
	
	
	
	
	var comExt= new comExt(); 
	comExt.verify();
	
	exports('comExt', comExt);
})