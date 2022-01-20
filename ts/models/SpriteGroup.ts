import {GameObject} from "./GameObject.js";

/**
 * Groups Gameobjects as an array
 * gameobject can be added and deleted to the group
 * all gameobject in one group can be updated together by calling update()
 */
export class SpriteGroup {
    private sprites: GameObject[];
    constructor() {
        this.sprites = [];
    }

    add(object: GameObject) {
        this.sprites.push(object);
    }

    update() {
        this.sprites.forEach((object: GameObject) => {
            object.update();
        });
    }

    delete(object: GameObject) {
        this.sprites.splice( this.sprites.indexOf(object), 1);
    }

    getSprites(): GameObject[] {
        return this.sprites;
    }

    setSprites(sprites: GameObject[]) {
        this.sprites = sprites;
    }
}