import {State} from "./State.js";
import {GameModel} from "../models/GameModel.js";
import {CANVAS_DATA} from "../game_config.js";

export default class InstructionView extends State {
    protected _next: string;

    constructor(private gameModel: GameModel) {
        super(CANVAS_DATA);
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