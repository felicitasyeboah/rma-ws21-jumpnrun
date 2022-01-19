import {State} from './State.js';
import {GameModel} from "../models/GameModel.js";
import {Player} from "../models/objects/Player.js";
import {Coin, Door, Enemy, Heart, MovingPlatform, Water} from "../models/objects/GameObject.js";
import {SpriteGroup} from "../models/objects/SpriteGroup.js";
import {CANVAS_DATA} from "../game_config.js";

/**
 * Erstellt ein WorldView Objekt. Die WorldView stellt die Spielewelt dar.
 */
export class WorldView extends State {
    private tileMapLevelData: any;
    private player: Player;
    private tilesetMap: any;
    private bgImage: any;
    private levelMap: number[][];
    private _tileList: any;
    private spriteData: any;
    private enemyGroup: SpriteGroup;
    private coinGroup: SpriteGroup;
    private platformGroup: SpriteGroup;
    private waterGroup: SpriteGroup;
    private heartGroup: SpriteGroup;
    private hudCtx: CanvasRenderingContext2D;
    private _timeToFinishLevel: number;
    levelTimer: number;
    protected _next: string;


    constructor(private gameModel: GameModel) {
        super(CANVAS_DATA);
        this._next = "startMenu";
        this.hudCtx = CANVAS_DATA.HUD_CTX;
        this.tileMapLevelData = gameModel.tileMapLevelData;
        this._timeToFinishLevel = 100; // in seconds
        this.player = gameModel.getPlayer();
        this.levelMap = [];
        this.tilesetMap = gameModel.worldImages["tilesetMap"];
        this.bgImage = gameModel.worldImages["background"];
        this._tileList = [];
        this.spriteData = gameModel.spriteData;
        this.enemyGroup = gameModel.getEnemyGroup();
        this.coinGroup = gameModel.getCoinGroup();
        this.platformGroup = gameModel.getPlatformGroup();
        this.waterGroup = gameModel.getWaterGroup();
        this.heartGroup = gameModel.getHeartGroup();
        this.levelTimer = 0;
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
        this.stopLevelTimer(this.levelTimer);
        this.levelMap = [];
        this._tileList = [];
        this.coinGroup.setSprites([]);
        this.enemyGroup.setSprites([]);
        this.platformGroup.setSprites([]);
        this.waterGroup.setSprites([]);
        this.heartGroup.setSprites([]);
    }

    /**
     * Initiert das jeweilige Level
     */
    initLevel() {
        this._timeToFinishLevel = 100;
        this.loadMap();
        this.drawBackground();
        this.initHud();
        this.drawMap();
        this.drawEntities();
        this.drawPlayer();
        this.setLevelTimer();
    }

    setLevelTimer() {
        this.levelTimer = setInterval(() => {
            this._timeToFinishLevel -= 1;
            if (this._timeToFinishLevel <= 0) {
                this.stopLevelTimer(this.levelTimer);
            }
        }, 1000);
    }

