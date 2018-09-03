/*
 * 当前打印功能只支持安全级别较低的IE 浏览器
 */
layui.define(['jquery','layer'],function(exports){
	var $ = layui.jquery,
	print = function(){
			this.config = {
					visible: false
			}
	};
	
	/*
	 * 打印为word
	 * @param {String} url word模板地址 
	 */
	print.prototype.viewToWord = function(url) {
		  var wordApp = null;      
		    try{
		        wordApp = new ActiveXObject('Word.Application'); 
		        if(wordApp == null){
		        	alert('客户端没有安装Word软件,不能创建Word对象');
		        	wordApp.Quit();
		        	return ;
		        }	
		    }catch(e)   
		    {   
		       alert(e+',"无法调用Office对象(不支持非IE浏览器)，请确保您的机器已安装了Office并打开浏览器安全选项卡--自定义级别--activeX控件和插件--对未标记为可执行的activeX控件初始化并执行--启用"');   
		       return;
		    }      
		    var Doc=wordApp.Documents.Open(url);     //打开本地(客户端)word模板
		    wordApp.Application.Visible = false;//word对象是否可见 
		    wordApp.Visible = false;//word模板是否可见 
		    try{
		    	wordApp.PrintOut(); //或  wordApp.Application.PrintOut(); 调用自动打印功能 
			    //wordApp.ActiveDocument.close();   //没有打开文档ActiveDocument事件无效
		    }catch(e){
		    	alert(e+'打印已取消');
		    	wordApp.Quit();
		    }
		    wordApp.Quit();   
		    wordApp=null;    
	}
	
	
	/*
	 * 打印为Excle
	 * @param {String} url excel模板地址 
	 */
	print.prototype.viewToExcel = function(url){  
	    var xlsApp = null;      
	    try{
	        xlsApp = new ActiveXObject('Excel.Application');
	        if(xlsApp == null){
	         alert('客户端没有安装Excel软件,不能创建Word对象');
	         return ;
	        } 
	    }
	    catch(e){   
	       alert(e+',浏览器安全级别过高或者客户端没有安装Excel软件');   
	       return;   
	    }
	    var xlBook = xlsApp.Workbooks.Open(url);  
	    var xlsheet;
	    var printSheetLen;
	    try{
	      for(printSheetLen = 1;printSheetLen <= xlBook.Sheets.Count; printSheetLen ++){  
	        xlsheet = xlBook.Worksheets(printSheetLen);   
	        xlsApp.Application.Visible = false;   
	        xlsApp.visible = false;   
	        xlsheet.Printout;   
	      }  
	    }  
	    catch(e){  
	         alert('打印第'+printSheetLen+"页失败,可能打印取消了或者是excel问题");
	         return ;
	    }  
	    finally{
	       xlsApp.Quit();
	       xlsApp=null;
	       
	    }  
	 };
	//todo
	 print.prototype.on = function(btn,frame,url,fn){
		 $(btn).click(function(){
			 $(frame).attr('src',url);
			 if(fn && typeof fn== "function")
			 fn();
		 })
	 }
	 
	 if($("#printIframe")){
		 $("#printIframe").load(function(){
	         setTimeout(function(){
	        	 $("#printIframe")[0].contentWindow.print();
	         },0);
	     });
	 }
	 
	 var print = new print();
	 exports('print',print);
})