puremvc.define({
	name : 'ejx4msg.ApplicationFlow',
	constructor : function() {
		// register the startup command and trigger it.
		this.facade.registerCommand(ejx4msg.AppConstants.STARTUP, ejx4msg.StartupCommandFlow);
		this.facade.registerCommand(ejx4msg.AppConstants.STARTUP, ejx4msg.StartupCommandWork);
		this.facade.sendNotification(ejx4msg.AppConstants.STARTUP);
	}
},
// INSTANCE MEMBERS
{
	// Define the startup notification name
	STARTUP : 'startup',
	// Get an instance of the PureMVC Facade. This creates the Model, View, and Controller instances.
	facade : puremvc.Facade.getInstance(ejx4msg.AppConstants.CORE_NAME)	
});
