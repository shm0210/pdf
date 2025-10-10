const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const pdfUrlInput = document.getElementById('pdfUrl');
const pdfFileInput = document.getElementById('pdfFile');
const loadBtn = document.getElementById('loadBtn');
const viewer = document.getElementById('viewer');
const viewerWrap = document.getElementById('viewerWrap');
const loader = document.getElementById('loader');
const pageIndicator = document.getElementById('pageIndicator');
const themeToggle = document.getElementById('themeToggle');

let pdfDoc = null;

function showLoader(show = true) {
  loader.classList.toggle('hidden', !show);
}

async function loadPdf(url) {
  viewer.innerHTML = '<div style="text-align:center;padding:20px;">Loading…</div>';
  pageIndicator.textContent = '0 / 0';
  showLoader(true);

  try {
    const loadingTask = pdfjsLib.getDocument(url);
    pdfDoc = await loadingTask.promise;
    viewer.innerHTML = '';

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      await renderPage(i);
    }

    setupScrollObserver();
  } catch (err) {
    viewer.innerHTML = `<div style="color:#ff6b6b;padding:20px;">Error: ${err.message}</div>`;
  } finally {
    showLoader(false);
  }
}

async function renderPage(num) {
  const page = await pdfDoc.getPage(num);
  const viewport = page.getViewport({ scale: 1.2 });

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

  await page.render({ canvasContext: context, viewport }).promise;
}

/* Update page indicator as you scroll */
function setupScrollObserver() {
  const pages = document.querySelectorAll('.page');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const num = parseInt(entry.target.id.replace('page-', ''));
        pageIndicator.textContent = `${num} / ${pdfDoc.numPages}`;
      }
    });
  }, { root: viewerWrap, threshold: 0.6 });
  pages.forEach(p => observer.observe(p));
}

/* Load button or Enter key */
loadBtn.addEventListener('click', () => {
  const url = pdfUrlInput.value.trim();
  if (url) loadPdf(url);
});

pdfUrlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const url = pdfUrlInput.value.trim();
    if (url) loadPdf(url);
  }
});

/* ---- Local file loading ---- */
pdfFileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Clear URL input to avoid confusion
  pdfUrlInput.value = '';

  viewer.innerHTML = '<div style="text-align:center;padding:20px;">Loading local PDF…</div>';
  pageIndicator.textContent = '0 / 0';
  showLoader(true);

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    pdfDoc = await loadingTask.promise;
    viewer.innerHTML = '';

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      await renderPage(i);
    }

    setupScrollObserver();
  } catch (err) {
    viewer.innerHTML = `<div style="color:#ff6b6b;padding:20px;">Error: ${err.message}</div>`;
  } finally {
    showLoader(false);
  }
});

/* Auto-load via ?pdf=URL */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pdfUrl = params.get('pdf');
  if (pdfUrl) {
    pdfUrlInput.value = pdfUrl;
    loadPdf(pdfUrl);
  }
});

/* ---- Theme toggle ---- */
themeToggle.addEventListener('click', () => {
  const body = document.body;
  const isDark = body.classList.toggle('dark');
  body.classList.toggle('light', !isDark);
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  
  // Save theme preference to localStorage
  localStorage.setItem('pdfViewerTheme', isDark ? 'dark' : 'light');
});

/* Load saved theme preference */
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('pdfViewerTheme') || 'light';
  const body = document.body;
  
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    body.classList.remove('light');
    themeToggle.textContent = '🌙';
  } else {
    body.classList.add('light');
    body.classList.remove('dark');
    themeToggle.textContent = '☀️';
  }
});
