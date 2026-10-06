import React, { useState, useRef } from 'react';
import {
  HugeiconsIcon,
  Upload04Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  SparklesIcon,
  File02Icon
} from './Hugeicons';
import Tesseract from 'tesseract.js';
import { Html5Qrcode } from 'html5-qrcode';

export function SerialScanner({ showNotification }) {
  const [scans, setScans] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processImage = async (file) => {
    const id = Date.now() + Math.random().toString(36).substring(7);
    const url = URL.createObjectURL(file);
    
    setScans(prev => [{
      id,
      file,
      url,
      qrData: null,
      ocrData: null,
      status: 'processing',
      progressMsg: 'Reading QR Code...'
    }, ...prev]);

    try {
      // 1. Load image and optimize it (downscale, grayscale, contrast) for both QR and OCR
      const img = new Image();
      img.src = url;
      await new Promise(resolve => { img.onload = resolve; });
      
      const MAX_DIM = 1400;
      let scale = 1;
      if (img.width > MAX_DIM || img.height > MAX_DIM) {
        scale = Math.min(MAX_DIM / img.width, MAX_DIM / img.height);
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      // Apply contrast and grayscale to help ZXing and Tesseract
      ctx.filter = 'contrast(1.4) grayscale(1)';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      const optimizedFile = new File([blob], "optimized.jpg", { type: "image/jpeg" });

      // 2. Scan with html5-qrcode
      let qrData = null;
      try {
        const html5QrCode = new Html5Qrcode("hidden-qr-reader");
        qrData = await html5QrCode.scanFile(optimizedFile, true);
        html5QrCode.clear();
      } catch (qrErr) {
        console.warn("QR not found in this image");
      }

      // Update state to indicate we are moving to OCR
      setScans(prev => prev.map(item => 
        item.id === id ? { ...item, qrData, progressMsg: 'Extracting Text (OCR)...' } : item
      ));

      // 3. Tesseract OCR
      const worker = await Tesseract.createWorker('eng', 1, { logger: m => {} });
      await worker.setParameters({ tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' });
      
      const ret = await worker.recognize(canvas); // using the optimized contrast canvas!
      await worker.terminate();

      // Clean up extracted text
      const ocrRaw = ret.data.text || '';
      
      // Tesseract often reads '0' as 'O' or '8' as 'B'. We allow Letters in the match, then correct them.
      const wsMatch = ocrRaw.match(/WS[A-Z0-9]{12,18}/i);
      
      let ocrData = null;
      if (wsMatch) {
        let rawSerial = wsMatch[0].toUpperCase();
        // The serials are WS followed by digits. Fix common OCR letter-to-digit mistakes.
        let prefix = rawSerial.substring(0, 2); // 'WS'
        let body = rawSerial.substring(2)
          .replace(/O/g, '0')
          .replace(/Q/g, '0')
          .replace(/I/g, '1')
          .replace(/L/g, '1')
          .replace(/Z/g, '2')
          .replace(/S/g, '5')
          .replace(/B/g, '8');
        ocrData = prefix + body;
      } else {
        // Strict fallback looking for a 14-digit number
        const strictMatch = ocrRaw.match(/[0-9]{13,16}/);
        if (strictMatch) ocrData = 'WS' + strictMatch[0];
      }

      setScans(prev => prev.map(item => 
        item.id === id ? { ...item, ocrData, status: 'done', progressMsg: 'Complete' } : item
      ));

      if (qrData) {
        showNotification('Serial Number successfully extracted via QR!', 'success');
      }

    } catch (err) {
      console.error(err);
      setScans(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'error', progressMsg: 'Failed to read image.' } : item
      ));
      showNotification('Error processing image.', 'error');
    }
  };

  const handleFiles = (files) => {
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      showNotification('Please upload valid image files.', 'error');
      return;
    }
    imageFiles.forEach(file => processImage(file));
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard!', 'success');
  };

  const handleCopyAll = () => {
    const allText = scans
      .filter(s => s.status === 'done' && (s.qrData || s.ocrData))
      .map(s => s.qrData || s.ocrData)
      .join('\n');
    
    if (allText) {
      navigator.clipboard.writeText(allText);
      showNotification('All serial numbers copied!', 'success');
    }
  };

  return (
    <div className="serial-scanner-layout">
      {/* ── DRAG & DROP ZONE ── */}
      <div 
        className={`scan-hero-zone ${isDragging ? 'drag-active' : ''}`}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        style={{ marginBottom: 20 }}
      >
        <div className="scan-icon-ring">
          <HugeiconsIcon icon={Upload04Icon} size={20} />
        </div>
        <div className="scan-hero-title">Upload Serial Number Photos</div>
        <div className="scan-hero-sub">Drop images containing QR codes and serial text here</div>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          multiple
          style={{ display: 'none' }}
          onChange={e => { if (e.target.files) handleFiles(e.target.files); }}
        />
      </div>

      {/* Hidden element required by html5-qrcode for rendering during scanFile */}
      <div id="hidden-qr-reader" style={{ display: 'none' }}></div>

      {/* ── ACTION BAR ── */}
      {scans.length > 0 && (
        <div className="scanner-action-bar">
          <div className="scanner-count">
            <span style={{ color: 'var(--accent-blue)', fontWeight: 700 }}>{scans.length}</span> Images Uploaded
          </div>
          <button type="button" className="btn-cta-full" style={{ width: 'auto', padding: '6px 14px' }} onClick={handleCopyAll}>
            <HugeiconsIcon icon={File02Icon} size={14} />
            Copy All Serial Numbers
          </button>
        </div>
      )}

      {/* ── RESULTS LIST ── */}
      <div className="scanner-results-grid">
        {scans.map((scan) => (
          <div key={scan.id} className="scanner-card section-card">
            <div className="scanner-card-img-box">
              <img src={scan.url} alt="Serial Scan" className="scanner-thumb" />
            </div>
            
            <div className="scanner-card-content">
              {scan.status === 'processing' || scan.status === 'reading_text' ? (
                <div className="scanner-loading">
                  <div className="pro-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  <span className="scanner-loading-text">{scan.progressMsg}</span>
                </div>
              ) : scan.status === 'error' ? (
                <div className="scanner-error">
                  <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                  Failed to process image
                </div>
              ) : (
                <div className="scanner-data">
                  {/* QR Data Result */}
                  <div className="scanner-data-row qr-row">
                    <div className="scanner-data-label">
                      <HugeiconsIcon icon={SparklesIcon} size={11} />
                      QR Code Data
                    </div>
                    {scan.qrData ? (
                      <div className="scanner-data-value-group">
                        <span className="scanner-data-value primary">{scan.qrData}</span>
                        <button className="btn-pill-subtle" onClick={() => handleCopy(scan.qrData)}>Copy</button>
                      </div>
                    ) : (
                      <span className="scanner-data-value empty">No QR code detected</span>
                    )}
                  </div>

                  {/* OCR Data Result */}
                  <div className="scanner-data-row ocr-row">
                    <div className="scanner-data-label">OCR Extracted Text</div>
                    {scan.ocrData ? (
                      <div className="scanner-data-value-group">
                        <span className="scanner-data-value secondary">{scan.ocrData}</span>
                        <button className="btn-pill-subtle" onClick={() => handleCopy(scan.ocrData)}>Copy</button>
                      </div>
                    ) : (
                      <span className="scanner-data-value empty">No text detected</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
