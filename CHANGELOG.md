# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
Full history of changelog coming...

## 3.3.2 - 2018-08-25
### Changed
- Minor code simplifications and rewriting/removal of some in line code documentation. 
- Updated the name of the "focusableElements" variable to "tabFocusElements" as this listing of elements was not to imply they were the only focusable elements, but that they are what's focusable by use of the tab key.  Additionally, modified some elements to not consider them tab focusable if they have a `hidden` attribute set.

## 3.3.1 - 2018-08-11
### Added
- New attribute for the dialog container, `data-modal-manual-close`. Adding this attribute will cancel out automatic creation of a close button, so you can hard code a single close button wherever you please, within the modal dialog.

## 3.3.0 - 2018-08-07
### Fixed
- Updated the allowed focusable elements within a dialog that the `js-first-focus` and `js-last-focus` classes can be added to.  This solves a focus bug caused by if an `input type="hidden"` or `disabled` element was the first or last child of a dialog.

## 3.2.1 - 2018-07-07
### Added
- Wrap the `focusTarget.focus()` in a `requestAnimationFrame`. This almost consistently solves for the iOS VoiceOver focus issue, where VO focus is not moved to an opened dialog if the dialog has `display: none` as its default display, or if a dialog contains a `role=document` element as its first child, instead of a heading. Credit to Thomas Jaggi, codepen.io/backflip, for recommending the workaround.
  
## 3.2.0 - 2018-07-05
### Added
- Added option to include a child element with a `data-modal-document` attribute, to indicate to the script that this element should have a `role="document"` applied to it, during the setup process. This will correctly allow users to navigate a dialog's contents with their virtual cursor, if using older versions of NVDA.

## 3.1.2 - 2018-07-03
### Changed
- Fix console error when an auto-load dialog was not found. Did not affect usage of dialog itself, but don't want unnecessary errors.
