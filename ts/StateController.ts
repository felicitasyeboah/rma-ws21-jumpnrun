import {GameModel} from "./GameModel.js";
import {WorldController} from "./WorldViewController.js";

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
    }

    //setupStates(stateData, state) {
    //}

    _flipState() {
    }

    // Updated die Views
    _update() {
        if (this.stateName === "worldView") {
            this.worldController.update();
            console.log(this.stateName);
        }
        this.state.update();
    }

    getHighscore() {
        this.gameModel.getHighscore();
    }

    // Eventlistener werden aktiviert
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
    }

    // Hauptspielschleife
    mainGameLoop(timestamp: number) {
        // console.log(timestamp);
        this.gameModel.setDeltatime(timestamp - this.lastTime); // Geschwindigkeit, in die der Clientcomputer einzelne
        this.lastTime = timestamp;                              // Frames verabeiten kann
        if (this.timer > this.interval) {
            this._update();
            this.timer = 0;
        } else {
            this.timer += this.gameModel.getDeltatime();
        }

        requestAnimationFrame((timestamp) => this.mainGameLoop(timestamp));


    }
}
