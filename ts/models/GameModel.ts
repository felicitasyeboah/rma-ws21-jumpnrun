import {Player} from "./objects/Player.js"
import {Canvasdata, keyState} from "../main.js";

/**
 * Das GameModel hält alle Daten der Applikation
 */
export class GameModel {
    private readonly startStateName: string;
    player: Player;
    deltatime: number;
    friction: number;
    gravity: number;
    keyState: keyState;
    private currentLevel: number;
    private readonly maxLevel: number;

    constructor(readonly canvasData: Canvasdata, public tileMapLevelData: {}, public worldImages: { [key: string]: string }, public collisionMapData: { [key: string]: number[] }) {
        this.deltatime = 0;
        this.startStateName = 'worldView';
        this.currentLevel = 1;
        this.maxLevel = 3;

        this.gravity = 4;
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

    getCurrentLevel() {
        return this.currentLevel;
    }

    setCurrentLevel(value: number) {
        this.currentLevel = value;
    }

    getMaxLevel() {
        return this.maxLevel;
    }

    getFriction() {
        return this.friction;
    }

    setFriction(value: number) {
        this.friction = value;
    }

    getGravity() {
        return this.gravity;
    }

    setGravity(value: number) {
        this.gravity = value;
    }
}