import {GameModel} from "../models/GameModel.js";
import {WorldController} from "./WorldViewController.js";

/**
 * Der Statecontroller verwaltet der einzelnen Views/Ansichten und updated diese.
 */
export default class StateController {
    private timer: number;
    private interval: number;
    private lastTime: number;
    private run: boolean;
    private stateData: { [p: string]: {} };
    private stateName: string;
    private gameModel: GameModel;
    private state: any;
    private worldController: WorldController;

    constructor(gameModel: GameModel, stateData: { [key: string]: {} }) {
        this.timer = 0;
        this.interval = 1000 / 60;
        this.lastTime = 0;
        this.run = true;
        this.stateData = stateData;
        this.stateName = gameModel.getStartStateName();
        this.gameModel = gameModel;
        this.state = this.stateData[this.stateName]; //Es wird eine der View-Objekte zugewiesen (world, startmenue etc.)
        this.worldController = new WorldController(this.gameModel, this.state);
        this.state.startup();
        this._registerEvents();
        this._handleResize(); // First draw

    }

    //setupStates(stateData, state) {
    //}
    /**
     * Wechselt die Ansichten/Views
     */
    _flipState() {
    }

    /**
     * Updated die Views/Ansichten
     */
    _update() {
        if (this.stateName === "worldView") {
            this.worldController.update();
        }
        this.state.update();
        this._renderDisplay();

    }

    _renderDisplay() {
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

    _handleResize() {
        let height = document.documentElement.clientHeight;
        let width = document.documentElement.clientWidth;

        this.gameModel.canvasData.DISPLAY_CANVAS.width = Math.floor(width / this.gameModel.canvasData.TILE_SIZE) * this.gameModel.canvasData.TILE_SIZE;

        if (this.gameModel.canvasData.DISPLAY_CANVAS.width > height) {
            this.gameModel.canvasData.DISPLAY_CANVAS.width = Math.floor(height / this.gameModel.canvasData.TILE_SIZE) * this.gameModel.canvasData.TILE_SIZE;
        }
        this.gameModel.canvasData.DISPLAY_CANVAS.height = this.gameModel.canvasData.DISPLAY_CANVAS.width * (this.gameModel.canvasData.GAME_HEIGHT / this.gameModel.canvasData.GAME_WIDTH);
    }


    /**
     * Eventlistener werden aktiviert
     */
    _registerEvents() {
        window.addEventListener('keyup', (event) => {
            this.state.getEvent(event)
        });
        window.addEventListener('keydown', (event) => {
            this.state.getEvent(event);
        });
        window.addEventListener('click', (event) => {
            this.state.getEvent(event);
        })
        window.addEventListener("resize", (event) => {
            this._handleResize();
        });
    }

    /**
     * Hauptspielschleife
     * @param timestamp
     */
    mainGameLoop(timestamp: number) {
        // console.log(timestamp);
        this.gameModel.setDeltatime(timestamp - this.lastTime); // Geschwindigkeit, in die der Clientcomputer einzelne
        this.lastTime = timestamp;                              // Frames verabeiten kann
        if (this.timer > this.interval) {
            this._registerEvents();
            this._update();
            this.timer = 0;
        } else {
            this.timer += this.gameModel.getDeltatime();
        }
        requestAnimationFrame((timestamp) => this.mainGameLoop(timestamp));
    }
}
