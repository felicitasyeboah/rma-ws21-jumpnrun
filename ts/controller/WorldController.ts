import {GameModel} from "../models/GameModel.js";
import {Player} from "../models/objects/Player.js";
import {Coin, Enemy, GameObject, MovingPlatform, Water} from "../models/objects/GameObject.js";
import {WorldView} from "../views/WorldView.js";
import {SpriteGroup} from "../models/objects/SpriteGroup.js";
import {StateController} from "./StateController.js";

/**
 * Der WoldController verwaltet und updated die Daten der WorldView
 */
export class WorldController extends StateController {

    private player: Player;

    readonly collisionMapData: { [key: string]: number[] };
    private rowTopPosition: number;
    private columnRightPosition: number;
    private rowBottomPosition: number;
    private columnLeftPosition: number;
    private tileMapLevelData: any;
    private tilesetMap: any;
    private enemyGroup: SpriteGroup;
    private platformGroup: SpriteGroup;
    private coinGroup: SpriteGroup;
    private waterGroup: SpriteGroup;
    private heartGroup: SpriteGroup;
    private coinCounter: number;

    constructor(gameModel: GameModel, private worldView: WorldView) {
        super(gameModel, worldView);
        this.gameModel = gameModel;
        this.player = gameModel.getPlayer();
        this.collisionMapData = gameModel.collisionMapData;
        this.tileMapLevelData = gameModel.tileMapLevelData;
        this.tilesetMap = gameModel.worldImages["tilesetMap"]
        this.rowTopPosition = 0;
        this.columnRightPosition = 0;
        this.rowBottomPosition = 0;
        this.columnLeftPosition = 0;
        this.enemyGroup = gameModel.getEnemyGroup();
        this.platformGroup = gameModel.getPlatformGroup();
        this.coinGroup = gameModel.getCoinGroup();
        this.waterGroup = gameModel.getWaterGroup();
        this.coinCounter = gameModel.getPlayer().getCoinCounter();
        this.heartGroup = gameModel.getHeartGroup();
    }

    /**
     * Prueft die Tasteneingaben in der WorldView
     * @param event
     */
    handleEvent(event: any): void {
        if (event.type === "keydown") {
            if (GameModel.KEY.LEFT.includes(event.key) && !this.gameModel.keyState.left) {
                event.preventDefault();
                this.gameModel.keyState.left = true;
            }
            if (GameModel.KEY.RIGHT.includes(event.key) && !this.gameModel.keyState.right) {
                event.preventDefault();
                this.gameModel.keyState.right = true;
            }
            if (GameModel.KEY.JUMP.includes(event.key)) {
                event.preventDefault();
                if (!this.player.getInTheAir() && !this.gameModel.keyState.jump) {
                    this.gameModel.keyState.jump = true;
                    this.player.setYVelocity(this.player.getJumpHeight());
                }
            }
        }
        if (event.type === "keyup") {
            if (GameModel.KEY.LEFT.includes(event.key) && this.gameModel.keyState.left) {
                event.preventDefault();
                this.gameModel.keyState.left = false;
            }
            if (GameModel.KEY.RIGHT.includes(event.key) && this.gameModel.keyState.right) {
                event.preventDefault();
                this.gameModel.keyState.right = false;
            }
            if (GameModel.KEY.JUMP.includes(event.key) && this.gameModel.keyState.jump) {
                event.preventDefault();
                this.gameModel.keyState.jump = false;
            }
            if (GameModel.KEY.PAUSE.includes(event.key) && (!this.gameModel.keyState.pause)) {
                event.preventDefault();
                this.pauseState();
            } else if (GameModel.KEY.PAUSE.includes(event.key) && (this.gameModel.keyState.pause)) {
                event.preventDefault();
                this.resumeState();
            }
        }
        if (event.type == "click" && event.target.className == "btn btn-resume" && this.gameModel.keyState.pause) {
            this.resumeState();
        }

        // if (State.KEY.RIGHT.includes(event.key)) {
        //     this.player.move("right");
        // } else if (State.KEY.LEFT.includes(event.key)) {
        //     this.player.move("left");
        // } else if (State.KEY.JUMP.includes(event.key)) {
        //     this.player.move("jump");
        // }
    }

