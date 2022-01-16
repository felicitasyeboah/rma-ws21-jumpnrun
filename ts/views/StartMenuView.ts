import {GameModel} from "../models/GameModel.js";
import {State} from "./State.js";
import Button from "../models/Button.js";
import {CANVAS_DATA} from "../main.js";

export default class StartMenuView extends State {
    protected _next: string;
    private buttonWidth: number;
    private buttonHeight: number;
    private _btnStartGame!: Button;
    private _btnHighscore!: Button;
    private _btnInstruction!: Button;

    constructor(private gameModel: GameModel) {
        super(gameModel.canvasData);
        this._next = "world";
        this.buttonWidth = 8;
        this.buttonHeight = 1.5;
        this.font = "1.4em " + CANVAS_DATA.FONT;

    }


    startup(): void {
        this._initButtons();
        this._drawBackground();
        this._drawButtons();
    }
    private _initButtons() {
        this._btnStartGame = new Button(
            'world',
            this.buttonWidth,
            this.buttonHeight,
            6,
            7.5,
            '#FEA443', 0.9,
            'blue', 7,
            this.font,
            "START GAME",
            "blue");

        this._btnHighscore = new Button(
            'highscore',
            this.buttonWidth,
            this.buttonHeight,
            6,
            9.5,
            undefined, undefined,
            'white', 7,
            this.font,
            "HIGHSCORE",
            "white");

        this._btnInstruction = new Button(
            'instruction',
            this.buttonWidth,
            this.buttonHeight,
            6,
            11.5,
            undefined, undefined,
            'white', 7,
            this.font,
            "INSTRUCTION",
            "white");

        this._buttonGroup.set(this._btnStartGame.name, this._btnStartGame);
        this._buttonGroup.set(this._btnHighscore.name, this._btnHighscore);
        this._buttonGroup.set(this._btnInstruction.name, this._btnInstruction);
        this._activeButton = this._btnStartGame;
    }
    private _drawButtons() {
        let x = 6 * CANVAS_DATA.TILE_SIZE;
        let yStart = 7.5 * CANVAS_DATA.TILE_SIZE;
        let spacer = 2;
        this.buttonGroup.forEach((button) => {

            if(button.bodyColor){
                this.bufferCtx.fillStyle =  button.bodyColor;
                if(button.alpha) {
                    this.bufferCtx.globalAlpha =  button.alpha;
                }
                this.bufferCtx.fillRect(
                    button.x, button.y,
                    button.width, button.height);
            }
            if(button.borderColor) {
                this.bufferCtx.strokeStyle = button.borderColor;
            }
            if(button.lineWidth) {
                this.bufferCtx.lineWidth = button.lineWidth;
            }
            this.bufferCtx.globalAlpha = 1;
            this.bufferCtx.strokeRect(
                button.x,
                button.y,
                button.width, button.height);
            if(button.font) {
                this.bufferCtx.font = button.font;
            }
            if(button.fontColor) {
                this.bufferCtx.fillStyle = button.fontColor;
            }
            if(button.text)
            {
                this.bufferCtx.textAlign="center";
                this.bufferCtx.textBaseline = "middle";
                this.bufferCtx.fillText(button.text, button.x + button.width/2, button.y + button.height/2);
            }

//console.log(button.boundingBoxHeight, button.boundingBoxWidth, button.boundingBoxX, button.boundingBoxY);

            //button.drawButton(button.name!, this.bufferCtx, x, yStart);
            yStart += spacer;
        })
        // this.btnStartGame.drawButton('start_game', this.bufferCtx, 6, 9);
        // this.btnHighscore.drawButton('highscore', this.bufferCtx, 6, 11);
        // this.btnInstruction.drawButton('instruction', this.bufferCtx, 6, 13);
    }
    private _drawBackground() {
        this.bufferCtx.drawImage(
            this.gameModel.backgroundImage,
            0,
            0,
            this.gameWidth,
            this.gameHeight
        );
    }

    cleanup(): void {
        this.CANVAS_DATA.BUFFER_CTX.clearRect(0,0, CANVAS_DATA.BUFFER_CANVAS.width, CANVAS_DATA.BUFFER_CANVAS.height);
        this._buttonGroup.clear();

    }

    update(){
        this.CANVAS_DATA.BUFFER_CTX.clearRect(0,0, CANVAS_DATA.BUFFER_CANVAS.width, CANVAS_DATA.BUFFER_CANVAS.height);
        this._drawBackground();
        this._drawButtons();
    }


    get btnStartGame(): Button {
        return this._btnStartGame;
    }

    set btnStartGame(value: Button) {
        this._btnStartGame = value;
    }

    get btnHighscore(): Button {
        return this._btnHighscore;
    }

    set btnHighscore(value: Button) {
        this._btnHighscore = value;
    }

    get btnInstruction(): Button {
        return this._btnInstruction;
    }

    set btnInstruction(value: Button) {
        this._btnInstruction = value;
    }



}