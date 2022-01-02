import {State} from "./State.js";
import {GameModel} from "../models/GameModel.js";

export default class InstructionView extends State {
    constructor(private gameModel: GameModel) {
        super(gameModel.canvasData);
        this.gameModel = gameModel;
    }

    getEvent(event: { [p: string]: string }): void {
    }

    startup(): void {
    }
}