    // Updated die Daten für die View
    update() {
        if (this.player.getAlive()) {
            {
                this.player.update();
                this.enemyGroup.update();
                this.platformGroup.update();
                this.handleCollisionObject(this.player);
            }
        }
        // wenn der spieler ein leben verloren hat, nur playe rupdaten, alles andere ist angehalten
        else {
            this.player.update();
            // switch (this.player.getLifeCounter()) {
            //     case 0:
            //         this.gameModel.getHeartGroup().delete(this.gameModel.getHeartGroup().getSprites()[length - 3]);
            //         break;
            //     case 1:
            //         this.gameModel.getHeartGroup().delete(this.gameModel.getHeartGroup().getSprites()[length - 2]);
            //         break;
            //     case 2:
            //         this.gameModel.getHeartGroup().delete(this.gameModel.getHeartGroup().getSprites()[length - 1]);
            //         break;
            // }
            // if (this.player.getLifeCounter() == 0) {
            //     console.log("GameOver");
            // }
            //TODO: restart button azeigen oder highscore, wenn player keien leben mehr hat
            //TODO: player image gegen ghost austauschen

        }
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
    }

    private resumeState() {
        this.gameModel.keyState.pause = false;
        this.gameModel.canvasData.DIV_PAUSE.style.display = "none";
        this.worldView.setLevelTimer();
    }


    private pauseState() {
        this.gameModel.keyState.pause = true;
        this.gameModel.canvasData.DIV_PAUSE.style.display = "flex";
        this.worldView.stopLevelTimer(this.worldView.levelTimer);

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

        // Tilebased-Collision-Detection: Collision-Handling zur Collision mit einem Tile innerhalb der CollisionMap
        this.locateCollisionTiles(object);
        this.checkCollisionWithGameObject(object);
    }

    // Localization function - auf was für Tiles (topLeft, topRight, bottomLeft, bottomRight)
    // befindet sich das Object aktuell
    locateCollisionTiles(object: GameObject) {
        let value;

        //wo befindet sich die obere linke Ecke //topTile left
        value = this.getTopLeftTileValue(object);
        this.checkCollisionWithTile(value, object, this.columnLeftPosition, this.rowTopPosition);

        // top right
        value = this.getTopRightTileValue(object);
        this.checkCollisionWithTile(value, object, this.columnRightPosition, this.rowTopPosition);

        // bottom left
        value = this.getBottomLeftTileValue(object);
        this.checkCollisionWithTile(value, object, this.columnLeftPosition, this.rowBottomPosition);

        // bottom right
        value = this.getBottomRightTileValue(object);
        this.checkCollisionWithTile(value, object, this.columnRightPosition, this.rowBottomPosition);
    }

    /**
     * Rechnet den x und y position des GameObjects auf dem Canvas in die row und column des tilemap-systems um und gibt
     * anhand derrer den Wert aus der collisionmap zurueck
     * @param object GameObject
     * @return Wert aus der Collisionmap
     */
    getTopLeftTileValue(object: GameObject) {
        this.rowTopPosition = Math.floor(object.getTop() / this.canvasData.TILE_SIZE); // berechnet die row der topPosition  des objects in der TileMap
        this.columnLeftPosition = Math.floor(object.getLeft() / this.canvasData.TILE_SIZE); // berechnet den column der leftPosition des objects in der TileMap
        return this.collisionMapData["level" + this.gameModel.getCurrentLevel()][this.rowTopPosition * this.canvasData.COLS + this.columnLeftPosition];
    }

    /**
     * Berechnet das top-right tile in der tilemap des aktuellen Levels und gibt den Wert aus der Collisionmap dieser Position zurück
     * @param object GameObject
     * @return Wert aus der Collisionmap
     */
    getTopRightTileValue(object: GameObject) {
        this.rowTopPosition = Math.floor(object.getTop() / this.canvasData.TILE_SIZE);
        this.columnRightPosition = Math.floor(object.getRight() / this.canvasData.TILE_SIZE);
        return this.collisionMapData["level" + this.gameModel.getCurrentLevel()][this.rowTopPosition * this.canvasData.COLS + this.columnRightPosition];
    }

    /**
     * Berechnet das bottom-teft tile in der tilemap des aktuellen Levels und gibt den Wert aus der Collisionmap dieser Position zurück
     * @param object GameObject
     * @return Wert aus der Collisionmap
     */
    getBottomLeftTileValue(object: GameObject) {
        this.rowBottomPosition = Math.floor(object.getBottom() / this.canvasData.TILE_SIZE);
        this.columnLeftPosition = Math.floor(object.getLeft() / this.canvasData.TILE_SIZE);
        return this.collisionMapData["level" + this.gameModel.getCurrentLevel()][this.rowBottomPosition * this.canvasData.COLS + this.columnLeftPosition];
    }

