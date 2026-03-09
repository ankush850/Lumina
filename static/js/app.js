const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const chooseBtn = document.getElementById('chooseBtn');
const removeBtn = document.getElementById('removeBtn');
const statusBox = document.getElementById('statusBox');
const fileMeta = document.getElementById('fileMeta');

let isProcessing = false;
const MAX_SIZE = 50 * 1024 * 1024;
const allowed = ['pdf', 'pptx'];

function setStatus(html) {
  statusBox.innerHTML = html;
}

function clearFileMeta() {
  fileMeta.textContent = '';
}

function validateFile(file) {
  if (!file) return { ok: false, message: 'Select a file first.' };
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!allowed.includes(ext)) return { ok: false, message: 'Invalid file type. Upload a PDF or PPTX.' };
  if (file.size > MAX_SIZE) return { ok: false, message: 'File too large. Max size is 50 MB.' };
  return { ok: true };
}

function updateFileMeta(file) {
  if (!file) { clearFileMeta(); return; }
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  fileMeta.textContent = `${ext.toUpperCase()} • ${sizeMB} MB`;
}

function onFileSelected(file) {
  const v = validateFile(file);
  if (!v.ok) {
    setStatus(`<div class="error">${v.message}</div>`);
    fileInput.value = '';
    clearFileMeta();
    return;
  }
  updateFileMeta(file);
  setStatus('');
}

chooseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => onFileSelected(fileInput.files[0]));

['dragenter', 'dragover'].forEach(ev => {
  document.body.addEventListener(ev, e => {
    e.preventDefault();
    dropZone.classList.add('drag');
  });
});
['dragleave', 'drop'].forEach(ev => {
  document.body.addEventListener(ev, e => {
    e.preventDefault();
    if (ev === 'drop' || !e.relatedTarget) {
      dropZone.classList.remove('drag');
    }
    if (ev === 'drop' && e.dataTransfer.files.length) {
      const f = e.dataTransfer.files[0];
      const dt = new DataTransfer();
      dt.items.add(f);
      fileInput.files = dt.files;
      onFileSelected(f);
    }
  });
});

async function removeWatermark() {
  if (isProcessing) return;
  const file = fileInput.files[0];
  const v = validateFile(file);
  if (!v.ok) {
    setStatus(`<div class="error">${v.message}</div>`);
    return;
  }
  isProcessing = true;
  removeBtn.disabled = true;
  removeBtn.textContent = 'Processing...';
  setStatus('<div class="success">Processing file...</div>');
  try {
    const fd = new FormData();
    fd.append('file', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const resp = await fetch('/api/remove-watermark', {
      method: 'POST',
      body: fd,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const result = await resp.json();
    if (resp.ok && result.status === 'success') {
      const removed = result.watermarks_removed || 0;
      const layouts = result.layouts_processed || 0;
      const download = result.download_url ? `<a class="btn primary result-download" href="${result.download_url}">Download Processed File</a>` : '';
      setStatus(`<div class="result"><div class="result-msg"><span class="icon">✔</span><span>Removed ${removed} watermarks from ${layouts} layouts</span></div>${download}</div>`);
    } else {
      const msg = result.message || 'Processing failed.';
      setStatus(`<div class="error">${msg}</div>`);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      setStatus('<div class="error">Request timed out. Please try a smaller file or try again later.</div>');
    } else {
      setStatus('<div class="error">Upload failed.</div>');
    }
  } finally {
    removeBtn.disabled = false;
    removeBtn.textContent = 'Remove Watermark';
    fileInput.value = '';
    clearFileMeta();
    isProcessing = false;
  }
}

removeBtn.addEventListener('click', removeWatermark);
