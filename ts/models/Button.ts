import {CANVAS_DATA} from "../canvas_config.js";

/**
 *  represaentiert einen Button auf dem Canvas
 */
export default class Button {
    private _width: number;
    private _height: number;
    private _boundingBoxWidth: number;
    private _boundingBoxHeight: number;
    private _boundingBoxX: number;
    private _boundingBoxY: number;
    private _xInCols: number;
    private _yInRows: number;
    constructor(private _name: string, private _widthInCols: number, private _heightInRows: number, private _x: number, private _y: number,
                private _bodyColor?: string, private _alpha?: number,
                private _borderColor?: string,
                private _lineWidth?: number,
                private _font?: string, private _text?: string, private _fontColor?: string) {
        this._name = _name;
        this._widthInCols = _widthInCols;
        this._heightInRows = _heightInRows;
        this._xInCols = _x;
        this._yInRows = _y;
        this._width = _widthInCols * CANVAS_DATA.TILE_SIZE;
        this._height = _heightInRows * CANVAS_DATA.TILE_SIZE;
        this._x = _x * CANVAS_DATA.TILE_SIZE;
        this._y = _y * CANVAS_DATA.TILE_SIZE;

        // Eine Art Hitbox zur Kollisionserkennung von Maus und Button.
        // die sich an die Groeße des Browserfensters anpasst.
        this._boundingBoxWidth = 0;
        this._boundingBoxHeight = 0;
        this._boundingBoxX = 0;
        this._boundingBoxY = 0;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get bodyColor(): string | undefined {
        return <string>this._bodyColor;
    }

    set bodyColor(value: string | undefined) {
        this._bodyColor = value;
    }

    get alpha(): number {
        return <number>this._alpha;
    }

    set alpha(value: number) {
        this._alpha = value;
    }

    get borderColor(): string {
        return <string>this._borderColor;
    }

    set borderColor(value: string) {
        this._borderColor = value;
    }

    get lineWidth(): number {
        return <number>this._lineWidth;
    }

    set lineWidth(value: number) {
        this._lineWidth = value;
    }

    get font(): string {
        return <string>this._font;
    }

    set font(value: string) {
        this._font = value;
    }

    get text(): string {
        return <string>this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    get fontColor(): string {
        return <string>this._fontColor;
    }

    set fontColor(value: string) {
        this._fontColor = value;
    }

    get widthInCols(): number {
        return this._widthInCols;
    }

    set widthInCols(value: number) {
        this._widthInCols = value;
    }

    get heightInRows(): number {
        return this._heightInRows;
    }

    set heightInRows(value: number) {
        this._heightInRows = value;
    }

    get boundingBoxWidth(): number {
        return this._boundingBoxWidth;
    }

    set boundingBoxWidth(value: number) {
        this._boundingBoxWidth = value;
    }

    get boundingBoxHeight(): number {
        return this._boundingBoxHeight;
    }

    set boundingBoxHeight(value: number) {
        this._boundingBoxHeight = value;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get boundingBoxX(): number {
        return this._boundingBoxX;
    }

    set boundingBoxX(value: number) {
        this._boundingBoxX = value;
    }

    get boundingBoxY(): number {
        return this._boundingBoxY;
    }

    set boundingBoxY(value: number) {
        this._boundingBoxY = value;
    }

    get xInCols(): number {
        return this._xInCols;
    }

    set xInCols(value: number) {
        this._xInCols = value;
    }

    get yInRows(): number {
        return this._yInRows;
    }

    set yInRows(value: number) {
        this._yInRows = value;
    }
}