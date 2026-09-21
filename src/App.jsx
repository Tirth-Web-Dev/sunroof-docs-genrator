import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  HugeiconsIcon,
  File02Icon,
  Building03Icon,
  UserIcon,
  Download04Icon,
  Sun03Icon,
  Moon02Icon,
  RotateLeft01Icon,
  Delete02Icon,
  ViewIcon,
  Upload04Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  ZoomInIcon,
  ZoomOutIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  SignatureIcon,
  SparklesIcon,
  RefreshIcon,
  ChevronDown01Icon
} from './components/Hugeicons';
import confetti from 'canvas-confetti';

import { parseApplicationPdf, SAMPLE_APPLICATION_DATA } from './utils/pdfParser';
import { generateAgreementPdf } from './utils/pdfGenerator';
import { COMPANY_PROFILES, INITIAL_AGREEMENT_DATA } from './utils/constants';
import { DocumentPages } from './components/DocumentPages';

/* ─── Computed step from form state ─── */
function getStep(formData, scanned) {
  if (!formData.selectedCompany) return 1;
  if (!scanned) return 2;
  return 3;
}

export default function App() {
  const [formData, setFormData] = useState(INITIAL_AGREEMENT_DATA);
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [vendorOpen, setVendorOpen] = useState(false);

  const fileInputRef = useRef(null);
  const stampInputRef = useRef(null);
  const consumerSigInputRef = useRef(null);

  const currentStep = getStep(formData, scanned);

  // Sync theme with html data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showNotification = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  }, []);

  // Switch Company Profile
  const handleCompanyToggle = (companyKey) => {
    const profile = COMPANY_PROFILES[companyKey] || COMPANY_PROFILES.sunroof;
    setFormData(prev => ({
      ...prev,
      selectedCompany: companyKey,
      vendorName: profile.name,
      vendorAddress: profile.address,
      vendorStamp: profile.stamp,
      customStampUrl: null
    }));
  };

  // PDF Application Scanner
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      showNotification('Please upload a valid PDF document.', 'error');
      return;
    }

    setIsProcessing(true);
    showNotification('Scanning PDF — auto-filling details...', 'info');

    try {
      const extracted = await parseApplicationPdf(file);

      let day = formData.executionDay;
      let month = formData.executionMonth;
      let year = formData.executionYear;

      if (extracted.applicationDate) {
        const parts = extracted.applicationDate.split(/[-/]/);
        if (parts.length === 3) {
          day = parts[0];
          month = parts[1];
          year = parts[2];
        }
      }

      setFormData(prev => ({
        ...prev,
        consumerName: extracted.applicantName || prev.consumerName,
        consumerAddress: extracted.address || prev.consumerAddress,
        mobileNo: extracted.mobileNo || prev.mobileNo,
        consumerAccountNo: extracted.consumerAccountNo || prev.consumerAccountNo,
        applicationNo: extracted.applicationNo || prev.applicationNo,
        appliedCapacity: extracted.appliedCapacity || prev.appliedCapacity,
        discom: extracted.discom || prev.discom,
        executionDay: day,
        executionMonth: month,
        executionYear: year
      }));

      setScanned(true);
      setDetailsOpen(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showNotification('Details extracted & filled in — review below ✓', 'success');
    } catch (err) {
      console.error('Error parsing PDF:', err);
      showNotification('Could not read PDF. Try Sample Data or enter manually.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load Sample Data
  const handleLoadSample = () => {
    setFormData(prev => ({
      ...prev,
      consumerName: SAMPLE_APPLICATION_DATA.applicantName,
      consumerAddress: SAMPLE_APPLICATION_DATA.address,
      mobileNo: SAMPLE_APPLICATION_DATA.mobileNo,
      consumerAccountNo: SAMPLE_APPLICATION_DATA.consumerAccountNo,
      applicationNo: SAMPLE_APPLICATION_DATA.applicationNo,
      appliedCapacity: SAMPLE_APPLICATION_DATA.appliedCapacity,
      discom: SAMPLE_APPLICATION_DATA.discom,
      executionDay: '19',
      executionMonth: '09',
      executionYear: '2026',
      selectedCompany: 'sunroof',
      vendorName: COMPANY_PROFILES.sunroof.name,
      vendorAddress: COMPANY_PROFILES.sunroof.address,
      vendorStamp: COMPANY_PROFILES.sunroof.stamp
    }));

    setScanned(true);
    setDetailsOpen(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    showNotification('Sample data loaded!', 'success');
  };

  // First Party Signature Upload
  const handleConsumerSigUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, consumerSignatureUrl: url }));
      showNotification('Signature uploaded ✓', 'success');
    }
  };

  // Custom Stamp Upload
  const handleStampUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, customStampUrl: url, includeStamp: true }));
      showNotification('Custom stamp uploaded ✓', 'success');
    }
  };

  // Clear customer fields
  const handleClearForm = () => {
    setFormData(prev => ({
      ...prev,
      consumerName: '',
      consumerAddress: '',
      mobileNo: '',
      consumerAccountNo: '',
      applicationNo: '',
      appliedCapacity: '',
      consumerSignatureUrl: null
    }));
    setScanned(false);
    showNotification('Fields cleared', 'info');
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    const previousMode = viewMode;
    setViewMode('all');
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 250));

    try {
      await generateAgreementPdf(
        { consumerName: formData.consumerName, applicationNo: formData.applicationNo },
        progress => setExportProgress(progress)
      );
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      showNotification('Agreement PDF downloaded!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showNotification('PDF generation failed. Please try again.', 'error');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
      setViewMode(previousMode);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const activeTabProp = viewMode === 'all' ? 'all' : String(currentPage);

  /* ─── Step indicator ─── */
  const steps = [
    { num: 1, label: 'Company' },
    { num: 2, label: 'Scan PDF' },
    { num: 3, label: 'Review' },
  ];

  return (
    <div className="app-shell">
      {/* TOP NAVBAR */}
      <header className="pro-navbar">
        <div className="brand-wrapper">
          <div className="brand-logo-box">
            <HugeiconsIcon icon={File02Icon} size={16} />
          </div>
          <div className="brand-text-group">
            <span className="brand-heading">Agreement Generator</span>
            <span className="brand-sub">PM Surya Ghar · Rooftop Solar</span>
          </div>
          <div className="brand-divider" />
          {scanned && formData.consumerName && (
            <span style={{
              fontSize: '0.68rem', fontWeight: 600,
              color: 'var(--accent-green)',
              background: 'var(--accent-green-dim)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 'var(--radius-pill)',
              padding: '2px 9px',
              letterSpacing: '-0.01em'
            }}>
              ✓ {formData.consumerName.split(' ')[0]}
            </span>
          )}
        </div>

        <div className="navbar-right-actions">
          {/* Theme Toggle */}
          <div className="theme-pill-toggle">
            <button
              type="button"
              className={`theme-pill-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <HugeiconsIcon icon={Sun03Icon} size={12} />
              Light
            </button>
            <button
              type="button"
              className={`theme-pill-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <HugeiconsIcon icon={Moon02Icon} size={12} />
              Dark
            </button>
          </div>

          {/* Download */}
          <button
            type="button"
            className="btn-download-pdf"
            onClick={handleDownloadPdf}
            disabled={isExporting}
          >
            <HugeiconsIcon icon={Download04Icon} size={14} />
            {isExporting ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="main-layout-grid">

        {/* ── LEFT SIDEBAR ── */}
        <aside className="sidebar-panel-container">

          {/* Step Indicator */}
          <div className="step-indicator">
            {steps.map((step, idx) => {
              const isDone = currentStep > step.num;
              const isActive = currentStep === step.num;
              return (
                <React.Fragment key={step.num}>
                  <div className={`step-item ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                    <div className={`step-dot ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                      {isDone ? '✓' : step.num}
                    </div>
                    <span className="step-label">{step.label}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`step-connector ${isDone ? 'done' : ''}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="sidebar-content">

            {/* Notification */}
            {notification && (
              <div className={`notification-toast ${notification.type}`}>
                <HugeiconsIcon
                  icon={notification.type === 'error' ? AlertCircleIcon : CheckmarkCircle02Icon}
                  size={15}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span>{notification.msg}</span>
              </div>
            )}

            {/* ── STEP 1: Company Selection ── */}
            <div className={`section-card ${currentStep === 1 ? 'highlighted' : ''}`}>
              <div className="section-card-header">
                <div className="section-card-title">
                  <span className={`step-badge ${currentStep > 1 ? 'done' : ''}`}>
                    {currentStep > 1 ? '✓' : '1'}
                  </span>
                  <span className="section-icon"><HugeiconsIcon icon={Building03Icon} size={13} /></span>
                  Select Company
                </div>
                {formData.selectedCompany && (
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>
                    {formData.selectedCompany === 'sunroof' ? 'Sunroof Energy' : 'Sunlight Green'}
                  </span>
                )}
              </div>
              <div className="section-card-body">
                <div className="company-toggle-grid">
                  <button
                    type="button"
                    className={`company-toggle-button ${formData.selectedCompany === 'sunroof' ? 'active' : ''}`}
                    onClick={() => handleCompanyToggle('sunroof')}
                  >
                    <img src={COMPANY_PROFILES.sunroof.logo} alt="Sunroof Logo" className="company-logo-img" />
                    <span>Sunroof Energy</span>
                  </button>
                  <button
                    type="button"
                    className={`company-toggle-button ${formData.selectedCompany === 'sunlight' ? 'active' : ''}`}
                    onClick={() => handleCompanyToggle('sunlight')}
                  >
                    <img src={COMPANY_PROFILES.sunlight.logo} alt="Sunlight Logo" className="company-logo-img" />
                    <span>Sunlight Green</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── STEP 2: Scan PDF ── */}
            <div className={`section-card ${currentStep === 2 ? 'highlighted' : ''}`}>
              <div className="section-card-header">
                <div className="section-card-title">
                  <span className={`step-badge ${scanned ? 'done' : ''}`}>
                    {scanned ? '✓' : '2'}
                  </span>
                  <span className="section-icon green"><HugeiconsIcon icon={Upload04Icon} size={13} /></span>
                  Scan Application PDF
                </div>
                <span className="scan-auto-tag">
                  <HugeiconsIcon icon={SparklesIcon} size={10} />
                  Auto-fill
                </span>
              </div>
              <div className="section-card-body">
                {/* Hero Dropzone */}
                <div
                  className={`scan-hero-zone ${isDragging ? 'drag-active' : ''}`}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className={`scan-icon-ring ${isProcessing ? 'scanning' : ''}`}>
                    {isProcessing
                      ? <HugeiconsIcon icon={RefreshIcon} size={20} />
                      : <HugeiconsIcon icon={Upload04Icon} size={20} />
                    }
                  </div>
                  <div className="scan-hero-title">
                    {isProcessing ? 'Analysing PDF…' : scanned ? 'Upload Another PDF' : 'Upload Application PDF'}
                  </div>
                  <div className="scan-hero-sub">
                    {isProcessing
                      ? 'Extracting name, address, capacity & ref no…'
                      : 'Drop your MNRE acknowledgement PDF here or click to browse'}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]); }}
                  />
                </div>

                {/* OR Sample Data */}
                <div className="scan-or-divider">
                  <span className="scan-or-text">or</span>
                </div>
                <button
                  type="button"
                  className="btn-pill-subtle"
                  style={{ width: '100%', justifyContent: 'center', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}
                  onClick={handleLoadSample}
                >
                  <HugeiconsIcon icon={SparklesIcon} size={13} />
                  Use Sample Application Data
                </button>
              </div>
            </div>

            {/* ── STEP 3: Review & Edit Details ── */}
            <div className={`section-card ${currentStep === 3 ? 'highlighted' : ''}`}>
              {/* Collapsible header */}
              <div
                className="collapsible-header section-card-header"
                onClick={() => setDetailsOpen(prev => !prev)}
                style={{ cursor: 'pointer' }}
              >
                <div className="section-card-title">
                  <span className={`step-badge ${scanned ? 'done' : ''}`}>
                    {scanned ? '✓' : '3'}
                  </span>
                  <span className="section-icon"><HugeiconsIcon icon={UserIcon} size={13} /></span>
                  Review & Edit Details
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {scanned && (
                    <button
                      type="button"
                      className="btn-pill-subtle danger"
                      style={{ fontSize: '0.65rem' }}
                      onClick={e => { e.stopPropagation(); handleClearForm(); }}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={11} />
                      Clear
                    </button>
                  )}
                  <HugeiconsIcon
                    icon={ChevronDown01Icon}
                    size={16}
                    className={`collapsible-chevron ${detailsOpen ? 'open' : ''}`}
                    style={{ color: 'var(--text-label)', transition: 'transform 0.25s ease' }}
                  />
                </div>
              </div>

              {detailsOpen && (
                <div className="collapsible-body section-card-body">

                  {/* Agreement Date */}
                  <div className="field-group">
                    <div className="field-label-row">
                      <span className="field-label">Agreement Date</span>
                      <div className="switch-wrapper">
                        <span className="switch-label-tag">Enable</span>
                        <label className="pro-switch">
                          <input
                            type="checkbox"
                            checked={formData.includeDate}
                            onChange={e => updateField('includeDate', e.target.checked)}
                          />
                          <span className="pro-slider"></span>
                        </label>
                      </div>
                    </div>
                    {formData.includeDate ? (
                      <div className="form-2col-grid" style={{ marginTop: 4 }}>
                        <input
                          type="text"
                          className="field-input"
                          placeholder="DD"
                          value={formData.executionDay}
                          maxLength={2}
                          onChange={e => updateField('executionDay', e.target.value)}
                        />
                        <input
                          type="text"
                          className="field-input"
                          placeholder="MM"
                          value={formData.executionMonth}
                          maxLength={2}
                          onChange={e => updateField('executionMonth', e.target.value)}
                        />
                        <div style={{ gridColumn: 'span 2' }}>
                          <input
                            type="text"
                            className="field-input"
                            placeholder="YYYY"
                            value={formData.executionYear}
                            maxLength={4}
                            onChange={e => updateField('executionYear', e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="field-input"
                        disabled
                        value="Left blank for physical stamping"
                        style={{ opacity: 0.5, fontStyle: 'italic', cursor: 'not-allowed' }}
                      />
                    )}
                  </div>

                  {/* Customer Name */}
                  <div className="field-group">
                    <label className="field-label">Customer Full Name</label>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="e.g. THAKOR MANORJI PRATAPJI"
                      value={formData.consumerName}
                      onChange={e => updateField('consumerName', e.target.value)}
                    />
                  </div>

                  {/* Installation Address */}
                  <div className="field-group">
                    <label className="field-label">Installation Address</label>
                    <textarea
                      className="field-textarea"
                      rows={2}
                      placeholder="e.g. AT-HARIJ, District: Patan, GUJARAT"
                      value={formData.consumerAddress}
                      onChange={e => updateField('consumerAddress', e.target.value)}
                    />
                  </div>

                  <div className="form-2col-grid">
                    <div className="field-group">
                      <label className="field-label">Capacity (kWp)</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="3.300 kWp"
                        value={formData.appliedCapacity}
                        onChange={e => updateField('appliedCapacity', e.target.value)}
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Mobile No</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="9913997154"
                        value={formData.mobileNo}
                        onChange={e => updateField('mobileNo', e.target.value)}
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Application Ref No</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="NP-GJUG25-8615248"
                        value={formData.applicationNo}
                        onChange={e => updateField('applicationNo', e.target.value)}
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Account No</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="28527134225"
                        value={formData.consumerAccountNo}
                        onChange={e => updateField('consumerAccountNo', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* First Party Signature */}
                  <div className="field-group">
                    <div className="field-label-row">
                      <span className="field-label">Customer Signature (Page 4)</span>
                      {formData.consumerSignatureUrl && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                          Uploaded ✓
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn-cta-full"
                        style={{ flex: 1 }}
                        onClick={() => consumerSigInputRef.current?.click()}
                      >
                        <HugeiconsIcon icon={SignatureIcon} size={14} />
                        {formData.consumerSignatureUrl ? 'Change Signature' : 'Upload Signature'}
                      </button>
                      {formData.consumerSignatureUrl && (
                        <button
                          type="button"
                          className="btn-pill-subtle danger"
                          onClick={() => updateField('consumerSignatureUrl', null)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    {formData.consumerSignatureUrl && (
                      <div className="sig-preview-row">
                        <img src={formData.consumerSignatureUrl} alt="Signature" className="sig-thumb" />
                        <span className="sig-desc">Shown in First Party signature cell</span>
                      </div>
                    )}
                    <input
                      ref={consumerSigInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleConsumerSigUpload}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ── Vendor & Stamp (collapsible) ── */}
            <div className="section-card">
              <div
                className="collapsible-header section-card-header"
                onClick={() => setVendorOpen(prev => !prev)}
                style={{ cursor: 'pointer' }}
              >
                <div className="section-card-title">
                  <span className="section-icon amber"><HugeiconsIcon icon={Building03Icon} size={13} /></span>
                  Vendor & Stamp
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="switch-wrapper" onClick={e => e.stopPropagation()}>
                    <span className="switch-label-tag">Stamp</span>
                    <label className="pro-switch">
                      <input
                        type="checkbox"
                        checked={formData.includeStamp}
                        onChange={e => updateField('includeStamp', e.target.checked)}
                      />
                      <span className="pro-slider"></span>
                    </label>
                  </div>
                  <HugeiconsIcon
                    icon={ChevronDown01Icon}
                    size={16}
                    style={{
                      color: 'var(--text-label)',
                      transition: 'transform 0.25s ease',
                      transform: vendorOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </div>
              </div>

              {vendorOpen && (
                <div className="collapsible-body section-card-body">
                  <div className="field-group">
                    <label className="field-label">Company Legal Name</label>
                    <input
                      type="text"
                      className="field-input"
                      value={formData.vendorName}
                      onChange={e => updateField('vendorName', e.target.value)}
                    />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Registered Office</label>
                    <textarea
                      className="field-textarea"
                      rows={2}
                      value={formData.vendorAddress}
                      onChange={e => updateField('vendorAddress', e.target.value)}
                    />
                  </div>
                  {formData.includeStamp && (
                    <div className="stamp-row">
                      <img
                        src={formData.customStampUrl || formData.vendorStamp}
                        alt="Active Stamp"
                        className="stamp-img-thumb"
                      />
                      <div className="stamp-info">
                        <span className="stamp-name">
                          {formData.selectedCompany === 'sunroof' ? 'Sunroof Energy Stamp' : 'Sunlight Green Stamp'}
                        </span>
                        <span className="stamp-sub">Attached to Page 4 — Second Party</span>
                      </div>
                      <button
                        type="button"
                        className="btn-pill-subtle"
                        style={{ fontSize: '0.68rem' }}
                        onClick={() => stampInputRef.current?.click()}
                      >
                        Replace
                      </button>
                      <input
                        ref={stampInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleStampUpload}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>{/* /sidebar-content */}
        </aside>

        {/* ── RIGHT: PREVIEW PANEL ── */}
        <main className="preview-panel-container">
          {/* Preview Toolbar */}
          <div className="preview-top-toolbar">
            <div className="preview-title-block">
              <HugeiconsIcon icon={ViewIcon} size={14} className="preview-title-icon" />
              Document Preview
            </div>

            {/* Page Navigation */}
            <div className="page-nav-capsule">
              <button
                type="button"
                className="capsule-arrow-btn"
                disabled={currentPage <= 1}
                onClick={() => { setViewMode('single'); setCurrentPage(prev => Math.max(1, prev - 1)); }}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={13} />
              </button>
              <span
                className="capsule-page-indicator"
                onClick={() => setViewMode(prev => prev === 'all' ? 'single' : 'all')}
                title="Toggle All / Single page"
              >
                {viewMode === 'all' ? 'All 4 Pages' : `Page ${currentPage} / 4`}
              </span>
              <button
                type="button"
                className="capsule-arrow-btn"
                disabled={currentPage >= 4}
                onClick={() => { setViewMode('single'); setCurrentPage(prev => Math.min(4, prev + 1)); }}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="zoom-controls-capsule">
              <button className="zoom-btn" onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))} title="Zoom Out">
                <HugeiconsIcon icon={ZoomOutIcon} size={13} />
              </button>
              <span className="zoom-pct-label">{Math.round(zoomLevel * 100)}%</span>
              <button className="zoom-btn" onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} title="Zoom In">
                <HugeiconsIcon icon={ZoomInIcon} size={13} />
              </button>
              <button className="zoom-btn" onClick={() => setZoomLevel(1)} title="Reset">
                <HugeiconsIcon icon={RotateLeft01Icon} size={12} />
              </button>
            </div>
          </div>

          {/* Document Canvas — only this scrolls */}
          <div className="preview-scroller-canvas">
            <div
              className="document-scale-wrapper"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <DocumentPages data={formData} activeTab={activeTabProp} />
            </div>
          </div>
        </main>
      </div>

      {/* Exporting Overlay */}
      {isExporting && (
        <div className="progress-overlay">
          <div className="progress-box">
            <div className="pro-spinner" />
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Generating Agreement PDF
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', letterSpacing: '-0.01em', lineHeight: 1.5 }}>
              {exportProgress?.stage || 'Preparing 4-page A4 document…'}
            </div>
            {exportProgress && (
              <div style={{
                width: '100%',
                height: '3px',
                background: 'var(--border-card)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginTop: 4
              }}>
                <div style={{
                  height: '100%',
                  width: `${(exportProgress.current / exportProgress.total) * 100}%`,
                  background: 'var(--grad-brand)',
                  borderRadius: '3px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
