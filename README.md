# Accessible Modal Dialog  
A vanilla JavaScript, accessible modal dialog script, written in ES5.

## Usage  
Include the _a11y.modal.js_ file at the bottom of your document, or concatenated into your primary .js file, as part of your build process.

Ideally modal dialogs are activated by a purposeful user interaction with a `button`, or an element that has been modified to have the semantics and keyboard functionality of a `button`.  While this script does allow dialogs to be activated by other means, a dialog opening without a purposeful action can be a confusing and frustrating user experience to many.

### Modal Dialog Trigger
The baseline for a `button` to open a modal dialog should consist of the following:  

```html
<button type="button"
  class="_your_class(es)_here_"
  data-modal-open="IDREF_of_modal_to_open"
  disabled>
  Launch My Modal
</button>
```

The `data-modal-open="..."` attribute is used to point to the specific modal this `button` is meant to activate.  Adding a `disabled` attribute ensures that if JavaScript is blocked, or fails, that users will understand the `button` *should* do something, but is currently inactive.

If JavaScript is unavailable, and the contents of a dialog will still make sense as part of the page's content, then an `a` element may be used as the dialog trigger, and progressively enhanced to be a `button`. This will allow the `a` to act as an in-page link to the would-be dialog's contents.

```html
<a href="#unique_ID_2"
  class="_your_class(es)_here_" 
  data-modal-open>
  Launch My Modal
</a>
```

The `href` attribute of a link may act as the identifier for the target dialog, if the `data-modal-open` attribute value is empty. However, if you would like this link to go to another location, if JavaScript were disabled, then set the `href` to the appropriate URL, and set the `data-modal-open` to the `IDREF` of the dialog within the document.

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

### Modal Dialog Base Markup
The bare minimum markup for a modal dialog would be the following:  

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


## Lack of features are not bugs
This script does *not* presently utilize the `aria-haspopup="dialog"` on the dialog triggers. Nor does it `aria-modal` on the dialog element. These attributes are currently in the dialog script, but commented out until they receive wider browser + screen reader support.  

For example, with screen readers that do not yet understand the `aria-haspopup="dialog"`, they treat it as if the trigger opens a `role="menu"`, and the announcements for that are *not* what someone would expect for a dialog.  Additionally, VoiceOver on macOS High Sierra will flat out not recognize some child elements of a dialog, if navigating by <kbd>up</kbd> or <kbd>down</kbd> arrow keys, or if navigating by <kbd>VO</kbd> + <kbd>left</kbd> or <kbd>right</kbd> arrow keys. The content missed is not the same between navigation controls, and with the use of the `inert` polyfill and `aria-hidden`, there is currently nothing missed from not using `aria-modal` on the dialog.  

## Inert Polyfill
For this script to provide peak accessibility, it must also utilize the [`inert` polyfill from Google](https://github.com/GoogleChrome/inert-polyfill). While the dialogs have a function to keep focus within the dialog, looping through any focusable elements within itself, the inert polyfill will help prevent a user from accessing the browser's chrome (e.g. the address bar) and then being able to navigate back into the obscured document. The dialog script doubles down on the elements with `inert="true"` and also add an `aria-hidden="true"` as well. This ensures that not only can users not access elements within the obscured document by keyboard navigation, but that these elements will not be revealed in screen reader listings of elements within a document (e.g. listings of regions, headings or form controls with NVDA and JAWS, or be revealed in VoiceOver's rotor menus.)


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


## Screen Reader Quirks
Things of note for why certain decisions were made, and how different screen reader and browser combos have their own inconsistencies in announcing modal dialogs.

- Do not set dialogs to `display: none` by default.  
  There is an issue with iOS Safari + VoiceOver where if an element is set to `display: none;` by default, even when set to `display: block;` <abbr>VO</abbr> will not move focus to the element, even if focus is programmatically set. To get around this, the CSS for these dialogs use `visibility: hidden;` for the inactive state, and `visibility: visible;` for showing the dialog.  

  As `visibility: hidden` does not remove an element from the document's flow, it's important that `position: absolute/fixed` is set to the dialog, regardless of whether it's active or not.
- The first element of a modal dialog should be its heading (which provides its accessible name). 
  This requirement is to compensate for Internet Explorer 11 + JAWS specifically. With this pairing, setting focus to the dialog element itself will announce the accessible name of the dialog, the dialog role, and then JAWS will announce re-announce the accessible name of the dialog and the role of the first child element of the dialog.
  For instance, if the dialog's heading provides the accessible name for the dialog, then JAWS + IE11 will announce "accessible name, dialog. accessible name, heading level #".  However, if the first child is another element that does not match the accessible name of the dialog, such as a button with text "close", it will be announced as:
  "accessible name, dialog. accessible name, button"
- Note that NVDA will not announce the dialog role when focus is set to the dialog element itself. For instance, in NVDA + IE11, it will simply announce the accessible name of the dialog, and nothing more.  In more standard browser pairings like Firefox or Chrome, the accessible name of the dialog will be announced, and then the contents of the dialog will begin to be announced, without ever mentioning the dialog role.


## Previous Versions
Read about older version of this script that required jQuery.   
[Version 1 - Smashing Magazine Article](http://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/)  
[Version 2 - Release Article](http://www.scottohara.me/blog/2016/09/07/revised-modal-window.html)  


## License & Such  
This script was written by [Scott O'Hara](https://twitter.com/scottohara).

It has an [MIT license](https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md).

Do with it what you will :)