    /**
     * Berechnet das bottom-right tile aus der tilemap des aktuellen Levels und gibt den Wert aus der Collisionmap dieser Position zurück
     * @param object GameObject
     * @return Wert aus der Collisionmap
     */
    getBottomRightTileValue(object: GameObject) {
        this.rowBottomPosition = Math.floor(object.getBottom() / this.canvasData.TILE_SIZE);
        this.columnRightPosition = Math.floor(object.getRight() / this.canvasData.TILE_SIZE);
        return this.collisionMapData["level" + this.gameModel.getCurrentLevel()][this.rowBottomPosition * this.canvasData.COLS + this.columnRightPosition];
    }

    // routing function - zuordnen des Collision-Tiles zu der entsprechenden Collision-function
    /**
     *  routing function - Ordnet den Wert des collision-tiles der entsprechenden collision-function zu
     * @param value Wert des collision-tiles
     * @param object GameObject
     * @param column col in der tileMap
     * @param row row in der tileMap
     */
    checkCollisionWithTile(value: number, object: GameObject, column: number, row: number) {
        // 11 = c_left, 12 = c_top, 13 = c_right, 14 = c_bottom,
        // 21 = c_top_left, 22 = c_top_right, 23 = c_top_left_right
        // 31 = c_bottom_left, 32 = c_bottom_right, 33 = c_bottom_left_right
        // 41 = c_top_left_right_bottom,
        // 51 = c_exit, 52 = c_water, 53 = c_coin, 54 = c_enemy
        // 99 = none,
        let topTileY: number | undefined, rightTileX: number | undefined, leftTileX: number | undefined,
            bottomTileY: number | undefined;

        leftTileX = column * this.canvasData.TILE_SIZE;
        topTileY = row * this.canvasData.TILE_SIZE;
        rightTileX = column * this.canvasData.TILE_SIZE + this.canvasData.TILE_SIZE;
        bottomTileY = row * this.canvasData.TILE_SIZE + this.canvasData.TILE_SIZE;

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
                //this.collideCoin(object, tileX, tileY);
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
            return true;
        } else {
            return false;
        }
    }

    collidePlatformRight(object: GameObject, tileRight: number) {
        if (object.getLeft() < tileRight && object.getOldLeft() >= tileRight) {
            object.setLeft(tileRight);
            object.setXVelocity(0);
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

    collideCoin(object: GameObject, coin: Coin) {
        if (this.player.getLeft() < coin.getRight() &&
            this.player.getRight() > coin.getLeft() &&
            this.player.getBottom() > coin.getTop() &&
            this.player.getTop() < coin.getBottom()) {
            return true;
        }
        return false;
    }

    collideEnemy(object: GameObject, enemy: Enemy) {
        if (this.player.getLeft() < enemy.getRight() &&
            this.player.getRight() > enemy.getLeft() &&
            this.player.getTop() < enemy.getBottom() &&
            this.player.getBottom() > enemy.getTop()) {
            return true;
        }
        return false;
    }

    collideWater(object: GameObject, water: Water) {
        if (this.player.getLeft() < water.getRight() &&
            this.player.getRight() > water.getLeft() &&
            this.player.getTop() < water.getBottom() &&
            this.player.getBottom() > water.getTop()) {
            return true;
        }
        return false;
    }

    collideMovingPlatform(object: GameObject, movingPlatform: MovingPlatform) {
        if (object.getTop() < movingPlatform.getBottom() &&
            object.getBottom() > movingPlatform.getTop() &&
            object.getRight() > movingPlatform.getLeft() &&
            object.getLeft() < movingPlatform.getRight()) {
            return true;
        }
        return false;
    }

// Collision-Detection: Collision-Handling zur Collision mit einem GameObject
    checkCollisionWithGameObject(object: GameObject) {
        this.platformGroup.getSprites().forEach((movingPlatform: MovingPlatform) => {
            if (this.collideMovingPlatform(object, movingPlatform)) {
                if (movingPlatform.type == "platform") {
                    object.setBottom(movingPlatform.getTop() - 0.1);
                }
                if (movingPlatform.type == "platform_topping") {
                    object.setBottom(movingPlatform.getTop() - 0.1);
                    //  object.setXVelocity(0);
                    object.setX(object.getX() + movingPlatform.moveDirection);
                }
                object.setInTheAir(false);
            }
        });
        if (object == this.player) {
            this.enemyGroup.getSprites().forEach((enemy: Enemy) => {
                if (this.collideEnemy(this.player, enemy)) {
                    this.player.died();
                }
            });
            this.coinGroup.getSprites().forEach((coin: Coin) => {
                if (this.collideCoin(this.player, coin)) {
                    this.coinGroup.delete(coin);
                    this.coinCounter++;
                    this.player.setCoinCounter(this.coinCounter);
                }
            });
            this.waterGroup.getSprites().forEach((water: Water) => {
                if (this.collideWater(this.player, water)) {
                    this.player.died();
                }
            });
        }
    }
}