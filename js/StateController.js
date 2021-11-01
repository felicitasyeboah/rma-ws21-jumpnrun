export default class StateController {
	
	constructor(gameModel, stateData) {
		this.timeToNextUpdate = 0;
		this.updateInterval = 30;
		//this.deltatime = gameModel.deltatime;
		this.lastTime = 0;
		this.run = true;
		this.stateData = stateData;
		this.stateName = gameModel.startStateName;
		this.gameModel = gameModel;
		this.state = this.stateData[this.stateName]; //Es wird eine der View-Objekte zugewiesen (world, startmenue etc.)
		this.state.startup();
		this._registerEvents(this.deltatime);
	}
	
	//setupStates(stateData, state) {
	//}
	
	_flipState() {
	}
	
	// Updated die Views
	_update() {
		this.state.update();
	}
	
	getHighscore() {
		this.gameModel.getHighscore();
		
	}
	
	// Eventlistener werden aktiviert
	_registerEvents() {
		window.addEventListener('keyup', (event) => {
			this.state.getEvent(event)
		});
		window.addEventListener('keydown', (event) => {
			this.state.getEvent(event)
		});
		window.addEventListener('click', (event) => {
			this.state.getEvent(event);
		})
	}
	
	// Hauptspielschleife
	mainGameLoop(timestamp) {
		this.gameModel.deltatime = timestamp - this.lastTime; // Geschwindigkeit, in die der Clientcomputer einzelne
															  // Frames verabeiten kann
		this.lastTime = timestamp;
		//this.timeToNextUpdate += this.gameModel.deltatime;
		//if (this.timeToNextUpdate > this.updateInterval) {
		this._update();
		//this.timeToNextUpdate = 0;
		//}
		
		requestAnimationFrame((timestamp) => this.mainGameLoop(timestamp));
		
	}
}