    stopLevelTimer(timer: number | undefined) {
        clearInterval(timer);
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
                        x: col * this.tileSize,
                        y: row * this.tileSize,
                        w: this.tileSize,
                        h: this.tileSize,
                    });
                }
                // ground_top
                if (tile == 1) {
                    this._tileList.push({
                        type: "ground_top",
                        x: col * this.tileSize,
                        y: row * this.tileSize,
                        w: this.tileSize,
                        h: this.tileSize,
                    });
                }
                // SLIME            // scaleSize = this.tileSize / w*h
                if (tile == 2) {
                    let slime = new Enemy(this.gameModel,
                        col * this.tileSize,
                        row * this.tileSize + this.tileSize - this.tileSize / this.spriteData.slime.w * this.spriteData.slime.h,
                        this.spriteData.slime.type)
                    this.enemyGroup.add(slime);
                }
                // Platform mit streuseln
                if (tile == 3) {

                    let platform = new MovingPlatform(this.gameModel,
                        col * this.tileSize,
                        row * this.tileSize,
                        1,
                        0,
                        "movingPlatformX");
                    this.platformGroup.add(platform);
                }
                // tile 4  = plattform ohne streusel
                if (tile == 4) {
                    let platform = new MovingPlatform(this.gameModel,
                        col * this.tileSize,
                        row * this.tileSize,
                        0,
                        1,
                        "movingPlatformY");
                    this.platformGroup.add(platform);
                }

                // tile 5 = water
                if (tile == 5) {
                    let water = new Water(
                        this.gameModel,
                        col * this.tileSize,
                        row * this.tileSize + this.tileSize - this.tileSize / this.spriteData.water.w * this.spriteData.water.h
                        );
                    this.waterGroup.add(water);
                }

                // TILE 6 = COIN
                if (tile == 6) {
                    let coin = new Coin(this.gameModel,
                        col * this.tileSize + (this.tileSize / 2) - this.spriteData.coin.w * 0.3,
                        row * this.tileSize);
                    this.coinGroup.add(coin);
                }

                // TILE 7 = DOOR
                if (tile == 7) {
                    const door = new Door(
                        this.gameModel,
                        col * this.tileSize,
                        row * this.tileSize);
                    this._tileList.push(
                        door);/*{
                        type: "exit",
                        dx: col * this.tileSize,
                        dy: row * this.tileSize,
                        dw: this.tileSize,
                        dh: this.tileSize / this.spriteData["exit"].w * this.spriteData["exit"].h,
                    });*/
                }
            }
        }
        console.log(this._tileList);
    }

    // Init HUD
    private initHud() {
        let spacing = 3;
        // HUD Coin Count
        let hudCoin = new Coin(this.gameModel,
            this.tileSize * 12.5,
            43);
        this.coinGroup.add(hudCoin);

        // HUD Life count
        let hudHeartFull1L = new Heart(this.gameModel,
            this.tileSize * 3.5,
            42,
            "heart_full");

        let hudHeartFull2L = new Heart(this.gameModel,
            hudHeartFull1L.getX() + hudHeartFull1L.getW() + spacing,
            42,
            "heart_full");
        let hudHeartFull3L = new Heart(this.gameModel,
            hudHeartFull2L.getX() + hudHeartFull2L.getW() + spacing,
            42,
            "heart_full");
        let hudHeart1L = new Heart(this.gameModel,
            this.tileSize * 3.5,
            42,
            "heart_empty");
        let hudHeart2L = new Heart(this.gameModel,
            hudHeart1L.getX() + hudHeart1L.getW() + spacing,
            42,
            "heart_empty");
        let hudHeart3L = new Heart(this.gameModel,
            hudHeart2L.getX() + hudHeart2L.getW() + spacing,
            42,
            "heart_empty");

        this.heartGroup.add(hudHeart1L);
        this.heartGroup.add(hudHeart2L);
        this.heartGroup.add(hudHeart3L);
        if (this.player.getLifeCounter() == 1 || this.player.getLifeCounter() == 2 || this.player.getLifeCounter() == 3) {
            this.heartGroup.add(hudHeartFull1L);
        }
        if (this.player.getLifeCounter() == 2 || this.player.getLifeCounter() == 3) {
            this.heartGroup.add(hudHeartFull2L);
        }
        if (this.player.getLifeCounter() == 3) {
            this.heartGroup.add(hudHeartFull3L);
        }
    }

    private drawBackground() {
        this.bufferCtx.drawImage(this.bgImage, 0, 0, this.CANVAS_DATA.GAME_WIDTH, this.CANVAS_DATA.GAME_HEIGHT);
    }

    /**
     * Zeichnet die Map
     * @private
     */
    private drawMap() {
        for (let tile of this._tileList) {
            this.bufferCtx.drawImage(
                this.tilesetMap,
                this.spriteData[tile.type].x,
                this.spriteData[tile.type].y,
                this.spriteData[tile.type].w,
                this.spriteData[tile.type].h,
                tile.x,
                tile.y,
                tile.w,
                tile.h,
            );

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

        // this.bufferCtx.drawImage(this.player.getPlayerSprites(),
        //     this.player.playerData.frames[0].rect[0],//getTileX() * this.player.getSpriteWidth(),
        //     this.player.playerData.frames[0].rect[1],//this.player.getTileY() * this.player.getSpriteHeight(),
        //     this.player.playerData.frames[0].rect[2],//this.player.getSpriteWidth(),
        //     this.player.playerData.frames[0].rect[3],//this.player.getSpriteHeight(),
        //     this.player.getX(),
        //     this.player.getY(),
        //     this.player.getW(),// * this.player.playerData.frames[0].rect[2] /this.player.playerData.frames[0].rect[3],
        //     this.player.getH());

        this.bufferCtx.drawImage(this.player.getPlayerSprites(), 72 * this.player.currentFrame, 97 * this.player.getTileY(), 72, 97, this.player.getX(), this.player.getY(),
            this.player.getW(), this.player.getH());
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

        this.heartGroup.getSprites().forEach((heart: Heart) => (
            this.bufferCtx.drawImage(
                this.tilesetMap,
                this.spriteData[heart.type].x,
                this.spriteData[heart.type].y,
                this.spriteData[heart.type].w,
                this.spriteData[heart.type].h,
                heart.getX(),
                heart.getY(),
                heart.getW(),
                heart.getH()
            )));
    }

    drawHud() {
        this.hudCtx.font = "1.2em 'Press Start 2P', cursive";
        this.hudCtx.fillStyle = "#ffffff";
        this.hudCtx.fillText(
            "x" + this.player.getCoinCounter(),
            this.tileSize * 13,
            55);
        this.hudCtx.fillText(
            "LIVES", this.tileSize * 1.5,
            55);
        this.hudCtx.fillText(
            "LEVEL " + this.gameModel.getCurrentLevel() + "/" + this.gameModel.getMaxLevel(),
            this.tileSize * 7,
            55);

        this.hudCtx.fillText("TIME " + this._timeToFinishLevel.toString(), this.tileSize * 15.5, 55)
        this.bufferCtx.drawImage(CANVAS_DATA.HUD_CANVAS, 0, 0);
    }

    /**
     * Redraws the View
     */
    update() {
        this.hudCtx.clearRect(0, 0, this.gameWidth, this.hudCtx.canvas.height);
        this.bufferCtx.clearRect(0, 0, this.gameWidth, this.gameHeight);
        this.displayCtx.clearRect(0, 0, this.displayCanvas.width, this.displayCanvas.height);
        this.drawBackground();
        this.drawMap();
        this.drawEntities();
        this.drawHud();
        this.drawPlayer();
    }

// Getter & Setter
    get tileList(): any {
        return this._tileList;
    }

    get timeToFinishLevel(): number {
        return this._timeToFinishLevel;
    }

    set timeToFinishLevel(value: number) {
        this._timeToFinishLevel = value;
    }


}