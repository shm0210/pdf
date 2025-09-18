const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const pdfUrlInput = document.getElementById('pdfUrl');
const loadBtn = document.getElementById('loadBtn');
const viewer = document.getElementById('viewer');
const viewerWrap = document.getElementById('viewerWrap');
const pageIndicator = document.getElementById('pageIndicator');
const hint = document.getElementById('hint');

let pdfDoc = null;

async function loadPdf(url) {
  viewer.innerHTML = '<div style="text-align:center;padding:20px;">Loading…</div>';
  pageIndicator.style.display = 'none';
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    pdfDoc = await loadingTask.promise;
    viewer.innerHTML = '';
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      await renderPage(i);
    }
    pageIndicator.style.display = 'block';
    pageIndicator.textContent = `1 / ${pdfDoc.numPages}`;
  } catch (err) {
    viewer.innerHTML = `<div style="color:red;padding:20px;">Error: ${err.message}</div>`;
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

  await page.render({ canvasContext: context, viewport: viewport }).promise;

  observePage(pageWrap, num);
}

let observer = null;
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

// --- Auto-load PDF from query string (?=pdfurl)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const pdfUrl = params.get(''); // because query is like ?=link
  if (pdfUrl) {
    pdfUrlInput.value = pdfUrl;
    loadPdf(pdfUrl);
  }
});
