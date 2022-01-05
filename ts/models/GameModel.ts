import {Player} from "./objects/Player.js"
import {Canvasdata, keyState} from "../main.js";
import {Coin, Enemy, MovingPlatform} from "./objects/GameObject";

/**
 * Das GameModel hält alle Daten der Applikation
 */
export class GameModel {
    private readonly startStateName: string;
    private player: Player;
    deltatime: number;
    friction: number;
    gravity: number;
    keyState: keyState;
    private currentLevel: number;
    private readonly maxLevel: number;
    private levelMap: number[][];
    private enemies: Enemy[];
    private platforms: MovingPlatform[];
    private coins: Coin[];
    spriteData: {};

    constructor(readonly canvasData: Canvasdata, public tileMapLevelData: {}, public worldImages: { [key: string]: string }, public collisionMapData: { [key: string]: number[] }, spriteData: {}) {
        this.deltatime = 0;
        this.startStateName = 'worldView';
        this.currentLevel = 1;
        this.maxLevel = 3;
        this.levelMap = [];
        this.gravity = 4;
        this.friction = 0.4;
        this.keyState = {
            right: false,
            left: false,
            jump: false,
        };
        this.player = new Player(this, 0, 0, 0, 0);
        this.enemies = [];
        this.platforms = [];
        this.coins = [];
        this.spriteData = spriteData;
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

    getEnemies() {
        return this.enemies;
    }

    setEnemies(value: Enemy[]) {
        this.enemies = value;
    }

    getPlatforms() {
        return this.platforms;
    }

    setPlatforms(value: MovingPlatform []) {
        this.platforms = value;
    }

    getCoins() {
        return this.coins;
    }

    setCoins(value: Coin[]) {
        this.coins = value;
    }

    getLevelMap() {
        return this.levelMap;
    }

    setLevelMap(value: number[][]) {
        this.levelMap = value;
    }

    getPlayer() {
        return this.player;
    }

    setPlayer(value: Player) {
        this.player = value;
    }
}