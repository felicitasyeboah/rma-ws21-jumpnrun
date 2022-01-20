import {GameModel} from "../models/GameModel.js";
import {StateController} from "./StateController.js";
import HighscoreView from "../views/HighscoreView.js";
import {CANVAS_DATA} from "../canvas_config.js";
import Button from "../models/Button.js";

export class HighscoreController extends StateController {
    constructor(protected gameModel: GameModel, protected view: HighscoreView) {
        super(gameModel);
    }

    handleEvent(event: any): void {
        if (event.type === "keydown") {

            if (GameModel.KEY.ENTER.includes(event.key)) {
                this.gameModel.keyState.enter = true;
                this.handleSelectedButton(this.view.activeButton!);
            }
        }
        if (event.type === "keyup") {
           if (GameModel.KEY.ENTER.includes(event.key)) {
                this.gameModel.keyState.enter = false;
            }
        }
        if (event.type === "click") {
            this.handleClickedButton(event);
        }

        if (event.type === "mousemove") {
            this.handleMouseMovement(event);
        }
    }

    // passt die Collisionbox der Buttons, an die jeweilige Groeße des Canvas bzw. des Browserfensters an
    // (bei resizen des Fensters, waehrend das Spiel laeuft.)
    handleButtonBoundings() {
        let t = CANVAS_DATA.DISPLAY_CANVAS.width / CANVAS_DATA.COLS;
        this.view.buttonGroup.forEach((btn: Button) => {
            btn.boundingBoxWidth = t * btn.widthInCols;
            btn.boundingBoxHeight = t * btn.heightInRows;
            btn.boundingBoxX = t * btn.xInCols;
            btn.boundingBoxY = t * btn.yInRows;
        })
    }
    // gibt die Position der Maus auf dem Canvas zurueck
    getMousePos(canvas: HTMLCanvasElement, event: any) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    // gibt zurueck, ob die Maus sich ueber einem der Menuebuttons befindet
    mouseOverlapsButton(pos: { [key: string]: number }, button: Button) {
        if (pos.x < button.boundingBoxX || pos.x > button.boundingBoxX + button.boundingBoxWidth ||
            pos.y < button.boundingBoxY || pos.y > button.boundingBoxY + button.boundingBoxHeight) return false
        else return true;
    }

    // findet den Button, auf den geklickt wurde, anhand der Mausposition
    handleClickedButton(event: Event) {
        let mousePos = this.getMousePos(CANVAS_DATA.DISPLAY_CANVAS, event);
        this.view.buttonGroup.forEach((btn: Button) => {

            if (this.mouseOverlapsButton(mousePos, btn)) {
                this.handleSelectedButton(btn);
            }
        });
    }
    // fuehrt die Funktion, fuer die der ausgewaehlte Buttons steht, aus
    handleSelectedButton(btn: Button) {
        btn.bodyColor = undefined;
        CANVAS_DATA.DIV_HIGHSCORE.style.display = "none"; //TODO: oder zu cleanup in highscoreview verlegen
        this.view.done = true;

    }
    // prueft die Position der Maus und gibt bei einer Ueberlappung mit einem Button,
    handleMouseMovement(event: MouseEvent) {
        let mousePos = this.getMousePos(CANVAS_DATA.DISPLAY_CANVAS, event);
        this.view.buttonGroup.forEach((btn: Button) => {
            if (this.mouseOverlapsButton(mousePos, btn)) {
                this.highlightButton(btn);
            } else if(!this.mouseOverlapsButton(mousePos, btn)) {
                this.view.buttonGroup.forEach((btn: Button) => {
                    btn.bodyColor = undefined;
                    // btn.alpha = 1;
                    btn.fontColor = 'white';
                    btn.borderColor = 'white';
                });
            }
        });
    }
    // highlightet den ausgewählten button
    highlightButton(btn: Button) {
        btn.alpha = 1;
        btn.bodyColor = '#FEA443';
        btn.fontColor = '#3b899f';
        btn.borderColor = '#3b899f';
        this.view.activeButton = btn;
    }
    update(): void {
        this.handleButtonBoundings();
    }
}
