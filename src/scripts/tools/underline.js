class underline {

	// 
	constructor( settings ) {
		this.text = '<i class="fas fa-underline"></i>';
		this.tag = 'u';
	}

	action () {
		// 
		let selection = window.getSelection();
		let range;
		let documentFragment;
		let newNode = document.createElement('u');
		// 
		if ( selection.rangeCount ) {
			// 
			range = selection.getRangeAt(0);
			// 
			documentFragment = range.extractContents();
			// 
			newNode.appendChild(documentFragment);
			//
			range.insertNode(newNode);
		}
	}
}