import Player from './Player.js';

export default class GameModel {
	constructor(canvasData, tileMapLevelData, worldImages) {
		console.log("model initiiert");
		this.canvasData = canvasData;
		this.startStateName = 'worldView';
		this.tileMapLevelData = tileMapLevelData;
		this.worldImages = worldImages;
		this._deltatime = 0;
		this.player = new Player(this);
	}
	
	getHighscore() {
		console.log("Das ist dein Highscore.");
	}
	
	setHighscore(name, punkte) {
		console.log("Name: " + name, "Punkte: " + punkte);
	}
	
	get deltatime() {
		return this._deltatime;
	}
	
	set deltatime(value) {
		this._deltatime = value;
	}
}
