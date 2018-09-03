puremvc.define({
    name: 'ejx4ui.controller.command.PrepViewCommand',
    parent: puremvc.SimpleCommand
	}, {
    execute: function (note) {
    	// 说明：后加载的dom节点无法绑定事件，所以……
        // Common Register Mediators :
        this.facade.registerMediator(new ejx4ui.view.mediator.CommonMediator());
    }
   }
);
