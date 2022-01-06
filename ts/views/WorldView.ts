import {State} from './State.js';
import {GameModel} from "../models/GameModel.js";
import {Player} from "../models/objects/Player.js";
import {Coin, Enemy, MovingPlatform, Water} from "../models/objects/GameObject.js";
import {SpriteGroup} from "../models/objects/SpriteGroup";

/**
 * Erstellt ein WorldView Objekt. Die WorldView stellt die Spielewelt dar.
 */
export class WorldView extends State {
    private tileMapLevelData: any;
    private player: Player;
    private tilesetMap: any;
    private levelMap: number[][];
    private _tileList: any;
    private spriteData: any;
    private enemyGroup: SpriteGroup;
    private coinGroup: SpriteGroup;
    private platformGroup: SpriteGroup;
    private waterGroup: SpriteGroup;


    constructor(private gameModel: GameModel) {
        super(gameModel.canvasData);
        this.gameModel = gameModel;
        this.tileMapLevelData = gameModel.tileMapLevelData;

        this.player = gameModel.getPlayer();
        this.levelMap = [];
        this.tilesetMap = gameModel.worldImages["tilesetMap"];
        this._tileList = [];
        this.spriteData = gameModel.spriteData;
        this.enemyGroup = gameModel.getEnemyGroup();
        this.coinGroup = gameModel.getCoinGroup();
        this.platformGroup = gameModel.getPlatformGroup();
        this.waterGroup = gameModel.getWaterGroup();

    }

    /**
     * startet die WorldView mit dem ersten Level
     */
    startup() {
        if (this.gameModel.getCurrentLevel() !== 1) {
            this.gameModel.setCurrentLevel(1);
        }
        this.initLevel();
    }

    cleanup() {
        this.levelMap = [];
        this._tileList = [];
    }

    /**
     * Initiert das jeweilige Level
     */
    initLevel() {
        this.loadMap();
        this.drawMap();
        this.drawPlayer();
    }

    /**
     * Lädt die Mapdaten
     * @private
     */
    private loadMap() {
        this.levelMap = this.tileMapLevelData["level" + this.gameModel.getCurrentLevel()];
        for (let row = 0; row < this.mapRows; row++) {
            for (let col = 0; col < this.mapCols; col++) {

                let tile = this.levelMap[row][col];

                // ground_blank
                if (tile == 0) {
                    this._tileList.push({
                        type: "ground_blank",
                        dx: col * this.tileSize,
                        dy: row * this.tileSize,
                        dw: this.tileSize,
                        dh: this.tileSize,
                    });
                }
                // ground_top
                if (tile == 1) {
                    this._tileList.push({
                        type: "ground_top",
                        dx: col * this.tileSize,
                        dy: row * this.tileSize,
                        dw: this.tileSize,
                        dh: this.tileSize,
                    });
                }
                // SLIME            // scaleSize = this.tileSize / w*h
                if (tile == 2) {
                    let slime = new Enemy(this.gameModel,
                        col * this.tileSize,
                        row * this.tileSize + this.tileSize - this.tileSize / this.spriteData["slime"].w * this.spriteData["slime"].h,
                        this.tileSize,
                        this.tileSize / this.spriteData["slime"].w * this.spriteData["slime"].h,
                        "slime")
                    this.enemyGroup.add(slime);
                }
                // Platform mit streuseln
                if (tile == 3) {

                    let platform = new MovingPlatform(this.gameModel, col * this.tileSize, row * this.tileSize, this.tileSize,
                        this.tileSize / this.spriteData["platform_topping"].w * this.spriteData["platform_topping"].h, 1, 0, "platform_topping");
                    this.platformGroup.add(platform);
                }
                // tile 4  = plattform ohne streusel
                if (tile == 4) {
                    let platform = new MovingPlatform(this.gameModel, col * this.tileSize, row * this.tileSize, this.tileSize,
                        this.tileSize / this.spriteData["platform"].w * this.spriteData["platform"].h, 0, 1, "platform");
                    this.platformGroup.add(platform);
                }

                // tile 5 = water
                if (tile == 5) {
                    let water = new Water(
                        this.gameModel,
                        col * this.tileSize,
                        row * this.tileSize + this.tileSize - this.tileSize / this.spriteData["water"].w * this.spriteData["water"].h,
                        this.tileSize,
                        this.tileSize / this.spriteData["water"].w * this.spriteData["water"].h,
                        "water");
                    this.waterGroup.add(water);
                }

                // TILE 6 = COIN
                if (tile == 6) {
                    let coin = new Coin(this.gameModel,
                        col * this.tileSize + (this.tileSize / 2) - this.spriteData["coin"].w / 4,
                        row * this.tileSize,
                        this.spriteData["coin"].w / 2,
                        this.spriteData["coin"].h / 2,
                        "coin");
                    this.coinGroup.add(coin);
                }

                // TILE 7 = EXIT
                if (tile == 7) {
                    this._tileList.push({
                        type: "exit",
                        dx: col * this.tileSize,
                        dy: row * this.tileSize,
                        dw: this.tileSize,
                        dh: this.tileSize / this.spriteData["exit"].w * this.spriteData["exit"].h,
                    });
                }
            }
        }
    }

