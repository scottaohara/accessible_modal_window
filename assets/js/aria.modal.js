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

	var pageWrapper = '';
	var escKey = 27;
	var enterKey = 13;
	var spaceKey = 32;
	var activeClass = 'modal-open';
	var html = doc.getElementsByTagName('html')[0];
	var body = doc.body;
	var activeModal;

	var modal = doc.querySelectorAll( '[data-modal]' );
	var children = html.querySelectorAll( 'body > *:not([data-modal])' );
	var previousModal = null;

	var closeIcon = '<svg role="presentation" viewBox="0 0 20 20" height="20" width="20"><path d="M10.707 10.5l8.646-8.646a.5.5 0 0 0-.707-.707L10 9.793 1.354 1.147a.5.5 0 0 0-.707.707L9.293 10.5.647 19.146a.5.5 0 0 0 .708.707l8.646-8.646 8.646 8.646a.498.498 0 0 0 .708 0 .5.5 0 0 0 0-.707L10.709 10.5z"/></svg>';


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

		for ( i = 0; i < modal.length; i++ ) {
			body.insertBefore( modal[i], body.firstChild );
		}
	}

	/**
	 * Global Create
	 *
	 * This function validates that the minimum required markup
	 * is present to create the ARIA widget(s).
	 * Any additional markup elements or attributes that
	 * do not exist in the found required markup patterns
	 * will be generated via this function.
	 */
	ARIAmodal.setupTrigger = function () {
		var self;
		var i;

		var trigger = doc.querySelectorAll('[data-modal-open]');

		for ( i = 0; i < trigger.length; i++ ) {
			self = trigger[i];

			/**
			 * If a link is being progressively enhanced into a button,
			 * then the link should have a role="button"
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
				 * A button should have an aria-haspopup="dialog" to
				 * convey to users that *this* button will launch a
				 * modal dialog.
				 *
				 * Presently, the "dialog" value is not fully supported
				 * and when not, it defaults back to announcing a "menu"
				 * will open.  Use with caution.
				 */
				// self.setAttribute('aria-haspopup', 'dialog');

				/**
				 * Remove the disabled attribute, as JavaScript
				 * is enabled and thus the button should function.
				 *
				 * A button may require being disabled though, so if
				 * it has a data-modal-disabled attribute, keep it disabled.
				 */
				if ( self.hasAttribute('disabled')
						 && !self.hasAttribute('data-modal-disabled') ) {
					self.removeAttribute('disabled');
				}

				/**
				 * Get modal target and supply the button with a
				 * unique ID to easily reference for returning focus
				 * to, once the modal dialog is closed.
				 */
				var target = self.getAttribute('data-modal-open');
				self.id = target + '__trigger';

				/**
				 * Events
				 */
				self.addEventListener('click', ARIAmodal.openModal);

			}
			else {
				console.warn('Missing target modal reference - [data-modal-open="IDREF"]');
			}

			self.addEventListener('keypress', ARIAmodal.keytrolls, false);

		} // for(widget.length)
	}; // ARIAmodal.setupTrigger()


	ARIAmodal.setupModal = function () {
		var self;
		var i;

		/**
		 * There may be modals that exist on screen, but
		 * buttons that haven't yet been created to launch them.
		 */
		for ( i = 0; i < modal.length; i++ ) {
			var self = modal[i];
			var getClass = self.getAttribute('data-modal-class');
			var heading  = self.querySelector('h1') ||
										 self.querySelector('h2') ||
										 self.querySelector('h1') ||
										 self.querySelector('h4');
			var modalType = self.getAttribute('data-modal-alert');
			var modalLabel = self.hasAttribute('data-modal-label');
			/**
			 * Determine the type of modal this is, and then
			 * set the appropriate role.
			 */
			if ( modalType ) {
				self.setAttribute('role', 'alertdialog');
			}
			else {
				self.setAttribute('role', 'dialog');
			}

			/**
			 * Modal dialogs need to be hidden by default.
			 * To ensure they stay hidden, even if CSS is
			 * disabled, or purposefully turned off, apply
			 * a [hidden] attribute to modals.
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
			 * This attribute currently screws stuff up with
			 * VoiceOver.  Leaving off for now.
			 */
			// self.setAttribute('aria-modal', 'true');


			/**
			 * If this is an alertdialog, special setup
			 * goes here
			 */


			/**
			 * If there is content to describe the modal dialog
			 * then there needs to be a flag/setup process here
			 */



			/**
			 * Check for a heading to set the accessible name of the modal,
			 * or if an aria-label should be set to the modal dialog instead.
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
					console.warn('Your modal should have its purpose conveyed via a h1.')
				}
			}
		}
	}; // ARIAmodal.setupModal


	ARIAmodal.setupModalCloseBtn = function ( self, getClass ) {
		var closeBtn = doc.createElement('button');
		closeBtn.setAttribute('type', 'button');
		closeBtn.setAttribute('aria-label', 'Close dialog');
		closeBtn.innerHTML = closeIcon;

		self.append(closeBtn);

		/**
		 * If a custom class is set, set that class
		 * and create BEM classes for direct child elements.
		 *
		 * If no custom class set, then use default "a11y-modal" class.
		 */
		if ( getClass ) {
			self.classList.add(getClass);
			closeBtn.classList.add(getClass + '__close-btn');
		}
		else {
			self.classList.add('a11y-modal');
			closeBtn.classList.add('a11y-modal__close-btn');
		}

		closeBtn.addEventListener('click', ARIAmodal.closeModal);
		doc.addEventListener('keydown', ARIAmodal.keytrolls);
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
		 * If a modal dialog contains a form control that is set to
		 * autofocus, then focus should be placed on that form control,
		 * instead of the wrapping dialog container.
		 */
		if ( target.querySelector('[autofocus]') ) {
			focusTarget = target.querySelector('[autofocus]');
		}

		/**
		 * Do a quick check to see if a modal is already open.
		 */
		if ( !body.classList.contains(activeClass) ) {
			body.classList.add(activeClass);
			for ( i = 0; i < children.length; i++ ) {
				children[i].setAttribute('aria-hidden', 'true');
				children[i].setAttribute('inert', '');
			}
		}
		else {
			/**
			 * Find the modal this trigger is contained within,
			 * and set that modal to hidden so the new modal can
			 * load in its place.
			 *
			 * Keep track of the previous modal's ID.
			 */
			previousModal = doc.querySelector('[data-modal]:not([hidden])').id;
			doc.getElementById(previousModal).setAttribute('hidden', '');
		}

		target.removeAttribute('hidden');
		focusTarget.focus();

		activeModal = target;

		if ( previousModal !== null ) {
			return [activeModal, previousModal];
		}
		else {
			return activeModal;
		}

	};


	ARIAmodal.closeModal = function ( e ) {
		var getTarget = activeModal.id;
		var trigger = doc.getElementById(getTarget + '__trigger') || null;
		var i;

		if ( previousModal === null ) {
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
		}
		else {
			/**
			 * If there was a previous modal open
			 */
			doc.getElementById(previousModal).removeAttribute('hidden');
			trigger = doc.getElementById(previousModal + '__trigger');

			activeModal = doc.getElementById(previousModal);
		}

		/**
		 * When a modal closes:
		 * the modal should be reset to hidden,
		 * the modal-open flag on the body can be removed.
		 * Keyboard focus must be appropriately managed...
		 */
		body.classList.remove('modal-open');
		doc.getElementById(getTarget).setAttribute('hidden', '');


		// if ( previousModal !== null ) {
		// 	activeModal.focus();
		// }
		 if ( trigger !== null ) {
			trigger.focus();
		}


		/*
			if a modal was opened on page load, then focus should not
			be returned to its trigger on close (it may not even have
			a trigger.) Return it to the top of the document instead.
		*/
		previousModal = null;
		return [previousModal, activeModal];
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
