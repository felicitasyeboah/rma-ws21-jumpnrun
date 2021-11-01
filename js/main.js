import StateController from './StateController.js';
import WorldView from './WorldView.js';
import StartmenuView from './StartmenuView.js';
import HighscoreView from './HighscoreView.js';
import InstructionView from './InstructionView.js';
import GameModel from './GameModel.js';

const CANVAS = document.getElementById("gameCanvas");
const CTX = CANVAS.getContext("2d");
CTX.imageSmoothingEnabled = false; // disable ImageSmoothing damit die Sprites nicht so verwaschen aussehen...
CANVAS.innerText = "Ihr Browser unterstuetzt kein Canvas Element.";

const CANVAS_WIDTH = CANVAS.width;
const CANVAS_HEIGHT = CANVAS.height;
const TILE_SIZE = 32;
const ROWS = CANVAS_HEIGHT / TILE_SIZE; // nach unten
const COLS = CANVAS_WIDTH / TILE_SIZE; // nach rechts
const CANVAS_DATA = {
	CANVAS: CANVAS,
	CTX: CTX,
	CANVAS_WIDTH: CANVAS_WIDTH,
	CANVAS_HEIGHT: CANVAS_HEIGHT,
	TILE_SIZE: TILE_SIZE,
	ROWS: ROWS, // nach unten
	COLS: COLS // nach rechts
};
let tileMapLevelData = {};
let worldImages = {};

function loadEntities() {
// Laden der Entitaeten
	let preload = new createjs.LoadQueue(false);
	preload.addEventListener("fileload", handleFileload);
	preload.addEventListener("complete", startGame);
	preload.loadManifest(([
		// Tilemapdaten Laden aus CSV-Dateien
		{id: "level1", src: "map_data/tilemap_level1.csv", group: "this.tileMapLevelData"},
		{id: "level2", src: "map_data/tilemap_level2.csv", group: "this.tileMapLevelData"},
		{id: "level3", src: "map_data/tilemap_level3.csv", group: "this.tileMapLevelData"},
		{id: "level4", src: "map_data/tilemap_level4.csv", group: "this.tileMapLevelData"},
		{id: "level5", src: "map_data/tilemap_level5.csv", group: "this.tileMapLevelData"},
		{id: "level6", src: "map_data/tilemap_level6.csv", group: "this.tileMapLevelData"},
		{id: "level7", src: "map_data/tilemap_level7.csv", group: "this.tileMapLevelData"},
		
		// Bilder Laden:
		// Tilemap-Sheet
		{id: "tilesetMap", src: "img/tileset_map.png"},
		
		// Player Spritesheet
		{id: "tilesetPlayer", src: "img/player_sprite.png"},
		
		//TODO: // Sounds laden
	
	]));
}

// das passiert mit einer Datei, wenn Sie geladen wird...
function handleFileload(event) {
	if (event.item.ext === "csv") {
		let mapData = [];
		let getRows = event.result.split(/\r?\n/);
		for (let row = 0; row < CANVAS_DATA.ROWS; row++) {
			mapData.push(getRows[row].split(','));
			for (let col = 0; col < CANVAS_DATA.COLS; col++) {
				mapData[row][col] = parseInt(mapData[row][col]) + 1;
			}
		}
		tileMapLevelData[event.item.id] = mapData;
	}
	if (event.item.type === "image") {
		worldImages[event.item.id] = event.result;
	}
	console.log(tileMapLevelData);
}

// Spiel wird gestart, Model, Views und Controller werden inittialisert
function startGame() {
	/* Model */
	const gameModel = new GameModel(CANVAS_DATA, tileMapLevelData, worldImages);
	
	/* Views */
	const STATE_DATA = {
		'worldView': new WorldView(gameModel),
		'startmenuView': new StartmenuView(gameModel),
		'highscoreView': new HighscoreView(gameModel),
		'instructionView': new InstructionView(gameModel)
		
	};
	
	/* Controller */
	const controller = new StateController(gameModel, STATE_DATA); /* View wird anhand des aktuellen States initialisiert in der Controller Klasse */
	// Controller startet die Hauptspielschleife
	controller.mainGameLoop(0);
	
}

window.addEventListener('load', (event) => {
	loadEntities();
});

