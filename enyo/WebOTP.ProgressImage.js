enyo.kind({
	name: "WebOTP.ProgressImage",
	kind: "enyo.Control",
	className: "progressImage",
	published: {
		src: "images/80.png",
		size: "80",
	},
	lineWidth: 6,
	create: function() {
		this.inherited(arguments);
		this.radius = undefined;
		this.innerInitial = [];
		this.outerInitial = [];
		this.innerProgress = [];
		this.outerProgress = [];
		this.canvas = [];
		this.ctx = [];
		this.inIndex = 0;
	},
	rendered: function() {
		this.inherited(arguments);
		if (this.hasNode()) {
			var canvas = document.createElement('canvas');
			this.node.appendChild(canvas);
		}
	},
	initProgress: function(inIndex, innerInitial, outerInitial) {
		if (this.canvas[inIndex] == undefined) {
			if (this.node.firstChild) {
				this.canvas[inIndex] = this.node.firstChild;
			} else {
				this.canvas[inIndex] = document.createElement('canvas');
				this.node.appendChild(this.canvas[inIndex]);
			}
//			this.canvas[inIndex] = this.node.firstChild;
			if (typeof(G_vmlCanvasManager) !== 'undefined') {
				G_vmlCanvasManager.initElement(this.canvas[inIndex]);
			}
			this.ctx[inIndex] = this.canvas[inIndex].getContext('2d');
			this.canvas[inIndex].width = this.canvas[inIndex].height = this.size;

//			this.ctx[inIndex].translate(this.size / 2, this.size / 2); // change center
//			this.ctx[inIndex].rotate((-1 / 2 ) * Math.PI); // rotate -90 deg
		}

		this.radius = (this.size - this.lineWidth - 10) / 2;

		this.innerInitial[inIndex] = innerInitial;
		this.outerInitial[inIndex] = outerInitial;

		//this.drawCircle('#555555', null, this.radius, 80 / 100);
		//this.drawCircle(null, '#555555', this.radius - 10, 80 / 100);
	},
	clearCanvas: function() {
		this.ctx[this.inIndex].fillStyle = "white";
		this.ctx[this.inIndex].fillRect(-this.size, -this.size, 2*this.size, 2*this.size);
	},
	drawCircle: function(stroke, fill, radius, percent) {
		if (isNaN(percent))
			return;
		percent = Math.min(Math.max(0, percent || 1), 1);
		this.ctx[this.inIndex].beginPath();
		this.ctx[this.inIndex].arc(this.size/2, this.size/2, radius, 1.5 * Math.PI, (Math.PI * 2 * percent + 1.5 * Math.PI), true);
		if (stroke != null) {
			this.ctx[this.inIndex].strokeStyle = stroke;
			this.ctx[this.inIndex].lineCap = 'round'; // butt, round or square
			this.ctx[this.inIndex].lineWidth = this.lineWidth;
			this.ctx[this.inIndex].stroke();
		}
		if (fill != null) {
			this.ctx[this.inIndex].lineTo(this.size/2,this.size/2);
			this.ctx[this.inIndex].fillStyle = fill;
			this.ctx[this.inIndex].fill();
		}
	},
	updateInnerProgress: function(inIndex, remaining) {
		this.innerProgress[inIndex] = (this.innerInitial[inIndex] - remaining) / this.innerInitial[inIndex];
		this.draw(inIndex);
	},
	updateOuterProgress: function(inIndex, remaining) {
		this.outerProgress[inIndex] = (this.outerInitial[inIndex] - remaining) / this.outerInitial[inIndex];
		//this.draw(inIndex);
	},
	setInnerStart: function(inIndex, innerInitial) {
		this.innerInitial[inIndex] = innerInitial;
	},
	draw: function(inIndex){
		this.inIndex = inIndex;
		this.clearCanvas();
		if (this.outerInitial[inIndex] != 0)
			this.drawCircle('#555555', null, this.radius, this.outerProgress[inIndex]);
		if (this.innerInitial[inIndex] != 0)
			this.drawCircle(null, '#555555', this.radius - 5, this.innerProgress[inIndex]);
	},
	destroyProgress: function(inIndex) {
		this.ctx[inIndex].clearRect(-this.size, -this.size, 2*this.size, 2*this.size);
	},
	srcChanged: function(inOldValue) {
		if (this.src != ""){
			this.setStyle("background-image: url('" + this.src+"')");
		} else {
			this.setStyle(""); // fallbacks to default CSS
		}
	},
});

