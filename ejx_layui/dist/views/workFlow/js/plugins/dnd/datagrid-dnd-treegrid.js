/**
 * INFO：
 * (1) 此脚本基于datagrid-dnd.js、treegrid-dnd.js脚本进行修改而来。
 * (2) 实现关键点：
 * 		设置目标区域的dropAccept；<br>
 * 		设置目标区域的droppable；<br>
 * 
 * MODIFY：
 * (1) 重复放置节点的判断（主要是进行 idField 的唯一性进行判断）2015年12月9日 <br>
 * (2) 放置时对新增节点的类型进行赋值（根据paramUI内的相关配置）2015年12月9日<br>
 * (3) 放置逻辑的变更（主要是Append）<br>
 * 
 * BUG：
 * (1) TODO xx 拖拽第一次放置无效，第二次才放置生效。
 * 
 * NOTE:
 * (1)	opt.finder.getTr(table, index, keyword, which);<br>
 * 		该接口很实用，getSelected和getSelections等接口均用到了，该接口的四个参数含义分别如下：<br>
 * table   | string |	表格的选择器<br>
 * index   | number |	行号<br>
 * keyword | string |	用于区分查找哪些类型的行，可以为以下几个值:<br>
 * 			"body":查找整个行数据，一般同时会传入index;<br>
 * 			"footer":查找footer行数据，一般同时会传入index;<br>
 * 			"selected":查找被选中的行数据，不会传入index;<br>
 * 			"last":查找最后一条行数据，不会传入index;<br>
 * 			"allbody":查找整个行数据，不会传入index;<br>
 * 			"allfooter":查找所有footer行数据，不会传入index;<br>
 * which   | number |	当存在frozenColumns的时候，表格内容将有两部分组成，which可能有三个值：<br>
 * 			0:递归查找，具体用途暂时没研究;<br>
 * 			1:在frozenColumns所在的table容器里查找;<br>
 * 			2:在columns所在的table容器里查找;<br>
 * (2)	this = $(this).get(0);<br>
 * 		原生dom可由easyui的datatable采用.get(0)来获得。<br>
 * 
 * @Modify by DJQ
 * @LastDate 2015年12月9日
 * @param $
 */
