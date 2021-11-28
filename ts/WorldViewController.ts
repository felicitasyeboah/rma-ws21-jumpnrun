import {GameModel} from "./GameModel.js";
import {Player} from "./Player.js";
import {Canvasdata} from "./main.js";
import {Object} from "./Object.js";
import {WorldView} from "./WorldView";

export class WorldController {
    private player: Player;
    readonly canvasData: Canvasdata;
    readonly collisionMap1

    constructor(private gameModel: GameModel, worldView: WorldView) {
        this.canvasData = gameModel.canvasData;
        this.player = gameModel.player;
        this.collisionMap1 = gameModel.collisionMap1;

    }

    handleCollisionObject(object: Object) {
        //left side of canvas
        if (object.getLeft() < 0) {
            object.setLeft(0)
        }
        // right side of canvas
        if (object.getRight() > this.canvasData.CANVAS_WIDTH) {
            object.setRight(this.canvasData.CANVAS_WIDTH)
        }
        // top of canvas
        if (object.getTop() < 0) {
            object.setTop(0)
        }
        // bottom of canvas
        if (object.getBottom() > this.canvasData.CANVAS_HEIGHT) {
            object.setJumping(false);
            object.setBottom(this.canvasData.CANVAS_HEIGHT);
        }
        //this.findCollisionTile(object);
        //}


        //Broad Phase - auf was für einem Tile befindet sich das Object aktuell
        //findCollisionTile(object: Object) {
        let top, right, left, bottom, value;

        //top left
        top = Math.floor(object.getTop() / this.canvasData.TILE_SIZE);
        left = Math.floor(object.getLeft() / this.canvasData.TILE_SIZE);
        value = this.collisionMap1[top * this.canvasData.COLS + left];
        this.routeCollisionTile(value, object, left * this.canvasData.TILE_SIZE, top * this.canvasData.TILE_SIZE, this.canvasData.TILE_SIZE)
        //top right
        top = Math.floor(object.getTop() / this.canvasData.TILE_SIZE);
        right = Math.floor(object.getRight() / this.canvasData.TILE_SIZE);
        value = this.collisionMap1[top * this.canvasData.COLS + right];
        this.routeCollisionTile(value, object, right * this.canvasData.TILE_SIZE, top * this.canvasData.TILE_SIZE, this.canvasData.TILE_SIZE)
        //bottom left
        bottom = Math.floor(object.getBottom() / this.canvasData.TILE_SIZE);
        left = Math.floor(object.getLeft() / this.canvasData.TILE_SIZE);
        value = this.collisionMap1[bottom * this.canvasData.COLS + left];
        this.routeCollisionTile(value, object, left * this.canvasData.TILE_SIZE, bottom * this.canvasData.TILE_SIZE, this.canvasData.TILE_SIZE)
        //bottom right
        bottom = Math.floor(object.getBottom() / this.canvasData.TILE_SIZE);
        right = Math.floor(object.getRight() / this.canvasData.TILE_SIZE);
        value = this.collisionMap1[bottom * this.canvasData.COLS + right];
        this.routeCollisionTile(value, object, right * this.canvasData.TILE_SIZE, bottom * this.canvasData.TILE_SIZE, this.canvasData.TILE_SIZE)
    }

    //routing Function - zuordnen des Collision-Tile zu der entsprechenden Collission-function
    routeCollisionTile(value: number, object: Object, tileX: number, tileY: number, tileSize: number) {
        switch (value) {
            case 1:
                break;
            case 2:
                break;
            case 3:
                if (this.collidePlatformTop(object, tileY)) return;
                if (this.collidePlatformLeft(object, tileX)) return;
                this.collidePlatformRight(object, tileX + tileSize);
                break;
            case 4:
                if (this.collidePlatformTop(object, tileY)) return;
                this.collidePlatformRight(object, tileX + tileSize)
                break;
            case 5:
                if (this.collidePlatformTop(object, tileY)) return;
                this.collidePlatformLeft(object, tileX);
                break;
            case 6:
                this.collidePlatformBottom(object, tileY + tileSize);
                break;
            case 7:
                this.collidePlatformTop(object, tileY);
                break;
            case 8:
                this.collidePlatformLeft(object, tileX);
                break;
            case 9:
                this.collidePlatformRight(object, tileX + tileSize)
                break;
            case 11:
                this.collidePlatformTop(object, tileY);
                this.collidePlatformLeft(object, tileX);
                this.collidePlatformRight(object, tileX + tileSize);
                this.collidePlatformBottom(object, tileY + tileSize);
                break;
        }
    }


    //Narrow Phase - Auf die Collission reagieren und Objektposition anpassen

    collidePlatformBottom(object: Object, tileBottom: number) {
        if (object.getTop() < tileBottom && object.getOldTop() >= tileBottom) {
            object.setTop(tileBottom);
            object.setYVeocity(0);
            return true;
        } else {
            return false;
        }
    }

    collidePlatformLeft(object: Object, tileLeft: number) {

        if (object.getRight() > tileLeft && object.getOldRight() <= tileLeft) {
            object.setRight(tileLeft);
            object.setXVelocity(0);
            return true;
        } else {
            return false;
        }
    }

    collidePlatformRight(object: Object, tileRight: number) {
        if (object.getLeft() < tileRight && object.getOldLeft() >= tileRight) {
            object.setLeft(tileRight);
            object.setXVelocity(0);
            return true;
        } else {
            return false;
        }
    }

    collidePlatformTop(object: Object, tileTop: number) {
        if (object.getBottom() > tileTop && object.getOldBottom() <= tileTop) {
            object.setBottom(tileTop);
            object.setJumping(false);
            return true;
        } else {
            return false;
        }
    }

    // Updated die Spiellogik
    update() {
        this.player.update();
        this.handleCollisionObject(this.player);
    }
}