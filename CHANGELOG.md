# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
Full history of changelog coming...

## 3.4.1 - 2019-10-07
### Changed
- Added minor feature: Now supports multiple triggers in page and creates unique id's for each trigger.

## 3.4.0 - 2019-01-09
### Changed
If using `data-modal-document` to wrap the contents of a modal dialog in a `role="document"`, the script has been updated to place the generated close button within the `role=document`.  `role=document` may be a necessary child of modal dialogs for people using VoiceOver's quick nav feature (more information in readme).

## 3.3.3 - 2018-08-26
### Changed
If a modal dialog trigger was progressively enhanced from an `a href` into a `role=button`, then that 'button' should no longer have the context menu of a link.  The script will now remove the `href` of these 'buttons' to not have the mismatched context menus.  Additionally, since the `href` is being removed, `tabindex=0` gets added to `<a>` elements.

## 3.3.2 - 2018-08-25
### Changed
- Minor code simplifications and rewriting/removal of some in line code documentation.
- Updated the name of the "focusableElements" variable to "tabFocusElements" as this listing of elements was not to imply they were the only focusable elements, but that they are what's focusable by use of the tab key.  Additionally, modified some elements to not consider them tab focusable if they have a `hidden` attribute set.

## 3.3.1 - 2018-08-11
### Added
- Added minor feature: New attribute for the dialog container, `data-modal-manual-close`. Adding this attribute will cancel out automatic creation of a close button, so you can hard code a single close button wherever you please, within the modal dialog.

## 3.3.0 - 2018-08-07
### Fixed
- Bug fix: updated the allowed focusable elements within a dialog that the `js-first-focus` and `js-last-focus` classes can be added to.  This solves a focus bug caused by if an `input type="hidden"` or `disabled` element was the first or last child of a dialog.

## 3.2.1 - 2018-07-07
### Fixed
- Wrap the `focusTarget.focus()` in a `requestAnimationFrame`. This almost consistently solves for the iOS VoiceOver focus issue, where VO focus is not moved to an opened dialog if the dialog has `display: none` as its default display, or if a dialog contains a `role=document` element as its first child, instead of a heading. Credit to Thomas Jaggi, codepen.io/backflip, for recommending the workaround.

## 3.2.0 - 2018-07-05
### Added
- Added feature: option to include a child element with a `data-modal-document` attribute, to indicate to the script that this element should have a `role="document"` applied to it, during the setup process. This will correctly allow users to navigate a dialog's contents with their virtual cursor, if using older versions of NVDA.

## 3.1.2 - 2018-07-03
### Changed
- Fix console error when an auto-load dialog was not found. Did not affect usage of dialog itself, but don't want unnecessary errors.
