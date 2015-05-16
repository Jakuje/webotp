enyo.kind({
	name: "WebOTP.ProgressTimer",
	kind: "enyo.Component",
	events: {
		"onUpdate": "",
	},
	/*endTime: [],
	callbacks: [],
	handle: 0,*/
	create: function() {
		this.inherited(arguments);
		this.endTime = [];
		this.callbacks = [];
		this.handle = 0;
	},
	start: function(inIndex, inInterval, inCallback) {
		this.endTime[inIndex] = new Date().getTime() + inInterval*1000;
		this.callbacks[inIndex] = inCallback;
		this.doUpdate(inInterval, inIndex);
		if (! this.handle) {
			this.handle = window.setInterval(enyo.bind(this, "update"), 500);
		}
	},
	stop: function(inIndex) {
		this.endTime[inIndex] = undefined;
		var empty = true;
		for (var i=0;i < this.endTime.length;i++) {
			if (this.endTime[i] != undefined) {
				empty = false;
			}
		}
		if (empty && this.handle != 0) {
			window.clearInterval(this.handle);
			this.handle = 0;
		}
		//this.doUpdate("", inIndex);
		if (this.callbacks[inIndex] != undefined) {
			this.callbacks[inIndex](null, inIndex);
		}
	},
	getRemaining: function(inIndex){
		return this.endTime[inIndex] - new Date().getTime();
	},
	update: function() {
		for(var i = 0; i < this.endTime.length; i++){
			if (this.endTime[i]) {
				var remains = this.endTime[i] - new Date().getTime();
				if (remains > 0){
					this.doUpdate(remains/1000, i);
				} else {
					this.stop(i);
				}
			}
		}
	},
});

