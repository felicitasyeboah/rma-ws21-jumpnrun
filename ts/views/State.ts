//AbstrakteKlasse
import {Canvasdata} from "../main.js";

/**
 * Die Abstrakte Klasse State wird von jeder View implementiert. Sie stellt die Views dar.
 */
export abstract class State {
    //TODO: FRAGE: soll ein statisches Attribut sein, oder besser im Constructo???
    public static KEY = {
        LEFT: ['ArrowLeft', 'a'],
        RIGHT: ['ArrowRight', 'd'],
        JUMP: [' ', 'w', 'ArrowUp']
    }
    protected bufferCanvas = this.CANVAS_DATA.BUFFER_CANVAS;
    protected bufferCtx = this.CANVAS_DATA.BUFFER_CTX;
    protected displayCanvas = this.CANVAS_DATA.DISPLAY_CANVAS;
    protected displayCtx = this.CANVAS_DATA.DISPLAY_CTX;
    protected gameHeight = this.CANVAS_DATA.GAME_HEIGHT;
    protected gameWidth = this.CANVAS_DATA.GAME_WIDTH;
    protected mapRows = this.CANVAS_DATA.ROWS;
    protected mapCols = this.CANVAS_DATA.COLS;
    protected tileSize = this.CANVAS_DATA.TILE_SIZE;

    protected constructor(readonly CANVAS_DATA: Canvasdata) {
        // if (this.constructor === State) {
        //     throw new Error("Abstract classes can't be instantiated.");
        // }
    }

    //Abstrake Methode
    abstract startup(): void; //  { throw new Error("Method 'startup()' must be implemented.");}

    //Abstrake Methode
    cleanup() {
        throw new Error("Method 'cleanup()' must be implemented.");
    }

    //Abstrake Methode
    abstract getEvent(event: { [key: string]: string }): void; // { throw new Error("Method 'getEvent()' must be implemented.");}

    //Abstrake Methode
    update() {
        throw new Error("Method 'update()' must be implemented.");
    }

}