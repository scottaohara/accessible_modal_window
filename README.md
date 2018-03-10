# Accessible Modal Dialog  
A vanilla (aka plain old JavaScript), accessible modal dialog script, written in ES5 with no need for a build process.


## Usage  
Include the _a11y.modal.js_ file at the bottom of your document, or concatenated into your primary .js file, as part of your build process.

Ideally modal dialogs are are triggered by either a `button` or an element that has been modified to have the semantics and keyboard functionality of a `button`.  While this script does allow dialogs to be fired by other means, a dialog opening without a purposeful action can be a confusing and frustrating user experience to many.

The baseline for a button to open a modal dialog should consist of the following:  
```html
<button type="button"
  class="_your_class(es)_here_"
  data-modal-open="IDREF_of_modal_to_open"
  disabled>
  Launch My Modal
</button>
```
The `data-modal-open="..."` attribute is used to point to the specific modal this `button` is meant to trigger.  Adding a `disabled` attribute ensures that if JavaScript is blocked, or fails, that users will understand the button *should* do something, but is presently inactive.

If JavaScript is unavailable and the contents of a dialog will still make sense as part of the page's content, then an `a` element can be used as the dialog trigger, and progressively enhanced to be a `button`.
```html
<a href="#unique_ID_2"
  class="_your_class(es)_here_" 
  data-modal-open>
  Launch My Modal
</a>
```
The `href` attribute can act as the identifier for the target dialog, if the `data-modal-open` attribute value is not set. However, if you would like this link to go to another location if JavaScript is disabled, then set the `href` to the appropriate URL, and set the `data-modal-open` to the `IDREF` of the dialog within the document.

*Note:* It is not recommended to use an `a` element to point to the contents of a would-be dialog, if that  dialog's contents are useless without JavaScript enabled. Nor is it useful to have an `a` element point to content that immediately follows it in the DOM order.

If a dialog's content would be completely useless without JavaScript enabled, and you do *not* want to have a disabled `button` in the UI, then instead use the following markup pattern:
```html
<button type="button"
  class="_your_class(es)_here_"
  data-modal-open="IDREF_of_modal_to_open"
  hidden>
  Launch My Modal
</button>
```
The `hidden` attribute will be removed when JavaScript is enabled, but will ensure the `button` is completely hidden if JavaScript is not available.


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
        href="#unique_link_id"
        class="modal__outro__close">
         Close <!-- or add your close icon here -->
      </a>
    </div> <!-- /.modal__outro -->

  </div> <!-- end .modal -->

</div> <!-- /.a11y-modal -->
```

The `data-modal-close` attribute is what the script looks for in closing the modal window. So if you would like to change the class or the `<svg>`, go right ahead.  Just make sure to add that attribute to whatever your close trigger ends up being.  


### Optional attributes  




### Additional Functionality  
Include [Matt Casserly's hash.click function](https://github.com/mattcass/hash.click) to auto open modal windows on page load, if their URI is part of the address bar. This will emulate a click of the modal trigger, so the standard modal open events will be performed.

```html
  <script src="assets/js/a11y.modal.js"></script>
  <script src="assets/js/hash.click.js"></script>
```


## Previous Versions
Read about older version of this script that required jQuery.   
[Version 1 - Smashing Magazine Article](http://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/)  
[Version 2 - Release Article](http://www.scottohara.me/blog/2016/09/07/revised-modal-window.html)  


## License & Such  
This script was written by [Scott O'Hara](https://twitter.com/scottohara).

It has an [MIT license](https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md).

Do with it what you will :)
