enyo.kind({
	name: "WebOTP.Help",
	kind: "Scroller",
	events: {
		"onBack": ""
	},
	components: [
		{kind: "PageHeader", components: [
			{kind: enyo.VFlexBox, content: "About application", flex: 1},
			{kind: "Button", content: "Back", onclick: "goBack"}
		]},
		{kind: "Item", content: "WebOTP app by Jakuje"},
		{kind: "Item", content: "FreeOTP port for webOS providing one-time-passwords for various services. Secure your account with two-factor-authentication!"},
		{kind: "RowGroup", caption: "Help", components: [
			{kind: "HFlexBox", onclick: "showWeb", components: [
				{kind: "Image", src: "images/browser.png", style: "width:50%;margin: -7px 0;"},
				{content: "Support"},
			]},
			{kind: "HFlexBox", onclick: "showNations", components: [
				{kind: "Image", src: "images/browser.png", style: "width:50%;margin: -7px 0;"},
				{content: "WebOS Nations"},
			]},
			{kind: "HFlexBox", onclick: "showForums", components: [
				{kind: "Image", src: "images/browser.png", style: "width:50%;margin: -7px 0;"},
				{content: "Discussion forums"},
			]}
		]},
		{kind: "RowGroup", caption: "Contact", components: [
			{kind: "HFlexBox", onclick: "showEmail", components: [
				{kind: "Image", src: "images/email.png", style: "width:50%;margin: -7px 0;"},
				{content: "Email author"},
			]}
		]},
		{kind: "Item", content: "© Copyright 2015 Jakuje"},
		{name : "browser", kind : "PalmService", service : "palm://com.palm.applicationManager", method : "open"}
	],
	showWeb: function() {
		this.$.browser.call({"target": "http://jakuje.dta3.com/webotp.phtml"});
	},
	showNations: function(){
		this.$.browser.call({"target": "http://www.webosnation.com/webotp"});
	},
	showForums: function(){
		this.$.browser.call({"target": "http://forums.webosnation.com/webos-apps-games/329648-freeotp.html"});
	},
	showEmail: function(){
		this.$.browser.call({"target": "mailto: jakuje@gmail.com"});
	},
	goBack: function() {
		this.doBack();
	},
});
