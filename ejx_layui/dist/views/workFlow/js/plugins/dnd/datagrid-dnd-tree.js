(function($){
	$.extend($.fn.datagrid.defaults, {
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
				var dropTargetTree = $(opts.dropTargetTree);
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
				var droppableOptions = {
					accept: 'tr.datagrid-row',
					onDragEnter: function(e, source){
						if ($(this).droppable('options').disabled){return;}
						if (dropTargetTree.tree("options").onDragEnter.call(target, getRow(this), getDraggingRow(source)) == false){
							setProxyFlag(source, false);
							var tr = opts.finder.getTr(target, $(this).attr('datagrid-row-index'));
							tr.find('td').css('border', '');
							tr.droppable('disable');
							$(this).droppable('disable');
						}
					},
					onDragOver: function(e, source) {
						if ($(this).droppable('options').disabled){
							return;
						}
						setDroppableBorder($(this), true);
						var pageY = source.pageY;
						var top = $(this).offset().top;
						var bottom = top + $(this).outerHeight();
						
						setProxyFlag(source, true);
						var tr = opts.finder.getTr(target, $(this).attr('datagrid-row-index'));
						tr.children('td').css('border','');
						if (pageY > top + (bottom - top) / 2) {
							tr.children('td').css('border-bottom','1px solid red');
						} else {
							tr.children('td').css('border-top','1px solid red');
						}
						
						if (dropTargetTree.tree("options").onDragOver.call(target, this, getDraggingRow(source)) == false){
							setProxyFlag(source, false);
							setDroppableBorder($(this), false);
							$(this).droppable('disable');
						}
					},
					onDragLeave: function(e, source) {
						if ($(this).droppable('options').disabled){
							return;
						}
						$(this).css('border','');
						setProxyFlag(source, false);
						dropTargetTree.tree("options").onDragLeave.call(target, getRow(this), getDraggingRow(source));
					},
					onDrop: function(e, source) {
						if ($(this).droppable('options').disabled){
							return;
						}
						point = "";
						setDroppableBorder($(this), false);
						var dRow = getRow(this);
						var sRow = getDraggingRow(source);
						if (dropTargetTree.tree("options").onBeforeDrop.call(target, this, sRow, point) == false){
							return;
						}
						dropTargetTree.tree("options").onDrop.call(target, this, sRow, point);
					}
				}
				
				if (index != undefined){
					var trs = opts.finder.getTr(this, index);
				} else {
					var trs = opts.finder.getTr(this, 0, 'allbody');
				}
				trs.draggable(draggableOptions);
				setDroppable(dropTargetTree);
				
				function setProxyFlag(source, allowed){
					var icon = $(source).draggable('proxy').find('span.tree-dnd-icon');
					icon.removeClass('tree-dnd-yes tree-dnd-no').addClass(allowed ? 'tree-dnd-yes' : 'tree-dnd-no');
				}
				function getRow(tr){
					if (!$(tr).hasClass('datagrid-row')){return null}
					var target = $(tr).closest('div.datagrid-view').children('table')[0];
					var opts = $(target).datagrid('options');
					return opts.finder.getRow(target, $(tr));
				}
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
				function setDroppable(target){
					//可放下的目标
					var c = target.find("div.tree-node"); // div.tree-node
//					var c = target.treegrid('getPanel').find("div.datagrid-row");
//					var c = $(target).treegrid('getPanel').find("div.tree-node");
					if (c.length > 0)
					{
						c.droppable(droppableOptions);
					} else {
						c.droppable('disable');
					}
				}
				/**
				 * 放下目标的边框颜色
				 */
				function setDroppableBorder(target, b)
				{
					if (b)
						target.css('border','1px dashed red');
					else
						target.css('border','');
				}
			});
		}
		
	});
})(jQuery);
