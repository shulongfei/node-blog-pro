puremvc.define({
    name: 'ejx4ui.controller.command.PrepModelCommand',
    parent: puremvc.SimpleCommand
    }, {
    execute: function (note) {
        // Common Register Proxies :
        this.facade.registerProxy(new ejx4ui.model.proxy.CommonProxy());
    	}
    }
);
