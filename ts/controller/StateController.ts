import {GameModel} from "../models/GameModel.js";
import {State} from "../views/State.js";
import {Canvasdata} from "../main.js";

export abstract class StateController {
    readonly canvasData: Canvasdata;
    protected abstract view: State;
    protected constructor(protected gameModel: GameModel) {
        this.gameModel = gameModel;
        this.canvasData = gameModel.canvasData;
    }

    abstract handleEvent(event: any): void;

    abstract update(): void;
}