class bold {

	// 
	constructor( settings ) {
		this.text = '<i class="fas fa-bold"></i>';
		this.tag = 'b';
	}

	action () {
		// 
		let selection = window.getSelection();
		let range;
		let documentFragment;
		let newNode = document.createElement('b');
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