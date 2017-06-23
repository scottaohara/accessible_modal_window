Accessible Modal Window (dialog)
================

_Read all about it:_  
[Version 1 - Smashing Magazine Article](http://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/)  
[Version 2 - Release Article](http://www.scottohara.me/blog/2016/09/07/revised-modal-window.html)  


## Requirements
[jQuery](http://jquery.com/download/)  - tested and works with latest releases of jQuery 1 - 3.



## Usage

Simply include the _a11y.modal.js_ file at the bottom of your document, or concatenated into your primary .js file as part of your build process.

Modals can be triggered by either a ```<button>``` or ```<a>```. If using an ```<a>```, the JavaScript will add a ```role="button"``` to the element, and will allow both <kbd>Space</kbd> and <kbd>Enter</kbd> to open a modal.

```html
<button type="button"
  class="__your_btn_classes_here__"
  data-action="modal-open"
  data-modal-open="unique_ID_1">
  Unique Button Text
</button>

<a data-action="modal-open"
   href="#unique_ID_2"
   id="unique_link_id">
  Unique Link Text
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
         href="#unique_link_id">
         Close <!-- or add your close icon here -->
      </a>
    </div> <!-- /.modal__outro -->

  </div> <!-- end .modal -->

</div> <!-- /.a11y-modal -->
```

The ```data-modal-close``` attribute is what the script looks for in closing the modal window. So if you would like to change the class or the ```<svg>```, go right ahead.  Just make sure to add that attribute to whatever your close trigger ends up being.


### Optional attributes 

Optional attributes that can be set to the modal trigger or ```.a11y-modal``` container:

* ```data-set-modal-title="Title Goes Here"```<br>Use this attribute to set an ```aria-label``` to a modal that doesn't already have a defined heading or ```aria-label```.

* ```data-modal-alert="true"```<br>Set a modal to have a role of ```alertdialog```.


Note - the above attributes should be set to either the container or trigger element. Not both.


## Classes & their uses

* ```.modal-is-open```<br>Class that is toggled on the ```<html>```. It's primary function is to ensure that on desktop browsers, the content under the modal window is not scrollable while the modal is open.

* ```.a11y-modal```<br>Primary hook for the JavaScript, and the main parent class for the entire modal window component. This class specifically is used to style the overlay.

* ```.modal```<br>Class used to style the visible content container of the modal window.

* ```.modal--sm```<br>Helper class to make a smaller sized modal content container.

* ```.modal--full-width```<br>Helper class to make a full width modal content container.

* ```.modal--take-over```<br>Helper class to make the modal content container take up the full browser screen real estate.

* ```.modal__intro```<br>Class to style the intro (header) area of the modal content container.

* ```.modal__intro__title```<br>Class to be used on the primary heading (title) of the modal.

* ```.modal__content```<br>Class to be used on the primary content area of the modal.

* ```.modal__outro```<br>Class to be used on the call to action, or footer area of the content container

* ```.modal__outro__close```<br>Class to be used on the close button for the modal.

* ```.no-js-hide```<br>Helper class to hide elements when JavaScript is not available.


### JavaScript breakdown

For a high level breakdown, please review the [version 2 release article](http://www.scottohara.me/blog/2016/09/07/revised-modal-window.html).  For an break down of what each function is doing, you can review the [documented JavaScript file](https://github.com/scottaohara/accessible_modal_window/blob/master/assets/js/a11y.modal.js).


### Additional Functionality

Include [Matt Casserly's hash.click function](https://github.com/mattcass/hash.click) to auto open modal windows on page load, if their URI is part of the address bar. This will emulate a click of the modal trigger, so the standard modal open events will be performed.

```html
  <script src="assets/js/jquery-3.1.0.min.js"></script>
  <script src="assets/js/a11y.modal.js"></script>
  <script src="assets/js/hash.click.js"></script>
```
