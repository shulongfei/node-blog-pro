puremvc.define({
	name : 'ejx4ui.AppConstants'
}, {}, { // The multiton key for this app's single core
	CORE_NAME : 'ejx4ui-MVC',
	// Notifications 
	STARTUP : 'startup',

	/**
	 * PureMVC 通知变量声明
	 *  自定义书写规范：
	 *      第一部分_第二部分_第三部分_第四部分_“REQUEST(请求)/RESPONSE(响应)/ONLOAD(加载)”
	 *  规范内字段说明：
	 *      第一部分：模块名称
	 *      第二部分：操作主对象名称
	 *      第三部分：操作子对象名称（无子对象则可省略，多个则追加）
	 *      第四部分：操作对象的属性
	 *  模块说明：
	 *  	模板模块: 	DEMO
	 * 		   
	 *  @author DJQ
	 *  @date   2015年1月14日
	 */

// //////////////////////////////////////////////
// / COMMON模块: COMMON
// //////////////////////////////////////////////  
	
	// 请求接入数据
	COMMON_SESSION_DATA_REQUEST : 'common_session_data_request',
	// 反馈接入数据
	COMMON_SESSION_DATA_RESPONSE : 'common_session_data_response',
	// 请求添加Tab
    COMMON_MAINTABS_ADD_REQUEST : 'common_maintabs_add_request', 
    // 反馈添加Tab        
    COMMON_MAINTABS_ADD_RESPONSE : 'common_maintabs_add_response',
    //请求加载接出
    COMMON_OUT_REQUEST:'common_out_request',
    //反馈加载接出
    COMMON_OUT_RESPONSE:'common_out_response',
    //请求添加组件
    COMMON_COMPONENT_REQUEST:'common_component_request',
    //反馈添加组件
    COMMON_COMPONENT_RESPONSE:'common_component_response',
    //关闭组件树
    COMMON_CLOSE_TAB_REQUEST:'common_close_tab_request',
    //关闭重复窗口
    COMMON_CLOSE_WINDOW_REQUEST:'common_close_window_request',
    //tab页面如果存在 则选中
    COMMON_ALIVE_TAB_RESPONSE:'common_alive_tab_response',
    //请求集成数据
    COMMON_FLW_REQUEST:'common_flw_request',
    //反馈集成数据
    COMMON_FLW_RESPONSE:'common_flw_response',
    

// //////////////////////////////////////////////
// / PureMVC
// //////////////////////////////////////////////

	ADD_TODO : 'add_todo',
	DELETE_TODO : 'delete_todo',
	UPDATE_TODO : 'update_todo',
	TOGGLE_TODO_STATUS : 'toggle_todo_status',
	REMOVE_TODOS_COMPLETED : 'remove_todos_completed',
	FILTER_TODOS : 'filter_todos',
	TODOS_FILTERED : 'todos_filtered',

	// Filter routes
	FILTER_ALL : 'all',
	FILTER_ACTIVE : 'active',
	FILTER_COMPLETED : 'completed'

});
