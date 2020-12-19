class eraser {

	// 
	constructor( settings ) {
		this.text = '<i class="fas fa-eraser"></i>';
		this.tags = '';
	}

	action () {
		// 
		let selection = window.getSelection();
		let range;
		let selectedText = window.getSelection().toString();
		let newNode = document.createTextNode(selectedText);
		// 
		if ( selection.rangeCount ) {
			// 
			range = selection.getRangeAt(0);
			//
			range.deleteContents();
			// 
			range.insertNode(newNode);
		}
	}
}