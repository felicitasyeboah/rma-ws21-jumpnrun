import GameController from './controller/GameController.js';
import {WorldView} from './views/WorldView.js';
import StartMenuView from './views/StartMenuView.js';
import HighscoreView from './views/HighscoreView.js';
import InstructionView from './views/InstructionView.js';
import {GameModel} from './models/GameModel.js';
import {Event} from "createjs-module";
import {WorldController} from "./controller/WorldController.js";
import {StartMenuController} from "./controller/StartMenuController.js";
import {HighscoreController} from "./controller/HighscoreController.js";
import {CANVAS_DATA} from "./canvas_config.js";
import {InstructionController} from "./controller/InstructionController.js";


let collisionMapData = {};
let spriteData = {};
let playerData: any;
let tileMapLevelData: { [key: string]: number[][] } = {};
let worldImages: { [key: string]: string } = {};

// Laden der Entitaeten

function loadEntities() {
    let preload = new createjs.LoadQueue(false);
    preload.addEventListener("fileload", handleFileload);
    preload.addEventListener("complete", startGame);
    preload.loadManifest(([
        // Tilemapdaten Laden aus CSV-Dateien
        {id: "level1", src: "map_data/level01.csv", group: "tileMapLevelData"},
        {id: "level2", src: "map_data/level02.csv", group: "tileMapLevelData"},
        {id: "level3", src: "map_data/level03.csv", group: "tileMapLevelData"},

        // Load CollisionmapData aus JSON File
        {id: "collisionMapData", src: "map_data/collisionMapData.json", group: "tileMapLevelData"},

        // Enthält Daten für die Spritesheets
        {id: "spriteData", src: "map_data/sprite_data.json", group: "tileMapLevelData"},
        {id: "playerData", src: "map_data/player_data.json", group: "tileMapLevelData"},

        // Bilder Laden:
        // Player Spritesheet
        {id: "tilesetPlayer", src: "img/player_sprite.png"},

        // Tilemap Spritesheet
        {id: "tilesetMap", src: "img/tileset_ice.png"},

        // Background Game
        {id: "background", src: "img/background.png"},
        {id: "backgroundInstruction", src: "img/background_instruction.png"},

        // Sounds laden
        // {id: "fx_coin", src: "fx/coin.wav"},
        // {id: "fx_game_over", src: "fx/game_over.wav"},
        // {id: "fx_jump", src: "fx/jump.wav"},
        // {id: "fx_bg_music", src: "fx/music.wav"},
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
    }
    if (event.item.type === "json") {
        if (event.item.id == "collisionMapData") {
            collisionMapData = event.result;
        }
        if (event.item.id == "spriteData") {
            spriteData = event.result;
        }
        if (event.item.id == "playerData") {
            playerData = event.result;
        }
    }
}

/**
 * Spiel wird gestart, Model, Views und Controller werden instanziiert
 */
function startGame() {

    /* Model */
    const gameModel = new GameModel(tileMapLevelData, worldImages, collisionMapData, spriteData, playerData);

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
        'highscore': new HighscoreController(gameModel, STATE_DATA.highscore),
        'instruction': new InstructionController(gameModel, STATE_DATA.instruction)
    }

    /* View wird anhand des aktuellen States initialisiert in der GameController Klasse */
    const gameController = new GameController(gameModel, STATE_DATA, 'startMenu', CONTROLLER_DATA);

    // GameController startet die Hauptspielschleife
    gameController.mainGameLoop(0);
}

window.addEventListener('load', (event) => {
    loadEntities();
});



