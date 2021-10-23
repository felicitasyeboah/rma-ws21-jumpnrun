//import {CANVAS_HEIGHT, CANVAS_WIDTH} from './app.js';
//import Player from './Player';

export default class GameController {
	constructor(stateData, stateName) {
		this.run = true;
		this.stateData = stateData;
		this.stateName = stateName;
		this.state = this.stateData[this.stateName]; //Es wird ein State(world etc objekt erstellt)
		this.state.startup();
	}
	
	//setupStates(stateData, state) {
	//}
	
	
	_flipState() {
	
	}
	
	_update() {
		//this.state.update();
	}
	
	_eventLoop() {
	
	}
	
	
	mainGameLoop() {
		//while (this.run) {
		//requestAnimationFrame(this.mainGameLoop);
		//this._eventLoop();
		//this._update();
		//}
		//let hero = new Player(CANVAS_WIDTH/2, CANVAS_HEIGHT/2,30,30);
		//console.log(hero.getPos);
		//hero.update();
		
	}
}
