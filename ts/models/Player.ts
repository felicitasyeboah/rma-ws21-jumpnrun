import {GameModel} from "./GameModel.js";
import {CANVAS_DATA, keyState} from "../canvas_config.js";
import {GameObject} from "./GameObject.js";

/**
 * Erstellt ein Player-Objekt
 */
export class Player extends GameObject {
    playerData: any;
    private playerSprites: any;
    private colsInSpritesheet: number;
    private rowsInSpritesheet: number;
    private spriteWidth: number;
    private spriteHeight: number;
    private tileX: number;
    private tileY: number;
    private maxTileX: number;
    private maxTileY: number;
    private jumpHeight: number;
    private _friction: number;
    private _gravity: number;
    private alive: boolean;
    private lifeCounter: number;
    private coinCounter: number;
    frames: number;
    currentFrame: number;

    keyState: keyState;

    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number) {
        super(gameModel, x, y);
        this.keyState = gameModel.keyState;

        this.playerData = gameModel.playerData;
        this.playerSprites = gameModel.worldImages["tilesetPlayer"];
        this.colsInSpritesheet = 11;
        this.rowsInSpritesheet = 2;
        this.spriteWidth = this.playerSprites.width / this.colsInSpritesheet;
        this.spriteHeight = this.playerSprites.height / this.rowsInSpritesheet;

        this.tileX = 0;
        this.tileY = 0
        this.maxTileX = this.colsInSpritesheet - 1; // -1 weil das letzte Sprite vom Ende des vorletezen
        // Sprite-width/-height berechnet wird
        this.maxTileY = (this.playerSprites.height / this.spriteHeight) - 1;

        this.w = 36 * this.spriteWidth / this.spriteHeight;//*this.playerData.frames[0].rect[2] / this.playerData.frames[0].rect[3];
        this.h = 36; // / this.spriteWidth * this.spriteHeight
        this.x = 35;
        this.y = CANVAS_DATA.GAME_HEIGHT - CANVAS_DATA.TILE_SIZE - this.h;

        this._friction = gameModel.friction;
        this._gravity = gameModel.gravity;

        this.alive = true;
        this.lifeCounter = 3;
        this.coinCounter = 0;

        this.jumpHeight = -20;

        this.frames = 10;
        this.currentFrame = 0;
    }

    // Wenn setzt geaenderten Werte auf die Default-Werte zurueck
    reset() {
        this.reborn();
        this.lifeCounter = 3;
        this.coinCounter = 0;
    }

    // Setzt die Playerposition auf seinen Startpunkt zurueck
    resetPlayerPos() {
        this.x = 35;
        this.y = CANVAS_DATA.GAME_HEIGHT - CANVAS_DATA.TILE_SIZE - this.h;
    }

    // settz Werte, die beim sterben gesetzt wurden, wieder auf default-werte zurueck und setzt den Spieler zum Startpunkt zureuck
    reborn() {
        this.resetPlayerPos();
        this._gravity = 2;
        this._friction = 0.4;
        this.alive = true;
    }

    /**
     * Bewegt den Spieler
     */
    move(/*playerDirection: string*/) {

        if (this.keyState.left) {
            this.xVelocity = -4;
            this.tileY = 1;
            if (this.currentFrame >= this.frames) this.currentFrame = 0;
            else this.currentFrame++;
        }
        if (this.keyState.right) {
            this.xVelocity = 4;
            this.tileY = 0;
            if (this.currentFrame >= this.frames) this.currentFrame = 0;
            else this.currentFrame++;
        }

    }

    died() {
        console.log("died");
        this.alive = false;
        this.xVelocity = 0;
        this.yVelocity *= -1;
        this._gravity = 0;
        this._friction = 0;
        this.y += this.yVelocity; // oder in die udpate methode, bei not alive
        this.lifeCounter--;
        switch (this.getLifeCounter()) {
            case 0:
                this.gameModel.getHeartGroup().delete(this.gameModel.getHeartGroup().getSprites()[length - 3]);
                break;
            case 1:
                this.gameModel.getHeartGroup().delete(this.gameModel.getHeartGroup().getSprites()[length - 2]);
                break;
            case 2:
                this.gameModel.getHeartGroup().delete(this.gameModel.getHeartGroup().getSprites()[length - 1]);
                break;
        }
    }

    /**
     * Updated den Spieler
     */
    update() {
        if (!this.inTheAir) {
            this.xVelocity *= this._friction;
        } else {
            this.yVelocity += this._gravity;
            this.xVelocity *= this._friction;
        }

        // if ((!this.alive)) {
        //     if (this.y <= 96) {
        //         this.yVelocity = 0;
        //         this.y = 96;
        //         this.xVelocity = 0;
        //     }
        // }

        this.inTheAir = true;
        this.move();
        this.xOld = this.x;
        this.yOld = this.y;
        this.x += this.xVelocity;
        this.y += this.yVelocity;


    }

    // Getter and Setters \\
    setPos(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getPos() {
        let pos = {x: 0, y: 0}
        pos.x = this.x;
        pos.y = this.y;
        return pos;
    }

    setPlayerX(x: number) {
        this.x = x;
    }

    setPlayerY(y: number) {
        this.y = y;
    }

    getPlayerSprites() {
        return this.playerSprites;
    }

    getColsInSpritesheet() {
        return this.colsInSpritesheet;
    }

    getRowsInSpritesheet() {
        return this.rowsInSpritesheet;
    }

    getSpriteWidth() {
        return this.spriteWidth;
    }

    getSpriteHeight() {
        return this.spriteHeight;
    }

    getJumpHeight() {
        return this.jumpHeight;
    }


    getTileX() {
        return this.tileX;
    }

    getTileY() {
        return this.tileY;
    }

    getMaxTileX() {
        return this.maxTileX;
    }

    getMaxTileY() {
        return this.maxTileY;
    }

    getAlive() {
        return this.alive;
    }

    setAlive(value: boolean) {
        this.alive = value;
    }

    getCoinCounter() {
        return this.coinCounter;
    }

    setCoinCounter(value: number) {
        this.coinCounter = value;
    }

    getLifeCounter() {
        return this.lifeCounter;
    }

    setLifeCounter(value: number) {
        this.lifeCounter = value;
    }


    get friction(): number {
        return this._friction;
    }

    set friction(value: number) {
        this._friction = value;
    }

    get gravity(): number {
        return this._gravity;
    }

    set gravity(value: number) {
        this._gravity = value;
    }

}
