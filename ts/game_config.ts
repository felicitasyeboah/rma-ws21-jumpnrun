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
const DIV_WRAPPER = document.getElementById('wrapper')!;

const DIV_PAUSE = document.getElementById("pause")!;
const DIV_RESTART = document.getElementById('restart')!;
const DIV_HIGHSCORE = document.getElementById('highscore')!;
const DIV_NEW_HIGHSCORE = document.getElementById('new_highscore')!;
const DIV_GAME_OVER = document.getElementById('gameover')!;

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
    DIV_WRAPPER: HTMLElement,
    DIV_GAME_OVER: HTMLElement,
    DIV_NEW_HIGHSCORE: HTMLElement,
    DIV_HIGHSCORE: HTMLElement,
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
    DIV_WRAPPER: DIV_WRAPPER,
    DIV_GAME_OVER: DIV_GAME_OVER,
    DIV_NEW_HIGHSCORE: DIV_NEW_HIGHSCORE,
    DIV_HIGHSCORE: DIV_HIGHSCORE,
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