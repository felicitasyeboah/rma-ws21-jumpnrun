import {GameModel} from "./GameModel.js";
import {keyState} from "./main.js";
import {Object} from "./Object.js";

export class Player extends Object {
    protected gameModel: GameModel;
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
    private friction: number;
    private gravity: number;

    keyState: keyState;

    constructor(gameModel: GameModel, x: number, y: number, w: number, h: number) {
        super(gameModel, x, y, w, h);
        this.gameModel = gameModel;
        this.keyState = gameModel.keyState;

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

        this.w = 24;
        this.h = 24; // / this.spriteWidth * this.spriteHeight
        this.x = gameModel.canvasData.TILE_SIZE;
        this.y = 300;//gameModel.canvasData.CANVAS_HEIGHT - gameModel.canvasData.TILE_SIZE - this.h;

        this.friction = gameModel.friction;
        this.gravity = gameModel.gravity;


        this.jumpHeight = -45;
    }

    // Könnte auch als Update-Funktion bezeichnet werden...
    // Udpated Playerposition
    move(/*playerDirection: string*/) {

        if (this.keyState.left) {
            this.xVelocity = -6;
        }
        if (this.keyState.right) {
            this.xVelocity = 6;
        }

        // switch (playerDirection) {
        //     case "right":
        //         this.tileY = 0
        //         this.xVelocity += 1;
        //             if (this.tileX >= this.maxTileX) this.tileX = 0;
        //             else this.tileX++;
        //         break;
        //     case "left":
        //         this.tileY = 1;
        //         this.xVelocity -= 1;
        //         if (this.tileX >= this.maxTileX) this.tileX = 0;
        //         else this.tileX++;
        //
        //         break;
        //     case "jump":
        //         this.yVelocity -= this.jumpHeight;
        //         break;
        // }
    }


    update() {
        if (!this.jumping) {
            this.xVelocity *= this.friction;
        } else {
            this.yVelocity += this.gravity;
        }
        this.jumping = true;
        this.move();
        this.xOld = this.x;
        this.yOld = this.y;
        this.y += this.yVelocity;
        this.x += this.xVelocity;
    }


    // Getter and Setters
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
}
