layui.define(['element','jquery','layer'], function (exports) {
    "use strict";
    var $ = layui.jquery,
        layer = layui.layer,
        element = layui.element,
        cacheName = 'tb_treeMenu';

    var treeMenu = function () {
        /**
         *  默认配置
         */
        this.config = {
            elem: undefined, //容器
            data: undefined, //数据源
            url: undefined, //数据源地址
            type: 'GET', //读取方式
            cached: false, //是否使用缓存
            spreadOne: false //设置是否只展开一个二级菜单
        };
    };
    //渲染
    treeMenu.prototype.render = function () {
        var _that = this;
        var _config = _that.config;
//        if (typeof (_config.elem) !== 'string' && typeof (_config.elem) !== 'object') {
////            common.throwError('treeMenu error: elem参数未定义或设置出错，具体设置格式请参考文档API.');
//        }
        var container;
        container =$( _config.elem);
        if (typeof (_config.elem) === 'string') {
            container = $('' + _config.elem + '');
        }
        if (typeof (_config.elem) === 'object') {
            container = _config.elem;
        }
        if (container.length === 0) {
//            console.log('treeMenu error:找不到elem参数配置的容器，请检查.');
        }
        if (_config.data === undefined && _config.url === undefined) {
//           console.log('treeMenu error:请为treeMenu配置数据源.')
        }
        //数据为自定义时
        if (_config.data !== undefined && typeof (_config.data) === 'object') {
            var html = getHtml(_config.data);
            container.html(html);
          //初始化动态元素，一些动态生成的元素如果不设置初始化，将不会有默认的动态效果
            element.init();
            _that.config.elem = container;
        } else {
        	//缓存数据
            if (_config.cached) {
                var cachetreeMenu = layui.data(cacheName);
                if (cachetreeMenu.treeMenu === undefined) {
                    $.ajax({
                        type: _config.type,
                        url: _config.url,
                        async: false, //_config.async,
                        dataType: _config.dataType,
                        success: function (result, status, xhr) {
                            //添加缓存
                            layui.data(cacheName, {
                                key: 'treeMenu',
                                value: result
                            });
                            var html = getHtml(result);
                            container.html(html);
                            element.init();
                        },
                        error: function (xhr, status, error) {
                            console.log('treeMenu error:' + error);
                        },
                        complete: function (xhr, status) {
                            _that.config.elem = container;
                        }
                    });
                } else {
                    var html = getHtml(cachetreeMenu.treeMenu);
                    container.html(html);
                    element.init();
                    _that.config.elem = container;
                }
            } else {
                //清空缓存 并请求后台数据
                layui.data(cacheName, null);
                $.ajax({
                    type: _config.type,
                    url: _config.url,
                    async: false, //_config.async,
                    contentType:_config.contentType,
                    dataType: _config.dataType,
                    success: function (result, status, xhr) {
                        var html = getHtml(result);
                        container.html(html);
                        element.init();
                    },
                    error: function (xhr, status, error) {
                        console.log('treeMenu error:' + error);
                    },
                    complete: function (xhr, status) {
                        _that.config.elem = container;
                    }
                });
            }
        }

        //只展开一个二级菜单
        if (_config.spreadOne) {
            var $ul = container.children('ul');
            $ul.find('li.layui-nav-item').each(function () {
                $(this).on('click', function () {
                    $(this).siblings().removeClass('layui-nav-itemed');
                });
            });
        }
        return _that;
    };
    /**
     * 配置treeMenu
     * @param {Object} options
     */
    treeMenu.prototype.set = function (options) {
        var that = this;
        that.config.data = undefined;
        $.extend(true, that.config, options);
        return that;
    };
    /**
     * 绑定事件
     * @param {String} events
     * @param {Function} callback
     */
    treeMenu.prototype.on = function (events, callback) {
        var that = this;
        var elem = that.config.elem;
        if (typeof (events) !== 'string') {
            console.log('treeMenu error:事件名配置出错');
        }
        var lIndex = events.indexOf('(');
        var eventName = events.substr(0, lIndex);
        var filter = events.substring(lIndex + 1, events.indexOf(')'));
        //待改：lay-filter好像并没有必要 
        if (eventName === 'click') {
            if (elem.attr('lay-filter') !== undefined) {
                elem.find('li').each(function () {
                    var $this = $(this);
                    //存在子菜单
                    if ($this.find('dl').length > 0) {
                    	console.log($(this).text()+":"+$this.find('dl').length);
                        var $dd = $this.find('dd').each(function () {
                            $(this).on(eventName, function () {
                                var $a = $(this).children('a');
                                var href = $a.attr('lay-href');
                                var icon = $a.children('i:first').data('icon');
                                var title = $a.children('cite').text();
                                var data = {
                                    elem: $a,
                                    field: {
                                        href: href,
                                        icon: icon,
                                        title: title
                                    }
                                }
                                callback(data);
                            });
                        });
                    } else {
                    	console.log($(this).text()+":"+$this.find('dl').length);
                        $this.on(eventName, function () {
                            var $a = $this.children('a');
                            var href = $a.attr('lay-href');
//                            var href = $a.data('url');
                            var icon = $a.children('i:first').data('icon');
                            var title = $a.children('cite').text();
                            var data = {
                                elem: $a,
                                field: {
                                    href: href,
                                    icon: icon,
                                    title: title
                                }
                            }
                            callback(data);
                        });
                    }
                });
            }
        }
    };
    /**
     * 清除缓存
     */
    treeMenu.prototype.cleanCached = function () {
        layui.data(cacheName, null);
    };
    /**
     * 获取html字符串
     * @param {Object} data
     */
    function getHtml(data) {
        var ulHtml = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].spread) {
                ulHtml += '<li class="layui-nav-item layui-nav-itemed">';
            } else {
                ulHtml += '<li class="layui-nav-item">';
            }
            if(!data[i].title){
            	data[i].title = "";
            }
            if (data[i].children !== undefined && data[i].children !== null && data[i].children.length > 0) {
            	ulHtml += '<a href="javascript:;">';
            }else{
            	 var link = "";
                 if(data[i].href && data[i].href.length > 0){
                 	link += "<a lay-href="+data[i].href+"";
                 }else{
                 	link += "<a href='javascript:;'";
                 }
                 if (data[i].event && data[i].event.length > 0){
                 	link += " layadmin-event="+data[i].event+"";
                 }
                 link += ">";
                 ulHtml += link ;
            }
            
            if (data[i].icon !== undefined && data[i].icon !== '') {
                    ulHtml += '<i class="layui-icon ' + data[i].icon + '"></i>';
            }
            if(data[i].title == undefined){
            	data[i].title = "";
            }
            ulHtml += '<cite>' + data[i].title + '</cite>'
            ulHtml += '</a>';
            if (data[i].children !== undefined && data[i].children !== null && data[i].children.length > 0) {
                ulHtml += traverseMenu(data[i].children);
            }
            ulHtml += '</li>';
        }

        return ulHtml;
    }
    function traverseMenu(data) {
        var temp = "<dl class='layui-nav-child'>";
        layui.each(data,function (i,item) {
        	if(item.title == undefined || !item.title){
        		item.title = "";
        	}
            temp += "<dd >";
            var link = "";
            if(item.href && item.href.length > 0){
            	link += "<a lay-href="+item.href+"";
            }else if (item.event && item.event.length > 0){
            	link += "<a href='javascript:;' layadmin-event="+item.event+"";
            }else{
            	link += "<a href='javascript:;'";
            }
            link += " style='padding-left:65px;'><i class='layui-icon " + item.icon + "' style='left:45px;'></i>"+item.title+" </a>";
            temp += link ;
            var children = item.children;
            if (children && children != undefined && children.length>0){
                temp += traverseMenu(children);
            }
            temp += "</dd>";
        });
        temp += "</dl>";
        return temp;
    };
    
    var treeMenu = new treeMenu();

    exports('treeMenu', treeMenu);
});