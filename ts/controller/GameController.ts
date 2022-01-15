import {GameModel} from "../models/GameModel.js";

/**
 * Der Gamecontroller startet den Gameloop. Er registriert Eventlistener und wechselt zwischen den einzelnen
 * Views/Zustaenden. Er sammelt die Updates der Views und dessen Controller und updated alles zusammen in der Gameloop
 *
 */
export default class GameController {
    private timer: number;
    private interval: number;
    private lastTime: number;
    private stateData: { [p: string]: {}; } | undefined;
    private stateName: string | undefined;
    private gameModel: GameModel;
    private state: any;
    private controllerData: any;
    private stateController: any;

    constructor(gameModel: GameModel, stateData: { [key: string]: {} }, startStateName: string, controllerData: { [key: string]: {} }) {
        this.timer = 0;
        this.interval = 1000 / 60;
        this.lastTime = 0;
        this.gameModel = gameModel;
        this.stateData = stateData;
        this.stateName = startStateName;
        this.controllerData = controllerData;

        //Es wird eins der View-Objekte zugewiesen (world, startmenu etc.)
        this.state = this.stateData[this.stateName];

        //Es wird eins der Controller-Objekte zugewiesen (world, startmenu etc.)
        this.stateController = this.controllerData[this.stateName];

        this.setupStates();
    }

    private setupStates() {
        this.state.startup();
        this.registerEvents();
        this.handleResize(); // First draw
    }

    /**
     * Wechselt die Ansicht/den Zustand
     */
    private flipState() {
        this.state.done = false;
        let previous = this.stateName;
        this.stateName = this.state.next;
        this.state.cleanup();
        this.state = this.stateData![this.stateName!];
        this.stateController = this.controllerData![this.stateName!];
        this.state.startup();
        this.state.previous = previous;
    }

    /**
     * Vereint updates von Views, Controllern, updated die Skalierung von  BufferCanvas auf des DisplayCanvas
     */
    private update() {

            // wenn in der Wordlview auf Pause gedrueckt wird, werden die update der Views und Controller ausgesetzt,
            // Es wird nur das letzte Standbild aus dem Buffercanvas neugerendert. Dadurch wird auf dem Canvas auch beim
            // Resizen des Browsers etwas dargestellt
            if (this.stateName === "world" && this.gameModel.keyState.pause) {
                this.renderDisplay();
                return;
            }

            // wenn eine View den Status beendet einnimmt
            if (this.state.done) {
                this.flipState();
            }
            this.stateController.update();
            this.state.update();
            this.renderDisplay();
    }

    // skaliert den Buffercanvas auf den tatsechlichen Canvas (DISPLAY_CANVAS)
    private renderDisplay() {
        this.gameModel.canvasData.DISPLAY_CTX.drawImage(
            this.gameModel.canvasData.BUFFER_CANVAS,
            0,
            0,
            this.gameModel.canvasData.BUFFER_CANVAS.width,
            this.gameModel.canvasData.BUFFER_CANVAS.height,
            0,
            0,
            this.gameModel.canvasData.DISPLAY_CANVAS.width,
            this.gameModel.canvasData.DISPLAY_CANVAS.height);
    }

    // Passt die Groeße des Canvas beim Resizen waehrend des Spiels an die Groeße des Browserfensters an
    private handleResize() {
        // Hoehe und Breite des Browserfensters holen
        let height = document.documentElement.clientHeight;
        let width = document.documentElement.clientWidth;

        // Canvas-Breite proportional zur Breite des Browserfesnters berechnen
        this.gameModel.canvasData.DISPLAY_CANVAS.width = Math.floor(width / this.gameModel.canvasData.TILE_SIZE) * this.gameModel.canvasData.TILE_SIZE;

        // wenn der Canvas danach breiter ist als der Browser hoch,
        // dann wird die Breite des Canvas noch proportional an die Hoehe des Fensters angepasst.
        if (this.gameModel.canvasData.DISPLAY_CANVAS.width > height) {
            this.gameModel.canvasData.DISPLAY_CANVAS.width = Math.floor(height / this.gameModel.canvasData.TILE_SIZE) * this.gameModel.canvasData.TILE_SIZE;
        }
        /* Berechnung proportionalen Höhe nicht noetig, da dieser Canvas quadtratisch ist.....
        this.gameModel.canvasData.DISPLAY_CANVAS.height = this.gameModel.canvasData.DISPLAY_CANVAS.width * (this.gameModel.canvasData.GAME_HEIGHT / this.gameModel.canvasData.GAME_WIDTH);
        */
        // Da Canvas quadratisch, Hoehe = Breite setzen
        this.gameModel.canvasData.DISPLAY_CANVAS.height = this.gameModel.canvasData.DISPLAY_CANVAS.width;

        //TODO: wenn doch nicht mehr benötigt, rausnehmen:

        // let rectangle = this.gameModel.canvasData.DISPLAY_CANVAS.getBoundingClientRect();
        //
        // this.gameModel.canvasData.P.style.left = rectangle.left + "px";
        // this.gameModel.canvasData.P.style.top = rectangle.top + "px";
        // this.gameModel.canvasData.P.style.fontSize = this.gameModel.canvasData.TILE_SIZE * rectangle.height / this.gameModel.canvasData.GAME_HEIGHT + "px";

    }

    /**
     * Aktviert Eventlistener und gibt die Events dem jeweilgen Controller zur Verarbeitung weiter
     */
    private registerEvents() {
        window.addEventListener('keyup', (event) => {
            this.stateController.handleEvent(event)
        });
        window.addEventListener('keydown', (event) => {
            this.stateController.handleEvent(event);
        });
        window.addEventListener('click', (event: any) => {
            this.stateController.handleEvent(event);
        });
        window.addEventListener("resize", (event) => {
            this.handleResize();
        });
        this.gameModel.canvasData.DISPLAY_CANVAS.addEventListener('mousemove', (event: any) => {
            this.stateController.handleEvent(event);
        })
    }

    /**
     * Hauptspielschleife
     * @param timestamp
     */
    mainGameLoop(timestamp: number) {
        // Geschwindigkeit, in die der Clientcomputer einzelne Frames verabeiten kann
        this.gameModel.setDeltatime(timestamp - this.lastTime);
        this.lastTime = timestamp;
        if (this.timer > this.interval) {
            this.update();
            this.timer = 0;
        } else {
            this.timer += this.gameModel.getDeltatime();
        }
        requestAnimationFrame((timestamp) => this.mainGameLoop(timestamp));
    }
}
