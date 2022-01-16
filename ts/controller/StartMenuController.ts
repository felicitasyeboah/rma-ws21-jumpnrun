import {StateController} from "./StateController.js";
import {GameModel} from "../models/GameModel.js";
import StartMenuView from "../views/StartMenuView.js";
import Button from "../models/Button.js";
import {CANVAS_DATA} from "../main.js";
//TODO: eintragen, was das bei highscore die highscoreview und bei instruction die instructionview geladen wird
/*
    Verarbeitet Benutzereingaben per Maus oder Tastatur,
    passt Daten des Models an und aktualisiert die StartMenuView
 */
export class StartMenuController extends StateController {
    constructor(protected gameModel: GameModel, protected view: StartMenuView) {
        super(gameModel);
    }

    // Verarbeitet die Maus- und Keyboard Events, die vom GameController kommen
    handleEvent(event: any): void {
        if (event.type === "keydown") {
            if (GameModel.KEY.UP.includes(event.key)) {
                this.gameModel.keyState.up = true;
                this.switchButtonUpwards();
            }
            if (GameModel.KEY.DOWN.includes(event.key)) {
                this.gameModel.keyState.down = true;
                this.switchButtonDownwards();
            }
            if (GameModel.KEY.ENTER.includes(event.key)) {
                this.gameModel.keyState.enter = true;
                this.handleSelectedButton(this.view.activeButton!);
            }
        }
        if (event.type === "keyup") {
            if (GameModel.KEY.UP.includes(event.key)) {
                this.gameModel.keyState.up = false;
            } else if (GameModel.KEY.DOWN.includes(event.key)) {
                this.gameModel.keyState.down = false;
            } else if (GameModel.KEY.ENTER.includes(event.key)) {
                this.gameModel.keyState.enter = false;
            }
        }
        if (event.type === "click") {
            console.log("click");
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
        let mousePos = this.getMousePos(this.canvasData.DISPLAY_CANVAS, event);
        this.view.buttonGroup.forEach((btn: Button) => {

            if (this.mouseOverlapsButton(mousePos, btn)) {
                this.handleSelectedButton(btn);
                console.log("button clicked", btn.name);
            }
        });
    }

    // fuehrt die Funktion, fuer die der ausgewaehlte Buttons steht, aus
    handleSelectedButton(btn: Button) {
        btn.bodyColor = undefined;
        switch (btn.name) {
            case 'world':
                this.view.next = btn.name;
                this.view.done = true;
                break;
            case 'highscore':
                this.view.next = btn.name;
                console.log('highscore switch case');
                this.view.done = true;

                break;
            case 'instruction':
                this.view.next = btn.name;
                console.log('instruction switch case');
                break;
        }
    }

    // prueft die Position der Maus und gibt bei einer Ueberlappung mit einem Button,
    handleMouseMovement(event: MouseEvent) {
        let mousePos = this.getMousePos(this.canvasData.DISPLAY_CANVAS, event);
        this.view.buttonGroup.forEach((btn: Button) => {
            if (this.mouseOverlapsButton(mousePos, btn)) {
                this.highlightButton(btn);
            }
        });
    }

    // highlightet den ausgewählten button
    highlightButton(btn: Button) {
        this.view.buttonGroup.forEach((btn: Button) => {
            btn.bodyColor = undefined;
            btn.alpha = 1;
            btn.fontColor = 'white';
            btn.borderColor = 'white';
        });
        btn.alpha = 0.9;
        btn.bodyColor = '#FEA443';
        btn.fontColor = 'blue';
        btn.borderColor = 'blue';
        this.view.activeButton = btn;
        console.log("overlaps", btn.name);
    }

    //wechselt die Buttons per Keyboard abwaerts
    switchButtonDownwards() {
        if (this.gameModel.keyState.down) {
            switch (this.view.activeButton) {
                case this.view.btnStartGame:
                    this.view.activeButton = this.view.btnHighscore;
                    this.highlightButton(this.view.btnHighscore);
                    break;
                case this.view.btnHighscore:
                    this.view.activeButton = this.view.btnInstruction;
                    this.highlightButton(this.view.btnInstruction);
                    break;
                case this.view.btnInstruction:
                    this.view.activeButton = this.view.btnStartGame;
                    this.highlightButton(this.view.btnStartGame);
                    break;
            }
        }
    }

    // wechselt die Buttons per Keyboard aufwaerts
    switchButtonUpwards() {
        if (this.gameModel.keyState.up) {
            switch (this.view.activeButton) {
                case this.view.btnStartGame:
                    this.view.activeButton = this.view.btnInstruction;
                    this.highlightButton(this.view.btnInstruction);
                    break;
                case this.view.btnHighscore:
                    this.view.activeButton = this.view.btnStartGame;
                    this.highlightButton(this.view.btnStartGame);
                    break;
                case this.view.btnInstruction:
                    this.view.activeButton = this.view.btnHighscore;
                    this.highlightButton(this.view.btnHighscore);
                    break;
            }
        }

    }

    // damit sich die Collisionbox der einzelnen Buttons immer an die Groeße des Canvas/Browserfensters anpassen,
    // wenn es vergroeßtert oder verkleinert wird.
    update(): void {
        this.handleButtonBoundings();
    }
}