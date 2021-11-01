import State from './State.js';


export default class WorldView extends State {
	constructor(gameModel) {
		super();
		this.gameModel = gameModel;
		this.ctx = gameModel.canvasData.CTX;
		this.canvasWidth = gameModel.canvasData.CANVAS_WIDTH;
		this.canvasHeight = gameModel.canvasData.CANVAS_HEIGHT;
		this.tileMapData = gameModel.tileMapLevelData;
		this.worldImages = gameModel.worldImages;
		this.currentLevel = 1;
		
		this.player = gameModel.player;
		
		this.mapRows = gameModel.canvasData.ROWS;
		this.mapCols = gameModel.canvasData.COLS;
		this.tileSize = gameModel.canvasData.TILE_SIZE;
		this.tilesetMap = this.worldImages["tilesetMap"];
	}
	
	// startet die WorldView mit dem ersten Level
	startup() {
		if (this.currentLevel !== 1) {
			this.currentLevel = 1;
		}
		this._initLevel(1);
	}
	
	// Initieriert das jeweilige Level
	_initLevel(currentLevel) {
		if (this.currentLevel !== currentLevel) {
			this.currentLevel = currentLevel;
		}
		this._drawMap();
		this._drawPlayer();
	}
	
	// Zeichnet die Map
	_drawMap() {
		let levelMap = this.tileMapData["level" + this.currentLevel];
		for (let row = 0; row < this.mapRows; row++) {
			for (let col = 0; col < this.mapCols; col++) {
				
				let spritesInTileMap = 8;
				let tile = levelMap[row][col] - 1;
				let spriteWidth = this.tilesetMap.width / spritesInTileMap;
				let spriteHeight = this.tilesetMap.height;
				this.ctx.drawImage(this.tilesetMap,
					tile * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					col * this.tileSize,
					row * this.tileSize,
					this.tileSize,
					this.tileSize);
			}
		}
	}
	
	// zeichnet den Player
	_drawPlayer() {
		this.ctx.drawImage(this.player.playerSprites,
			this.player.tileX * this.player.spriteWidth,
			this.player.tileY * this.player.spriteHeight,
			this.player.spriteWidth,
			this.player.spriteHeight,
			this.player.x,
			this.player.y,
			this.player.w,
			this.player.h);
	}
	
	// Prueft Tasteneingaben
	getEvent(event) {
		if (this.KEY.RIGHT.includes(event.key)) {
			this.player.move("right");
		} else if (this.KEY.LEFT.includes(event.key)) {
			this.player.move("left");
		} else if (this.KEY.JUMP.includes(event.key)) {
			this.player.move("jump");
		}
		console.log(this.player.x);
	}
	
	// Updated den Canvas
	update() {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		this._drawMap();
		this._drawPlayer();
	}
	
}