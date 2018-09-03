puremvc.define(
    {
        name: 'ejx4msg.StartupCommandWork',
//        parent: puremvc.MacroCommand
        parent: puremvc.SimpleCommand
    },{
//      initializeMacroCommand: function () {
        execute: function (note) {
        	//console.log(note);
//        	this.addSubCommand(ejx4msg.controller.command.PrepViewCommand);
        	
        	// 流程配置
        	this.facade.registerMediator(new ejx4msg.view.mediator.WorkMediator());
    		

        	// 说明：后加载的dom节点无法绑定事件，所以……
        	
            // Register Mediators :
            // this.facade.registerMediator(new ejx4msg.view.mediator.CommonMediator());
        	
        }
    }
);
