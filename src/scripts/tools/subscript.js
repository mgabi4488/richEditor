class subscript {

	// 
	constructor( settings ) {
		this.text = '<i class="fas fa-subscript"></i>';
		this.tag = 'sub';
	}

	action () {
		// 
		let selection = window.getSelection();
		let range;
		let documentFragment;
		let newNode = document.createElement('sub');
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