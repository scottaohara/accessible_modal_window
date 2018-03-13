;(function ( w, doc, undefined ) {
	'use strict';

	/**
	 * Local object for method references
	 * and define script metadata
	 */
	var ARIAmodal = {};
	w.ARIAmodal   = ARIAmodal;

	ARIAmodal.NS      = 'ARIAmodal';
	ARIAmodal.AUTHOR  = 'Scott O\'Hara';
	ARIAmodal.VERSION = '3.0.0';
	ARIAmodal.LICENSE = 'https://github.com/scottaohara/accessible_modal_window/blob/master/LICENSE';

	var escKey = 27;
	var enterKey = 13;
	var spaceKey = 32;

	var activeClass = 'modal-open';
	var html = doc.getElementsByTagName('html')[0];
	var body = doc.body;
	var activeModal;

	var modal = doc.querySelectorAll( '[data-modal]' );
	var children = html.querySelectorAll( 'body > *:not([data-modal])' );
	var initialTrigger;

	var closeIcon = '<svg role="img" focusable="false" aria-hidden="true" viewBox="0 0 20 20" height="20" width="20"><path d="M10.707 10.5l8.646-8.646a.5.5 0 0 0-.707-.707L10 9.793 1.354 1.147a.5.5 0 0 0-.707.707L9.293 10.5.647 19.146a.5.5 0 0 0 .708.707l8.646-8.646 8.646 8.646a.498.498 0 0 0 .708 0 .5.5 0 0 0 0-.707L10.709 10.5z"/></svg>';


	/**
	 * Function to place the modal dialog(s) as the first child(ren)
	 * of the body element, so tabbing backwards will move focus
	 * into the browser's chrome.
	 *
	 * Also add a class to all other direct children of the body
	 * element to help manage focus and to appropriately hide
	 * content from assistive technology, when modals are open.
	 */
	ARIAmodal.organizeDOM = function () {
		var i;
		var refEl = body.firstChild || null;

		for ( i = 0; i < modal.length; i++ ) {
			body.insertBefore( modal[i], refEl );
		}
	}

	/**
	 * Global Create
	 *
	 * This function validates that the minimum required markup
	 * is present to create the ARIA widget(s).
	 *
	 * Any additional markup elements or attributes that
	 * do not exist in the found required markup patterns
	 * will be generated setup functions.
	 */
	ARIAmodal.setupTrigger = function () {
		var trigger = doc.querySelectorAll('[data-modal-open]');
		var self;
		var i;

		for ( i = 0; i < trigger.length; i++ ) {
			self = trigger[i];

			/**
			 * If not a button, update the semantics to make it announce as a button.
			 * Provide it with a tabindex if it's not a button or link with href.
			 * If no data-modal-open value was set, and it's a link, then get the
			 * target ID from the href value.
			 */
			if ( self.nodeName !== 'BUTTON' ) {
				self.setAttribute('role', 'button');

				if ( !self.hasAttribute('href') || !self.hasAttribute('tabindex') ) {
					self.tabIndex = 0;
				}

				if ( self.getAttribute('data-modal-open') === '' && self.getAttribute('href') ) {
					self.setAttribute('data-modal-open', self.getAttribute('href').split('#')[1] );
				}
			}

			/**
			 * Check for if a data-modal-open attribute is on
			 * a button. If not, then the button targets nothing
			 * and there's not much that can be done with that.
			 */
			if ( self.getAttribute('data-modal-open') ) {
				/**
				 * A button should have an aria-haspopup="dialog" to convey to users that
				 * *this* button will launch a modal dialog.
				 *
				 * Presently, the "dialog" value is not fully supported and in unsupported
				 * instances, it defaults back to announcing that a "menu" will open.
				 * Use this attribute with caution until this value has wider support.
				 */
				// self.setAttribute('aria-haspopup', 'dialog');

				/**
				 * Remove the disabled attribute, as if this script is running, JavaScript
				 * must be enabled and thus the button should function.
				 *
				 * But wait...there may be value in having a disabled button that can be
				 * enabled via other user actions. So, in that scenario look for a
				 * data-modal-disabled attribute, to keep the button disabled.
				 */
				if ( self.hasAttribute('disabled')
						 && !self.hasAttribute('data-modal-disabled') ) {
					self.removeAttribute('disabled');
				}

				/**
				 * In instances when JavaScript is unavailable and a disabled button is
				 * not desired, a hidden attribute can be used to completely hide the button.
				 *
				 * Remove this hidden attribute to reveal the button.
				 */
				if ( self.hasAttribute('hidden') ) {
					self.removeAttribute('hidden');
				}

				/**
				 * Get modal target and supply the button with a unique ID to easily
				 * reference for returning focus to, once the modal dialog is closed.
				 */
				var target = self.getAttribute('data-modal-open');
				self.id = target + '__trigger-' + self.nodeName;

				/**
				 * Events
				 */
				self.addEventListener('click', ARIAmodal.openModal);
				self.addEventListener('keypress', ARIAmodal.keytrolls, false);
			}
			else {
				console.warn('Missing target modal dialog - [data-modal-open="IDREF"]');
			}

		} // for(widget.length)
	}; // ARIAmodal.setupTrigger()


	/**
	 * Setup the necessary attributes and child elements for the
	 * modal dialogs.
	 */
	ARIAmodal.setupModal = function () {
		var self;
		var i;

		for ( i = 0; i < modal.length; i++ ) {
			var self = modal[i];
			var getClass      = self.getAttribute('data-modal-class');
			var heading       = self.querySelector('h1') ||
                         self.querySelector('h2') ||
                         self.querySelector('h1') ||
                         self.querySelector('h4');
			var isAlertDialog = self.hasAttribute('data-modal-alert');
			var modalLabel    = self.hasAttribute('data-modal-label');
			var aFocusCheck   = false;
			var descCheck     = false;

			/**
			 * Check to see if this is meant to be an alert or normal dialog.
			 * Supply the appropriate role.
			 */
			if ( isAlertDialog ) {
				self.setAttribute('role', 'alertdialog');
			}
			else {
				self.setAttribute('role', 'dialog');
			}

			/**
			 * Modal dialogs need to be hidden by default.
			 *
			 * To ensure they stay hidden, even if CSS is disabled, or purposefully
			 * turned off, apply a [hidden] attribute to the dialogs.
			 */
			self.setAttribute('hidden', '');

			/**
			 * When a modal dialog is opened, the dialog itself
			 * should be focused. Set a tabindex="-1" to allow this
			 * while keeping the container out of the focus order.
			 */
			self.tabIndex = '-1';

			/**
			 * Modal dialogs need at least one actionable item
			 * to close them...
			 */
			ARIAmodal.setupModalCloseBtn( self, getClass );

			/**
			 * This attribute currently makes it difficult to navigate
			 * through the contents of a modal dialog with VoiceOver.
			 *
			 * Up/down arrows do not have access to all content, and
			 * using VO + left/right also do not have access to all
			 * content, but do have access to different content then
			 * up/down arrows alone.
			 */
			// self.setAttribute('aria-modal', 'true');


			/**
			 * Do a check to see if there is an element flagged to be the
			 * description of the modal dialog.
			 */
			if ( self.querySelector('[data-modal-description]') ) {
				var getDesc = self.querySelector('[data-modal-description]');
				getDesc.id = 'md_desc_' + Math.floor(Math.random() * 999) + 1;

				self.setAttribute('aria-describedby', getDesc.id);

				descCheck = true;
			}
			else if ( self.hasAttribute('aria-describedby') ) {
				descCheck = true;
			}


			/**
			 * Do a check to see if there is an element that should
			 * receive autofocus within the dialog.
			 */
			// if ( !self.querySelector('[autofocus') && isAlertDialog ) {
			// 	console.warn('')
			// }


			/**
			 * Check for a heading to set the accessible name of the dialog,
			 * or if an aria-label should be set to the dialog instead.
			 */
			if ( modalLabel ) {
				self.setAttribute('aria-label', self.getAttribute('data-modal-label'));
			}
			else {
				if ( heading ) {
					var makeHeading = self.id + '_heading';
					heading.classList.add(getClass + '__heading');
					heading.id = makeHeading;

					/**
					 * Set an aria-labelledby to the modal dialog container.
					 */
					self.setAttribute('aria-labelledby', makeHeading);
				}
				else {
					console.warn('Dialogs should have their purpose conveyed by a heading element (h1).');
				}
			}
		}
	}; // ARIAmodal.setupModal


	ARIAmodal.setupModalCloseBtn = function ( self, getClass ) {
		var manualClose = self.querySelector('[data-modal-close-btn]');
		var btnClass;

		if ( manualClose === null ) {
			var closeBtn = doc.createElement('button');
			closeBtn.setAttribute('type', 'button');

			/**
			 * If a custom class is set, set that class
			 * and create BEM classes for direct child elements.
			 *
			 * If no custom class set, then use default "a11y-modal" class.
			 */
			if ( getClass ) {
				btnClass = getClass;
			}
			else {
				btnClass = 'a11y-modal';
			}

			self.classList.add(btnClass);
			closeBtn.classList.add(btnClass + '__close-btn');

			/**
			 * If there is no data-modal-close attribute, or it has no set value, then inject
			 * the close button icon and text into the generated button.
			 *
			 * If the data-modal-close attribute has a set value, then use that as the
			 * visible text of the close button, and do not position it in the upper right
			 * of the modal dialog.
			 */
			if ( self.getAttribute('data-modal-close') === '' ) {
				closeBtn.innerHTML = closeIcon;
				closeBtn.setAttribute('aria-label', 'Close');
				// add a helper class for close icon buttons.
				closeBtn.classList.add('is-icon-btn');
			}
			else {
				closeBtn.innerHTML = self.getAttribute('data-modal-close');
				/**
				 * If a specific class or classes
				 */
				if ( self.getAttribute('data-modal-close-class') ) {
					closeBtn.classList.add(self.getAttribute('data-modal-close-class'));
				}
			}

			self.appendChild(closeBtn);

			closeBtn.addEventListener('click', ARIAmodal.closeModal);
		}
		else {
			manualClose.addEventListener('click', ARIAmodal.closeModal);
		}

		doc.addEventListener('keydown', ARIAmodal.keytrolls, false);
	}; // ARIAmodal.setupModalCloseBtn


	/**
	 * Actions
	 */
	ARIAmodal.openModal = function ( e ) {
		var i;
		var getTarget = this.getAttribute('data-modal-open');
		var target = doc.getElementById(getTarget);
		var focusTarget = target;

		/**
		 * In case these are links, negate default behavior
		 * and just do what this script tells these triggers
		 * to do.
		 */
		e.preventDefault();

		/**
		 * Keep track of the trigger that opened the initial dialog.
		 */
		initialTrigger = this.id;

		/**
		 * If a modal dialog contains a form control that is set to
		 * autofocus, then focus should be placed on that form control,
		 * instead of the wrapping dialog container.
		 */
		if ( target.querySelector('[autofocus]') || target.querySelector('[data-autofocus]') ) {
			focusTarget = target.querySelector('[autofocus]') || target.querySelector('[data-autofocus]');
		}
		else if ( target.hasAttribute('data-modal-focus-close') ) {
			focusTarget = target.querySelector('[class*="close-btn"]');
		}

		/**
		 * Do a check to see if a modal is already open.
		 * If not, then add a class to the body as a check
		 * for other functions and set contents other than
		 * the opened dialog to be hidden from screen readers
		 * and to not accept tab focus, nor for their child elements.
		 */
		if ( !body.classList.contains(activeClass) ) {
			body.classList.add(activeClass);

			for ( i = 0; i < children.length; i++ ) {
				children[i].setAttribute('aria-hidden', 'true');
				children[i].setAttribute('inert', 'true');
			}
		}
		else {
			console.warn('It is not advised to open modal dialogs from within other dialogs. Instead consider replacing the contents of this dialog with new content. Or providing a stepped, or tabbed interface within this dialog. Chaining dialogs should be considered a UX bug, not a feature.');
		}

		target.removeAttribute('hidden');
		focusTarget.focus();

		return initialTrigger;
	};


	ARIAmodal.closeModal = function ( e ) {
		var trigger = doc.getElementById(initialTrigger) || null;
		var i;

		/**
		 * Loop through all the elements that were hidden to
		 * screen readers, and had inert to negate their
		 * children from being focusable.
		 */
		for ( i = 0; i < children.length; i++ ) {
			children[i].removeAttribute('aria-hidden');
			children[i].removeAttribute('inert');
			body.classList.remove('modal-open');
		}

		/**
		 * When a modal closes:
		 * the modal should be reset to hidden,
		 * the modal-open flag on the body can be removed.
		 * Keyboard focus must be appropriately managed...
		 */
		body.classList.remove('modal-open');
		doc.querySelector('[data-modal]:not([hidden])').setAttribute('hidden', '');

		/**
		 * Return focus to the trigger that opened the modal dialog.
		 */
		trigger.focus();
	};


	ARIAmodal.keytrolls = function ( e, activeModal ) {
		var keyCode = e.keyCode || e.which;


		if ( e.target.hasAttribute( 'data-modal-open' ) ) {
			switch ( keyCode ) {
				case enterKey:
				case spaceKey:
					e.preventDefault();
					e.target.click();
				break;
			}
		}

		if ( body.classList.contains('modal-open') ) {
			switch ( keyCode ) {
				case escKey:
					ARIAmodal.closeModal( activeModal );
					break;

				default:
					break;
			}
		}

	}; // ARIAmodal.keytrolls()


	/**
	 * Initialize modal Functions
	 * if expanding this script, place any other
	 * initialize functions within here.
	 */
	ARIAmodal.init = function () {
		ARIAmodal.setupTrigger();
		ARIAmodal.setupModal();
		ARIAmodal.organizeDOM();
	};


	/**
	 * Go go JavaScript!
	 */
	ARIAmodal.init();

})( window, document );
