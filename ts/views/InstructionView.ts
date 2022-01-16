import {State} from "./State.js";
import {GameModel} from "../models/GameModel.js";

export default class InstructionView extends State {
    protected _next: string;

    constructor(private gameModel: GameModel) {
        super(gameModel.canvasData);
        this.gameModel = gameModel;
        this._next = "startMenu";
    }

    startup(): void {
    }

    cleanup(): void {
    }

    update(): void {
    }

}