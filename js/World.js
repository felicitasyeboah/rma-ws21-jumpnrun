import State from './State.js';
import Player from './Player.js';

export default class World extends State {
	constructor(canvas, tileMapLevelData, worldImages) {
		super();
		this.canvas = canvas;
		this.tileMapData = tileMapLevelData;
		this.worldImages = worldImages;
		this.currentLevel = 1;
	}
	
	startup() {
		if (this.currentLevel !== 1) {
			this.currentLevel = 1;
		}
		this._initLevel(1);
		//this.display = new View();
		//this.display.drawWorld();
	}
	
	_initLevel(currentLevel) {
		if (this.currentLevel !== currentLevel) {
			this.currentLevel = currentLevel;
		}
		let levelMap = this.tileMapData["level" + this.currentLevel];
		for (let row = 0; row < this.canvas.ROWS; row++) {
			for (let col = 0; col < this.canvas.COLS; col++) {
				
				let tileMap = this.worldImages["tilemap"];
				let spritesInTileMap = 8;
				let tile = levelMap[row][col] - 1;
				let spriteWidth = tileMap.width / spritesInTileMap;
				let spriteHeight = tileMap.height;
				this.canvas.CTX.drawImage(tileMap,
					tile * spriteWidth,
					0,
					spriteWidth,
					spriteHeight,
					col * this.canvas.TILE_SIZE,
					row * this.canvas.TILE_SIZE,
					this.canvas.TILE_SIZE,
					this.canvas.TILE_SIZE);
				
				
			}
		}
		let playerSprites = this.worldImages["player"];
		let spritesInSpritesheet = 11;
		let spriteWidth = playerSprites.width / spritesInSpritesheet;
		let spriteHeight = playerSprites.height;
		let player = new Player(32, 511, this.canvas.TILE_SIZE, this.canvas.TILE_SIZE / spriteWidth * spriteHeight);
		this.canvas.CTX.drawImage(playerSprites,
			0,
			0,
			spriteWidth,
			spriteHeight,
			this.canvas.TILE_SIZE,
			this.canvas.CANVAS_HEIGHT - (2.4 * this.canvas.TILE_SIZE), //TODO: zahl genralisieren
			player.getWidth(),
			player.getHeight());
	}
	
	update() {
	
	}
	
	getLevel() {
	}
}