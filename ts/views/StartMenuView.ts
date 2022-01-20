import {GameModel} from "../models/GameModel.js";
import {State} from "./State.js";
import Button from "../models/Button.js";
import {CANVAS_DATA} from "../canvas_config.js";

export default class StartMenuView extends State {
    protected _next: string;
    private buttonWidth: number;
    private buttonHeight: number;
    private _btnStartGame!: Button;
    private _btnHighscore!: Button;
    private _btnInstruction!: Button;

    constructor(private gameModel: GameModel) {
        super();
        this._next = "world";
        this.buttonWidth = 8;
        this.buttonHeight = 1.5;
        this.font = "1.4em " + CANVAS_DATA.FONT;

    }

    startup(): void {
        this._initButtons();
        this._drawBackground();
        this._drawButtons();
        this._drawHeadline();
    }

    /**
     * erstellt die Buttons der Startmenues
     * @private
     */
    private _initButtons() {
        this._btnStartGame = new Button(
            'world',
            this.buttonWidth,
            this.buttonHeight,
            6,
            7.5,
            '#FEA443', undefined,
            '#1f4854', 7,
            this.font,
            "START GAME",
            "#1f4854");

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

    /**
     *  zeichnet die Buttons des Startmenues
     * @private
     */
    private _drawButtons() {
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
            yStart += spacer;
        })
    }

    /**
     * zeichnet den Hintergrund
     * @private
     */
    private _drawBackground() {
        this.bufferCtx.drawImage(
            this.gameModel.backgroundImage,
            0,
            0,
            this.gameWidth,
            this.gameHeight
        );
    }

    /**
     * zeichnet die Ueberschrift
     * @private
     */
    private _drawHeadline() {
        this.bufferCtx.font = "2.4em" + CANVAS_DATA.FONT;
        this.bufferCtx.fillStyle = "#1f4854";
        this.bufferCtx.fillText("* PIXL JUMPER *", CANVAS_DATA.TILE_SIZE*10, CANVAS_DATA.TILE_SIZE * 4);

    }

    /**
     * Raumt die view auf, vor eintritt in eine neue View
     */
    cleanup(): void {
        CANVAS_DATA.BUFFER_CTX.clearRect(0,0, CANVAS_DATA.BUFFER_CANVAS.width, CANVAS_DATA.BUFFER_CANVAS.height);
        this._buttonGroup.clear();

    }

    /**
     * updated...
     */
    update(){
        CANVAS_DATA.BUFFER_CTX.imageSmoothingEnabled = false;
        CANVAS_DATA.BUFFER_CTX.clearRect(0,0, CANVAS_DATA.BUFFER_CANVAS.width, CANVAS_DATA.BUFFER_CANVAS.height);
        this._drawBackground();
        this._drawButtons();
        this._drawHeadline();

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