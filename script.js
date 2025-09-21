const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const pdfUrlInput = document.getElementById('pdfUrl');
const loadBtn = document.getElementById('loadBtn');
const btnText = document.querySelector('.btn-text');
const btnSpinner = document.querySelector('.btn-spinner');
const viewer = document.getElementById('viewer');
const viewerWrap = document.getElementById('viewerWrap');
const pageIndicator = document.getElementById('pageIndicator');
const hint = document.getElementById('hint');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomLevel = document.getElementById('zoomLevel');

let pdfDoc = null;
let observer = null;
let currentScale = 1.2;
let currentPage = 1;

function showButtonLoading() {
  btnText.style.display = 'none';
  btnSpinner.style.display = 'flex';
  loadBtn.disabled = true;
}

function hideButtonLoading() {
  btnText.style.display = 'block';
  btnSpinner.style.display = 'none';
  loadBtn.disabled = false;
}

function showViewerLoading() {
  viewer.innerHTML = `
    <div class="loading-overlay">
      <div class="loading-spinner-large"></div>
    </div>
  `;
  pageIndicator.style.display = 'none';
}

function showError(message) {
  viewer.innerHTML = `
    <div class="error-message">
      <h3>Error Loading PDF</h3>
      <p>${message}</p>
    </div>
  `;
}

async function loadPdf(url) {
  if (!url) {
    showError('Please enter a valid URL');
    return;
  }
  
  showButtonLoading();
  showViewerLoading();
  
  try {
    // Clear previous observer if any
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    
    const loadingTask = pdfjsLib.getDocument(url);
    pdfDoc = await loadingTask.promise;
    
    viewer.innerHTML = '';
    viewer.classList.add('continuous');
    
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      await renderPage(i);
    }
    
    pageIndicator.style.display = 'block';
    pageIndicator.textContent = `Page 1 of ${pdfDoc.numPages}`;
    hint.style.display = 'none';
    
    // Set up intersection observer for page tracking
    setupPageObserver();
  } catch (err) {
    console.error('PDF loading error:', err);
    showError(err.message || 'Failed to load the PDF. Please check the URL and try again.');
  } finally {
    hideButtonLoading();
  }
}

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: currentScale });

  const pageWrap = document.createElement('div');
  pageWrap.className = 'page';
  pageWrap.id = 'page-' + num;
  pageWrap.dataset.pageNumber = num;

  const canvas = document.createElement('canvas');
  canvas.className = 'pdf-canvas';
  pageWrap.appendChild(canvas);
  viewer.appendChild(pageWrap);

  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport: viewport }).promise;
}

function setupPageObserver() {
  if (observer) {
    observer.disconnect();
  }
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const pageNum = parseInt(entry.target.dataset.pageNumber);
        currentPage = pageNum;
        pageIndicator.textContent = `Page ${pageNum} of ${pdfDoc.numPages}`;
      }
    });
  }, { 
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  });
  
  // Observe all pages
  document.querySelectorAll('.page').forEach(page => {
    observer.observe(page);
  });
}

function zoomPdf(factor) {
  if (!pdfDoc) return;
  
  currentScale *= factor;
  currentScale = Math.max(0.5, Math.min(3, currentScale)); // Limit zoom range
  zoomLevel.textContent = `${Math.round(currentScale * 100)}%`;
  
  // Re-render all pages with new scale
  showViewerLoading();
  
  setTimeout(async () => {
    viewer.innerHTML = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      await renderPage(i);
    }
    setupPageObserver();
    
    // Scroll to current page
    const currentPageElem = document.getElementById(`page-${currentPage}`);
    if (currentPageElem) {
      currentPageElem.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
}

pdfUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadPdf(pdfUrlInput.value.trim());
});

loadBtn.addEventListener('click', () => loadPdf(pdfUrlInput.value.trim()));

zoomInBtn.addEventListener('click', () => zoomPdf(1.2));
zoomOutBtn.addEventListener('click', () => zoomPdf(0.8));

// Auto-load PDF from query string (?pdf=url)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pdfUrl = params.get('pdf');
  if (pdfUrl) {
    pdfUrlInput.value = pdfUrl;
    loadPdf(pdfUrl);
  }
});
