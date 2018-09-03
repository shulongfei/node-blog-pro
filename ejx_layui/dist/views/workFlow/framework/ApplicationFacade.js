puremvc.define({
	name : 'ejx4ui.Application',
	constructor : function() {
		// register the startup command and trigger it.
		this.facade.registerCommand(ejx4ui.AppConstants.STARTUP,
				ejx4ui.controller.command.StartupCommand);
		this.facade.sendNotification(ejx4ui.AppConstants.STARTUP);
	}
},
// INSTANCE MEMBERS
{
	// Define the startup notification name
	STARTUP : 'startup',
	// Get an instance of the PureMVC Facade. This creates the Model, View, and Controller instances.
	facade : puremvc.Facade.getInstance(ejx4ui.AppConstants.CORE_NAME)
});
