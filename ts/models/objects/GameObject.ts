import {GameModel} from "../GameModel.js";

export class GameObject {
    protected xOld: number;
    protected yOld: number;
    protected x: number;
    protected y: number;
    protected w: number;
    protected h: number;
    protected gameModel: GameModel;
    protected jumping: boolean;
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
        this.jumping = true;
        this.xVelocity = 0;
        this.yVelocity = 0;

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

    getTopRight() {
        return
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

    setJumping(pressed: boolean) {
        this.jumping = pressed;
    }

    getJumping() {
        return this.jumping;
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

class GameItem extends GameObject {
    private image: any;
    protected gameModel: GameModel;

    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number) {
        super(gameModel, x, y, h, w)
        this.gameModel = gameModel;
        this.image = undefined;
    }

}

export class Water extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number) {
        super(gameModel, x, y, w, h);
    }
}

export class Coin extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number) {
        super(gameModel, x, y, w, h);
    }
}

export class Exit extends GameItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number) {
        super(gameModel, x, y, w, h);
    }
}

/**
 * Oberklasse für bewegende Items der Karte
 */
class MovingItem extends GameItem {
    moveDirection: number;
    moveCounter: number

    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number) {
        super(gameModel, x, y, w, h);
        this.moveDirection = 1; // 1 = nach rechts, -1 = nach links
        this.moveCounter = 0;
    }
}

/**
 * Gegnerobjekt, das sich bewegt.
 */
export class Enemy extends MovingItem {
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, private moveX: number, private moveY: number) {
        super(gameModel, x, y, w, h);
        this.moveX = moveX;
        this.moveY = moveY;
    }

    //kann auch Updatefunktion werden
    move() {
        this.x += this.moveDirection;
        this.moveCounter++;
        if (this.moveCounter > 50) {
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
    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number, moveX: number, moveY: number) {
        super(gameModel, x, y, w, h);
        this.moveX = moveX;
        this.moveY = moveY;

    }

    //kann auch Updatefunktion werden
    move() {
        this.x += this.moveDirection * this.moveX;
        this.y += this.moveDirection * this.moveY;
        this.moveCounter++;
        if (this.moveCounter > 50) {
            this.moveDirection *= -1;
            this.moveCounter *= -1;
        }
    }


}

