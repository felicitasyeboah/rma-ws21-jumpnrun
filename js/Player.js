export default class Player {
	constructor(gameModel) {
		this.gameModel = gameModel;
		this._playerSprites = gameModel.worldImages["tilesetPlayer"];
		this._colsInSpritesheet = 11;
		this._rowsInSpritesheet = 2;
		this._spriteWidth = this._playerSprites.width / this._colsInSpritesheet;
		this._spriteHeight = this._playerSprites.height / this._rowsInSpritesheet;
		
		this._tileX = 0;
		this._tileY = 0
		this._maxTileX = this._colsInSpritesheet - 1; // -1 weil das letzte Sprite vom Ende des vorletezen
													  // Sprite-width/-height berechnet wird
		this._maxTileY = (this._playerSprites.height / this._spriteHeight) - 1;
		
		this._w = gameModel.canvasData.TILE_SIZE;
		this._h = gameModel.canvasData.TILE_SIZE / this._spriteWidth * this._spriteHeight
		this._x = gameModel.canvasData.TILE_SIZE;
		this._y = gameModel.canvasData.CANVAS_HEIGHT - gameModel.canvasData.TILE_SIZE - this._h;
		
		this._velocity = 2;
		
		this.timeSinceMove = 0;
		this.moveIntervall = 10;
	}
	
	// Könnte auch als Update-Funktion bezeichnet werden...
	// Udpated Playerposition
	move(playerDirection) {
		switch (playerDirection) {
			case "right":
				this._tileY = 0
				this._x += this._velocity;
				this.timeSinceMove += this.gameModel.deltatime;
				if (this.timeSinceMove > this.moveIntervall) {
					if (this._tileX >= this._maxTileX) this._tileX = 0;
					else this._tileX++;
					this.timeSinceMove = 0;
				}
				break;
			case "left":
				this._tileY = 1;
				this._x -= this._velocity;
				if (this._tileX >= this._maxTileX) this._tileX = 0;
				else this._tileX++;
				
				break;
			case "jump":
				break;
		}
		// PlayerSprites durchlaufen
		//((player.sx < 3) && (player.moveUp || player.moveDown || player.moveLeft || player.moveRight) &&
		// (switchSprite)) ? player.sx++ : player.sx = 0;
	}
	
	update() {
		
		//ctx.fillStyle = "blue";
		//ctx.fillRect(this.x, this.y, this.w, this.h);
		
	}
	
	// Getter and Setters
	
	setPos(x, y) {
		this._x = x;
		this._y = y;
	}
	
	getPos() {
		let pos = {x: 0, y: 0}
		pos.x = this._x;
		pos.y = this._y;
		return pos;
	}
	
	setPlayerX(x) {
		this._x = x;
	}
	
	setPlayerY(y) {
		this._y = y;
	}
	
	getWidth() {
		return this._w;
	}
	
	getHeight() {
		return this._h;
	}
	
	get playerSprites() {
		return this._playerSprites;
	}
	
	get colsInSpritesheet() {
		return this._colsInSpritesheet;
	}
	
	get rowsInSpritesheet() {
		return this._rowsInSpritesheet;
	}
	
	get spriteWidth() {
		return this._spriteWidth;
	}
	
	get spriteHeight() {
		return this._spriteHeight;
	}
	
	get w() {
		return this._w;
	}
	
	get h() {
		return this._h;
	}
	
	get x() {
		return this._x;
	}
	
	get y() {
		return this._y;
	}
	
	get velocity() {
		return this._velocity;
	}
	
	
	get tileX() {
		return this._tileX;
	}
	
	get tileY() {
		return this._tileY;
	}
	
	get maxTileX() {
		return this._maxTileX;
	}
	
	get maxTileY() {
		return this._maxTileY;
	}
}
