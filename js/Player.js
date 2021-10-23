export default class Player {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		
		//this.graphics.beginFill("blue").drawRect((CANVAS_WIDTH/2)-(this.w/2),(CANVAS_HEIGHT)-(this.h),this.w,this.h);
	}
	
	setPos(x, y) {
		this.x = x;
		this.y = y;
	}
	
	getPos() {
		let pos = {x: 0, y: 0}
		pos.x = this.x;
		pos.y = this.y;
		return pos;
	}
	
	getWidth() {
		return this.w;
	}
	
	getHeight() {
		return this.h;
	}
	
	update() {
		//ctx.fillStyle = "blue";
		//ctx.fillRect(this.x, this.y, this.w, this.h);
		
	}
	
}
