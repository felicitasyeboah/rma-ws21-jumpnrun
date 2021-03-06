import {GameModel} from "../models/GameModel.js";
import {Player} from "../models/Player.js";
import {Coin, Enemy, GameObject, MovingPlatform, Water} from "../models/GameObject.js";
import {WorldView} from "../views/WorldView.js";
import {SpriteGroup} from "../models/SpriteGroup.js";
import {StateController} from "./StateController.js";
import {checkHighScore, saveHighScore} from "../highscore_utils.js";
import {CANVAS_DATA} from "../canvas_config.js";
import {TileFinder} from "./TileFinder.js";

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
    tileFinder: TileFinder;

    constructor(gameModel: GameModel, protected view: WorldView) {
        super(gameModel);
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
        this.heartGroup = gameModel.getHeartGroup();
        this.tileFinder = new TileFinder(gameModel);
    }

    /**
     * Prueft die Tasteneingaben in der WorldView
     * @param event
     */
    handleEvent(event: any): void {
        if (event.type === "keydown") {
            if (GameModel.KEY.LEFT.includes(event.key) && !this.gameModel.keyState.left) {
                this.gameModel.keyState.left = true;
            }
            if (GameModel.KEY.RIGHT.includes(event.key) && !this.gameModel.keyState.right) {
                this.gameModel.keyState.right = true;
            }
            if (GameModel.KEY.JUMP.includes(event.key)) {
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
        // Pause-Fenster: wenn auf den Resume Button geclickt wird -> resume Game
        if (event.type == "click" && event.target.className == "btn btn-resume" && this.gameModel.keyState.pause) {
            this.resumeState();
        }
        // Restart-Level-Fenster: wenn auf den Restart-Button geclickt wird -> restart Level
        if ((event.target.className == "btn btn-restart-level" && GameModel.KEY.ENTER.includes((event.key))) ||
            (event.type == "click" && event.target.className == "btn btn-restart-level")) {
            this.restartLevel();
        }
        // Restart-Level und Game Over-Fenster: wenn auf den Quit-Button geclickt wird -> Quit Game (zurueck zum Hauptmenue)
        if ((event.target.className == "btn btn-quit" && GameModel.KEY.ENTER.includes((event.key))) ||
            (event.type == "click" && event.target.className == "btn btn-quit")) {
            this.view.next = "startMenu";
            this.quitGame();
        }
        // Game Over Fenster: wenn auf den Restart-Game-Button geclickt wird -> restart game
        if ((event.target.className == "btn btn-restart-game" && GameModel.KEY.ENTER.includes((event.key))) ||
            (event.type == "click" && event.target.className == "btn btn-restart-game")) {
            this.restartGame();
        }

        // New Highscore-Fenster: wenn auf den Save-Button geclickt wird -> Save username (weiter zum Highscorescreen)
        if ((event.target.className == "btn btn-new_highscore" && GameModel.KEY.ENTER.includes((event.key))) ||
            (event.type == "click" && event.target.className == "btn btn-new_highscore")) {
            const username = this.getPlayerNameFromInput();
            saveHighScore(this.player.getCoinCounter(), username);
            this.view.next = 'highscore';
            this.quitGame();
        }
    }

    // Updated die Daten f??r die View
    update() {
        if (this.player.getAlive()) {
            {
                this.player.update();
                this.enemyGroup.update();
                this.platformGroup.update();
                this.coinGroup.update();
                this.handleCollisionObject(this.player);
            }
        }
        // wenn der spieler ein leben verloren hat, nur playerupdaten, alles andere ist angehalten
        else {
            if (this.player.getY() <= 96) {
                this.player.setYVelocity(0);
                this.player.setY(96);
                this.player.setXVelocity(0);
            }
            if(this.player.getY() <= 96) {
                this.view.freeze = true;
            }
            this.player.update();

            // wenn Spieler keine Leben mehr hat oder die Zeit abgelaufen ist
            if ((this.player.getLifeCounter() == 0) || (this.view.timeToFinishLevel <= 0)){

                // pruefen, ob ein neuer Highscore erreicht wurde
                this.handleGameOver(this.player.getCoinCounter());

            } else {
                // wenn Spieler noch leben uebrig hat
                this.showRestartBtn();
            }

            //TODO: player image gegen ghost austauschen

        }
    }

    // wertet GameOver aus -> wurde ein neuer Highscore erreicht?
    handleGameOver(userScore: number) {
        // wenn kein neuer Highscore erreich wurde
        if (!checkHighScore(userScore)) {
            CANVAS_DATA.DIV_GAME_OVER.style.display = "flex";

            // wenn das ende des Spiels (maximalses Level) nicht erreicht wurde
            if (this.gameModel.getCurrentLevel() <= this.gameModel.getMaxLevel()) {
                // pr??efe ob die zeit abgelaufen ist
                if (this.view.timeToFinishLevel <= 0) {
                    CANVAS_DATA.DIV_GAME_OVER.querySelector('div')!.innerHTML = "Time is up!<br/><br/><br/>Your score:<br/><br/>" + this.player.getCoinCounter();
                }
                // wenn keine Leben mehr vorhanden sind
                else {
                    CANVAS_DATA.DIV_GAME_OVER.querySelector('div')!.innerHTML = "Game over! <br/><br/><br/>Your score:<br/><br/>" + this.player.getCoinCounter();
                }
            // wenn das letzte Level durchgespeilt wurde
            } else if (this.gameModel.getCurrentLevel() > this.gameModel.getMaxLevel()) {
                CANVAS_DATA.DIV_GAME_OVER.querySelector('div')!.innerHTML = "You finished game! <br/><br/><br/> Your score:<br/><br/>" + this.player.getCoinCounter();
            }
        }
        // wenn ein neuer Highscore erreich wurde
        else {
            CANVAS_DATA.DIV_NEW_HIGHSCORE.style.display = "flex";
            if (this.gameModel.getCurrentLevel() <= this.gameModel.getMaxLevel()) {
                // wenn die Zeit abgelaufen war
                if (this.view.timeToFinishLevel <= 0) {
                    CANVAS_DATA.DIV_NEW_HIGHSCORE.querySelector('div')!.innerHTML = "Time is up!<br/><br/><br/>New highscore:<br/><br/>" + this.player.getCoinCounter();
                }
                // wenn keine Leben mehr vorhanden sind
                else {
                    CANVAS_DATA.DIV_NEW_HIGHSCORE.querySelector('div')!.innerHTML = "Game over<br /><br /><br /> New highscore:<br /><br />" + this.player.getCoinCounter();
                }
            } else if (this.gameModel.getCurrentLevel() > this.gameModel.getMaxLevel()) {
                CANVAS_DATA.DIV_NEW_HIGHSCORE.querySelector('div')!.innerHTML = "You finished game! <br /><br /><br /> New highscore:<br /><br />" + this.player.getCoinCounter();
            }
        }
    }

    getPlayerNameFromInput() {
        const input = document.getElementById('player_name')! as HTMLInputElement;
        return input.value;
    }

    /**
     * l??dt das n??chste Level
     * @param nextLevel
     */
    switchLevel(nextLevel: number) {
        console.log(nextLevel);
        if (nextLevel <= this.gameModel.getMaxLevel()) {
            this.gameModel.setCurrentLevel(nextLevel);
            this.resetLevelData();
            this.view.initLevel();
        } else {
            //TODO: Ende des Spiels, Highscore/Score anzeigen
            console.log("maximales level erreicht");
            this.view.freeze = true;
            this.handleGameOver(this.player.getCoinCounter());
        }
    }

    // Setzt die Leveldaten zurueck vor Eintritt ins das naechste Level
    resetLevelData() {
        this.player.resetPlayerPos();
        this.view.cleanup();
    }

    // setzt das Spiel fort, nachdem es pausiert wurde
    private resumeState() {
        this.gameModel.keyState.pause = false;
        CANVAS_DATA.DIV_PAUSE.style.display = "none";
        this.view.setLevelTimer();
    }

    // Pausiert das Spiel
    private pauseState() {
        this.gameModel.keyState.pause = true;
        CANVAS_DATA.DIV_PAUSE.style.display = "flex";
        this.view.stopLevelTimer(this.view.levelTimer);
    }
    // startet das Spiel ganz von vorne
    private restartGame() {
        this.view.freeze = false;
        this.view.next = 'world';
        this.view.done = true;
        CANVAS_DATA.DIV_RESTART.style.display = "none";
        CANVAS_DATA.DIV_GAME_OVER.style.display = "none";
        CANVAS_DATA.DIV_NEW_HIGHSCORE.style.display = "none";
        this.player.reset();

    }

    // setzt den Spieler wieder am Anfang des Levels beginnen, nachdem er gestorben ist und noch Leben uebrig hat
    private restartLevel() {
        CANVAS_DATA.DIV_RESTART.style.display = "none";
        this.view.freeze = false;
        this.player.reborn();
        this.view.setLevelTimer();
    }

    // zurueck zum StartMenu -> setzt alle Daten zurueck
    private quitGame() {
        this.view.done = true;
        this.view.freeze = false;
        CANVAS_DATA.DIV_RESTART.style.display = "none";
        CANVAS_DATA.DIV_GAME_OVER.style.display = "none";
        CANVAS_DATA.DIV_NEW_HIGHSCORE.style.display = "none";
        this.player.reset();
    }

    // blendet das RestartMenu mit Quit und Restart Game Button ein, wenn der Spieler ein Leben verliert und noch Leben uebrig hat.
    private showRestartBtn() {
        CANVAS_DATA.DIV_RESTART.style.display = "flex";
        CANVAS_DATA.DIV_RESTART.focus();
        this.view.stopLevelTimer(this.view.levelTimer);
    }

    /**
     * Kollisionsbehandlung eines Objekts
     * @param object
     */
    handleCollisionObject(object: GameObject) {
        // Collision-Handling zur Collision mit der Canvasbegrenzung
        // linke Seite des canvas
        if (object.getLeft() < 0) {
            object.setLeft(0)
        }
        // rechte Seite des canvas
        if (object.getRight() > CANVAS_DATA.GAME_WIDTH) {
            object.setRight(CANVAS_DATA.GAME_WIDTH)
        }
        // Obere Seite des canvas
        if (object.getTop() < 0) {
            object.setTop(0)
        }
        // untere Seite des canvas
        if (object.getBottom() > CANVAS_DATA.GAME_HEIGHT) {
            object.setInTheAir(false);
            object.setBottom(CANVAS_DATA.GAME_HEIGHT);
        }

        // Tilebased-Collision-Detection: Collision-Handling zur Collision mit einem Tile innerhalb der CollisionMap
        this.checkCollisionWithTile(object);
        // Pixelbased collision
        this.checkCollisionWithGameObject(object);
    }

    /**
     * checkt ob bei dem Gameobject eine COllision mit Tiles vorliegt, auf denen es sich gerade befindet
     * @param object GameObject
     */
    checkCollisionWithTile(object: GameObject) {
        let xleft = object.getLeft();
        let xright = object.getRight();
        let ytop = object.getTop();
        let ybottom = object.getBottom();
        const tiles = this.tileFinder.searchByRange(xleft, xright, ytop, ybottom);
        tiles.forEach((tile: {
            tileValue: number,
            xleft: number,
            xright: number,
            ytop: number,
            ybottom: number
        }) => {
            // nur zum Debuggen
            /*CANVAS_DATA.BUFFER_CTX.strokeStyle = "blue";
            CANVAS_DATA.BUFFER_CTX.lineWidth = 1;
            CANVAS_DATA.BUFFER_CTX.beginPath();
            CANVAS_DATA.BUFFER_CTX.rect(
                Math.floor(tile.xleft / CANVAS_DATA.TILE_SIZE) * CANVAS_DATA.TILE_SIZE,
                Math.floor(tile.ytop / CANVAS_DATA.TILE_SIZE) * CANVAS_DATA.TILE_SIZE,
                CANVAS_DATA.TILE_SIZE, CANVAS_DATA.TILE_SIZE);
            CANVAS_DATA.BUFFER_CTX.stroke();*/

            // 11 = c_left, 12 = c_top, 13 = c_right, 14 = c_bottom,
            // 21 = c_top_left, 22 = c_top_right, 23 = c_bottom_right, 24 = c_bottom_left,
            // 31 = c_bottom_left_right, 32 = c_top_left_right, 33 = c_right_top_bottom, 34 = c_left_top_bottom
            // 41 = c_top_left_right_bottom,
            // 51 = c_exit, 52 = c_water, 53 = c_coin, 54 = c_enemy
            // 99 = none,
            let topTileY: number, rightTileX: number, leftTileX: number,
                bottomTileY: number;

            leftTileX = tile.xleft;
            topTileY = tile.ytop;
            rightTileX = tile.xleft + CANVAS_DATA.TILE_SIZE;
            bottomTileY = tile.ytop + CANVAS_DATA.TILE_SIZE;

            if (tile.tileValue === undefined) return;
            switch (tile.tileValue) {
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
                    if (this.collidePlatformLeft(object, leftTileX)) return;
                    this.collidePlatformTop(object, topTileY);
                    break;
                case 22: //22 = c_top_right
                    if (this.collidePlatformRight(object, rightTileX)) return;
                    this.collidePlatformTop(object, topTileY);
                    break;
                case 23: // 23 = c_bottom_right
                    if (this.collidePlatformRight(object, rightTileX)) return;
                    this.collidePlatformBottom(object, bottomTileY);
                    break;
                case 24: // 24 = c_bottom_left
                    if (this.collidePlatformLeft(object, leftTileX)) return;
                    this.collidePlatformBottom(object, bottomTileY)
                    break;
                case 25: // 25 = c_bottom_top
                    if (this.collidePlatformTop(object, topTileY)) return;
                    this.collidePlatformBottom(object, bottomTileY)
                    break;

                case 31: // 33 = c_bottom_left_right
                    if (this.collidePlatformRight(object, rightTileX)) return;
                    if (this.collidePlatformLeft(object, leftTileX)) return;
                    this.collidePlatformBottom(object, bottomTileY)
                    break;
                case 32: //32 = top_left_right
                    if (this.collidePlatformRight(object, rightTileX)) return;
                    if (this.collidePlatformLeft(object, leftTileX)) return;
                    this.collidePlatformTop(object, topTileY)
                    break;
                case 33: //33 = right_top_bottom
                    if (this.collidePlatformRight(object, rightTileX)) return;
                    if (this.collidePlatformBottom(object, bottomTileY)) return;
                    this.collidePlatformTop(object, topTileY)
                    break;
                case 34: //34 = left_top_bottom
                    if (this.collidePlatformLeft(object, leftTileX)) return;
                    if (this.collidePlatformBottom(object, bottomTileY)) return;
                    this.collidePlatformTop(object, topTileY)
                    break;

                case 41: //41 = top_left_right_bottom
                    if (this.collidePlatformLeft(object, leftTileX)) return;
                    if (this.collidePlatformRight(object, rightTileX)) return;
                    if (this.collidePlatformTop(object, topTileY)) return;
                    this.collidePlatformBottom(object, bottomTileY);
                    break;
                case 51: // 51 = c_exit
                    this.switchLevel(this.gameModel.getCurrentLevel() + 1);
                    break;
                case 99:  // 99 = none
                    break;
                default:
                    break;
            }
        })
    }

    // Collision-Detection: Collision-Handling zur Collision mit einem GameObject
    checkCollisionWithGameObject(object: GameObject) {
        this.platformGroup.getSprites().forEach((movingPlatform: MovingPlatform) => {
            if (this.collideMovingPlatform(object, movingPlatform)) {
                this.collidePlatformRight(object, movingPlatform.getRight());
                this.collidePlatformLeft(object, movingPlatform.getLeft());
                if ((object.getBottom() > movingPlatform.getTop() && object.getOldBottom() <= movingPlatform.getTop())) {
                    if (movingPlatform.moveY) {
                        object.setBottom(movingPlatform.getTop());
                        if (object.getBottom() == movingPlatform.getTop()) {
                            object.setBottom(movingPlatform.getTop() + movingPlatform.moveDirection);
                        }
                    }
                    if (movingPlatform.moveX) {
                        object.setBottom(movingPlatform.getTop());
                        object.setX(object.getX() + movingPlatform.moveDirection);
                    }
                    object.setInTheAir(false);
                }
                //this.collidePlatformBottom(object, movingPlatform.getBottom());

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
                    this.player.setCoinCounter(this.player.getCoinCounter() + 1)
                }
            });
            this.waterGroup.getSprites().forEach((water: Water) => {
                if (this.collideWater(this.player, water)) {
                    this.player.died();
                }
            });
        }
    }

    // Response Funktionen - Auf die Collission reagieren und Objektposition anpassen
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
            object.setRight(tileLeft);
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
        return this.player.getLeft() < coin.getRight() &&
            this.player.getRight() > coin.getLeft() &&
            this.player.getBottom() > coin.getTop() &&
            this.player.getTop() < coin.getBottom();
    }

    collideEnemy(object: GameObject, enemy: Enemy) {
        return this.player.getLeft() < enemy.getRight() &&
            this.player.getRight() > enemy.getLeft() &&
            this.player.getTop() < enemy.getBottom() &&
            this.player.getBottom() > enemy.getTop();

    }

    collideWater(object: GameObject, water: Water) {
        return this.player.getLeft() < water.getRight() &&
            this.player.getRight() > water.getLeft() &&
            this.player.getTop() < water.getBottom() &&
            this.player.getBottom() > water.getTop();

    }

    collideMovingPlatform(object: GameObject, movingPlatform: MovingPlatform) {
        return object.getTop() < movingPlatform.getBottom() &&
            object.getBottom() > movingPlatform.getTop() &&
            object.getRight() > movingPlatform.getLeft() &&
            object.getLeft() < movingPlatform.getRight();

    }
}