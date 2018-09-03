puremvc.define({
	name : 'ejx4ui.controller.command.PrepControllerCommand',
	parent : puremvc.SimpleCommand
}, {
	execute : function(note) {
		// @Common Register Commands :
		this.facade.registerCommand(ejx4ui.AppConstants.COMMON_SESSION_DATA_REQUEST, ejx4ui.controller.command.CommonCommand);
		this.facade.registerCommand(ejx4ui.AppConstants.COMMON_MAINTABS_ADD_REQUEST, ejx4ui.controller.command.CommonCommand);
		this.facade.registerCommand(ejx4ui.AppConstants.COMMON_MAINTABS_MSG_REQUEST, ejx4ui.controller.command.CommonCommand);
		//组件数据
		this.facade.registerCommand(ejx4ui.AppConstants.COMMON_COMPONENT_REQUEST, ejx4ui.controller.command.CommonCommand);
		//接出
		this.facade.registerCommand(ejx4ui.AppConstants.COMMON_OUT_REQUEST, ejx4ui.controller.command.CommonCommand);
		
//		this.facade.registerCommand(ejx4ui.AppConstants.COMMON_PASSWORD_UPDATE_REQUEST, ejx4ui.controller.command.CommonCommand);
//		this.facade.registerCommand(ejx4ui.AppConstants.COMMON_NOTICE_DATA_REQUEST, ejx4ui.controller.command.CommonCommand);
		
		// @UserManage Register Commands :
		this.facade.registerCommand(ejx4ui.AppConstants.USERMANAGE_USERINFOLIST_DATA_REQUEST, ejx4ui.controller.command.UserManageCommand);
		this.facade.registerCommand(ejx4ui.AppConstants.USERMANAGE_USERINFO_DATA_REQUEST, ejx4ui.controller.command.UserManageCommand);
		this.facade.registerCommand(ejx4ui.AppConstants.USERMANAGE_USERNAME_CHECK_REQUEST, ejx4ui.controller.command.UserManageCommand);
		this.facade.registerCommand(ejx4ui.AppConstants.USERMANAGE_USERINFO_ADD_REQUEST, ejx4ui.controller.command.UserManageCommand);
		this.facade.registerCommand(ejx4ui.AppConstants.USERMANAGE_USERINFO_DELETE_REQUEST, ejx4ui.controller.command.UserManageCommand);
		this.facade.registerCommand(ejx4ui.AppConstants.USERMANAGE_USERINFO_UPDATE_REQUEST, ejx4ui.controller.command.UserManageCommand);
	
	}
});
