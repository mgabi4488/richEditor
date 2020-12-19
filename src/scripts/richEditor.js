/**
 * Rich Editor Tool:
 * Istructions: https://github.com/mgabi4488/richEditor
 */
class richEditor extends EventHandler {

	/**
	 * Initialize Class
	 */
	constructor( settings ) {
		// initialize the parent class
		super();
		// get isntance
		let _ = this;
		// 
		_.$el = settings.$el;
		// 
		_.$editor = document.createElement('div');
		// 
		_.allOptions = ['superscript','subscript','italic','bold','underline','strikethrough','eraser','link'];
		// 
		_.hideOptions = Array.isArray(settings.hideOptions) ? settings.hideOptions : [];
		// 
		_.loadDependecies(() => {
			// 
			_.convert();
			// listen for selection changes
			super.addEventListener(document,'selectionchange.richEditor', () => {
				// 
				_.selectActiveOptions();
				// 
				_.showFloatingBar();
			});
			// listen for mouse move to caputre the corrdinates
			super.addEventListener(document,'mousedown.richEditor', ( e ) => {
				// listen to mouse move
				super.addEventListener(document,'mousemove.richEditor', ( e ) => {
					_.mouseX = e.clientX;
					_.mouseY = e.clientY;
				});
				// stop listening to mouse move
				super.addEventListener(document,'mouseup.richEditor', ( e ) => {
					super.removeEventListener(document,'mousemove.richEditor');
				});
			});
		});
		// 
		_.addPublicObject();
	}

	/**
	 *
	 */
	addPublicObject() {
		this.$el.richEditor = {
			$el: this.$el,
			$editor: this.$editor,
			getEditorContent: this.getEditorContent,
			getContent: this.getContent,
			save: this.save
		};
	}


	/**
	 *
	 */
	loadDependecies( callBack ) {
		// 
		let headTag = document.querySelector('head');
		let option = null;
		let scripts = [];
		let _ = this;
		/**
		 *
		 */
		let getScript = ( src ) => {
			return new Promise(function(resolve, reject) {
				// 
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = src;
				script.async = true;
				// 
				script.onload = ( event ) => {
					resolve(script.src);
				};
				//
				headTag.appendChild(script);
			})
		};
		// 
		for( let i = 0; i < this.allOptions.length; i++ ) {
			// 
			option = this.allOptions[i];
			// 
			if ( this.hideOptions.indexOf(option) != -1 ) continue;
			// 
			scripts.push(getScript('src/scripts/tools/'+option+'.js'));
		}
		// Usage:  Load different file types with one callback
		Promise.all(scripts).then(function( resolved ) {
			// 
			for( let i = 0; i < resolved.length; i++ ) {
				//
				let optionName = resolved[i].replace('.js','').split('/').pop();
				let optionIndex = _.allOptions.indexOf(optionName);
				let option = eval(optionName);
				// 
				_.allOptions[optionIndex] = new option();
			}
			// 
			if ( callBack ) callBack.call(this,true,resolved);
		}).catch(function( rejected ) {
			if ( callBack ) callBack.call(this,false,rejected);
		});
	}

	/**
	 *
	 */
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
		let _ = this;
		$options.classList.add('r-e-editor-bar-options');
		// 
		for ( let i = 0; i < this.allOptions.length; i++ ) {
			// 
			if ( this.hideOptions.indexOf(this.allOptions[i]) != -1 ) continue;
			// 
			let $option = document.createElement('li');
			this.allOptions[i].$button = document.createElement('button');
			this.allOptions[i].$button.innerHTML = this.allOptions[i].text;
			$option.setAttribute('data-index',i);
			// 
			$option.classList.add('r-e-editor-bar-option');
			// 
			super.addEventListener(this.allOptions[i].$button,'click', ( event ) => {
				// 
				let $clickedBtn = event.target.parentNode;
				// 
				let index = $clickedBtn.parentNode.getAttribute('data-index');
				// 
				_.saveSelection();
				// 
				_.allOptions[index].action();
				// 
				_.restoreSelection();
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
			if ( this.hideOptions.indexOf(this.allOptions[i]) != -1 ) continue;
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
	}

	/**
	 * Restore the selection `range` is a `Range` object
	 */
	restoreSelection() {
		const selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(this.selecton);
	}

	/**
	 *
	 */
	getEditorContent() {
		return this.$editor.innerHTML;
	}

	/**
	 *
	 */
	save() {
		this.$el.value =  this.$editor.innerHTML;
	}

	/**
	 *
	 */
	getContent() {
		return this.$el.value;
	}
}