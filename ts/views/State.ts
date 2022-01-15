//AbstrakteKlasse
import {Canvasdata} from "../main.js";

/**
 * Die Abstrakte Klasse State wird von jeder View implementiert. Sie stellt die Views dar.
 */
export abstract class State {
    protected bufferCanvas = this.CANVAS_DATA.BUFFER_CANVAS;
    protected bufferCtx = this.CANVAS_DATA.BUFFER_CTX;
    protected displayCanvas = this.CANVAS_DATA.DISPLAY_CANVAS;
    protected displayCtx = this.CANVAS_DATA.DISPLAY_CTX;
    protected gameHeight = this.CANVAS_DATA.GAME_HEIGHT;
    protected gameWidth = this.CANVAS_DATA.GAME_WIDTH;
    protected mapRows = this.CANVAS_DATA.ROWS;
    protected mapCols = this.CANVAS_DATA.COLS;
    protected tileSize = this.CANVAS_DATA.TILE_SIZE;
    protected font = this.CANVAS_DATA.FONT;
    private _done: boolean;
    private _next: string;
    private _previous: string;

    protected constructor(readonly CANVAS_DATA: Canvasdata) {
        this._done = false;
        this._next = "";
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
}