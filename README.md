# Screen Capture OCR Chrome Extension

A Chrome extension that captures screen content, performs OCR, and generates intelligent insights using LLMs.

## Features

- Screen capture with adjustable quality settings
- OCR text extraction using Tesseract.js
- LLM-powered analysis using Hugging Face Inference API
- Modern, responsive UI with progress indicators
- Efficient image processing and caching
- Error handling and validation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/KPrathamesh-27/Guide_Extension
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

3. Configure environment variables:
Create a `.env` file in the backend directory:
```env
PORT=3000
HUGGING_FACE_API_KEY=your_api_key_here
```

4. Load the extension in Chrome:
- Open Chrome and navigate to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `extension` directory

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Extension Development
- Make changes to the extension code
- Reload the extension in Chrome

## Usage

1. Click the extension icon in Chrome
2. Click "Capture Screen" to capture the current tab
3. Optional: Add specific instructions in the text input
4. Wait for processing and view results

## Tech Stack

- Frontend:
  - HTML/CSS/JavaScript
  - Chrome Extension APIs
  - Modern UI components
- Backend:
  - Node.js/Express
  - Tesseract.js for OCR
  - Hugging Face Inference API
  - File type validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Author

Prathamesh Kusalkar

## Acknowledgments

- Tesseract.js team
- Hugging Face team
- Chrome Extensions documentation