    /**
     * Zeichnet die Map
     * @private
     */
    private drawMap() {
        for (let tile of this._tileList) {
            let spritesInTileMap = 8;
            let spriteWidth = this.tilesetMap.width / spritesInTileMap;
            let spriteHeight = this.tilesetMap.height;
            this.bufferCtx.drawImage(
                this.tilesetMap,
                this.spriteData[tile.type].x,
                this.spriteData[tile.type].y,
                this.spriteData[tile.type].w,
                this.spriteData[tile.type].h,
                tile.dx,
                tile.dy,
                tile.dw,
                tile.dh,
            );
            // this.bufferCtx.drawImage(this.tilesetMap,
            //     tile * spriteWidth,
            //     0,
            //     spriteWidth,
            //     spriteHeight,
            //     col * this.tileSize,
            //     row * this.tileSize,
            //     this.tileSize,
            //     this.tileSize);
            //this.bufferCtx.strokeStyle = "darkgrey";
            //this.bufferCtx.lineWidth = 0.5;
            //this.bufferCtx.strokeRect(col * this.tileSize, row * this.tileSize, this.tileSize - this.bufferCtx.lineWidth, this.tileSize - this.bufferCtx.lineWidth);

        }
    }


    /**
     * zeichnet den Player
     * @private
     */
    private drawPlayer() {
        this.bufferCtx.fillStyle = "lightgrey";
        this.bufferCtx.strokeStyle = "white";
        this.bufferCtx.lineWidth = 5;
        this.bufferCtx.fillRect(
            this.player.getX(),
            this.player.getY(),
            this.player.getW(),
            this.player.getH());
        this.bufferCtx.strokeRect(
            this.player.getX() + this.bufferCtx.lineWidth * 0.5,
            this.player.getY() + this.bufferCtx.lineWidth * 0.5,
            this.player.getW() - this.bufferCtx.lineWidth,
            this.player.getH() - this.bufferCtx.lineWidth);
        // this.ctx.drawImage(this.player.getPlayerSprites(),
        //     this.player.getTileX() * this.player.getSpriteWidth(),
        //     this.player.getTileY() * this.player.getSpriteHeight(),
        //     this.player.getSpriteWidth(),
        //     this.player.getSpriteHeight(),
        //     this.player.getX(),
        //     this.player.getY(),
        //     this.player.getW(),
        //     this.player.getH());
    }

    private drawEntities() {
        this.waterGroup.getSprites().forEach((water: Water) => {
            this.bufferCtx.drawImage(
                this.tilesetMap,
                this.spriteData[water.type].x,
                this.spriteData[water.type].y,
                this.spriteData[water.type].w,
                this.spriteData[water.type].h,
                water.getX(),
                water.getY(),
                water.getW(),
                water.getH()
            )
        });
        this.enemyGroup.getSprites().forEach((enemy: Enemy) => (
            this.bufferCtx.drawImage(
                this.tilesetMap,
                this.spriteData[enemy.type].x,
                this.spriteData[enemy.type].y,
                this.spriteData[enemy.type].w,
                this.spriteData[enemy.type].h,
                enemy.getX(),
                enemy.getY(),
                enemy.getW(),
                enemy.getH()
            )
        ));
        this.platformGroup.getSprites().forEach((platform: MovingPlatform) => (
            this.bufferCtx.drawImage(
                this.tilesetMap,
                this.spriteData[platform.type].x,
                this.spriteData[platform.type].y,
                this.spriteData[platform.type].w,
                this.spriteData[platform.type].h,
                platform.getX(),
                platform.getY(),
                platform.getW(),
                platform.getH()
            )
        ));
        this.coinGroup.getSprites().forEach((coin: Coin) => (
            this.bufferCtx.drawImage(
                this.tilesetMap,
                this.spriteData[coin.type].x,
                this.spriteData[coin.type].y,
                this.spriteData[coin.type].w,
                this.spriteData[coin.type].h,
                coin.getX(),
                coin.getY(),
                coin.getW(),
                coin.getH()
            )));
    }

    //TODO: Frage: Eventhandling auslagern in Controller?
    /**
     * Prueft die Tasteneingaben in der WorldView
     * @param event
     */
    getEvent(event: any): void {
        if (event.type === "keydown") {
            if (State.KEY.LEFT.includes(event.key)) {
                this.gameModel.keyState.left = true;
            }
            if (State.KEY.RIGHT.includes(event.key)) {
                this.gameModel.keyState.right = true;
            }
            if (State.KEY.JUMP.includes(event.key)) {
                if (!this.player.getInTheAir() && !this.gameModel.keyState.jump) {
                    this.gameModel.keyState.jump = true;
                    this.player.setYVelocity(this.player.getJumpHeight());
                }
            }
        }
        if (event.type === "keyup") {
            if (State.KEY.LEFT.includes(event.key)) {
                this.gameModel.keyState.left = false;
            } else if (State.KEY.RIGHT.includes(event.key)) {
                this.gameModel.keyState.right = false;
            } else if (State.KEY.JUMP.includes(event.key)) {
                this.gameModel.keyState.jump = false;
            }
        }
        // if (State.KEY.RIGHT.includes(event.key)) {
        //     this.player.move("right");
        // } else if (State.KEY.LEFT.includes(event.key)) {
        //     this.player.move("left");
        // } else if (State.KEY.JUMP.includes(event.key)) {
        //     this.player.move("jump");
        // }
    }

    /**
     * Redraws the View
     */
    update() {
        this.bufferCtx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
        this.drawMap();
        this.drawPlayer();
        this.drawEntities();
    }

    // Getter & Setter
    get tileList(): any {
        return this._tileList;
    }

}