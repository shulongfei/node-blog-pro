puremvc.define({
    name: 'ejx4ui.controller.command.CommonCommand',
    parent: puremvc.SimpleCommand
}, {
    execute: function (note) {
        var body = note.getBody();
        var commonProxy = this.facade.retrieveProxy(ejx4ui.model.proxy.CommonProxy.NAME);
        switch (note.getName()) {
            case ejx4ui.AppConstants.COMMON_SESSION_DATA_REQUEST: // 接入列表信息
                commonProxy.getSessionData(body);
                break;
            case ejx4ui.AppConstants.COMMON_MAINTABS_ADD_REQUEST: // 添加Tab选项卡，加载特定页面
                commonProxy.addTab(body);
                break;
            case ejx4ui.AppConstants.COMMON_OUT_REQUEST: // 接出列表信息
            	commonProxy.getSessionData_out(body);
            	break;
            case ejx4ui.AppConstants.COMMON_COMPONENT_REQUEST: // 组件列表信息
            	commonProxy.getSessionData1(body);
            	break;
            case ejx4ui.AppConstants.COMMON_FLW_REQUEST: // 集成列表信息
            	commonProxy.getFlw(body);
            	break;
        }
    }
});
