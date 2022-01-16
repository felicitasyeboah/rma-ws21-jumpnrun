import GameController from './controller/GameController.js';
import {WorldView} from './views/WorldView.js';
import StartMenuView from './views/StartMenuView.js';
import HighscoreView from './views/HighscoreView.js';
import InstructionView from './views/InstructionView.js';
import {GameModel} from './models/GameModel.js';
import {Event} from "createjs-module";
import {WorldController} from "./controller/WorldController.js";
import {StartMenuController} from "./controller/StartMenuController.js";

const TILE_SIZE = 32;
const ROWS = 20; // nach unten
const COLS = 20; // nach rechts

// Breite und Höhe der nativen GameMap
const GAME_WIDTH = COLS * TILE_SIZE;
const GAME_HEIGHT = ROWS * TILE_SIZE;

// P Element um Punkte und Leben des Spielers anzuzeigen
// const P = document.createElement("p");
// P.setAttribute("style", "color:#ffffff; font-size:2.0em; position:fixed;");
// document.body.appendChild(P);

const DIV_PAUSE = document.getElementById("pause")!;
const DIV_RESTART = document.getElementById('restart')!;

// Buffer canvas: die nativen tilemapdaten werden hier rein gezeichnet
const BUFFER_CANVAS = document.createElement('canvas') as HTMLCanvasElement;
const BUFFER_CTX = BUFFER_CANVAS.getContext("2d")!;
BUFFER_CTX.imageSmoothingEnabled = false;
// Breite und Höhe der GameMap werden an das Buffer Canvas Element übergeben
BUFFER_CANVAS.width = GAME_WIDTH;
BUFFER_CANVAS.height = GAME_HEIGHT;

// HUD Canvas: dort wird das HUD rein gezeichnet
const HUD_CANVAS = document.createElement('canvas') as HTMLCanvasElement;
const HUD_CTX = HUD_CANVAS.getContext('2d')!;

HUD_CANVAS.width = GAME_WIDTH;
HUD_CANVAS.height = TILE_SIZE * 3;

// Display canvas: zum Skalieren der nativen Tilemapdaten an die Maße der jeweiligen ClientFenstergröße
const DISPLAY_CANVAS = document.getElementById("gameCanvas") as HTMLCanvasElement;
const DISPLAY_CTX = DISPLAY_CANVAS.getContext('2d')!;

DISPLAY_CTX.imageSmoothingEnabled = false; // disable ImageSmoothing damit die Sprites nicht so verwaschen aussehen...
DISPLAY_CANVAS.innerText = "Ihr Browser unterstuetzt kein Canvas Element.";

export type Canvasdata = {
    DIV_RESTART: HTMLElement,
    DIV_PAUSE: HTMLElement,
    BUFFER_CANVAS: HTMLCanvasElement,
    BUFFER_CTX: CanvasRenderingContext2D,
    HUD_CANVAS: HTMLCanvasElement,
    HUD_CTX: CanvasRenderingContext2D,
    DISPLAY_CANVAS: HTMLCanvasElement,
    DISPLAY_CTX: CanvasRenderingContext2D,
    GAME_WIDTH: number,
    GAME_HEIGHT: number,
    TILE_SIZE: number,
    ROWS: number,
    COLS: number,
    FONT: string
}
export const CANVAS_DATA: Canvasdata = {
    DIV_RESTART: DIV_RESTART,
    DIV_PAUSE: DIV_PAUSE,
    BUFFER_CANVAS: BUFFER_CANVAS,
    BUFFER_CTX: BUFFER_CTX,
    HUD_CANVAS: HUD_CANVAS,
    HUD_CTX: HUD_CTX,
    DISPLAY_CANVAS: DISPLAY_CANVAS,
    DISPLAY_CTX: DISPLAY_CTX,
    GAME_WIDTH: GAME_WIDTH,
    GAME_HEIGHT: GAME_HEIGHT,
    TILE_SIZE: TILE_SIZE,
    ROWS: ROWS, // nach unten
    COLS: COLS, // nach rechts
    FONT: "\'Press Start 2P\', cursive"
};

export type keyState = {
    right: boolean,
    left: boolean,
    jump: boolean,
    up: boolean,
    down: boolean,
    pause: boolean
    enter: boolean;
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

        // Load CollisionmapData aus JSON File
        {id: "collisionMapData", src: "map_data/collisionMapData.json", group: "tileMapLevelData"},

        // Enthält Daten für die Spritesheets
        {id: "spriteData", src: "map_data/sprite_data.json", group: "tileMapLevelData"},

        // Bilder Laden:
        // Player Spritesheet
        {id: "tilesetPlayer", src: "img/player_sprite.png"},

        // Tilemap Spritesheet
        {id: "tilesetMap", src: "img/tileset_64x512.png"},

        // Background Game
        {id: "background", src: "img/background.png"},


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
        'world': new WorldView(gameModel),
        'startMenu': new StartMenuView(gameModel),
        'highscore': new HighscoreView(gameModel),
        'instruction': new InstructionView(gameModel)
    };

    /* Controller */
    const CONTROLLER_DATA = {
        'world': new WorldController(gameModel, STATE_DATA.world),
        'startMenu': new StartMenuController(gameModel, STATE_DATA.startMenu),
        'highscore': new WorldController(gameModel, STATE_DATA.world),
        'instruction': new WorldController(gameModel, STATE_DATA.world)
    }

    /* View wird anhand des aktuellen States initialisiert in der GameController Klasse */
    const gameController = new GameController(gameModel, STATE_DATA, 'startMenu', CONTROLLER_DATA);

    // GameController startet die Hauptspielschleife
    gameController.mainGameLoop(0);
}

window.addEventListener('load', (event) => {
    loadEntities();
});



