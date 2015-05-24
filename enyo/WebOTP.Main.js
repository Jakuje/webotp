const STORE_COOKIE = "appPrefs";
enyo.setAllowedOrientation("up");
enyo.kind({
	name: "WebOTP.Main",
	kind: enyo.VFlexBox,
	components: [
		{kind: "AppMenu", components: [
			{kind: "EditMenu"},
			{caption: "About", onclick: "showHelp"}
		]},
		{name: "pane", kind: "Pane", flex: 1, onSelectView: "viewSelected", components: [
			{name: "list", className: "enyo-bg", kind: "WebOTP.List",
				onEdit: "editService", onNew: "addNew",
				onDelete: "deleteService", onStore: "storeServices"},
			{name: "detail", className: "enyo-bg", kind: "WebOTP.Detail",
				onAddService: "addService", onBack: "goBack",
				onEditService: "serviceEdited"},
			{name: "help", className: "enyo-bg", kind: "WebOTP.Help", onBack: "goBack"}
		]},
		{kind: enyo.ApplicationEvents,
			onBack: "goBack",
//			onOpenAppMenu: "onOpenAppMenu"
		},
	],
	create: function() {
		this.inherited(arguments);
		this.$.list.modelChanged(this.getServices());
		this.$.pane.selectViewByName("list");
	},
	viewSelected: function(inSender, inView) {
		if (inView == this.$.list) {
			this.$.detail.cleanup();
		} else if (inView == this.$.detail) {
		}
	},
	showHelp: function(inSender) {
		this.$.pane.selectViewByName("help");
	},
	goBack: function(inSender, inEvent) {
		this.$.pane.back(inEvent);
	},
	addNew: function(inSender, inEvent) {
		this.$.pane.selectViewByName("detail");
		this.$.detail.addNew();
	},
	editService: function(inSender, inServiceId) {
		this.$.detail.edit(inServiceId);
		this.$.pane.selectViewByName("detail");
	},
	serviceEdited: function(inSender, inServiceId, inData){
		this.services[inServiceId].issuer = inData.issuer;
		this.services[inServiceId].description = inData.description;
		this.services[inServiceId].icon = inData.icon;
		this.storeServices();
		this.$.list.modelChanged(this.services);
	},
	addService: function(inSender, inService){
		this.services.push(inService);
		this.storeServices();
		this.$.list.modelChanged(this.services);
	},
	deleteService: function(inSender, inServiceId){
		this.services.splice(inServiceId,1);
		this.storeServices();
		this.$.list.modelChanged(this.services);
	},

	/* Data store */
	services: null,
	getServices: function() {
		if (!this.services) {
			try {
				this.services = enyo.json.parse(enyo.getCookie(STORE_COOKIE));
			} catch(err) {
				this.services = [];
				this.storeServices();
			}
		}
		return this.services;
	},
	storeServices: function(){
		enyo.setCookie(STORE_COOKIE, enyo.json.stringify(this.services));
	},
});
