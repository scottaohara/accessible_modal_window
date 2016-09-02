Accessible Modal Window (dialog)
================

_Read all about it:_
[Version 1 - Smashing Magazine Article](http://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/)
[Version 2 - Coming Soon](#!)


## Requirements
[jQuery](http://jquery.com/download/)  - tested and works with latest releases of jQuery 1 - 3.



## Usage

Modals can be triggered by either a ```<button>``` or ```<a>```.

```html
<button type="button"
  class="__your_btn_classes_here__"
  data-action="modal-open"
  data-modal-open="unique_ID_1">
  Launch Modal
</button>

<a data-action="modal-open"
   href="#unique_ID_2">
  Open Small Alert Modal
</a>
```

The recommended default markup for the modal window component:

```html
<div id="unique_ID_1" class="a11y-modal">

  <div class="modal">

    <header class="modal__intro">
      <h3 class="modal__intro__title">
        Modal Window
      </h3>
    </header>

    <div class="modal__content">
      ...
    </div> <!-- /.modal__content -->

    <div class="modal__outro">
      ...

      <a data-modal-close
         class="modal__outro__close"
         href="#x">
        <svg role="presentation" viewBox="0 0 20 20" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 10.5l8.646-8.646a.5.5 0 0 0-.707-.707L10 9.793 1.354 1.147a.5.5 0 0 0-.707.707L9.293 10.5.647 19.146a.5.5 0 0 0 .708.707l8.646-8.646 8.646 8.646a.498.498 0 0 0 .708 0 .5.5 0 0 0 0-.707L10.709 10.5z"/></svg>
      </a>
    </div> <!-- /.modal__outro -->

  </div> <!-- end .modal -->

</div> <!-- /.a11y-modal -->
```


## Classes & their uses

* ```.modal-is-open```  
  Class that is toggled on the ```<html>```. It's primary function is to ensure that on desktop browsers, the content under the modal window is not scrollable while the modal is open.

* ```.a11y-modal```
  Primary hook for the JavaScript, and the main parent class for the entire modal window component. This class specifically is used to style the overlay.

* ```.modal```
  Class used to style the visible content container of the modal window.

* ```.modal--sm```
  Helper class to make a smaller sized modal content container.

* ```.modal--full-width```
  Helper class to make a full width modal content container.

* ```.modal--take-over```
  Helper class to make the modal content container take up the full browser screen real estate.

* ```.modal__intro```
  Class to style the intro (header) area of the modal content container.

* ```.modal__intro__title```
  Class to be used on the primary heading (title) of the modal.

* ```.modal__content```
  Class to be used on the primary content area of the modal.

* ```.modal__outro```
  Class to be used on the call to action, or footer area of the content container

* ```.modal__outro__close```
  Class to be used on the close button for the modal.

* ```.no-js-hide```
  Helper class to hide elements when JavaScript is not available.
