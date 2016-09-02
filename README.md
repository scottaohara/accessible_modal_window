Accessible Modal Window (dialog)
================

An accessibility minded modal window written in both vanilla JavaScript and as a jQuery plug-in, utilizing.


_Read all about it:_
[Version 1 - Smashing Magazine Article](http://www.smashingmagazine.com/2014/09/making-modal-windows-better-for-everyone/)
[Version 2 - Coming Soon](#!)



## Usage

Modals can be triggered by either a ```<button>``` or ```<a>```.

```html
<button type="button"
  class="__your_btn_classes_here__"
  data-action="modal-open"
  data-modal-open="normal_modal"
  data-set-modal-title="Test Title">
  Launch Modal
</button>

<a data-action="modal-open"
   data-modal-open="small_modal"
   data-set-modal-title="Test Title"
   data-modal-alert="true"
   class="no-js-hide"
   href="#small_modal">
  Open Small Alert Modal
</a>
```
