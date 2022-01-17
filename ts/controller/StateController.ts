import {GameModel} from "../models/GameModel.js";
import {State} from "../views/State.js";

export abstract class StateController {
    protected abstract view: State;
    protected constructor(protected gameModel: GameModel) {
        this.gameModel = gameModel;
    }

    abstract handleEvent(event: any): void;

    abstract update(): void;
}