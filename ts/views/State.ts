//AbstrakteKlasse
import {CANVAS_DATA, Canvasdata} from "../game_config.js";
import Button from "../models/Button.js";

/**
 * Die Abstrakte Klasse State wird von jeder View implementiert. Sie stellt die Views dar.
 */
export abstract class State {
    protected bufferCanvas = CANVAS_DATA.BUFFER_CANVAS;
    protected bufferCtx = CANVAS_DATA.BUFFER_CTX;
    protected displayCanvas = CANVAS_DATA.DISPLAY_CANVAS;
    protected displayCtx = CANVAS_DATA.DISPLAY_CTX;
    protected gameHeight = CANVAS_DATA.GAME_HEIGHT;
    protected gameWidth = CANVAS_DATA.GAME_WIDTH;
    protected mapRows = CANVAS_DATA.ROWS;
    protected mapCols = CANVAS_DATA.COLS;
    protected tileSize = CANVAS_DATA.TILE_SIZE;
    protected font = CANVAS_DATA.FONT;
    protected _activeButton: Button | undefined;
    protected _buttonGroup: Map<string, Button>;
    protected _done: boolean;
    protected _previous: string;

    protected abstract _next: string;

    protected constructor() {
        this._buttonGroup = new Map<string, Button>();
        this._activeButton = undefined;
        this._done = false;
        this._previous = "";
    }

    //Abstrake Methode
    abstract startup(): void; //  { throw new Error("Method 'startup()' must be implemented.");}

    //Abstrake Methode
    abstract cleanup(): void; //throw new Error("Method 'cleanup()' must be implemented.");

    //Abstrake Methode
    abstract update(): void; // throw new Error("Method 'update()' must be implemented.");


    get done(): boolean {
        return this._done;
    }

    set done(value: boolean) {
        this._done = value;
    }

    get next(): string {
        return this._next;
    }

    set next(value: string) {
        this._next = value;
    }

    get previous(): string {
        return this._previous;
    }

    set previous(value: string) {
        this._previous = value;
    }

    get activeButton(): Button | undefined {
        return this._activeButton;
    }

    set activeButton(value: Button | undefined) {
        this._activeButton = value;
    }

    get buttonGroup(): Map<string, Button> {
        return this._buttonGroup;
    }

    set buttonGroup(value: Map<string, Button>) {
        this._buttonGroup = value;
    }
}