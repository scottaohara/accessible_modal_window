// Scoping the $, incase you want to use jQuery, but it's not required
;(function ($, w, doc) {

  // Enable strict mode
  "use strict";

  // Local object for method references
  var Modal = {};

  // Namespace
  Modal.NS = "Modal";
  Modal.AUTHOR = "Scott O'Hara";
  Modal.VERSION = "0.0.4";
  Modal.DOCUMENTATION = "http://www.smashingmagazine.com/2014/09/making-modals-better-for-everyone/";
  Modal.LICENSE = "https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md";

  // set Modal variables
  var $m = $('.modal-overlay'),
      $html = $('html'),
      $body = $('body'),
      $mOpen = $('.js-open-modal'),
      $mTitle = $('.modal__intro__title'),
      $mOpenTarget,
      $mClose = $('.modal__outro__close'),
      $modal = $('.modal'),
      $allNodes = $("*"),
      $isModalOpen = false,
      $lastFocus,
      i;

  // initialize the modal(s) on load
  Modal.Init = function() {

    // take all instances of modals
    // and put them at the top of the <body>
    // this allows for backwards tab into the url bar
    this.Swap($m, $body);

    // open modal by btn click/hit
    $(document).on('click', '.js-open-modal', function(){
      $modal = $('.modal', $mOpenTarget);
      $mOpenTarget = $('#'+$(this).attr('data-open'));
      $lastFocus = document.activeElement;
      $isModalOpen = true;

      $html.addClass('modal-is-open');
      $mOpenTarget.attr('aria-hidden', 'false');
      $modal.attr('tabindex', '-1').focus();
    });

    // close modal by btn click/hit
    $mClose.on('click', this.Close);

    $m.on('click touchstart', this.OverlayClose);

    // close modal by keydown, but only if modal is open
    $(document).on('keydown', this.Close);

    // restrict tab focus on elements only inside modal window
    $allNodes.on('focus', this.Restrict );
  };


  /*
    Modal Window Functions
  */
  /* Place modal window(s) as the first child(ren) of the $body node */
  Modal.Swap = function( m, p ) {
    // this if is only here for use in the UI-kit.
    if ( !$body.hasClass('cs-body')) {
      $body.prepend($m);
    }
  };


  /*
    Bind to both the button click and the escape key to
    close the modal window  but only if isModalOpen is set to true
  */
  Modal.Close = function( e ) {
    if ( $isModalOpen && ( !e.keyCode || e.keyCode === 27 ) ) {
      $html.removeClass('modal-is-open');
      $m.attr('aria-hidden', 'true');
      $isModalOpen = false;

      $lastFocus.focus();
    }
  };


  Modal.OverlayClose = function ( e ) {
    if ( e.target === $modal.parent().get(0) ) {
      Modal.Close( e );
    }
  };


  Modal.Restrict = function ( e ) {
    if ( $html.hasClass('modal-is-open') && !$modal.get(0).contains( e.target ) ) {
      e.stopPropagation();
      $modal.focus();
    }
  };


  Modal.Init();

} )( jQuery, this, this.document );
