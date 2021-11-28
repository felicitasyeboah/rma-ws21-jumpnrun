// <reference path="../node_modules/createjs-module/createjs.d.ts"/>
import StateController from './StateController.js';
import {WorldView} from './WorldView.js';
import StartmenuView from './StartmenuView.js';
import HighscoreView from './HighscoreView.js';
import InstructionView from './InstructionView.js';
import {GameModel} from './GameModel.js';
//import * as createjs from 'createjs-module';
const CANVAS = document.getElementById("gameCanvas") as HTMLCanvasElement;
const CTX = CANVAS.getContext("2d")!;
CTX.imageSmoothingEnabled = false; // disable ImageSmoothing damit die Sprites nicht so verwaschen aussehen...
CANVAS.innerText = "Ihr Browser unterstuetzt kein Canvas Element.";

const CANVAS_WIDTH = CANVAS.width;
const CANVAS_HEIGHT = CANVAS.height;
const TILE_SIZE = 32;
const ROWS = CANVAS_HEIGHT / TILE_SIZE; // nach unten
const COLS = CANVAS_WIDTH / TILE_SIZE; // nach rechts
export type Canvasdata = {
    CANVAS: HTMLCanvasElement,
    CTX: CanvasRenderingContext2D,
    CANVAS_WIDTH: number,
    CANVAS_HEIGHT: number,
    TILE_SIZE: number,
    ROWS: number,
    COLS: number
}
const CANVAS_DATA: Canvasdata = {
    CANVAS: CANVAS,
    CTX: CTX,
    CANVAS_WIDTH: CANVAS_WIDTH,
    CANVAS_HEIGHT: CANVAS_HEIGHT,
    TILE_SIZE: TILE_SIZE,
    ROWS: ROWS, // nach unten
    COLS: COLS // nach rechts
};

export type keyState = {
    right: boolean,
    left: boolean,
    jump: boolean,
}
let tileMapLevelData: { [key: string]: number[][] } = {};
let worldImages: { [key: string]: string } = {};

let collisionMap1 = [
    0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 0,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 8,
    9, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 5, 8,
    9, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 11, 0, 0, 0, 0, 0, 5, 7, 0,
    9, 0, 0, 0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 7, 0, 0, 0,
    9, 0, 0, 5, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0,
    4, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]
//9 = c_right, 8 = c_left, 7 = c_top, 6 = c_bottom
//5 = c_top_left, 4 = c_top_right, 3 = top_left_right
//2 = coin_collect 1 = water_die, 11 = top_left_right_bottom

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
        // Player Spritesheet
        {id: "tilesetPlayer", src: "img/player_sprite.png"},

        // Tilemap-Sheet
        {id: "tilesetMap", src: "img/tileset_map.png"},


        //TODO: // Sounds laden

    ]));
}

//{ item: { ext: string; id: string; type: string; }; result: string; }
// das passiert mit einer Datei, wenn Sie geladen wird...
function handleFileload(event: { item: { ext: string; id: string | number; type: string; }; result: string; }) {
    if (event.item.ext === "csv") {
        let mapDataAsString: string[][] = [];
        let mapData: number[][] = [];
        let getRows = event.result.split(/\r?\n/);
        for (let row = 0; row < CANVAS_DATA.ROWS; row++) {
            mapData[row] = [];
            mapDataAsString.push(getRows[row].split(','));
            for (let col = 0; col < CANVAS_DATA.COLS; col++) {
                mapData[row][col] = parseInt(mapDataAsString[row][col]) + 1;
            }
        }
        tileMapLevelData[event.item.id] = mapData;
    }
    if (event.item.type === "image") {
        worldImages[event.item.id] = event.result;
    }
    console.log(worldImages["tilesetPlayer"]);
}

// Spiel wird gestart, Model, Views und Controller werden instanziiert
function startGame() {
    /* Model */
    const gameModel = new GameModel(CANVAS_DATA, tileMapLevelData, worldImages, collisionMap1);

    /* Views */
    const STATE_DATA = {
        'worldView': new WorldView(gameModel),
        'startmenuView': new StartmenuView(gameModel),
        'highscoreView': new HighscoreView(gameModel),
        'instructionView': new InstructionView(gameModel)
    };

    /* Controller */
    const stateController = new StateController(gameModel, STATE_DATA); /* View wird anhand des aktuellen States initialisiert in der Controller Klasse */
    // Controller startet die Hauptspielschleife
    stateController.mainGameLoop(0);

}

window.addEventListener('load', (event) => {
    loadEntities();
});

