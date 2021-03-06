import {GameModel} from "../models/GameModel.js";
import {State} from "./State.js";
import {CANVAS_DATA} from "../canvas_config.js";
import Button from "../models/Button.js";
import {showHighScores} from "../highscore_utils.js";

/**
 * Stellt die Highscoretabelle dar
 */
export default class HighscoreView extends State {
    protected _next: string;
    private buttonWidth: number;
    private buttonHeight: number;
    private _btnBackToMenu!: Button;

    constructor(private gameModel: GameModel) {
        super();
        this._next = "startMenu";
        this.buttonWidth = 8;
        this.buttonHeight = 1.5;
        this.font = "1.4em " + CANVAS_DATA.FONT;
    }

    startup(): void {
        this._drawBackground();
        this._initButton();
        this._drawButton();
        CANVAS_DATA.DIV_HIGHSCORE.style.display = "flex";
        HighscoreView._displayHighScores();
    }

    // erstellt  den "Back to Menu" button
    private _initButton() {
        this._btnBackToMenu = new Button(
            'startMenu',
            this.buttonWidth,
            this.buttonHeight,
            6,
            17,
            undefined, 1,
            'white', 7,
            this.font,
            "BACK TO MENU",
            "white");
        this._buttonGroup.set(this._btnBackToMenu.name, this._btnBackToMenu);
        this._activeButton = this._btnBackToMenu;
    }

    // zeichnet den Button
    private _drawButton() {
        this.buttonGroup.forEach((button) => {
            if (button.bodyColor) {
                this.bufferCtx.fillStyle = button.bodyColor;
                if (button.alpha) {
                    this.bufferCtx.globalAlpha = button.alpha;
                }
                this.bufferCtx.fillRect(
                    button.x, button.y,
                    button.width, button.height);
            }
            if (button.borderColor) {
                this.bufferCtx.strokeStyle = button.borderColor;
            }
            if (button.lineWidth) {
                this.bufferCtx.lineWidth = button.lineWidth;
            }
            this.bufferCtx.globalAlpha = 1;
            this.bufferCtx.strokeRect(
                button.x,
                button.y,
                button.width, button.height);
            if (button.font) {
                this.bufferCtx.font = button.font;
            }
            if (button.fontColor) {
                this.bufferCtx.fillStyle = button.fontColor;
            }
            if (button.text) {
                this.bufferCtx.textAlign = "center";
                this.bufferCtx.textBaseline = "middle";
                this.bufferCtx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);
            }
        })
    }

    // zeichnet den Hintergrund
    private _drawBackground() {
        this.bufferCtx.drawImage(
            this.gameModel.backgroundImage,
            0,
            0,
            this.gameWidth,
            this.gameHeight
        );
    }

    // Stellt die Highscoretabelle dar; uebergeben aus dem LocalStorage
    private static _displayHighScores() {
        showHighScores();
    }

    // leert die view
    cleanup(): void {
        CANVAS_DATA.BUFFER_CTX.clearRect(0,0, CANVAS_DATA.BUFFER_CANVAS.width, CANVAS_DATA.BUFFER_CANVAS.height);
        this._buttonGroup.clear();
    }

    // updated den das Zeichnen auf dem Canvas
    update(): void {
        CANVAS_DATA.BUFFER_CTX.clearRect(0,0, CANVAS_DATA.BUFFER_CANVAS.width, CANVAS_DATA.BUFFER_CANVAS.height);
        this._drawBackground();
        this._drawButton();
    }

}