(function($){
	
	$.extend($.fn.datagrid.defaults, {
		dropAccept: 'tr.datagrid-row',  // 目标区域的dropAccept, 配置可接收类型的Class
		onBeforeDrag: function(row){},	// return false 停止拖拽
		onStartDrag: function(row){},
		onStopDrag: function(row){},
	});	
	
	$.extend($.fn.datagrid.methods, {
		enableDnd: function(jq, index){
			return jq.each(function(){
				var target = this;
				var state = $.data(this, 'datagrid');
				var dg = $(this);
				var opts = state.options;
				var dropTargetTree = $(opts.dropTargetTree); // 需要接收拖拽的目标源
				var dropTargetTreeDom = $(opts.dropTargetTree).get(0);
				var dropTargetTreeOpts = $(opts.dropTargetTree).treegrid("options");
				var msgIdField = dropTargetTreeOpts.idField; // "fid"
				var msgTextField = dropTargetTreeOpts.treeField; // "clazz"
				
				/**
				 *  拖拽对象属性
				 */
				var draggableOptions = {
					disabled: false,
					revert: true,
					cursor: 'pointer',
					proxy: function(source) {
						var p = $('<div style="z-index:9999999999999"></div>').appendTo('body');
						var draggingRow = getDraggingRow(source);
						var rows = $.isArray(draggingRow) ? draggingRow : [draggingRow];
						$.map(rows, function(row,i){
							var index = dg.datagrid('getRowIndex', row);
							var tr1 = opts.finder.getTr(target, index, 'body', 1);
							var tr2 = opts.finder.getTr(target, index, 'body', 2);
							tr2.clone().removeAttr('id').removeClass('droppable').appendTo(p);
							tr1.clone().removeAttr('id').removeClass('droppable').find('td').insertBefore(p.find('tr:eq('+i+') td:first'));
							$('<td><span class="tree-dnd-icon tree-dnd-no" style="position:static">&nbsp;</span></td>').insertBefore(p.find('tr:eq('+i+') td:first'));
						});
						p.find('td').css('vertical-align','middle');
						p.hide();
						return p;
					},
					deltaX: 15,
					deltaY: 15,
					onBeforeDrag:function(e){
						var draggingRow = getDraggingRow(this);
						if (opts.onBeforeDrag.call(target, draggingRow) == false){return false;}
						if ($(e.target).parent().hasClass('datagrid-cell-check')){return false;}
						if (e.which != 1){return false;}
						$.map($.isArray(draggingRow)?draggingRow:[draggingRow], function(row){
							var index = $(target).datagrid('getRowIndex', row);
							opts.finder.getTr(target, index).droppable({accept:'no-accept'});
						});
					},
					onStartDrag: function() {
						$(this).draggable('proxy').css({
							left: -10000,
							top: -10000
						});
						var draggingRow = getDraggingRow(this);
						opts.onStartDrag.call(target, draggingRow);
						state.draggingRow = draggingRow;
					},
					onDrag: function(e) {
						var x1=e.pageX,y1=e.pageY,x2=e.data.startX,y2=e.data.startY;
						var d = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
						if (d>3){	// when drag a little distance, show the proxy object
							$(this).draggable('proxy').show();
							var tr = opts.finder.getTr(target, parseInt($(this).attr('datagrid-row-index')), 'body');
							$.extend(e.data, {
								startX: tr.offset().left,
								startY: tr.offset().top,
								offsetWidth: 0,
								offsetHeight: 0
							});
						}
						this.pageY = e.pageY;
					},
					onStopDrag:function(){
						$.map($.isArray(state.draggingRow) ? state.draggingRow : [state.draggingRow], function(row){
							var index = dg.datagrid('getRowIndex', row);
							dg.datagrid('enableDnd', index);
						});
						opts.onStopDrag.call(target, state.draggingRow);
					}
				};
				
				/**
				 * 释放对象属性
				 * 
				 * @modify by DJQ
				 * @date 2015年12月6日
				 */
				var droppableOptions = {
					accept: opts.dropAccept, // 'tr.datagrid-row'
					onDragEnter: function(e, source){
						if (dropTargetTreeOpts.onDragEnter.call(dropTargetTreeDom, getRow(this), getDraggingRow(source)) == false){
							setProxyFlag(source, false);
							var tr = dropTargetTreeOpts.finder.getTr(dropTargetTreeDom, $(this).attr('node-id'));
							tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
							tr.droppable('disable');
							$(this).disabledNodes.push($(this).attr('node-id'));
						}
					},
					onDragOver: function(e, source) {
						var nodeId = $(this).attr('node-id');
						if ($.inArray(nodeId, $(this).disabledNodes) >= 0){return}
						var pageY = source.pageY;
						var top = $(this).offset().top;
						var bottom = top + $(this).outerHeight();
						
						setProxyFlag(source, true);
						var tr = dropTargetTreeOpts.finder.getTr(dropTargetTreeDom, nodeId);
						tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
						if (pageY > top + (bottom - top) / 2){
							if (bottom - pageY < 5){
								tr.addClass('treegrid-row-bottom');
							} else {
								tr.addClass('treegrid-row-append');
							}
						} else {
							if (pageY - top < 5){
								tr.addClass('treegrid-row-top');
							} else {
								tr.addClass('treegrid-row-append');
							}
						}
						if (dropTargetTreeOpts.onDragOver.call(dropTargetTreeDom, this, getDraggingRow(source)) == false){
							setProxyFlag(source, false);
							tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
							tr.droppable('disable');
							$(this).disabledNodes.push(nodeId);
						}
					},
					onDragLeave: function(e, source) {
						setProxyFlag(source, false);
						var tr = dropTargetTreeOpts.finder.getTr(dropTargetTreeDom, $(this).attr('node-id'));
						tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
						dropTargetTreeOpts.onDragLeave.call(dropTargetTreeDom, getRow(this), getDraggingRow(source));
					},
					onDrop: function(e, source) {
						var dest = this;
						var action, point;
						var tr = dropTargetTreeOpts.finder.getTr(dropTargetTreeDom, $(this).attr('node-id'));
						if (tr.hasClass('treegrid-row-append')){
							action = append;
							point = 'append';
						} else {
							action = insert;
							point = tr.hasClass('treegrid-row-top') ? 'top' : 'bottom';
						}
						
						var dRow = getRow(this);
						var sRow = getDraggingRow(source);
						if (dropTargetTreeOpts.onBeforeDrop.call(dropTargetTreeDom, dRow, sRow, point) == false){
							tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
							return;
						}
						action(sRow, dRow, point);
						tr.removeClass('treegrid-row-append treegrid-row-top treegrid-row-bottom');
					}
				}
				
				/**
				 * ##########################################################################################
				 * ##########################################################################################
				 * ##########################################################################################
				 */

				/**
				 * 为需要拖拽对象和需要接收的对象进行初始化设置
				 */
				if (index != undefined){
					var trs = opts.finder.getTr(this, index);
				} else {
					var trs = opts.finder.getTr(this, 0, 'allbody');
				}
				trs.draggable(draggableOptions);
				setDroppable(dropTargetTree);
				
				/**
				 * ##########################################################################################
				 * ##########################################################################################
				 * ##########################################################################################
				 */
				
				function setProxyFlag(source, allowed){
					var icon = $(source).draggable('proxy').find('span.tree-dnd-icon');
					icon.removeClass('tree-dnd-yes tree-dnd-no').addClass(allowed ? 'tree-dnd-yes' : 'tree-dnd-no');
				}
				
				/**
				 * 获取目标Row
				 * @modify by DJQ
				 * 
				 */
				function getRow(tr){
					var nodeId = $(tr).attr('node-id');
					return dropTargetTree.treegrid('find', nodeId);
				}
				
				/**
				 * 获取正在拖拽的对象
				 * 
				 */
				function getDraggingRow(tr){
					if (!$(tr).hasClass('datagrid-row')){return null}
					var target = $(tr).closest('div.datagrid-view').children('table')[0];
					var opts = $(target).datagrid('options');
					if (!opts.singleSelect){
					//if (opts.dragSelection){
						var rows = $(target).datagrid('getSelections');
						$.map(rows, function(row){
							row._selected = true;
						});
						if (!rows.length){
							var row = opts.finder.getRow(target, $(tr));
							row._selected = false;
							return row;
						}
						return rows;
					} else {
						var row = opts.finder.getRow(target, $(tr));
						if ($(tr).hasClass('datagrid-row-selected')){
							row._selected = true;
						}
						return $.isArray(row) ? row : [row];
					}
				}
				
				/**
				 * 为目标区域设置接收动作
				 * @modify by DJQ
				 */
				function setDroppable(target){
					//可放下的目标
					var c = target.treegrid('getPanel').find('tr[node-id]');
					if (c.length > 0)
					{
						c.droppable(droppableOptions); // 这里设置目标区域接收的类型，以及相关的事件设定
					} else {
						c.droppable('disable');
					}
				}
				
				/**
				 * 放下目标的边框颜色
				 */
				function setDroppableBorder(target, b){
					if (b)
						target.css('border','1px solid red');
					else
						target.css('border','');
				}
				
				/**
				 * 向TreeGrid树内追加节点
				 * 注意：sRow 为数据
				 * 请注意数据格式
				 * @add by DJQ 2015年12月5日
				 * 
				 */
				function append(sRow, dRow){ 
				
					var data = sRow[0]; // 注意源和目标的id需要一致
					if (dRow.state == 'closed'){
						dropTargetTree.treegrid('expand', dRow[msgIdField]);
					}
					if( utilUI.checkIdField(dropTargetTree, data) ){
						doAppend(data);
					} else {
						$.messager.alert('警告','该节点已经存在，请勿重复添加！');
					}
					function doAppend(data){
//						var data = {
//							fid : sRow[0][dropTargetTreeOpts.idField] // 注意fid
//						};
//						var data = sRow[0]; // 注意源和目标的id需要一致
//						var data = extUtil.str2Json(paramUI.defData); // 注意源和目标的id需要一致
						data[msgIdField] = sRow[0][msgIdField];
						var sDropTargetTreeField = dRow[msgTextField];
						var sDropTargetIdField = dRow[msgIdField];
						
						// 设置drop下的节点类型
						data[msgTextField] = utilUI.compareXX(paramUI.leafNodeRule, sDropTargetTreeField, true);
						// 叶子节点不允许Append
						if (data[msgTextField] == sDropTargetTreeField){
							$.messager.alert('警告','节点已为叶子节点，不允许在其内部插入叶子节点！');
							return;
						}
						var param = {};
						param.parent = sDropTargetIdField;
						param.data = [data]; // NOTICE 当方法为append的时候，data类型为数组，注意！！！
						var onLoadSuccess = dropTargetTreeOpts.onLoadSuccess;
						dropTargetTreeOpts.onLoadSuccess = function(){};
						dropTargetTree.treegrid('append', param);
						dropTargetTreeOpts.onLoadSuccess = onLoadSuccess;
						dropTargetTree.treegrid('enableDnd', sDropTargetIdField);
						dropTargetTreeOpts.onDrop.call(dropTargetTreeDom, dRow, data, 'append');
						dropTargetTree.treegrid('select', data[msgIdField]); //TODO 选中操作节点
					}
				}
				
				/**
				 * 向TreeGrid树内插入节点
				 * 注意：sRow 为数据
				 * 请注意数据格式
				 * @add by DJQ 2015年12月5日
				 */
				function insert(sRow, dRow, point){
					
//					var data = {
//						fid : sRow[0][dropTargetTreeOpts.idField] // 注意fid
//					};
//					var data = sRow[0]; // 注意源和目标的id需要一致
					var data = extUtil.str2Json(paramUI.defData); // 注意源和目标的id需要一致
					data[msgIdField] = sRow[0][msgIdField];
					if( utilUI.checkIdField(dropTargetTree, data) ){
						
						var sDropTargetTreeField = dRow[msgTextField];
						var sDropTargetIdField = dRow[msgIdField];
						
						// 叶子节点不允许Append
						if ( utilUI.compare(paramUI.rootClazz, sDropTargetTreeField)){
							$.messager.alert('警告','节点为根节点，不允许在其前后插入叶子节点！');
							return;
						}
						// 设置drop下的节点类型
						data[msgTextField] = utilUI.compareXX(paramUI.leafNodeRule, sDropTargetTreeField, true);
						
						var param = {};
						if (point == 'top'){
							param.before = sDropTargetIdField;
						} else {
							param.after = sDropTargetIdField;
						}
						param.data = data;
						var onLoadSuccess = dropTargetTreeOpts.onLoadSuccess;
						dropTargetTreeOpts.onLoadSuccess = function(){};
						dropTargetTree.treegrid('insert', param);
						dropTargetTreeOpts.onLoadSuccess = onLoadSuccess;
						dropTargetTree.treegrid('enableDnd', data[msgIdField]);
						dropTargetTreeOpts.onDrop.call(dropTargetTreeDom, dRow, data, point);
						dropTargetTree.treegrid('select', data[msgIdField]); //TODO 选中操作节点
					}
				}
				
			});
		}
		
	});
})(jQuery);
