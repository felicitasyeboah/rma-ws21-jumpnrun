import {GameModel} from "./GameModel.js";
import {State} from "./State.js";

export default class StartmenuView extends State {
    constructor(private gameModel: GameModel) {
        super(gameModel.canvasData);
    }

    getEvent(event: { [p: string]: string }): void {
    }

    startup(): void {
    }
}