//AbstrakteKlasse
export default class State {
	constructor() {
		if (this.constructor === State) {
			throw new Error("Abstract classes can't be instantiated.");
		}
	}
	
	//Abstrake Methode
	startup() {
		throw new Error("Method 'startup()' must be implemented.");
	}
	
	//Abstrake Methode
	cleanup() {
		throw new Error("Method 'cleanup()' must be implemented.");
	}
	
	//Abstrake Methode
	getEventup() {
		throw new Error("Method 'getEvent()' must be implemented.");
	}
	
	//Abstrake Methode
	update() {
		throw new Error("Method 'update()' must be implemented.");
	}
	
}