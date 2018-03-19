# Accessible Modal Dialog  

*Note: this readme is still being rewritten.**

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
The `href` attribute can act as the identifier for the target dialog, if the `data-modal-open` attribute value is not set. However, if you would like this link to go to another location, if JavaScript is disabled, then set the `href` to the appropriate URL, and set the `data-modal-open` to the `IDREF` of the dialog within the document.

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

The bare minimum default markup for the modal dialog would be the following:  

```html
<div id="unique_ID_to_match_data-modal-open" data-modal>
  <h1>
    A descriptive title for the dialog
  </h1>
  <div>
    <!-- primary content of the dialog here -->
  </div>
</div>
```



### Configuration attributes  
The following attributes are used to setup instances of the dialog triggers (buttons), the dialog container, and any necessary child elements of the dialogs.  


#### Trigger Attributes
- `data-modal-open`
- ``
- `hidden`: Set to a trigger to hide it in the event that JavaScript is unavailable.
- `disabled`: Set to a trigger to disable it in the event that JavaScript is unavailable.


#### Dialog Attributes
- `hidden`: All dialogs that are not meant to be visible if JavaScript or CSS are disabled should have this attribute.
- `data-modal` (leave blank, or accepts "alert" value)
- `data-modal-class` (accepts value)
- `data-modal-close` Adding a value to this attribute will change the auto generated close button from an "icon" button to an inline button with a visible label of the value. 
- `data-modal-close-class` The value added to this attribute will be applied to the generated close button as a class.
- `data-modal-focus-close`: This attribute serves as a hook to autofocus the generated close button when the dialog is opened.


#### Dialog Children Attributes
- `autofocus`: If a dialog has this attribute on a child element, move focus to this element instead of the dialog container.
- `data-autofocus`: Since it is invalid to have multiple `autofocus` attributes in a single document, but there may be multiple dialog instances, use this attribute to simulate an automatic focus with JavaScript.
- `data-modal-description`: This attribute will be used to auto-generate a unique ID, and become the pointer for the generated `aria-describedby` that is added to the dialog container.
- `data-modal-close-btn`: Add this attribute to `button` elements within the dialog that should be allowed to close the dialog.


## Previous Versions
Read about older version of this script that required jQuery.   
[Version 1 - Smashing Magazine Article](http://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/)  
[Version 2 - Release Article](http://www.scottohara.me/blog/2016/09/07/revised-modal-window.html)  


## License & Such  
This script was written by [Scott O'Hara](https://twitter.com/scottohara).

It has an [MIT license](https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md).

Do with it what you will :)
