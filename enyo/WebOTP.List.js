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
						{name: "pin", content: "------", className: "pinDisplay", flex: 1},
						{kind: enyo.HFlexBox, components: [
							{kind: "enyo.VFlexBox", flex: 1, components: [
								{name: "issuer", className: "enyo-item-secondary"},
								{name: "description", className: "enyo-item-ternary"},
							]},
							{kind: "enyo.VFlexBox", components: [
								{kind: "Spacer", flex: 1},
								{kind: "IconButton", icon: "images/btn_edit.png", onclick: "editClicked"},
							]},
						]},
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
		/* workaround bug for not-giving me correct row index  */
		//var inIndex = inEvent.rowIndex;
		var inIndex = this.$.list.fetchRowIndexByNode(inEvent.toElement);
		var service = this.services[inIndex];
		var timeout;

		/* make sure the init goes with correct row! */
		this.$.list.controlsToRow(inIndex);

		this.showNewPin(inIndex);
		if (service.type == 0) {
			var swap_timeout = service.interval - (Math.floor(new Date().getTime() / 1000) % service.interval);
			timeout = parseInt(service.interval)+swap_timeout;
			this.$.icon.initProgress(inIndex, swap_timeout, timeout);
			this.$.timer.start(inIndex, timeout, enyo.bind(this, "hidePin"));
			// do puter circle first, since the inner triggers redraw
			this.$.pinTimer.start(inIndex, swap_timeout, enyo.bind(this, "showSecondPin"));
		} else {
			timeout = parseInt(service.interval);
			this.$.icon.initProgress(inIndex, timeout, 0);
			// counter has only inner circle
			this.$.pinTimer.start(inIndex, timeout, enyo.bind(this, "hidePin"));
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
		this.showNewPin(inIndex);
	},
	showNewPin: function(inIndex) {
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


