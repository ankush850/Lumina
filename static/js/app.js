/**
 * Lumina AI - Document Sanitizer & Presentation Studio
 * Modern reactive frontend controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('file-preview');
  const previewFileName = document.getElementById('preview-file-name');
  const previewFileMeta = document.getElementById('preview-file-meta');
  const previewFileIcon = document.getElementById('preview-file-icon');
  const removeFileBtn = document.getElementById('remove-file-btn');
  const processBtn = document.getElementById('process-btn');

  // Stepper Elements
  const processingState = document.getElementById('processing-state');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  const progressPercent = document.getElementById('progress-percent');
  const stepItems = document.querySelectorAll('.step-card');

  // Completion Elements
  const completionState = document.getElementById('completion-state');
  const statRemoved = document.getElementById('stat-removed');
  const statLayouts = document.getElementById('stat-layouts');
  const statFormat = document.getElementById('stat-format');
  const statTime = document.getElementById('stat-time');
  const downloadBtn = document.getElementById('download-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Tabs
  const tabSingle = document.getElementById('tab-single');
  const tabBatch = document.getElementById('tab-batch');
  const batchQueueArea = document.getElementById('batch-queue-area');
  const batchList = document.getElementById('batch-list');
  const processBatchBtn = document.getElementById('process-batch-btn');

  // State
  let selectedFile = null;
  let batchFiles = [];
  let currentMode = 'single'; // 'single' | 'batch'
  let isProcessing = false;

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  const ALLOWED_EXTS = ['pdf', 'pptx'];

  // Toast System
  function showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    if (type === 'error') icon = 'error';

    toast.innerHTML = `
      <span class="material-symbols-outlined" style="font-size: 20px;">${icon}</span>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[m]);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function validateFile(file) {
    if (!file) return { valid: false, message: 'No file selected.' };
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return { valid: false, message: 'Invalid format. Please select a .pdf or .pptx file.' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, message: 'File exceeds 50MB maximum size limit.' };
    }
    return { valid: true, ext };
  }

  // Handle Single File Selection
  function handleSingleFile(file) {
    const val = validateFile(file);
    if (!val.valid) {
      showToast(val.message, 'error');
      return;
    }

    selectedFile = file;
    const ext = val.ext;

    // Update Preview
    if (previewFileName) previewFileName.textContent = file.name;
    if (previewFileMeta) previewFileMeta.textContent = `${ext.toUpperCase()} • ${formatBytes(file.size)}`;

    if (previewFileIcon) {
      previewFileIcon.className = `file-type-icon ${ext}`;
      previewFileIcon.textContent = ext.toUpperCase();
    }

    // Toggle Visibility
    if (dropZone) dropZone.classList.add('hidden');
    if (filePreview) filePreview.classList.remove('hidden');
    if (completionState) completionState.classList.add('hidden');
    if (processingState) processingState.classList.add('hidden');

    showToast(`Loaded "${file.name}"`, 'info', 2000);
  }

  // Handle Batch Files Selection
  function handleBatchFiles(files) {
    const validList = [];
    for (const f of files) {
      const v = validateFile(f);
      if (v.valid) {
        validList.push({ file: f, ext: v.ext, status: 'ready', result: null });
      } else {
        showToast(`${f.name}: ${v.message}`, 'error');
      }
    }

    if (validList.length === 0) return;

    batchFiles = [...batchFiles, ...validList];
    renderBatchList();
    if (dropZone) dropZone.classList.add('hidden');
    if (batchQueueArea) batchQueueArea.classList.remove('hidden');
  }

  function renderBatchList() {
    if (!batchList) return;
    batchList.innerHTML = '';

    batchFiles.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'file-preview-card';
      row.style.marginTop = '8px';
      
      let statusBadge = '<span class="format-pill">Ready</span>';
      if (item.status === 'processing') {
        statusBadge = '<span class="format-pill" style="color:#38bdf8;border-color:rgba(56,189,248,0.3)">Processing...</span>';
      } else if (item.status === 'done') {
        statusBadge = `<a href="${item.result?.download_url || '#'}" class="format-pill" style="color:#34d399;border-color:rgba(52,211,153,0.3);text-decoration:none;" download>Download Clean</a>`;
      } else if (item.status === 'error') {
        statusBadge = '<span class="format-pill" style="color:#f87171;border-color:rgba(248,113,113,0.3)">Failed</span>';
      }

      row.innerHTML = `
        <div class="file-info-group">
          <div class="file-type-icon ${item.ext}">${item.ext.toUpperCase()}</div>
          <div class="file-details">
            <span class="file-name">${escapeHtml(item.file.name)}</span>
            <span class="file-meta-text">${formatBytes(item.file.size)}</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          ${statusBadge}
          <button class="btn-icon" data-index="${index}" title="Remove file">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      `;

      row.querySelector('.btn-icon').addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        batchFiles.splice(idx, 1);
        if (batchFiles.length === 0) {
          resetWorkspace();
        } else {
          renderBatchList();
        }
      });

      batchList.appendChild(row);
    });
  }

  // Reset workspace
  function resetWorkspace() {
    selectedFile = null;
    batchFiles = [];
    isProcessing = false;

    if (fileInput) fileInput.value = '';
    if (dropZone) dropZone.classList.remove('hidden');
    if (filePreview) filePreview.classList.add('hidden');
    if (processingState) processingState.classList.add('hidden');
    if (completionState) completionState.classList.add('hidden');
    if (batchQueueArea) batchQueueArea.classList.add('hidden');

    if (progressBar) progressBar.style.width = '0%';
    if (processBtn) {
      processBtn.disabled = false;
      processBtn.innerHTML = `
        <span class="material-symbols-outlined">auto_fix_high</span>
        <span>Process Document with Lumina AI</span>
      `;
    }
  }

  // Drag & Drop Listeners
  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length) {
        if (currentMode === 'single') {
          handleSingleFile(e.target.files[0]);
        } else {
          handleBatchFiles(Array.from(e.target.files));
        }
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      document.body.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZone && !isProcessing) dropZone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      document.body.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (eventName === 'drop' || !e.relatedTarget) {
          if (dropZone) dropZone.classList.remove('dragover');
        }

        if (eventName === 'drop' && e.dataTransfer && e.dataTransfer.files.length) {
          if (isProcessing) return;
          if (currentMode === 'single') {
            handleSingleFile(e.dataTransfer.files[0]);
          } else {
            handleBatchFiles(Array.from(e.dataTransfer.files));
          }
        }
      });
    });
  }

  if (removeFileBtn) {
    removeFileBtn.addEventListener('click', resetWorkspace);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetWorkspace);
  }

  // Tab switching
  if (tabSingle && tabBatch) {
    tabSingle.addEventListener('click', () => {
      if (isProcessing) return;
      currentMode = 'single';
      tabSingle.classList.add('active');
      tabBatch.classList.remove('active');
      if (fileInput) fileInput.removeAttribute('multiple');
      resetWorkspace();
    });

    tabBatch.addEventListener('click', () => {
      if (isProcessing) return;
      currentMode = 'batch';
      tabBatch.classList.add('active');
      tabSingle.classList.remove('active');
      if (fileInput) fileInput.setAttribute('multiple', 'multiple');
      resetWorkspace();
    });
  }

  // Multi-step animated progress simulation
  function updateStepUI(stepIndex, pct, text) {
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressPercent) progressPercent.textContent = `${pct}%`;
    if (progressText) progressText.textContent = text;

    if (stepItems && stepItems.length) {
      stepItems.forEach((item, idx) => {
        if (idx < stepIndex) {
          item.className = 'step-card completed';
        } else if (idx === stepIndex) {
          item.className = 'step-card active';
        } else {
          item.className = 'step-card';
        }
      });
    }
  }

  // Single File Process Trigger
  if (processBtn) {
    processBtn.addEventListener('click', async () => {
      if (!selectedFile || isProcessing) return;
      isProcessing = true;
      const startTime = performance.now();

      if (filePreview) filePreview.classList.add('hidden');
      if (processingState) processingState.classList.remove('hidden');

      // Start Stepper Animation
      updateStepUI(0, 15, 'Scanning presentation structures & slide masters...');

      const stepTimer1 = setTimeout(() => {
        updateStepUI(1, 45, 'Detecting Gamma watermark hyperlinks & overlays...');
      }, 500);

      const stepTimer2 = setTimeout(() => {
        updateStepUI(2, 75, 'Purging watermark nodes & preserving vector paths...');
      }, 1100);

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('/api/remove-watermark', {
          method: 'POST',
          body: formData
        });

        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          updateStepUI(3, 100, 'Sanitization complete! Finalizing output...');

          setTimeout(() => {
            if (processingState) processingState.classList.add('hidden');
            if (completionState) completionState.classList.remove('hidden');

            const removed = data.watermarks_removed ?? 0;
            const layouts = data.layouts_processed ?? 0;
            const elapsed = ((performance.now() - startTime) / 1000).toFixed(2) + 's';
            const time = data.processing_time || elapsed;
            const fmt = (data.file_type || selectedFile.name.split('.').pop() || 'PDF').toUpperCase();

            if (statRemoved) statRemoved.textContent = removed;
            if (statLayouts) statLayouts.textContent = layouts;
            if (statFormat) statFormat.textContent = fmt;
            if (statTime) statTime.textContent = time;

            if (downloadBtn) {
              if (data.download_url) {
                downloadBtn.href = data.download_url;
                downloadBtn.setAttribute('download', `clean_${selectedFile.name}`);
                downloadBtn.style.display = 'inline-flex';
              } else {
                downloadBtn.style.display = 'none';
              }
            }

            showToast(data.message || 'Watermarks removed cleanly!', 'success');
          }, 600);
        } else {
          throw new Error(data.message || 'Watermark removal failed on server.');
        }
      } catch (err) {
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        showToast(err.message || 'Failed to process document. Please try again.', 'error');
        resetWorkspace();
      } finally {
        isProcessing = false;
      }
    });
  }

  // Batch Process Trigger
  if (processBatchBtn) {
    processBatchBtn.addEventListener('click', async () => {
      if (batchFiles.length === 0 || isProcessing) return;
      isProcessing = true;
      processBatchBtn.disabled = true;
      processBatchBtn.textContent = 'Processing Batch Queue...';

      let successCount = 0;

      for (let i = 0; i < batchFiles.length; i++) {
        const item = batchFiles[i];
        item.status = 'processing';
        renderBatchList();

        try {
          const fd = new FormData();
          fd.append('file', item.file);

          const res = await fetch('/api/remove-watermark', {
            method: 'POST',
            body: fd
          });

          const resData = await res.json();
          if (res.ok && resData.status === 'success') {
            item.status = 'done';
            item.result = resData;
            successCount++;
          } else {
            item.status = 'error';
          }
        } catch (e) {
          item.status = 'error';
        }
        renderBatchList();
      }

      showToast(`Batch processing completed. ${successCount}/${batchFiles.length} files cleaned.`, 'success');
      processBatchBtn.disabled = false;
      processBatchBtn.textContent = 'Process All Files';
      isProcessing = false;
    });
  }
});
