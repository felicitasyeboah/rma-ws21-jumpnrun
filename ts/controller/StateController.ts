import {GameModel} from "../models/GameModel.js";
import {State} from "../views/State.js";
import {Canvasdata} from "../main.js";

export abstract class StateController {
    readonly canvasData: Canvasdata;
    protected constructor(protected gameModel: GameModel, protected view: State) {
        this.gameModel = gameModel;
        //this.view = view;
        this.canvasData = gameModel.canvasData;
    }

    abstract handleEvent(event: any): void;

    abstract update(): void;
}