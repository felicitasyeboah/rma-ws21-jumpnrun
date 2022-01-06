import {Player} from "./objects/Player.js"
import {Canvasdata, keyState} from "../main.js";
import {SpriteGroup} from "./objects/SpriteGroup.js";

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
    private enemyGroup: SpriteGroup;
    private platformGroup: SpriteGroup;
    private coinGroup: SpriteGroup;
    private waterGroup: SpriteGroup;
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
        this.enemyGroup = new SpriteGroup();
        this.platformGroup = new SpriteGroup();
        this.coinGroup = new SpriteGroup();
        this.waterGroup = new SpriteGroup();
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

    getEnemyGroup() {
        return this.enemyGroup;
    }

    setEnemyGroup(value: SpriteGroup) {
        this.enemyGroup = value;
    }

    getPlatformGroup() {
        return this.platformGroup;
    }

    setPlatformGroup(value: SpriteGroup) {
        this.platformGroup = value;
    }

    getCoinGroup() {
        return this.coinGroup;
    }

    setCoinGroup(value: SpriteGroup) {
        this.coinGroup = value;
    }
    getWaterGroup() {
        return this.waterGroup;
    }
    setWaterGroup(value: SpriteGroup) {
        this.waterGroup = value;
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