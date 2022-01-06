import {GameModel} from "../models/GameModel.js";
import {Player} from "../models/objects/Player.js";
import {Canvasdata} from "../main.js";
import {Enemy, GameObject, MovingPlatform} from "../models/objects/GameObject.js";
import {WorldView} from "../views/WorldView.js";

/**
 * Der WoldController verwaltet und updated die Daten der WorldView
 */
export class WorldController {
    private player: Player;
    readonly canvasData: Canvasdata;
    readonly collisionMapData: { [key: string]: number[] };
    private topTile: number;
    private rightTile: number;
    private bottomTile: number;
    private leftTile: number;
    private tileMapLevelData: any;
    private gameModel: any;
    private tilesetMap: any;

    constructor(gameModel: GameModel, private worldView: WorldView) {
        this.gameModel = gameModel;
        this.canvasData = gameModel.canvasData;
        this.player = gameModel.getPlayer();
        this.collisionMapData = gameModel.collisionMapData;
        this.tileMapLevelData = gameModel.tileMapLevelData;
        this.tilesetMap = gameModel.worldImages["tilesetMap"]
        this.topTile = 0;
        this.rightTile = 0;
        this.bottomTile = 0;
        this.leftTile = 0;
    }

    /**
     * lädt das nächste Level
     * @param nextLevel
     */
    switchLevel(nextLevel: number) {
        console.log(nextLevel);
        if (nextLevel <= this.gameModel.getMaxLevel()) {
            this.gameModel.setCurrentLevel(nextLevel);
            this.resetLevelData();
            this.worldView.initLevel();
        } else {
            //TODO: Ende des Spiels, Highscore/Score anzeigen
            console.log("maximales level erreicht");
        }
    }

    resetLevelData() {
        this.player.resetPlayerPos();
        this.worldView.cleanup();
        this.gameModel.setCoins([]);
        this.gameModel.setEnemies([]);
        this.gameModel.setPlatforms([]);
    }

    /**
     * Kollisionsbehandlung eines Objekts mit statischen Hindernissen und der Ganvasbegrenzung
     * @param object
     */
    handleCollisionObject(object: GameObject) {
        // Collision-Handling zur Collision mit der Canvasbegrenzung
        // linke Seite des canvas
        if (object.getLeft() < 0) {
            object.setLeft(0)
        }
        // rechte Seite des canvas
        if (object.getRight() > this.canvasData.GAME_WIDTH) {
            object.setRight(this.canvasData.GAME_WIDTH)
        }
        // Obere Seite des canvas
        if (object.getTop() < 0) {
            object.setTop(0)
        }
        // untere Seite des canvas
        if (object.getBottom() > this.canvasData.GAME_HEIGHT) {
            object.setInTheAir(false);
            object.setBottom(this.canvasData.GAME_HEIGHT);
        }

        // Collision-Handling zur Collision mit einem Item/Tile innerhalb der Map
        this.locateCollisionTiles(object);
    }

    // Localization function - auf was für Tiles (topLeft, topRight, bottomLeft, bottomRight)
    // befindet sich das Object aktuell
    locateCollisionTiles(object: GameObject) {
        let value;

        //wo befindet sich die obere linke Ecke //topTile left
        value = this.getTopLeftTileValue(object);
        this.routeCollisionTile(value, object, this.leftTile, this.topTile);

        // top right
        value = this.getTopRightTileValue(object);
        this.routeCollisionTile(value, object, this.rightTile, this.topTile);

        // bottom left
        value = this.getBottomLeftTileValue(object);
        this.routeCollisionTile(value, object, this.leftTile, this.bottomTile);

        // bottom right
        value = this.getBottomRightTileValue(object);
        this.routeCollisionTile(value, object, this.rightTile, this.bottomTile);
    }

    getTopLeftTileValue(object: GameObject) {
        this.topTile = Math.floor(object.getTop() / this.canvasData.TILE_SIZE);
        this.leftTile = Math.floor(object.getLeft() / this.canvasData.TILE_SIZE);
        return this.collisionMapData["level" + this.gameModel.getCurrentLevel()][this.topTile * this.canvasData.COLS + this.leftTile];
    }

