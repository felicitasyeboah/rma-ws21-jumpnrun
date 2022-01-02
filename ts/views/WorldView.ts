import {State} from './State.js';
import {GameModel} from "../models/GameModel.js";
import {Player} from "../models/objects/Player.js";

/**
 * Erstellt ein WorldView Objekt. Die WorldView stellt die Spielewelt dar.
 */
export class WorldView extends State {
    private tileMapData: any;
    private player: Player;
    private tilesetMap: any;

    constructor(private gameModel: GameModel) {
        super(gameModel.canvasData);
        this.gameModel = gameModel;
        this.tileMapData = gameModel.tileMapLevelData;

        this.player = gameModel.player;

        this.tilesetMap = gameModel.worldImages["tilesetMap"];
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

    }

    /**
     * Initiert das jeweilige Level
     */
    initLevel() {
        this.drawMap();
        this.drawPlayer();
    }

    /**
     * Zeichnet die Map
     * @private
     */
    private drawMap() {
        let levelMap = this.tileMapData["level" + this.gameModel.getCurrentLevel()];
        for (let row = 0; row < this.mapRows; row++) {
            for (let col = 0; col < this.mapCols; col++) {

                let spritesInTileMap = 8;
                let tile = levelMap[row][col];
                let spriteWidth = this.tilesetMap.width / spritesInTileMap;
                let spriteHeight = this.tilesetMap.height;
                this.bufferCtx.drawImage(this.tilesetMap,
                    tile * spriteWidth,
                    0,
                    spriteWidth,
                    spriteHeight,
                    col * this.tileSize,
                    row * this.tileSize,
                    this.tileSize,
                    this.tileSize);
                this.bufferCtx.strokeStyle = "darkgrey";
                this.bufferCtx.lineWidth = 0.5;
                this.bufferCtx.strokeRect(col * this.tileSize, row * this.tileSize, this.tileSize - this.bufferCtx.lineWidth, this.tileSize - this.bufferCtx.lineWidth);
            }
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
                if (!this.player.getJumping() && !this.gameModel.keyState.jump) {
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
    }
}