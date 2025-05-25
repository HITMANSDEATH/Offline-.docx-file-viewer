# Offline DOCX file Viewer (Chrome/Brave Extension)
A lightweight Chrome/Brave extension to view `.docx` files offline directly in your browser. No uploads, no servers, no internet required.

## Features
- Select `.docx` files via popup
- Renders content using [Mammoth.js](https://github.com/mwilliamson/mammoth.js)
- Opens documents in a new tab with clean formatting
- Stores file data locally using `chrome.storage.local`
- Fully offline — no network required

## File Structure
extension-root/
├── manifest.json # Extension config
├── popup.html # Upload UI
├── popup.js # Handles file reading & storage
├── viewer.html # Displays DOCX content
├── viewer.js # Logic for rendering with Mammoth
├── background.js # Opens viewer tab
├── mammoth.browser.min.js # DOCX to HTML conversion engine
└── docx_icon.png # Extension icon


## Installation (for developers)
1. Clone or download this repository.
2. Open `chrome://extensions/` in Chrome or Brave.
3. Enable Developer Mode (top right).
4. Click "Load unpacked" and select the project folder.
5. Click the extension icon → Select a `.docx` file → View it in a new tab.

## Usage
1. Click the extension icon.
2. Choose a `.docx` file.
3. The file opens in a new tab with clean HTML formatting.
4. All processing is done locally — nothing is sent to the internet.

## Privacy
This extension works entirely offline. No data is transmitted anywhere.

## Tech Stack
- HTML, CSS, JavaScript
- Chrome Extension APIs
- Mammoth.js for `.docx` to HTML conversion

## Known Limitations
- `.doc` support is limited — `.docx` is preferred.
- Complex layouts or advanced formatting might not render perfectly.

## License
MIT License — free to use, modify, and distribute.
