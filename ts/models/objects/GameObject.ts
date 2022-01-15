import {GameModel} from "../GameModel.js";

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

    constructor(gameModel: GameModel, x: number, y: number, height: number, width: number) {
        this.gameModel = gameModel;
        this.x = x;
        this.y = y;
        this.xOld = x;
        this.yOld = y;
        this.w = width;
        this.h = height;
        this.inTheAir = true;
        this.xVelocity = 0;
        this.yVelocity = 0;
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

export class GameItem extends GameObject {
    private _type: string;
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, type: string) {
        super(gameModel, x, y, h, w)
        this.gameModel = gameModel;
        this._type = type;
    }

    get type(): string {
        return this._type;
    }
}

export class Water extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, type: string) {
        super(gameModel, x, y, w, h, type);
    }
}

export class Coin extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, type: string) {
        super(gameModel, x, y, w, h, type);
    }
}

export class Heart extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, type: string) {
        super(gameModel, x, y, w, h, type);
    }
}

export class Exit extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, type: string) {
        super(gameModel, x, y, w, h, type);
    }
}

/**
 * Oberklasse für bewegende Items der Karte
 */
class MovingItem extends GameItem {
    moveDirection: number;
    moveCounter: number

    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, type: string) {
        super(gameModel, x, y, w, h, type);
        this.moveDirection = 1; // 1 = nach rechts, -1 = nach links
        this.moveCounter = 0;
    }
}

/**
 * Gegnerobjekt, das sich bewegt.
 */
export class Enemy extends MovingItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, type: string) {
        super(gameModel, x, y, w, h, type);
    }


    //kann auch Updatefunktion werden
    update() {
        this.x += this.moveDirection;
        this.moveCounter++;
        if (this.moveCounter > this.gameModel.canvasData.TILE_SIZE) {
            this.moveDirection *= -1;
            this.moveCounter *= -1;
        }
    }

}

/**
 * Bewegliche Platform
 */
export class MovingPlatform extends MovingItem {
    private moveX: number; // 1 = gesetzt (bewegt sich), 0 = ungesetzt(bewegt sich nicht)
    private moveY: number; // 1 = gesetzt (bewegt sich), 0 = ungesetzt(bewegt sich nicht)
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, moveX: number, moveY: number, type: string) {
        super(gameModel, x, y, w, h, type);
        this.moveX = moveX;
        this.moveY = moveY;

    }

    //kann auch Updatefunktion werden
    update() {
        this.x += this.moveDirection * this.moveX;
        this.y += this.moveDirection * this.moveY;
        this.moveCounter++;
        if (this.moveCounter > this.gameModel.canvasData.TILE_SIZE) {
            this.moveDirection *= -1;
            this.moveCounter *= -1;
        }
    }


}

