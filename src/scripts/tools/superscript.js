class superscript {

	// 
	constructor( settings ) {
		this.text = '<i class="fas fa-superscript"></i>';
		this.tag = 'sup';
	}

	action () {
		// 
		let selection = window.getSelection();
		let range;
		let documentFragment;
		let newNode = document.createElement('sup');
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