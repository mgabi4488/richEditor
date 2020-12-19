/**
 * Event Handler Class - The class is adding or removing the events
 * 1: Adding Events - Events can be added with a custom namespace for example
 * click.namespace 
 */
class EventHandler {

	/**
	 * Initialize Class
	 */
	constructor() {
		this.functionMap = {};
	}

	/**
	 * Add event method
	 */
	addEventListener( element, event, func ) {
		// save the function to the events object
		this.functionMap[event] = func;
		// add the event to the element
		element.addEventListener(event.split('.')[0], this.functionMap[event]);
	}

	/**
	 * Remove event method
	 */
	removeEventListener( element, event ) {
		element.removeEventListener(event.split('.')[0], this.functionMap[event]);
		delete this.functionMap[event];
	}
}