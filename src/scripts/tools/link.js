class link {

	// 
	constructor( settings ) {
		this.text = '<i class="fas fa-link"></i>';
		this.tag = '';
	}

	action () {
		// 
		let selection = window.getSelection();
		let range;
		let documentFragment;
		let newNode = document.createElement('a');
		// 
		newNode.setAttribute('href','https://www.google.com/');
		// 
		newNode.setAttribute('target','_blank');
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