;(function ( $, w, doc ) {

  'use strict';

  var A11yModal = {};

  A11yModal.NS = "A11yModal";
  A11yModal.AUTHOR = "Scott O'Hara";
  A11yModal.VERION = "2.0.1";
  A11yModal.DOCUMENTATION = 'coming soon, yo';
  A11yModal.LICENSE = "https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md";


  // setup global class variables
  var modalTrigger      = '[data-action="modal-open"]',

      modal             = '.a11y-modal',

      modalDoc          = '.modal',
      modalTitle        = '[data-modal-title]',
      modalClose        = '[data-modal-close]',

      genModalClose     = '<button type="button" data-modal-close class="modal__outro__close"><span aria-hidden="true">⨉</span></button>',

      $html             = $('html'),

      bodyElements      = 'a11y-hide-if-modal-open',

      safetyModalTitle  = "Dialog Window";


  $.fn.extend({

    a11yModal: function ( e ) {

      return this.each( function () {

        var id = this.id,
            $self = $('#' + id),

        // setup modals properly
        setupA11yModal = function () {

          // setup each modal instance to have the
          // appropriate attributes. These attributes
          // are applied to what would be considered the
          // modal container, or 'overlay'
          $self.each( function () {

            var $this = $(this),
                $findTitle = $this.find(modalTitle),
                $findHeading = $this.find(':header'),
                $thisLabel;


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
            $this.attr('tabindex', '-1');
            $this.find(modalDoc).attr('tabindex', '-1');


            // check to see if an aria-label was set on the modal
            // if not, then start running checks to apply an aria-labelledby
            if ( !$self.attr('aria-label') ) {

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
              else if ( $findHeading ) {

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

              if ( $this.find('.modal__outro').length ) {

                $this.find('.modal__outro').append(genModalClose);

              } else {

                $this.append(genModalClose);

              } // if/else

            } // if

            // Set aria-label and control attributes to the
            // close trigger.
            $this.find(modalClose).attr({
              'aria-label': 'Close Modal',
              'aria-controls': $this.parent().attr('id')
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

            var $this = $(this),
                $grabTarget,
                $modalTarget;

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


        // Place modal window(s) as the first child(ren)
        // of the body element so tabbing backwards can
        // move focus into the browser's address bar
        organizeDOM = function () {

          var $body = $('body'),
              $afterLast = $body.find('.a11y-modal').last().find('~ *:not(script)');


          // place all the modal dialogs at the top of the DOM, as the
          // first children of BODY. This will allow for backwards tabbing
          // into the browser's address bar, where as if the modals were
          // not located at the top of the DOM, keyboard focus would be
          // completely trapped within the modal window.
          $body.prepend($(modal));


          // for all direct children of the BODY element, add a class
          // to target during open/close
          $body.find(' > *:not(.a11y-modal, script)').addClass(bodyElements);

        },


        openA11yModal = function ( e ) {

          // setup vars
          var $this = $(this),
              $modalTarget = $('#' + $this.attr('aria-controls') );


          // Check to see if the modal has either an aria-label or labelledby attribute
          // if not, that means that the modal didn't have a manually set aria-label,
          // nor does the modal have any sort of heading element to draw a title from.
          // In this instance, pull the safetyModalTitle var in as an aria-label
          if ( !$modalTarget.attr('aria-labelledby') && !$modalTarget.attr('aria-label') ) {

            // Last ditch effort to allow control over what the aria-label will be.
            // If the data-set-modal-title attribute is set to the modal trigger,
            // its value will be set as the modal's aria-label
            if ( $this.attr('data-set-modal-title') ) {
              safetyModalTitle = $this.attr('data-set-modal-title');
            }

            // set an aria-label to the modal
            $modalTarget.attr('aria-label', safetyModalTitle );

          } // if


          // traps focus while the modal is open
          trapFocus();

          // if modal trigger is an <a>, make sure that URI isn't
          // updated and more importantly that the document doesn't
          // auto-jump to the DOM location of the modal window.
          e.preventDefault();


          // set that modal be visible, controlled by the
          // aria-hidden attribute and CSS
          // then shift focus to it
          $modalTarget.attr('aria-hidden', 'false');


          // add a class to the HTML, to allow for a CSS hook
          // to help restrict document scroll while the modal
          // is open
          $html.addClass('modal-is-open');


          // Hide main document content from screen readers by
          // applying an aria-hidden attribute to all direct
          // siblings of the modal windows. (var bodyElements)
          $('.'+bodyElements).attr('aria-hidden', 'true');


          // finally, apply focus to the newly opened modal window
          $modalTarget.find(modalDoc).focus();

        },


        // Bind to both the button click and the escape key to
        // close the modal window  but only if isModalOpen is set to true
        closeA11yModal = function ( e ) {

          var returnFocus = $('[aria-controls="'+$self.attr('id')+'"]');

          e.preventDefault();

          $html.removeClass('modal-is-open');
          $self.attr('aria-hidden', 'true');

          // remove the aria-hidden that was applied during modal open
          $('.'+bodyElements).removeAttr('aria-hidden');

          returnFocus.focus();

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

          } // switch

        },


        // keyboard controls for opened modals
        keytrollsA11yModal = function ( e ) {

          var keyCode = e.keyCode || e.which;

          if ( $html.hasClass('modal-is-open') ) {

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

            } // switch

          }

        },


        // trap focus within the modal window, because otherwise
        // users can tab to obscured elements, and that's just
        // bad UX.
        trapFocus = function () {
          var $trapArea = $self.find(modalDoc),
              $trapAreaClose = $self.find(modalClose);

          $(document).on('focusin.' + $self, function ( e ) {

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
