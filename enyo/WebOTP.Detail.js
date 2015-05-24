// validated input: changeOnInput:true, onchange: "validate", kind: "Input"
enyo.kind({
	name: "ValidatedInput",
	kind: "Input",
	onchange: "validate",
	changeOnInput: true
});

enyo.kind({
	name: "WebOTP.Detail",
	kind: "Scroller",
	layoutKind: enyo.VFlexLayout,
	events: {
		"onBack": "",
		"onAddService": "",
		"onEditService": "",
	},
	components: [
		{kind: "WebOTP.Crypto", name: "crypto"},
		{kind: "RowGroup", caption: "Identification", components: [
			{kind: enyo.HFlexBox, components: [
          			{kind: "WebOTP.ProgressImage", name: "icon", src: "images/80.png"},
				{kind: enyo.VFlexBox, flex: 1, components: [
					{kind: "ValidatedInput", name: "issuer", hint: "jdoe@example.com"},
					{kind: "ValidatedInput", name: "description", hint: "service description"}
				]},
			]}
		]},
		{kind: "RowGroup", caption: "Secret", name: "secret_block", components: [
			{kind: "ValidatedInput", name: "secret", hint: "(base 32)", onchange: "validateBase32", components: [
				{content: "Secret key", className: "enyo-label"}
			]}
		]},
		{kind: "DividerDrawer", caption: "Advanced", name: "advanced", open: false, onOpenChanged: "drawerChanged", components: [
			{kind: "RowGroup", caption: "Configuration", components: [
				{layoutKind: "HFlexLayout", align: "center", components: [
					{kind: "RadioGroup", name: "type", flex: 2, onChange: "toggleType", components: [
						{label: "TOTP"},
						{label: "HOTP"}
					]},
					{content: "Type", className: "jlabel", flex: 1}
				]},
				{layoutKind: "HFlexLayout", align: "center", components: [
					{kind: "RadioGroup", name: "digits", flex: 2, components: [
						{label: "6", value: 6},
						{label: "8", value: 8}
					]},
					{content: "Digits", className: "jlabel", flex: 1}
				]},
				{layoutKind: "HFlexLayout", components: [
					{kind: "ListSelector", name: "algorithm", popupAlign: "left", label: "Algorithm", flex: 1, items: [
						{caption: "SHA1"},
						{caption: "MD5"},
						{caption: "SHA256"},
						{caption: "SHA512"}
					]},
				]},
				{kind: "ValidatedInput", name: "interval", hint: "Interval", value: "30", autoKeyModifier: "num-lock", components: [
					{content: "Interval [s]", className: "enyo-label"}
				]},
				{kind: "Input", name: "counter", value: "0", autoKeyModifier: "num-lock", components: [
					{content: "Counter", className: "enyo-label"}
				]},
			]}
		]},
		{kind: enyo.HFlexBox, components: [
			{kind: "Button", className: "enyo-button", caption: "Back", flex: 1, onclick: "goBack"},
			{kind: "Button", className: "enyo-button-affirmative", caption: "Add", disabled: true, flex:1, name: "submit", onclick: "addToken"},
		]}
	],
	drawerChanged: function() {
		this.toggleType(this.$.type);
	},
	toggleType: function(inSender) {
		if (inSender.getValue() == 0) {
			this.$.counter.hide();
		} else {
			this.$.counter.show();
		}
	},
	validate: function() {
		this.$.submit.setDisabled(true);

		if (this.$.issuer.value == "")
			return;
		if (this.$.description.value == "")
			return;
		if (this.$.secret_block.getShowing() && this.$.secret.value.length < 8)
			return;
		if (this.$.interval.getShowing() && this.$.interval.value == "0")
			return;

		this.$.submit.setDisabled(false);
	},
	validateBase32: function(inSender, inEvent) {
		this.validate();
		var newValue = this.$.crypto.validateBase32(inSender.getValue());
		inSender.setValue(newValue);
	},
	addToken: function() {
		this.doAddService({
			issuer: this.$.issuer.value,
			description: this.$.description.value,
			icon: '',
			secret: this.$.secret.value, // TODO push into keyring, not in cookie ...
			type: this.$.type.value,
			digits: this.$.digits.value,
			algorithm: this.$.algorithm.value,
			interval: this.$.interval.value,
			counter: this.$.counter.value,
		});
		this.cleanup(); // security!
		this.goBack();
	},
	editToken: function(inSender) {
		this.doEditService(this.serviceId, {
			issuer: this.$.issuer.value,
			description: this.$.description.value,
			icon: '',
		});
		this.cleanup(); // security!
		this.goBack();
	},
	addNew: function() {
		this.$.secret_block.show();
		this.$.advanced.show();
		this.$.submit.setCaption("Add");
		this.$.submit.onclick = "addToken";
		this.validate();
	},
	edit: function(inServiceId) {
		this.serviceId = inServiceId;
		var s = this.owner.services[inServiceId];
		this.$.issuer.setValue(s.issuer);
		this.$.icon.setSrc(s.icon);
		this.$.description.setValue(s.description);
		this.$.secret_block.hide();
		this.$.advanced.hide();
		this.$.submit.setCaption("Edit");
		this.$.submit.onclick = "editToken";
		this.validate();
	},
	cleanup: function() {
		this.$.issuer.setValue("");
		this.$.description.setValue("");
		this.$.secret.setValue("");
		this.$.type.setValue(0);
		this.$.digits.setValue(6);
		this.$.algorithm.setValue("SHA1");
		this.$.interval.setValue("30");
		this.$.counter.setValue("0");
		this.$.advanced.close();
		this.$.icon.setSrc("");
	},
	goBack: function() {
		this.cleanup();
		this.doBack();
	}
});

