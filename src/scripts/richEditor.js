

class EventHandlerClass {
  constructor() {
    this.functionMap = {};
  }

  addEventListener(event, func) {
    this.functionMap[event] = func;
    document.addEventListener(event.split('.')[0], this.functionMap[event]);
  }

  removeEventListener(event) {
    document.removeEventListener(event.split('.')[0], this.functionMap[event]);
    delete this.functionMap[event];
  }
}

EventHandler = new EventHandlerClass();



class richEditor {

	// 
	constructor( settings ) {
		// 
		let _ = this;
		// 
		this.$el = settings.$el;
		// 
		this.$editor = document.createElement('div');
		// 
		this.allOptions = [{
			text: '<i class="fas fa-superscript"></i>',
			tag: 'sup',
			action: () => {
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
		},{
			text: '<i class="fas fa-subscript"></i>',
			tag: 'sub',
			action: () => {
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
		},{
			text: '<i class="fas fa-italic"></i>',
			tag: 'i',
			action: () => {
				// 
				let selection = window.getSelection();
				let range;
				let documentFragment;
				let newNode = document.createElement('i');
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
		},{
			text: '<i class="fas fa-bold"></i>',
			tag: 'b',
			action: () => {
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
		},{
			text: '<i class="fas fa-underline"></i>',
			tag: 'u',
			action: () => {
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
			},
		},{
			text: '<i class="fas fa-strikethrough"></i>',
			tag: 's',
			action: () => {
				// 
				let selection = window.getSelection();
				let range;
				let documentFragment;
				let newNode = document.createElement('s');
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
		},{
			text: '<i class="fas fa-eraser"></i>',
			tag: '',
			action: () => {
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
		}];
		// 
		this.convert();
		// listen for selection changes
		EventHandler.addEventListener('selectionchange.richEditor', () => {
			// 
			this.selectActiveOptions();
			// 
			this.showFloatingBar();
		});
		// listen for mouse move to caputre the corrdinates
		EventHandler.addEventListener('mousedown.richEditor', ( e ) => {
			// listen to mouse move
			EventHandler.addEventListener('mousemove.richEditor', ( e ) => {
				_.mouseX = e.clientX;
				_.mouseY = e.clientY;
			});
			// stop listening to mouse move
			EventHandler.addEventListener('mouseup.richEditor', ( e ) => {
				EventHandler.removeEventListener('mousemove.richEditor');
			});
		});
	}

	//
	convert() {
		// get objects
		let $elParent = this.$el.parentNode;
		let $wrapper = document.createElement('div');
		let $editorBar = document.createElement('div');
		// create editor bar
		$wrapper.appendChild($editorBar);
		$editorBar.classList.add('r-e-editor-bar');
		// 
		$editorBar.appendChild(this.getOptions());
		// create editor
		this.$editor.innerHTML = this.$el.value;
		$wrapper.appendChild(this.$editor);
		this.$editor.classList.add('r-e-editor');
		this.$editor.id = 'r-e-editor';
		this.$editor.setAttribute('contenteditable',true);
		// crete wrapper
		$wrapper.classList.add('r-e');
		$wrapper.appendChild(this.$el);
		// hide original element
		this.$el.classList.add('r-e-original');
		// append wrapper
		$elParent.appendChild($wrapper);
	}

	// 
	getOptions() {
		// 
		const $options = document.createElement('ul');
		$options.classList.add('r-e-editor-bar-options');
		// 
		for ( let i = 0; i < this.allOptions.length; i++ ) {
			// 
			let $option = document.createElement('li');
			this.allOptions[i].$button = document.createElement('button');
			this.allOptions[i].$button.innerHTML = this.allOptions[i].text;
			$option.setAttribute('data-index',i);

			$option.classList.add('r-e-editor-bar-option');
			// 
			this.allOptions[i].$button.addEventListener('click', ( event ) => {
				// 
				let $clickedBtn = event.target.parentNode;
				// 
				let index = $clickedBtn.parentNode.getAttribute('data-index');
				// 
				this.saveSelection();
				// 
				this.allOptions[index].action();
				// 
				this.restoreSelection();
			});
			// 
			$option.appendChild(this.allOptions[i].$button);
			$options.appendChild($option);
		}
		// 
		return $options;
	}

	// 
	selectActiveOptions() {
		// 
		let editorTags = {};
		// 
		for ( let i = 0; i < this.allOptions.length; i++ ) {
			// 
			if ( this.allOptions[i].tag == '' ) continue;
			// 
			this.allOptions[i].$button.classList.remove('active');
			// 
			editorTags[this.allOptions[i].tag] = document.getElementsByTagName(this.allOptions[i].tag);
			// 
			for (let tag of editorTags[this.allOptions[i].tag]) {
				// 
				const selection = window.getSelection();
				var range = selection.getRangeAt(0);
				var bool = range.intersectsNode(tag);
				// 
				if ( bool ) {
					this.allOptions[i].$button.classList.add('active');
				} else {
					this.allOptions[i].$button.classList.remove('active');
				}
			}
		}
	}

	//
	showFloatingBar() {
		// 
		let slection = window.getSelection();
		//
		let $floatingBar = document.getElementById('floatingBar');
		// 
		if ( slection.toString().length == 0 && $floatingBar ) {
			// 
			$floatingBar.remove();
			// 
			return;
		} else if ( slection.toString().length == 0 ) {
			return;
		}
		// 
		if ( !$floatingBar ) {
			$floatingBar = document.createElement('div');
			$floatingBar.id = 'floatingBar';
			$floatingBar.appendChild(this.getOptions());
			$floatingBar.classList.add('r-e-editor-bar-floatin');
			document.body.appendChild($floatingBar);
		}
		// 
		$floatingBar.style.top = (this.mouseY + 10) + 'px';
		$floatingBar.style.left = this.mouseX + 'px';
	}

	/**
	 * Save the selection return a 
	 * `Range` instance if there is a selected text
	 */
	saveSelection() {
		const selection = window.getSelection();
		this.selecton = selection.rangeCount === 0 ? null : selection.getRangeAt(0);
	};

	/**
	 * Restore the selection `range` is a `Range` object
	 */
	restoreSelection() {
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(this.selecton);
	};

}