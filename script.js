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

let pdfDoc = null;
let observer = null;

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
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      await renderPage(i);
    }
    
    pageIndicator.style.display = 'block';
    pageIndicator.textContent = `1 / ${pdfDoc.numPages}`;
    hint.style.display = 'none';
  } catch (err) {
    console.error('PDF loading error:', err);
    showError(err.message || 'Failed to load the PDF. Please check the URL and try again.');
  } finally {
    hideButtonLoading();
  }
}

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: 1.5 }); // Slightly increased scale for better readability

  const pageWrap = document.createElement('div');
  pageWrap.className = 'page';
  pageWrap.id = 'page-' + num;

  const canvas = document.createElement('canvas');
  canvas.className = 'pdf-canvas';
  pageWrap.appendChild(canvas);
  viewer.appendChild(pageWrap);

  const context = canvas.getContext('2d');
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport: viewport }).promise;

  observePage(pageWrap, num);
}

function observePage(el, num) {
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          pageIndicator.textContent = `${parseInt(
            entry.target.id.replace('page-', '')
          )} / ${pdfDoc.numPages}`;
        }
      });
    }, { root: viewerWrap, threshold: 0.6 });
  }
  observer.observe(el);
}

pdfUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadPdf(pdfUrlInput.value.trim());
});

loadBtn.addEventListener('click', () => loadPdf(pdfUrlInput.value.trim()));

// Auto-load PDF from query string (?pdf=url)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pdfUrl = params.get('pdf');
  if (pdfUrl) {
    pdfUrlInput.value = pdfUrl;
    loadPdf(pdfUrl);
  }
});
