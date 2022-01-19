import {GameModel} from "../GameModel.js";
import {CANVAS_DATA} from "../../game_config.js";

export class GameObject {
    protected xOld: number;
    protected yOld: number;
    protected x: number;
    protected y: number;
    protected w: number;
    protected h: number;
    protected gameModel: GameModel;
    protected inTheAir: boolean;
    protected xVelocity: number;
    protected yVelocity: number;
    frames: number;
    spriteData: any;

    constructor(gameModel: GameModel, x: number, y: number) {
        this.gameModel = gameModel;
        this.spriteData = gameModel.spriteData;
        this.x = x;
        this.y = y;
        this.xOld = x;
        this.yOld = y;
        this.w = 0;
        this.h = 0;
        this.inTheAir = true;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.frames = 0;
    }

    update() {
        // to be overriden
    }
    // Getters and Setters
    getLeft() {
        return this.x;
    }

    getRight() {
        return this.x + this.w;
    }

    getTop() {
        return this.y;
    }

    getBottom() {
        return this.y + this.h;
    }

    getOldLeft() {
        return this.xOld;
    }

    getOldRight() {
        return this.xOld + this.w;
    }

    getOldTop() {
        return this.yOld;
    }

    getOldBottom() {
        return this.yOld + this.h;
    }

    setLeft(x: number) {
        this.x = x;
    }

    setRight(x: number) {
        this.x = x - this.w;
    }

    setTop(y: number) {
        this.y = y;
    }

    setBottom(y: number) {
        this.y = y - this.h;
    }

    setOldLeft(x: number) {
        this.xOld = x;
    }

    setOldRight(x: number) {
        this.xOld = x - this.w;
    }

    setOldTop(y: number) {
        this.yOld = y;
    }

    setOldBottom(y: number) {
        this.yOld = y - this.h;
    }


    getW() {
        return this.w;
    }

    getH() {
        return this.h;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getOldX() {
        return this.xOld;
    }
    getOldY() {
        return this.yOld;
    }

    setX(value: number) {
        this.x = value;
    }

    setY(value: number) {
        this.y = value;
    }

    setInTheAir(pressed: boolean) {
        this.inTheAir = pressed;
    }

    getInTheAir() {
        return this.inTheAir;
    }

    getYVelocity() {
        return this.yVelocity;
    }

    setYVelocity(number: number) {
        this.yVelocity = number;
    }

    getXVelocity() {
        return this.xVelocity;
    }

    setXVelocity(number: number) {
        this.xVelocity = number;
    }
}

abstract class GameItem extends GameObject {
    abstract _type: string;
    protected constructor(gameModel: GameModel, x: number, y: number) {
        super(gameModel, x, y,)
        this.gameModel = gameModel;
    }

    get type(): string {
        return this._type;
    }
}

export class Water extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number) {
        super(gameModel, x, y,);
        this.w = CANVAS_DATA.TILE_SIZE;
        this.h = CANVAS_DATA.TILE_SIZE / this.spriteData.water.w * this.spriteData.water.h;
        this._type = this.spriteData.water.type;
    }

    _type: string;
}

export class Coin extends GameItem {
    delay = 205;
    time = Date.now();
    constructor(gameModel: GameModel, x: number, y: number) {
        super(gameModel, x, y);

        this.w = this.spriteData.coin.w * 0.7;
        this.h = this.spriteData.coin.h * 0.7;
        this._type = this.spriteData.coin.type;
        this.frames = this.spriteData.coin.frames;
        this.currentFrame = 0;

    }
    update () {
        if(Date.now() - this.time >= this.delay){
            this.currentFrame++;
            if(this.currentFrame >= this.frames) {
                this.currentFrame = 0;
            }
            if ((Date.now() - this.time - this.delay) > this.delay){
                this.time = Date.now();
            } else {
                this.time += this.delay;
            }
        }
    }
    _type: string;
    currentFrame: number;
}

export class Heart extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number, type: string) {
        super(gameModel, x, y);
        this.w = this.spriteData.heart_full.w / 1.5;
        this.h = this.spriteData.heart_full.h / 1.5;
        this._type = type;
    }
    _type: string;
}

export class Door extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number) {
        super(gameModel, x, y);
        this.w = CANVAS_DATA.TILE_SIZE;
        this.h = CANVAS_DATA.TILE_SIZE / this.spriteData.door.w * this.spriteData.door.h;
        this._type = this.spriteData.door.type;
    }
    _type: string;
}

/**
 * Oberklasse für bewegende Items der Karte
 */
abstract class MovingItem extends GameItem {
    moveDirection: number;
    moveCounter: number

    protected constructor(gameModel: GameModel, x: number, y: number) {
        super(gameModel, x, y);
        this.moveDirection = 1; // 1 = nach rechts, -1 = nach links
        this.moveCounter = 0;
        this._type ="";
    }

    _type: string;
}

/**
 * Gegnerobjekt, das sich bewegt.
 */
export class Enemy extends MovingItem {

    constructor(gameModel: GameModel, x: number, y: number, type: string) {
        super(gameModel, x, y);
        this.w = CANVAS_DATA.TILE_SIZE;
        this.h = CANVAS_DATA.TILE_SIZE / this.spriteData.slime.w * this.spriteData.slime.h
        this._type = type;
        this.frames = this.spriteData.slime.frames;
        this.currentFrame = 0;
    }

    // Updatefunktion
    update() {
        this.x += this.moveDirection;
        this.moveCounter++;
        if (this.moveCounter > CANVAS_DATA.TILE_SIZE) {
            this.moveDirection *= -1;
            this.moveCounter *= -1;
        }

        if(Date.now() - this.time >= this.delay){
            this.currentFrame++;
            if(this.currentFrame >= this.frames) {
                this.currentFrame = 0;
            }
            if ((Date.now() - this.time - this.delay) > this.delay){
                this.time = Date.now();
            } else {
                this.time += this.delay;
            }
        }
    }
    delay = 150;
    time = Date.now();
    _type: string;
    currentFrame: number;
}

/**
 * Bewegliche Platform
 */
export class MovingPlatform extends MovingItem {
    _type: string;
    private _moveX: number; // 1 = gesetzt (bewegt sich), 0 = ungesetzt(bewegt sich nicht)
    private _moveY: number; // 1 = gesetzt (bewegt sich), 0 = ungesetzt(bewegt sich nicht)
    constructor(gameModel: GameModel, x: number, y: number, moveX: number, moveY: number, type: string) {
        super(gameModel, x, y);
        this._moveX = moveX;
        this._moveY = moveY;
        this.w = CANVAS_DATA.TILE_SIZE;
        this.h = CANVAS_DATA.TILE_SIZE / this.spriteData.movingPlatformX.w * this.spriteData.movingPlatformX.h;
        this._type = type;
    }

    //kann auch Updatefunktion werden
    update() {
        this.x += this.moveDirection * this._moveX;
        this.y += this.moveDirection * this._moveY;
        this.moveCounter++;
        if (this.moveCounter > CANVAS_DATA.TILE_SIZE) {
            this.moveDirection *= -1;
            this.moveCounter *= -1;
        }
    }


    get moveX(): number {
        return this._moveX;
    }

    get moveY(): number {
        return this._moveY;
    }
}

