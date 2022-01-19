import {CANVAS_DATA} from "../game_config.js";
import {GameModel} from "../models/GameModel.js";

export class TileFinder {
    gameModel: GameModel;
    constructor(gameModel: GameModel) {
        this.gameModel = gameModel;

    }
    toIndex(pos: number) {
        return Math.floor(pos/CANVAS_DATA.TILE_SIZE);
    }

    toIndexRange(pos1: number, pos2: number) {
        const pMax = Math.ceil(pos2 / CANVAS_DATA.TILE_SIZE) * CANVAS_DATA.TILE_SIZE;
        const range = [];
        let pos = pos1;
        do {
            range.push(this.toIndex(pos));
            pos += CANVAS_DATA.TILE_SIZE;
        } while (pos < pMax);
        return range;
    }

    getByIndex(indexX: number, indexY: number) {
        const tileValue = this.gameModel.
            collisionMapData["level" + this.gameModel.getCurrentLevel()][indexY * CANVAS_DATA.COLS + indexX]
        if (tileValue) {
            const xleft = indexX * CANVAS_DATA.TILE_SIZE;
            const xright = xleft + CANVAS_DATA.TILE_SIZE;
            const ytop = indexY * CANVAS_DATA.TILE_SIZE;
            const ybottom = ytop + CANVAS_DATA.TILE_SIZE;
            return {
                tileValue,
                xleft,
                xright,
                ytop,
                ybottom,
            };
        }
    }

    searchByPosition(posX: number, posY: number) {
        return this.getByIndex(
            this.toIndex(posX),
            this.toIndex(posY));
    }

    searchByRange(xleft: number, xright: number, ytop: number, ybottom: number) {
        let matches: any
            matches= [];
        this.toIndexRange(xleft, xright).forEach(indexX => {
            this.toIndexRange(ytop, ybottom).forEach(indexY => {
                const match = this.getByIndex(indexX, indexY);
                if (match) {
                    matches.push(match);
                }
            });
        });
        return matches;
    }
}
