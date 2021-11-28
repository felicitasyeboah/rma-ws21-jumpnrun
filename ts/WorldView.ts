import {State} from './State.js';
import {GameModel} from "./GameModel.js";
import {Player} from "./Player.js";

export class WorldView extends State {
    private tileMapData: any;
    private currentLevel: number;
    private player: Player;
    private tilesetMap: any;

    constructor(private gameModel: GameModel) {
        super(gameModel.canvasData);
        this.gameModel = gameModel;
        this.tileMapData = gameModel.tileMapLevelData;
        this.currentLevel = 1;

        this.player = gameModel.player;

        this.tilesetMap = gameModel.worldImages["tilesetMap"];
    }

    // startet die WorldView mit dem ersten Level
    startup() {
        if (this.currentLevel !== 1) {
            this.currentLevel = 1;
        }
        this.initLevel(1);
    }

    // Initieriert das jeweilige Level
    private initLevel(currentLevel: number) {
        if (this.currentLevel !== currentLevel) {
            this.currentLevel = currentLevel;
        }
        this.drawMap();
        this.drawPlayer();
    }

    // Zeichnet die Map
    private drawMap() {
        let levelMap = this.tileMapData["level" + this.currentLevel];
        for (let row = 0; row < this.mapRows; row++) {
            for (let col = 0; col < this.mapCols; col++) {

                let spritesInTileMap = 8;
                let tile = levelMap[row][col] - 1;
                let spriteWidth = this.tilesetMap.width / spritesInTileMap;
                let spriteHeight = this.tilesetMap.height;
                this.ctx.drawImage(this.tilesetMap,
                    tile * spriteWidth,
                    0,
                    spriteWidth,
                    spriteHeight,
                    col * this.tileSize,
                    row * this.tileSize,
                    this.tileSize,
                    this.tileSize);
            }
        }
    }

    // zeichnet den Player
    private drawPlayer() {
        this.ctx.fillStyle = "lightgrey";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        this.ctx.fillRect(
            this.player.getX(),
            this.player.getY(),
            this.player.getW(),
            this.player.getH());
        this.ctx.strokeRect(
            this.player.getX() + this.ctx.lineWidth * 0.5,
            this.player.getY() + this.ctx.lineWidth * 0.5,
            this.player.getW() - this.ctx.lineWidth,
            this.player.getH() - this.ctx.lineWidth);
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

    // Prueft Tasteneingaben
    getEvent(event: { [key: string]: string }) {
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
                    this.player.setYVeocity(this.player.getJumpHeight());
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

    // Updated den Canvas
    update() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawMap();
        this.drawPlayer();
    }
}