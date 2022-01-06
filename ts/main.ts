// <reference path="../node_modules/createjs-module/createjs.d.ts"/>
import StateController from './controller/StateController.js';
import {WorldView} from './views/WorldView.js';
import StartmenuView from './views/StartmenuView.js';
import HighscoreView from './views/HighscoreView.js';
import InstructionView from './views/InstructionView.js';
import {GameModel} from './models/GameModel.js';
import {Event} from "createjs-module";
//import * as createjs from 'createjs-module';

const TILE_SIZE = 32;
const ROWS = 20; // nach unten
const COLS = 20; // nach rechts

// Breite und Höhe der nativen GameMap
const GAME_WIDTH = COLS * TILE_SIZE;
const GAME_HEIGHT = ROWS * TILE_SIZE;

// Buffer canvas: die nativen tilemapdaten werden hier rein geladen
const BUFFER_CANVAS = document.createElement('canvas') as HTMLCanvasElement;
const BUFFER_CTX = BUFFER_CANVAS.getContext("2d")!;

// Breite und Höhe der GameMap werden an das Buffer Canvas Element übergeben
BUFFER_CANVAS.width = GAME_WIDTH;
BUFFER_CANVAS.height = GAME_HEIGHT;

// Display canvas: zum Skalieren der nativen Tilemapdaten an die Maße der jeweiligen ClientFenstergröße
const DISPLAY_CANVAS = document.getElementById("gameCanvas") as HTMLCanvasElement;
const DISPLAY_CTX = DISPLAY_CANVAS.getContext('2d')!;

DISPLAY_CTX.imageSmoothingEnabled = false; // disable ImageSmoothing damit die Sprites nicht so verwaschen aussehen...
DISPLAY_CANVAS.innerText = "Ihr Browser unterstuetzt kein Canvas Element.";

export type Canvasdata = {
    BUFFER_CANVAS: HTMLCanvasElement,
    BUFFER_CTX: CanvasRenderingContext2D,
    DISPLAY_CANVAS: HTMLCanvasElement,
    DISPLAY_CTX: CanvasRenderingContext2D,
    GAME_WIDTH: number,
    GAME_HEIGHT: number,
    TILE_SIZE: number,
    ROWS: number,
    COLS: number
}
const CANVAS_DATA: Canvasdata = {
    BUFFER_CANVAS: BUFFER_CANVAS,
    BUFFER_CTX: BUFFER_CTX,
    DISPLAY_CANVAS: DISPLAY_CANVAS,
    DISPLAY_CTX: DISPLAY_CTX,
    GAME_WIDTH: GAME_WIDTH,
    GAME_HEIGHT: GAME_HEIGHT,
    TILE_SIZE: TILE_SIZE,
    ROWS: ROWS, // nach unten
    COLS: COLS // nach rechts
};

export type keyState = {
    right: boolean,
    left: boolean,
    jump: boolean,
}
let collisionMapData = {}; //cmd;
let spriteData = {};
let tileMapLevelData: { [key: string]: number[][] } = {};
let worldImages: { [key: string]: string } = {};

function loadEntities() {
// Laden der Entitaeten
    let preload = new createjs.LoadQueue(false);
    preload.addEventListener("fileload", handleFileload);
    preload.addEventListener("complete", startGame);
    preload.loadManifest(([
        // Tilemapdaten Laden aus CSV-Dateien
        {id: "level1", src: "map_data/tilemap_level1.csv", group: "tileMapLevelData"},
        {id: "level2", src: "map_data/tilemap_level2.csv", group: "tileMapLevelData"},
        {id: "level3", src: "map_data/tilemap_level3.csv", group: "tileMapLevelData"},
        {id: "level4", src: "map_data/tilemap_level4.csv", group: "tileMapLevelData"},
        {id: "level5", src: "map_data/tilemap_level5.csv", group: "tileMapLevelData"},
        {id: "level6", src: "map_data/tilemap_level6.csv", group: "tileMapLevelData"},
        {id: "level7", src: "map_data/tilemap_level7.csv", group: "tileMapLevelData"},

        //Load CollisionmapData aus JSON File
        {id: "collisionMapData", src: "map_data/collisionMapData.json", group: "tileMapLevelData"},
        {id: "spriteData", src: "map_data/sprite_Data.json", group: "tileMapLevelData"},

        // Bilder Laden:
        // Player Spritesheet
        {id: "tilesetPlayer", src: "img/player_sprite.png"},

        // Tilemap-Sheet
        {id: "tilesetMap", src: "img/tileset_64x512.png"},


        //TODO: // Sounds laden

    ]));
}

// das passiert mit einer Datei, wenn Sie geladen wird...
function handleFileload(event: Event) {
    if (event.item.ext === "csv") {
        let mapDataAsString: string[][] = [];
        let mapData: number[][] = [];
        let getRows = event.result.split(/\r?\n/);
        for (let row = 0; row < CANVAS_DATA.ROWS; row++) {
            mapData[row] = [];
            mapDataAsString.push(getRows[row].split(','));
            for (let col = 0; col < CANVAS_DATA.COLS; col++) {
                mapData[row][col] = parseInt(mapDataAsString[row][col]);
            }
        }
        tileMapLevelData[event.item.id] = mapData;
    }
    if (event.item.type === "image") {
        worldImages[event.item.id] = event.result;
        console.log(worldImages);
    }
    if (event.item.type === "json") {
        if (event.item.id == "collisionMapData") {
            collisionMapData = event.result;
        }
        if (event.item.id == "spriteData") {
            spriteData = event.result;
        }
    }
}

/**
 * Spiel wird gestart, Model, Views und Controller werden instanziiert
 */
function startGame() {
    /* Model */
    const gameModel = new GameModel(CANVAS_DATA, tileMapLevelData, worldImages, collisionMapData, spriteData);

    /* Views */
    const STATE_DATA = {
        'worldView': new WorldView(gameModel),
        'startmenuView': new StartmenuView(gameModel),
        'highscoreView': new HighscoreView(gameModel),
        'instructionView': new InstructionView(gameModel)
    };

    /* Controller */

    /* View wird anhand des aktuellen States initialisiert in der StateController Klasse */
    const stateController = new StateController(gameModel, STATE_DATA);
    // StateController startet die Hauptspielschleife
    stateController.mainGameLoop(0);
}

window.addEventListener('load', (event) => {
    loadEntities();
});



