;(function ( $, w, doc ) {

  'use strict';

  var A11yModal = {};

  A11yModal.NS = "A11yModal";
  A11yModal.AUTHOR = "Scott O'Hara";
  A11yModal.VERION = "2.3.0";
  A11yModal.DOCUMENTATION = 'https://github.com/scottaohara/accessible_modal_window';
  A11yModal.LICENSE = "https://github.com/scottaohara/accessible_modal_window/blob/master/LICENSE";


  // setup global class variables
  var modalTrigger      = '[data-action="modal-open"]';

  var modal             = '.a11y-modal';

  var modalClass        = 'modal';
  var modalDoc          = '.'+modalClass;
  var modalTitle        = '[data-modal-title]';
  var modalClose        = '[data-modal-close]';

  var modalAddStyle     = 'data-add-style';

  var modalIsOpen       = 'modal-is-open';

  var genModalClose     = '<button type="button" data-modal-close class="modal__outro__close"><svg role="presentation" viewBox="0 0 20 20" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 10.5l8.646-8.646a.5.5 0 0 0-.707-.707L10 9.793 1.354 1.147a.5.5 0 0 0-.707.707L9.293 10.5.647 19.146a.5.5 0 0 0 .708.707l8.646-8.646 8.646 8.646a.498.498 0 0 0 .708 0 .5.5 0 0 0 0-.707L10.709 10.5z"/></svg></button>';

  var $html             = $('html');

  var bodyWrapID        = 'a11y_body_wrap';
  var bodyElements      = 'a11y-hide-if-modal-open';

  var bodyWrapInit      = 'default';

  var safetyModalTitle  = "Dialog Window";

  var $previousModal    = null;


  $.fn.extend({

    a11yModal: function ( e ) {

      return this.each( function () {

        if ( bodyWrapInit !== 'default') {
          bodyWrapID = bodyWrapInit;
        }

        var id = this.id;
        var $self = $('#' + id),

        // setup modals properly
        setupA11yModal = function () {
          // setup each modal instance to have the
          // appropriate attributes. These attributes
          // are applied to what would be considered the
          // modal container, or 'overlay'
          $self.each( function () {
            var $this = $(this);
            var $findTitle = $this.find(modalTitle);
            var $findHeading = $this.find(':header');
            var $thisLabel;

            // first check to see what sort of dialog this should be
            // if a data-modal-alert attribute is set to true, then
            // this is meant to be an alert dialog, so set the role
            // to 'alertdialog'. If it's not set, it's mean to be
            // a normal dialog. So set the role to just 'dialog'
            if ( $this.attr('data-modal-alert') === 'true' ) {
              $this.attr({
                'role': 'alertdialog'
              });
            }
            else {
              $this.attr({
                'role': 'dialog'
              });
            }

            // we will need to set focus to the modal content
            // container for focus trapping reasons, so we
            // need this to have a tabindex
            $this.find(modalDoc).attr('tabindex', '-1');

            // check to see if an aria-label was set on the modal
            // if not, then start running checks to apply an aria-labelledby
            if ( !$self[0].hasAttribute('aria-label') ) {

              // if the modal window has a child modalTitle set,
              // then add an aria-labelledby attribute to the dialog,
              // pointing to that element.
              if ( $findTitle.length ) {
                $thisLabel = $findTitle.attr('id');
              } //if $findTitle

              // in the event that a modalTitle wasn't manually set,
              // then we should look to see if there's a heading element
              // present at all, and then make THAT the source for the
              // aria-labelledby
              else if ( $findHeading.length ) {
                // does the heading we found have an id already?
                // let's check
                if ( $findHeading.first().attr('id') ) {
                  $thisLabel = $findHeading.first().attr('id');
                } // if it doesn't, then generate one
                else {
                  $thisLabel = $this.attr('id') + '_title';

                  $findHeading.first().attr('id', $thisLabel);
                } //else
              } // else/if

              $this.attr( 'aria-labelledby', $thisLabel );
            } // if
          });


          // setup each modal content area (the component that
          // contains the actual content)
          $self.find(modalDoc).each( function () {
            var $this = $(this);

            // important for older versions of NVDA to accurately
            // understand a modal's content
            $this.attr({
              'role': 'document' // *
            });

            // Modals need a close button, and it should be the last
            // element in the modal.

            // If a modal doesn't have a close button, create it.
            if ( !$this.find(modalClose).length ) {

              // the best place to add the close button would be
              // in the outro area, so check to see if it exists
              if ( $this.find('.modal__outro').length ) {
                $this.find('.modal__outro').append(genModalClose);
              }
              else {
                // if the outro area doesn't exist, then just add
                // the close button as the last element in the modal.
                $this.append(genModalClose);
              } // if/else

            } // if

            // Set aria-label to the close trigger.
            $this.find(modalClose).attr({
              'aria-label': 'Close Modal'
            });
          }); // end modalDoc
        },


        // setup modal triggers
        // the following applies needed aria-attributes
        // to the modal triggers, as well as doing a
        // final check to ensure that the modal window
        // has appropriate labeling
        setupA11yModalTriggers = function () {
          $(modalTrigger).each( function () {
            var $this = $(this);
            var $grabTarget;
            var $modalTarget;

            // if the trigger is a link, we need to give it a
            // button role.
            if ( $this.attr('href') ) {
              $this.attr('role', 'button');
            }

            // The triggers need to point to the modals they control via
            // the aria-controls attribute. So run a check to see if the
            // attribute exists on the button.
            //
            // It's likely that it WON'T exist, as the optimal method for
            // the minimum mark-up is to use a data-modal-open attribute
            // instead. The reason for this is that in situations without
            // JavaScript, we don't want partial ARIA hooks, as that can
            // create confusion for ATs that would expect certain
            // functionality that wouldn't be available due to lack of JS.
            if ( !$this.attr('aria-controls') ) {
              // make sure that the trigger actually triggers something.
              // if it there's no data-modal-open attribute set, then
              // pull the target from the href
              if ( $this.attr('data-modal-open') ) {
                $grabTarget = $this.attr('data-modal-open');
                $this.attr('aria-controls', $grabTarget );
              }
              // if there's no data-modal-open, pull the target from
              // from the href
              else if ( $this.attr('href') ) {
                $grabTarget = $this.attr('href').split('#')[1];
                $this.attr('aria-controls', $grabTarget );
              }
              // if neither of the above are set, then this just
              // won't work and you're clearly expecting this to
              // open by magic.
              else {
                console.log("No target set. A target is set by setting the value of an aria-controls attribute, which if absent, can be generated by the trigger's href URI, or a data-modal-open attribute to the value of the modal window ID you are attempting to open.");
                return false;
              }

            } // end if aria-controls

            // now that the aria-controls is set, point to the modal's target
            // so we can run the next if
            $modalTarget = $('#'+$this.attr('aria-controls') )

            // finally a last check to see if the trigger is meant to launch
            // an alert dialog modal. If the alertdialog role wasn't set during
            // the initial setup function, then look to see if the 'data-modal-alert'
            // attribute is present on the trigger, and if so, apply the alertdialog
            // role to the modal on trigger activation.
            if ( $this.attr('data-modal-alert') === 'true' && $modalTarget.attr('role') !== 'alertdialog' ) {
              $modalTarget.attr('role', 'alertdialog');
            }
          });
        },


        // When modal dialogs overlays, focus should not be able to escape them.
        // To ensure this, we will reorder the DOM to move modal windows out of
        // their original place in the document order, and while wrapping all
        // normal content in a new wrapper div.
        organizeDOM = function () {
          var $body = $('body');
          var $bodyWrap = '<div id="'+bodyWrapID+'" />';

          // Wrap all contents of the <body> in a new div.
          // This div will be important in toggling screen reader's abilities
          // to interact with this content, when a modal window is open.
          // If this statement is not true, then it's because you already
          // have a wrapper element you can use for this purpose, and you
          // have passed in the ID.
          if ( bodyWrapInit === 'default' ) {
            $('body > *').wrapAll($bodyWrap);
          }

          // place all the modal dialogs at the top of the DOM, as the
          // first children of BODY. This will allow for backwards tabbing
          // into the browser's address bar, where as if the modals were
          // not located at the top of the DOM, keyboard focus would be
          // completely trapped within the modal window.
          $body.prepend($(modal));
        },


        openA11yModal = function ( e ) {
          // setup vars
          var $this = $(this);
          var $modalTarget = $('#' + $this.attr('aria-controls') );

          // if modal trigger is an <a>, make sure that URI isn't
          // updated and more importantly that the document doesn't
          // auto-jump to the DOM location of the modal window.
          e.preventDefault();

          // if this trigger has a data attribute of 'data-add-style', take the value
          // of this attribute and add it as a class to the target modal window
          if ( $this[0].hasAttribute(modalAddStyle) ) {
            var $grabClass = $(this).attr(modalAddStyle);

            $modalTarget.find(modalDoc).attr('class', modalClass + ' ' + $grabClass);
          }

          // if a modal is opened from within another modal, close the first
          // modal so we can open the new one.
          if ( $this.parents('.' + modalClass).length ) {
            $this.closest(modal).attr('aria-hidden', 'true');
            // keep track of the previous modal
            $previousModal = $this.closest(modal).attr('id');
          }

          // Check to see if the modal has either an aria-label or labelledby attribute
          // if not, that means that the modal didn't have a manually set aria-label,
          // nor does the modal have any sort of heading element to draw a title from.
          // In this instance, pull the safetyModalTitle var in as an aria-label
          if ( !$modalTarget[0].hasAttribute('aria-labelledby') && !$modalTarget[0].hasAttribute('aria-label') ) {

            // Last ditch effort to allow control over what the aria-label will be.
            // If the data-set-modal-title attribute is set to the modal trigger,
            // its value will be set as the modal's aria-label
            if ( $this[0].hasAttribute('data-set-modal-title') ) {
              safetyModalTitle = $this.attr('data-set-modal-title');
            }

            // set an aria-label to the modal
            $modalTarget.attr('aria-label', safetyModalTitle );
          } // if

          // make the modal visible, by updating the aria-hidden
          // attribute and it's corresponding CSS,
          // then shift focus to it
          $modalTarget.attr('aria-hidden', 'false');

          // add a class to the HTML, to allow for a CSS hook to help
          // restrict document scroll while the modal is open
          $html.addClass(modalIsOpen);

          // traps focus while the modal is open
          trapFocus( $modalTarget );

          // Hide main document content from screen readers by
          // applying an aria-hidden attribute to the primary document content
          // e.g. the wrapper around all things not modal windows
          //
          // Only do this if the wrapper was not already hidden, due to
          // a previously opened modal window.
          if ( !$('#' + bodyWrapID)[0].hasAttribute('aria-hidden') ) {
            $('#' + bodyWrapID).attr('aria-hidden', 'true');
          }

          // apply focus to the newly opened modal window
          $modalTarget.find(modalDoc).focus();

          return $previousModal;
        },



        // Bind to both the button click and the escape key to
        // close the modal window  but only if isModalOpen is set to true
        closeA11yModal = function ( e ) {
          var returnFocus = $('[aria-controls="'+$self.attr('id')+'"]');

          e.preventDefault();

          $self.attr('aria-hidden', 'true');

          if ( $previousModal !== null ) {
            $('#' + $previousModal).attr('aria-hidden', 'false');
            $('#' + $previousModal).find(modalDoc).focus();

            $previousModal = null;
          }
          else {
            $html.removeClass(modalIsOpen);

            // remove the aria-hidden that was applied during modal open
            $('body').find('#'+bodyWrapID).removeAttr('aria-hidden');

            returnFocus.focus();
          }
        },


        // on click of the modal overlay, close the modal
        overlayA11yModal = function ( e ) {
          if ( e.target === $self.find(modalDoc).parent().get(0) ) {
            closeA11yModal( e );
          }
        },


        // keyboard controls specific to the modal dialog windows
        keytrollsA11yModalTrigger = function ( e ) {
          var keyCode = e.keyCode || e.which;

          switch ( keyCode ) {
            // space & enter
            case 32:
            case 13:
              e.stopPropagation();
              $(this).trigger('click');
              break;

            default:
              break;
          } // switch
        },


        // keyboard controls for opened modals
        keytrollsA11yModal = function ( e ) {
          var keyCode = e.keyCode || e.which;

          if ( $html.hasClass(modalIsOpen) ) {

            switch ( keyCode ) {
              // tab
              case 9:
                if ( !e.shiftKey && $self.find(modalClose).is(':focus') ) {
                  $(modalDoc).focus();
                }
                break;

              // esc
              case 27:
                closeA11yModal( e );
                break;

              // space & enter
              case 32:
              case 13:
                if ( $self.find(modalClose).is(':focus') ) {
                  e.stopPropagation();
                  closeA11yModal( e );
                }
                break;

              default:
                break;
            } // switch
          }
        },


        // trap focus within the modal window, because otherwise
        // users can tab to obscured elements, and that's just
        // bad UX.
        trapFocus = function ( $thisModal ) {
          var $thisModal = $thisModal;

          var $trapArea = $thisModal.find(modalDoc);
          var $trapAreaClose = $thisModal.find(modalClose);

          $(document).on('focusin.' + $thisModal, function ( e ) {

            if ( $trapArea[0] !== e.target && !$trapArea.has(e.target).length) {
              $trapAreaClose.focus();
            }
          });
        }; // trap focus


        // run setup functions
        organizeDOM();
        setupA11yModal();
        setupA11yModalTriggers();


        // events specific to modal dialogs
        $self.on('keydown', keytrollsA11yModal.bind(this) );
        $self.on('click touchstart', overlayA11yModal.bind(this) );
        $self.find(modalClose).on('click', closeA11yModal.bind(this) );


        // open Modals aren't inside the modal component, hence the $(document)
        $(document).on('click', modalTrigger, openA11yModal );
        $(document).on('keydown', modalTrigger, keytrollsA11yModalTrigger );
      }); // end: return this.each()
    } // end: a11yModal: function
  }); // end: $.fn.extend

  $(modal).a11yModal();

} )( jQuery, this, this.document );
