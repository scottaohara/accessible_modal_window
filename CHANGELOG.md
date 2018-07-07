# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]
Full history of changelog coming...

## 3.2.1 - 2018-07-07
### Added
- Wrap the `focusTarget.focus()` in a `requestAnimationFrame`. This almost consistently solves for the iOS VO focus issue, where VO focus is not moved to an opened dialog if the dialog has `display: none` as its default display, or if a dialog contains a `role=document` element as its first child, instead of a heading. Credit to Thomas Jaggi, codepen.io/backflip, for recommending the workaround.
  
## 3.2.0 - 2018-07-05
### Added
- Added option to include a child element with a `data-modal-document` attribute, to indicate to the script that this element should have a `role="document"` applied to it, during the setup process. This will correctly allow users to navigate a dialog's contents with their virtual cursor, if using older versions of NVDA.

## 3.1.2 - 2018-07-03
### Changed
- Fix console error when an auto-load dialog was not found. Did not affect usage of dialog itself, but don't want unnecessary errors.
