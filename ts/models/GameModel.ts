import {Player} from "./objects/Player.js"
import {Canvasdata, keyState} from "../game_config.js";
import {SpriteGroup} from "./objects/SpriteGroup.js";

/**
 * Das GameModel hält alle Daten der Applikation
 */
export class GameModel {
    //TODO: FRAGE: soll ein statisches Attribut sein, oder besser im Constructo???
    public static KEY = {
        LEFT: ['ArrowLeft', 'a'],
        RIGHT: ['ArrowRight', 'd'],
        JUMP: [' ', 'w', 'ArrowUp'],
        UP: ['ArrowUp', 'w'],
        DOWN: ['ArrowDown', 's'],
        PAUSE: ['Escape', 'esc', 'ESC', 'Esc', 'p', 'P'],
        ENTER: ['Enter']
    }

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
    private heartGroup: SpriteGroup;

    spriteData: {};
    private _backgroundImage: ImageBitmap;

    constructor(public tileMapLevelData: {}, public worldImages: { [key: string]: string }, public collisionMapData: { [key: string]: number[] }, spriteData: {}) {
        this.deltatime = 0;
        this.currentLevel = 1;
        this.maxLevel = 3;
        this.levelMap = [];
        this.gravity = 2.5;
        this.friction = 0.6; // oder 0.4 / 0.55 mit
        this.keyState = {
            right: false,
            left: false,
            jump: false,
            up: false,
            down: false,
            pause: false,
            enter: false
        };
        this.player = new Player(this, 0, 0, 0, 0);
        this.enemyGroup = new SpriteGroup();
        this.platformGroup = new SpriteGroup();
        this.coinGroup = new SpriteGroup();
        this.waterGroup = new SpriteGroup();
        this.heartGroup = new SpriteGroup();
        this.spriteData = spriteData;
        this._backgroundImage = worldImages['background'] as unknown as ImageBitmap;
    }

    getHighscore() {
        console.log("Das ist dein Highscore.");
    }

    setHighscore(name: string, punkte: number) {
        console.log("Name: " + name, "Punkte: " + punkte);
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
    getHeartGroup() {
        return this.heartGroup;
    }
    setHeartGroup(value: SpriteGroup) {
        this.heartGroup = value;
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


    get backgroundImage(): ImageBitmap {
        return this._backgroundImage;
    }
}