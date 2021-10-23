import GameController from './GameController.js';
import World from './World.js';

function initApp() {
	//// Konstanten und Globale Spielvariablen \\\\
	const CANVAS = document.getElementById("gameCanvas");
	const CTX = CANVAS.getContext("2d")
	CANVAS.innerText = "Ihr Browser unterstuetzt kein Canvas Element.";
	const CANVAS_WIDTH = CANVAS.width;
	const CANVAS_HEIGHT = CANVAS.height;
	const TILE_SIZE = 32;
	const ROWS = CANVAS_HEIGHT / TILE_SIZE; // nach unten
	const COLS = CANVAS_WIDTH / TILE_SIZE; // nach rechts
	
	const canvasData = {
		CANVAS: CANVAS,
		CTX: CTX,
		CANVAS_WIDTH: CANVAS_WIDTH,
		CANVAS_HEIGHT: CANVAS_HEIGHT,
		TILE_SIZE: TILE_SIZE,
		ROWS: ROWS, // nach unten
		COLS: COLS // nach rechts
	};
	
	//requestAnimationFrame(initApp);
	// Laden der Entitaeten
	
	function loadImage(src) {
		let img = new Image();
		img.src = src;
		return img;
	}
	
	//let tileImages = [
	//	{id: "tile1", src: "img/chocoCenter.png", group: "tiles"},
	//	{id: "tile2", src: "img/chocoMid.png", group: "tiles"}];
	
	let preload = new createjs.LoadQueue(false);
	preload.addEventListener("fileload", handleFileload);
	preload.addEventListener("complete", handleComplete);
	preload.loadManifest(([
		//// Tilemapdaten Laden aus CSV-Dateien
		{id: "level1", src: "map_data/tilemap_level1.csv", group: "tileMapLevelData"},
		{id: "level2", src: "map_data/tilemap_level2.csv", group: "tileMapLevelData"},
		{id: "level3", src: "map_data/tilemap_level3.csv", group: "tileMapLevelData"},
		{id: "level4", src: "map_data/tilemap_level4.csv", group: "tileMapLevelData"},
		{id: "level5", src: "map_data/tilemap_level5.csv", group: "tileMapLevelData"},
		{id: "level6", src: "map_data/tilemap_level6.csv", group: "tileMapLevelData"},
		{id: "level7", src: "map_data/tilemap_level7.csv", group: "tileMapLevelData"},
		
		//// Bilder Laden \\\\
		/// Tilemap-Sheet \\\\
		/*		{id: "tile1", src: "img/chocoCenter.png", group: "tileMapDataImages"},
				{id: "tile2", src: "img/chocoMid.png", group: "tileMapDataImages"},
				{id: "tile3", src: "img/slimeGreen.png", group: "tileMapDataImages"},
				{id: "tile4", src: "img/chocoHalfAlt40px.png", group: "tileMapDataImages"},
				{id: "tile5", src: "img/chocoHalfAlt40px.png", group: "tileMapDataImages"},
				{id: "tile6", src: "img/liquidWaterTop_mid45px.png", group: "tileMapDataImages"},
				{id: "tile7", src: "img/coinGold.png", group: "tileMapDataImages"},
				{id: "tile7", src: "img/coinGold.png", group: "tileMapDataImages"},
				{id: "tile8", src: "img/exit.png", group: "tileMapDataImages"},*/
		{id: "tilemap", src: "img/tileset_map.png"},
		
		//// Player Spritesheet \\\\
		{id: "player", src: "img/player_sprite.png"},
		
		
		//// Sounds laden \\\\
	
	
	]));
	
	let tileMapLevelData = {};
	let worldImages = {};
	
	function handleFileload(event) {
		if (event.item.ext === "csv") {
			var mapData = [];
			let getRows = event.result.split(/\r?\n/);
			for (let row = 0; row < canvasData.ROWS; row++) {
				mapData.push(getRows[row].split(','));
				for (let col = 0; col < canvasData.COLS; col++) {
					mapData[row][col] = parseInt(mapData[row][col]) + 1;
				}
			}
			tileMapLevelData[event.item.id] = mapData;
		}
		if (event.item.type === "image") {
			worldImages[event.item.id] = event.result;
		}
	}
	
	function handleComplete() {
		
		let stateData = {
			'world': new World(canvasData, tileMapLevelData, worldImages)
		};
		const APP = new GameController(stateData, 'world');
		APP.mainGameLoop();
	}
}

window.addEventListener('load', (event) => {
	initApp();
})