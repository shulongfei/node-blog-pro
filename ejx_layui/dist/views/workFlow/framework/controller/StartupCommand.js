puremvc.define(
    {
        name: 'ejx4ui.controller.command.StartupCommand',
        parent: puremvc.MacroCommand
    },{
        initializeMacroCommand: function () {
        	this.addSubCommand(ejx4ui.controller.command.PrepControllerCommand);
            this.addSubCommand(ejx4ui.controller.command.PrepModelCommand);
            this.addSubCommand(ejx4ui.controller.command.PrepViewCommand);
        }
    }
);
