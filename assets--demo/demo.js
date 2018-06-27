/**
 * This script is for the skip link and to ensure that moving focus
 * via hashchange is respected in all browsers.
 */
window.addEventListener("hashchange", function( e ) {

	if ( location.hash.substring(1) !== '' ) {
  	var el = document.getElementById(location.hash.substring(1));

	  if ( el ) {
	    if ( !/^(?:a|select|input|button|textarea)$/i.test( el.tagName ) ) {
	      el.tabIndex = -1;
	    }
	    el.focus();
	  }
	}
}, false);