    getTopRightTileValue(object: GameObject) {
        this.topTile = Math.floor(object.getTop() / this.canvasData.TILE_SIZE);
        this.rightTile = Math.floor(object.getRight() / this.canvasData.TILE_SIZE);
        return this.collisionMapData["level" + this.gameModel.getCurrentLevel()][this.topTile * this.canvasData.COLS + this.rightTile];
    }

    getBottomLeftTileValue(object: GameObject) {
        this.bottomTile = Math.floor(object.getBottom() / this.canvasData.TILE_SIZE);
        this.leftTile = Math.floor(object.getLeft() / this.canvasData.TILE_SIZE);
        return this.collisionMapData["level" + this.gameModel.getCurrentLevel()][this.bottomTile * this.canvasData.COLS + this.leftTile];
    }

    getBottomRightTileValue(object: GameObject) {
        this.bottomTile = Math.floor(object.getBottom() / this.canvasData.TILE_SIZE);
        this.rightTile = Math.floor(object.getRight() / this.canvasData.TILE_SIZE);
        return this.collisionMapData["level" + this.gameModel.getCurrentLevel()][this.bottomTile * this.canvasData.COLS + this.rightTile];
    }

    // routing function - zuordnen des Collision-Tile zu der entsprechenden Collision-function
    routeCollisionTile(value: number, object: GameObject, tileX: number, tileY: number) {
        // 11 = c_left, 12 = c_top, 13 = c_right, 14 = c_bottom,
        // 21 = c_top_left, 22 = c_top_right, 23 = c_top_left_right
        // 31 = c_bottom_left, 32 = c_bottom_right, 33 = c_bottom_left_right
        // 41 = c_top_left_right_bottom,
        // 51 = c_exit, 52 = c_water, 53 = c_coin, 54 = c_enemy
        // 99 = none,
        let topTileY: number | undefined, rightTileX: number | undefined, leftTileX: number | undefined,
            bottomTileY: number | undefined;

        leftTileX = tileX * this.canvasData.TILE_SIZE;
        topTileY = tileY * this.canvasData.TILE_SIZE;
        rightTileX = tileX * this.canvasData.TILE_SIZE + this.canvasData.TILE_SIZE;
        bottomTileY = tileY * this.canvasData.TILE_SIZE + this.canvasData.TILE_SIZE;
        if (value === undefined) return;
        switch (value) {
            case 11: //11 = c_left
                this.collidePlatformLeft(object, leftTileX);
                break;
            case 12: //12 = c_top
                this.collidePlatformTop(object, topTileY);
                break;
            case 13: //13 = c_right
                this.collidePlatformRight(object, rightTileX);
                break;
            case 14: //14 = c_bottom
                this.collidePlatformBottom(object, bottomTileY);
                break;
            case 21: //21 = c_top_left
                if (this.collidePlatformTop(object, topTileY)) return;
                this.collidePlatformLeft(object, leftTileX);
                break;
            case 22: //22 = c_top_right
                if (this.collidePlatformTop(object, topTileY)) return;
                this.collidePlatformRight(object, rightTileX);
                break;
            case 23: //23 = top_left_right
                if (this.collidePlatformTop(object, topTileY)) return;
                if (this.collidePlatformLeft(object, leftTileX)) return;
                this.collidePlatformRight(object, rightTileX);
                break;
            case 31: // 31 = c_bottom_left
                if (this.collidePlatformBottom(object, bottomTileY)) return;
                this.collidePlatformLeft(object, leftTileX);
                break;
            case 32: // 32 = c_bottom_right
                if (this.collidePlatformBottom(object, bottomTileY)) return;
                this.collidePlatformRight(object, rightTileX);
                break;
            case 33: // 33 = c_bottom_left_right
                if (this.collidePlatformBottom(object, bottomTileY)) return;
                if (this.collidePlatformLeft(object, leftTileX)) return;
                this.collidePlatformRight(object, rightTileX);
                break;
            case 41: //41 = top_left_right_bottom
                if (this.collidePlatformRight(object, rightTileX)) return;

                if (this.collidePlatformBottom(object, bottomTileY)) return;
                if (this.collidePlatformTop(object, topTileY)) return;
                this.collidePlatformLeft(object, leftTileX);
                break;
            case 51: // 51 = c_exit
                this.switchLevel(this.gameModel.getCurrentLevel() + 1);
                break;
            case 52: // 52 = c_water
                break;
            case 53: // 53 = c_coin
                this.collideCoin(object, tileX, tileY);
                break;
            case 54: // 54 = c_enemy wohl ueberfluessaig, da sich alle bwegen werden
                break;
            case 99:  // 99 = none
                break;
        }
    }


