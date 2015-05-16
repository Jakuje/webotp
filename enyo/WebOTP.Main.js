const STORE_COOKIE = "appPrefs";
enyo.setAllowedOrientation("up");
enyo.kind({
	name: "WebOTP.Main",
	kind: enyo.VFlexBox,
	components: [
		{kind: "AppMenu", components: [
			{caption: "About", onclick: "showCredits"}
		]},
		{name: "pane", kind: "Pane", flex: 1, onSelectView: "viewSelected", components: [
			{name: "list", className: "enyo-bg", kind: "WebOTP.List",
				onEdit: "editService", onNew: "addNew",
				onDelete: "deleteService", onStore: "storeServices"},
			{name: "detail", className: "enyo-bg", kind: "WebOTP.Detail",
				onAddService: "addService", onBack: "goBack",
				onEditService: "serviceEdited"}
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
				this.services = [
					{"issuer":"jakuje@gmail.com", "description":"github","icon":"images/github.png", "secret":"12345678","type":0,"digits":6,"algorithm":"SHA1","interval":"30","counter":"0"},
					{"issuer":"jakuje@gmail.com", "description":"google","icon":"images/g80.png", "secret":"12345678","type":0,"digits":6,"algorithm":"SHA1","interval":"15","counter":"0"},
					{"issuer":"jakuje@dta3.com", "description":"abcdefghijklmnop","icon":"images/80.png", "secret":"abcdefghijklmnop","type":0,"digits":6,"algorithm":"SHA1","interval":"30","counter":"0"}
				];
				this.storeServices();
			}
		}
		return this.services;
	},
	storeServices: function(){
		enyo.setCookie(STORE_COOKIE, enyo.json.stringify(this.services));
	},
});
