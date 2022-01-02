import {GameModel} from "../models/GameModel.js";
import {State} from "./State.js";

export default class HighscoreView extends State {
    constructor(private gameModel: GameModel) {
        super(gameModel.canvasData);
        this.gameModel = gameModel;
    }

    getEvent(event: { [p: string]: string }): void {
    }

    startup(): void {
    }
}