    // Response Functions - Auf die Collission reagieren und Objektposition anpassen
    collidePlatformBottom(object: GameObject, tileBottom: number) {
        if (object.getTop() < tileBottom && object.getOldTop() >= tileBottom) {
            object.setTop(tileBottom);
            object.setYVelocity(0);
            return true;
        } else {
            return false;
        }
    }

    collidePlatformLeft(object: GameObject, tileLeft: number) {
        if (object.getRight() > tileLeft && object.getOldRight() <= tileLeft) {
            object.setRight(tileLeft - 0.05);
            object.setXVelocity(0);
            console.log(tileLeft);
            return true;
        } else {
            return false;
        }
    }

    collidePlatformRight(object: GameObject, tileRight: number) {
        if (object.getLeft() < tileRight && object.getOldLeft() >= tileRight) {
            object.setLeft(tileRight);
            object.setXVelocity(0);
            console.log("tileright", tileRight);
            return true;
        } else {
            return false;
        }
    }

    collidePlatformTop(object: GameObject, tileTop: number) {
        if (object.getBottom() > tileTop && object.getOldBottom() <= tileTop) {
            object.setBottom(tileTop - 0.05);
            object.setInTheAir(false);
            return true;
        } else {
            return false;
        }
    }

    collideCoin(object: GameObject, tileX: number, tileY: number) {
        let counter = 0;
        this.gameModel.getCoins().forEach((coin: { getX: () => number; getY: () => number; }) => {
            if (coin.getX() == tileX * this.canvasData.TILE_SIZE + (this.canvasData.TILE_SIZE/2 - this.gameModel.spriteData["coin"].w /4)
                && (coin.getY() == tileY * this.canvasData.TILE_SIZE)) {
                this.gameModel.getCoins().splice(counter, 1);
                this.gameModel.setCoins(this.gameModel.getCoins());
            }
            counter++;
        });
    }

    // collideEnemy() {
    //     this.gameModel.getEnemies().forEach((enemy: { x: number; xOld: number; }) => {
    //         if (enemy.x < this.player.getX() && enemy.xOld > this.player.getOldLeft()) {
    //             this.player.setPlayerX(this.player.getX());
    //             this.player.setXVelocity(0);
    //         }
    //     })
    //}
    collideMovingPlatform(object: GameObject, movingPlatform: MovingPlatform) {
        if (object.getTop() > movingPlatform.getBottom() ||
            object.getBottom() < movingPlatform.getTop() ||
            object.getRight() < movingPlatform.getLeft() ||
            object.getLeft() > movingPlatform.getRight()) {
                return false;
        }
        if(movingPlatform.type == "platform") {
            object.setBottom(movingPlatform.getTop());
        }
        if (movingPlatform.type == "platform_topping") {
            object.setBottom(movingPlatform.getTop());
            object.setX(object.getX()+movingPlatform.moveDirection);
        }
        object.setInTheAir(false);

    }


    // Updated die Daten für die View
    update() {
        this.player.update();
        this.handleCollisionObject(this.player);
        this.gameModel.getEnemies().forEach(function (enemy: Enemy) {
            enemy.update();
        });
        this.gameModel.getPlatforms().forEach((platform: MovingPlatform) => {
            platform.update();
            this.collideMovingPlatform(this.player, platform);
        });
        //enemy: { update: () => any; }) => enemy.update());


    }
}