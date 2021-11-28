import {Player} from "./Player.js"
import {Canvasdata, keyState} from "./main.js";

export class GameModel {
    private readonly startStateName: string;
    player: Player;
    deltatime: number;
    friction: number;
    gravity: number;
    keyState: keyState;

    constructor(readonly canvasData: Canvasdata, public tileMapLevelData: {}, public worldImages: { [key: string]: string }, public collisionMap1: number[]) {
        this.deltatime = 0;
        this.startStateName = 'worldView';

        this.gravity = 7;
        this.friction = 0.4;
        this.keyState = {
            right: false,
            left: false,
            jump: false,
        };
        this.player = new Player(this, 0, 0, 0, 0);
    }

    getHighscore() {
        console.log("Das ist dein Highscore.");
    }

    setHighscore(name: string, punkte: number) {
        console.log("Name: " + name, "Punkte: " + punkte);
    }

    getStartStateName() {
        return this.startStateName;
    }

    getDeltatime() {
        return this.deltatime;
    }

    setDeltatime(deltatime: number) {
        this.deltatime = deltatime;
    }
}