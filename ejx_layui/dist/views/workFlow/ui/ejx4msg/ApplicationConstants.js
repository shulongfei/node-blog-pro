puremvc.define({
	name : 'ejx4msg.AppConstants'
}, {}, { // The multiton key for this app's single core
	CORE_NAME : 'ejx4msg',
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
// / MSG模块: MSG
// //////////////////////////////////////////////  
	
	// 展示pro数据
	MSG_PRO_DATA_SHOW : 'msg_pro_data_show',
	// 修改message数据
	MSG_MESSAGE_BTNS_SHOW : 'msg_message_btns_show',
	MSG_MESSAGE_DATA_UPDATE : 'msg_message_data_update',
	MSG_MESSAGE_DATA_DIALOG_SHOW : 'msg_message_data_dialog_show',
	MSG_MESSAGE_CONTENT_DIALOG_SHOW : 'msg_message_content_dialog_show',
	MSG_MESSAGE_DATA_IDFIELD_SET : 'msg_message_data_idfield_set',
	MSG_MESSAGE_DATA_DIV_SHOW : 'msg_message_data_div_show',
	MSG_MESSAGE_DATA_NODELOG_SHOW:'msg_message_data_nodelog_show',
	
	
// //////////////////////////////////////////////
// FLOW模块:
// //////////////////////////////////////////////  
	
	// 展示pro数据
	FLOW_PRO_DATA_SHOW : 'flow_pro_data_show',
	// 修改flow数据
	FLOW_MESSAGE_BTNS_SHOW : 'flow_message_btns_show',
	FLOW_MESSAGE_DATA_UPDATE : 'flow_message_data_update',
	FLOW_MESSAGE_DATA_DIALOG_SHOW : 'flow_message_data_dialog_show',
	FLOW_MESSAGE_CONTENT_DIALOG_UPDATE : 'flow_message_content_dialog_update',
	FLOW_MESSAGE_CONTENT_DIALOG_SEARCH : 'flow_message_content_dialog_search',
	FLOW_MESSAGE_DATA_IDFIELD_SET : 'flow_message_data_idfield_set',
	FLOW_MESSAGE_DATA_DIV_SHOW : 'flow_message_data_div_show',
	FLOW_MESSAGE_DATA_DIV_SHOW_START : 'flow_message_data_div_show_start',
	FLOW_MESSAGE_DATA_DIV_SHOW_END : 'flow_message_data_div_show_end',
	FLOW_MESSAGE_DATA_DIV_SHOW_USERTASK : 'flow_message_data_div_show_usertask',
	FLOW_MESSAGE_DATA_DIV_SHOW_SERVICETASK : 'flow_message_data_div_show_servicetask',
	FLOW_MESSAGE_DATA_DIV_SHOW_FLOW : 'flow_message_data_div_show_flow',
	
// //////////////////////////////////////////////
// / COMMON模块: COMMON
// //////////////////////////////////////////////  
	
	// 请求session数据
	COMMON_SESSION_DATA_REQUEST : 'common_session_data_request',
	// 反馈session数据
	COMMON_SESSION_DATA_RESPONSE : 'common_session_data_response',
	// 请求添加Tab
    COMMON_MAINTABS_ADD_REQUEST : 'common_maintabs_add_request', 
    // 反馈添加Tab        
    COMMON_MAINTABS_ADD_RESPONSE : 'common_maintabs_add_response',
    // 请求更新个人密码
    COMMON_PASSWORD_UPDATE_REQUEST : 'common_password_update_request',
    // 响应更新个人密码
    COMMON_PASSWORD_UPDATE_RESPONSE : 'common_password_update_response',
    // 请求notice数据
//    COMMON_NOTICE_DATA_REQUEST : 'common_notice_data_request',
    // 响应notice数据
    COMMON_NOTICE_DATA_RESPONSE : 'common_notice_data_response',

 // //////////////////////////////////////////////
 // / 工单管理 :USERMANAGE
 // //////////////////////////////////////////////

    // 请求加载用户信息列表
    USERMANAGE_USERINFOLIST_DATA_REQUEST:	'usermanage_userinfolist_data_request',
    // 响应加载用户信息列表
    USERMANAGE_USERINFOLIST_DATA_RESPONSE:	'usermanage_userinfolist_data_response',
    // 请求加载用户信息
    USERMANAGE_USERINFO_DATA_REQUEST:		'usermanage_userinfo_data_request',
    // 响应加载用户信息
    USERMANAGE_USERINFO_DATA_RESPONSE:		'usermanage_userinfo_data_response',
    // 请求检测登入名合法性
    USERMANAGE_USERNAME_CHECK_REQUEST: 		'usermanage_username_check_request',
    // 响应检测登入名合法性
    USERMANAGE_USERNAME_CHECK_RESPONSE: 	'usermanage_username_check_response',
    // 请求添加用户信息
    USERMANAGE_USERINFO_ADD_REQUEST:		'usermanage_userinfo_add_request',
    // 响应添加用户信息
    USERMANAGE_USERINFO_ADD_RESPONSE:		'usermanage_userinfo_add_response',
    // 请求删除用户信息
    USERMANAGE_USERINFO_DELETE_REQUEST:		'usermanage_userinfo_delete_request',
    // 响应删除用户信息
    USERMANAGE_USERINFO_DELETE_RESPONSE: 	'usermanage_userinfo_delete_response',
    // 请求更新用户信息
    USERMANAGE_USERINFO_UPDATE_REQUEST:		'usermanage_userinfo_update_request',
    // 响应更新用户信息
    USERMANAGE_USERINFO_UPDATE_RESPONSE: 	'usermanage_userinfo_update_response',
	    
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
