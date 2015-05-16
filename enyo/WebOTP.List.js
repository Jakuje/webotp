enyo.kind({
	name: "WebOTP.List",
	kind: enyo.VFlexBox,
	events: {
		"onEdit": "",
		"onNew": "",
		"onDelete": "",
		"onStore": "",
	},
	components: [
		{kind: "WebOTP.Crypto", name: "crypto", onStore: "storeTokens"},
		{kind: "WebOTP.ProgressTimer", name: "timer", onUpdate: "updateProgress"},
		{kind: "WebOTP.ProgressTimer", name: "pinTimer", onUpdate: "updateProgressPin"},
		{kind: "Scroller", flex: 1, components: [
			{kind: "PageHeader", components: [
				{kind: enyo.VFlexBox, content: "WebOTP", flex: 1},
				{name: "newButton", kind: "Button", content: "New", onclick: "addNew"}
			]},
			{name: "list", kind: "VirtualRepeater", onSetupRow: "getListItem", components: [
				{kind: "SwipeableItem", name: "item", layoutKind: "HFlexLayout", onclick: "itemClicked", onConfirm: "deleteItem", components: [
					{kind: "WebOTP.ProgressImage", name: "icon", content: "", size: 80},
					{kind: enyo.VFlexBox, flex: 1, components: [
						{kind: enyo.HFlexBox, components: [
							{name: "pin", content: "------", className: "pinDisplay", flex: 1},
							{kind: "enyo.VFlexBox", components: [
								{kind: "IconButton", icon: "images/btn_edit.png", onclick: "editClicked"},
							]},
						]},
						{name: "issuer", className: "enyo-item-secondary"},
						{name: "description", className: "enyo-item-ternary"},
					]},
				]}
			]} 
		]},
	],
	services: [],
	/*rendered: function(){
		this.$.crypto.test();
	},*/
	getListItem: function(inSender, inIndex) {
		try{
			var r = this.services[inIndex];
		} catch(e) {}
		if (r) {
			this.$.issuer.setContent(r.issuer);
			this.$.description.setContent(r.description);
			if (r.icon != "") {
				this.$.icon.setSrc(r.icon);
			}
			if (r.pin != undefined) {
				this.$.pin.setContent(r.pin);
			}
			return true;
		}
	},
	addNew: function() {
		this.doNew();
	},
	deleteItem: function(inSender, inIndex) {
		this.$.timer.stop(inIndex); // remove any running timers
		this.doDelete(inIndex);
	},
	editClicked: function(inSender, inEvent) {
		this.doEdit(inEvent.rowIndex);
		inEvent.stopPropagation();
	},
	itemClicked: function(inSender, inEvent) {
		var service = this.services[inEvent.rowIndex];
		var timeout = 60;
		var swap_timeout = service.interval - (Math.floor(new Date().getTime() / 1000) % service.interval);
		this.$.icon.initProgress(inEvent.rowIndex, swap_timeout, timeout);
		this.showNewPin(null, inEvent.rowIndex);
		this.$.timer.start(inEvent.rowIndex, timeout, enyo.bind(this, "hidePin"));
		if (service.type == 0){
			this.$.pinTimer.start(inEvent.rowIndex, swap_timeout, enyo.bind(this, "showSecondPin"));
		}
		inEvent.stopPropagation();
	},
	updateProgress: function(inSender, inRemains, inIndex) {
		this.$.list.controlsToRow(inIndex);
		this.$.icon.updateOuterProgress(inIndex, inRemains);
	},
	hidePin: function(inSender, inIndex){
		this.$.list.controlsToRow(inIndex);
		this.$.pin.setContent("------");
		this.$.icon.destroyProgress(inIndex);
	},
	updateProgressPin: function(inSender, inRemains, inIndex) {
		this.$.list.controlsToRow(inIndex);
		this.$.icon.updateInnerProgress(inIndex, inRemains);
	},
	showSecondPin: function(inSender, inIndex) {
		var remain_timeout = Math.floor(this.$.timer.getRemaining(inIndex)/1000);
		this.$.icon.setInnerStart(inIndex, remain_timeout);
		this.$.pinTimer.start(inIndex, remain_timeout, enyo.bind(this, "hidePin"));
		this.showNewPin(inSender, inIndex);
	},
	showNewPin: function(inSender, inIndex) {
		this.$.list.controlsToRow(inIndex);
		var service = this.services[inIndex];
		var pin = this.$.crypto.getPIN(service);
		this.$.pin.setContent(pin);
	},
	modelChanged: function(inServices) {
		this.services = inServices;
		this.$.list.render();
	},
	storeTokens: function(){
		this.doStore();
	},
});


