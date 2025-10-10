# INFINITY PDF VIEWER

A modern, responsive PDF viewer built with vanilla JavaScript and PDF.js that works both online and offline. View PDFs from URLs or local files with a clean, customizable interface.

![PDF Viewer](https://img.shields.io/badge/PDF-Viewer-blue) ![Version](https://img.shields.io/badge/version-1.0.0-green) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

## 🌐 Live Demo

**[View Live Demo](https://shm0210.github.io/pdf/)**

## ✨ Features

- **Dual Input Methods**: Load PDFs from URL or local files
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Scrolling**: Custom scrollbar with page indicator
- **Page Navigation**: Real-time page indicator as you scroll
- **Fast Rendering**: Uses PDF.js for efficient PDF rendering
- **URL Parameters**: Auto-load PDFs via `?pdf=URL` parameter
- **Modern UI**: Clean, minimalist interface with smooth animations

## 🚀 Quick Start

### Method 1: Direct URL
1. Visit [the live demo](https://shm0210.github.io/pdf/)
2. Paste a public PDF URL in the input field
3. Click "Load" or press Enter

### Method 2: Local File
1. Click "Choose File" to select a PDF from your device
2. The PDF will load automatically

### Method 3: URL Parameter
Append `?pdf=PDF_URL` to the page URL to auto-load a PDF:
```
https://shm0210.github.io/pdf/?pdf=https://example.com/document.pdf
```

## 🛠️ Installation

To host locally:

```bash
# Clone or download the HTML file
# Serve using any web server

# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📁 Project Structure

```
pdf-viewer/
├── index.html          # Main application file
├── README.md          # Project documentation
└── (optional assets)
```

## 🎨 Customization

### Themes
The viewer includes both light and dark themes. Toggle using the button in the bottom-left corner. Your preference is saved in localStorage.

### Styling
Key CSS variables for customization:
```css
:root {
  --page-gap: 2px;      /* Space between pages */
  --accent: #0078ff;    /* Primary accent color */
  --bg: #f6f7f8;        /* Background color */
  --page-bg: #fff;      /* Page background */
  --border: rgba(0, 0, 0, 0.1); /* Border colors */
  --text: #222;         /* Text color */
}
```

## 🔧 Technical Details

### Built With
- **PDF.js** (v2.16.105) - PDF rendering engine
- **Vanilla JavaScript** - No frameworks required
- **Modern CSS** - CSS Grid, Flexbox, and CSS Variables
- **Intersection Observer API** - For scroll tracking

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Lazy rendering of PDF pages
- Efficient canvas rendering
- Optimized scroll performance
- Minimal dependencies

## 📱 Mobile Support

Fully responsive design that works on:
- Smartphones
- Tablets
- Desktop computers
- Touch-enabled devices

## 🔄 API Reference

### JavaScript Functions

| Function | Description |
|----------|-------------|
| `loadPdf(url)` | Loads PDF from URL |
| `renderPage(num)` | Renders specific page number |
| `setupScrollObserver()` | Sets up page tracking |
| `showLoader(show)` | Controls loading indicator |

### Events

| Event | Element | Description |
|-------|---------|-------------|
| `click` | Load Button | Triggers PDF loading |
| `keydown` | URL Input | Enter key loads PDF |
| `change` | File Input | Loads local PDF file |
| `click` | Theme Toggle | Switches themes |

## 🐛 Troubleshooting

### Common Issues

1. **PDF fails to load**
   - Check if the URL is accessible and CORS-enabled
   - Ensure it's a valid PDF file

2. **Local files not loading**
   - Modern browsers may restrict local file access
   - Use a local server for best results

3. **Rendering issues**
   - Clear browser cache
   - Check browser console for errors

### CORS Notes
- PDF URLs must have proper CORS headers
- Local development may require a local server

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Shubham**  
- GitHub: [@shm0210](https://github.com/shm0210)  
- Instagram: [@i.shubham0210](https://instagram.com/i.shubham0210)  

## 🙏 Acknowledgments

- [PDF.js](https://mozilla.github.io/pdf.js/) - Mozilla's PDF rendering library
- [Cloudflare CDN](https://cdnjs.com/) - For hosting PDF.js resources
- All contributors and testers

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting](#troubleshooting) section
2. Open an issue on GitHub
3. Contact via Instagram: [@i.shubham0210](https://instagram.com/i.shubham0210)

---

**⭐ If you find this project helpful, please give it a star on GitHub!**
