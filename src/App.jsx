import React, { useState, useRef, useEffect } from 'react';
import {
  HugeiconsIcon,
  File02Icon,
  Settings02Icon,
  Building03Icon,
  UserIcon,
  Calendar03Icon,
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
  RefreshIcon
} from './components/Hugeicons';
import confetti from 'canvas-confetti';

import { parseApplicationPdf, SAMPLE_APPLICATION_DATA } from './utils/pdfParser';
import { generateAgreementPdf } from './utils/pdfGenerator';
import { COMPANY_PROFILES, INITIAL_AGREEMENT_DATA } from './utils/constants';
import { DocumentPages } from './components/DocumentPages';

export default function App() {
  const [formData, setFormData] = useState(INITIAL_AGREEMENT_DATA);
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState(1); // 1, 2, 3, 4
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'single'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const stampInputRef = useRef(null);
  const consumerSigInputRef = useRef(null);

  // Sync theme with html data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Switch Company Profile (Sunroof Energy default vs Sunlight Green)
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
    showNotification(`Switched profile to ${profile.label}`, 'info');
  };

  // PDF Application Scanner
  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.includes('pdf') && !file.name.endsWith('.pdf')) {
      showNotification('Please upload a valid PDF document.', 'error');
      return;
    }

    setIsProcessing(true);
    showNotification('Scanning Application PDF and parsing details...', 'info');

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

      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      showNotification('Application details successfully extracted & updated in Agreement!', 'success');
    } catch (err) {
      console.error('Error parsing PDF:', err);
      showNotification('Failed to read PDF structure. Try manual entry or Sample Data.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // First Party Signature Upload
  const handleConsumerSigUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, consumerSignatureUrl: url }));
      showNotification('First Party signature uploaded & set to cell!', 'success');
    }
  };

  // Custom Stamp Upload
  const handleStampUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, customStampUrl: url, includeStamp: true }));
      showNotification('Custom stamp uploaded successfully!', 'success');
    }
  };

  // Load Sample Data (from user screenshot)
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

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    showNotification('Sample applicant data loaded!', 'success');
  };

  // Clear Form
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
    showNotification('Applicant details cleared', 'info');
  };

  // Download PDF
  const handleDownloadPdf = async () => {
    const previousMode = viewMode;
    setViewMode('all');
    setIsExporting(true);

    await new Promise(resolve => setTimeout(resolve, 250));

    try {
      await generateAgreementPdf(
        {
          consumerName: formData.consumerName,
          applicationNo: formData.applicationNo
        },
        progress => setExportProgress(progress)
      );

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      showNotification('Agreement PDF successfully generated & downloaded!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showNotification('Failed to generate PDF. Please try again or use Print.', 'error');
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

  return (
    <div className="app-container">
      {/* 1. Pro Executive Top Navbar */}
      <header className="pro-navbar">
        <div className="brand-wrapper">
          <div className="brand-logo-box">
            <HugeiconsIcon icon={File02Icon} size={19} />
          </div>
          <div className="brand-heading">
            Quotation & Agreement Generator
          </div>
        </div>

        <div className="navbar-right-actions">
          {/* Theme Segmented Capsule */}
          <div className="theme-pill-toggle">
            <button
              type="button"
              className={`theme-pill-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <HugeiconsIcon icon={Sun03Icon} size={14} />
              Light
            </button>
            <button
              type="button"
              className={`theme-pill-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <HugeiconsIcon icon={Moon02Icon} size={14} />
              Dark
            </button>
          </div>

          {/* Download PDF Action Button */}
          <button
            type="button"
            className="btn-download-pdf"
            onClick={handleDownloadPdf}
            disabled={isExporting}
          >
            <HugeiconsIcon icon={Download04Icon} size={16} />
            Download PDF
          </button>

          {/* Quick Reload Sample */}
          <button
            type="button"
            className="btn-nav-icon"
            onClick={handleLoadSample}
            title="Load Sample Application Data"
          >
            <HugeiconsIcon icon={RotateLeft01Icon} size={16} />
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout Grid */}
      <div className="main-layout-grid">
        {/* Left Side: Parameters Sidebar */}
        <aside className="sidebar-panel-container">
          <div className="parameters-card">
            {/* Parameters Header */}
            <div className="parameters-header">
              <div className="parameters-title">
                <HugeiconsIcon icon={Settings02Icon} size={18} className="parameters-title-icon" />
                Parameters
              </div>
              <div className="parameters-actions">
                <button
                  type="button"
                  className="btn-pill-subtle"
                  onClick={handleClearForm}
                  title="Clear Applicant Fields"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={13} />
                  Clear
                </button>
                <button
                  type="button"
                  className="btn-pill-subtle"
                  onClick={handleLoadSample}
                  title="Reset to Sample Application Data"
                >
                  <HugeiconsIcon icon={RotateLeft01Icon} size={13} />
                  Reset
                </button>
              </div>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background:
                    notification.type === 'error'
                      ? 'rgba(244, 63, 94, 0.15)'
                      : notification.type === 'info'
                      ? 'rgba(6, 182, 212, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                  color:
                    notification.type === 'error'
                      ? 'var(--accent-rose)'
                      : notification.type === 'info'
                      ? 'var(--accent-cyan)'
                      : 'var(--accent-emerald)',
                  border: '1px solid currentColor'
                }}
              >
                <HugeiconsIcon
                  icon={notification.type === 'error' ? AlertCircleIcon : CheckmarkCircle02Icon}
                  size={16}
                />
                <span>{notification.msg}</span>
              </div>
            )}

            {/* Sub-Card 1: Company Profile Selection */}
            <div className="section-subcard">
              <div className="section-header-row">
                <div className="section-title">
                  <HugeiconsIcon icon={Building03Icon} size={16} className="section-icon-blue" />
                  Company Profile Selection
                </div>
              </div>

              {/* Segmented Company Profile Buttons */}
              <div className="company-toggle-grid">
                <button
                  type="button"
                  className={`company-toggle-button ${formData.selectedCompany === 'sunroof' ? 'active' : ''}`}
                  onClick={() => handleCompanyToggle('sunroof')}
                >
                  <img
                    src={COMPANY_PROFILES.sunroof.logo}
                    alt="Sunroof Logo"
                    className="company-logo-img"
                  />
                  <span>Sunroof Energy</span>
                </button>

                <button
                  type="button"
                  className={`company-toggle-button ${formData.selectedCompany === 'sunlight' ? 'active' : ''}`}
                  onClick={() => handleCompanyToggle('sunlight')}
                >
                  <img
                    src={COMPANY_PROFILES.sunlight.logo}
                    alt="Sunlight Logo"
                    className="company-logo-img"
                  />
                  <span>Sunlight Green</span>
                </button>
              </div>
            </div>

            {/* Sub-Card 2: Customer Information */}
            <div className="section-subcard">
              <div className="section-header-row">
                <div className="section-title">
                  <HugeiconsIcon icon={UserIcon} size={16} className="section-icon-blue" />
                  Customer Information
                </div>
              </div>

              {/* Date Row with ADD DATE Toggle */}
              <div className="field-group">
                <div className="field-label-row">
                  <span className="field-label">Proposal / Agreement Date</span>
                  <div className="switch-wrapper">
                    <span className="switch-label-tag">Add Date</span>
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
                  <div className="form-2col-grid" style={{ marginTop: '4px' }}>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="DD (e.g. 19)"
                      value={formData.executionDay}
                      maxLength={2}
                      onChange={e => updateField('executionDay', e.target.value)}
                    />
                    <input
                      type="text"
                      className="field-input"
                      placeholder="MM (e.g. 09)"
                      value={formData.executionMonth}
                      maxLength={2}
                      onChange={e => updateField('executionMonth', e.target.value)}
                    />
                    <div style={{ gridColumn: 'span 2' }}>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="YYYY (e.g. 2026)"
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
                    value="Date Disabled (Left blank for physical stamping)"
                    style={{ opacity: 0.65, cursor: 'not-allowed', fontStyle: 'italic' }}
                  />
                )}
              </div>

              {/* Customer Full Name */}
              <div className="field-group">
                <label className="field-label">Customer Full Name</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="e.g. Lilaben Navinchandra Jani / THAKOR MANORJI PRATAPJI"
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
                  placeholder="e.g. 3/5/2003, Jani Vado, Mehsana City Sub Division"
                  value={formData.consumerAddress}
                  onChange={e => updateField('consumerAddress', e.target.value)}
                />
              </div>

              {/* First Party Signature Upload */}
              <div className="field-group">
                <div className="field-label-row">
                  <span className="field-label">First Party Sign (Page 4 Cell)</span>
                  {formData.consumerSignatureUrl && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      Uploaded ✓
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-pill-subtle"
                    style={{ flex: 1, padding: '7px 14px', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => consumerSigInputRef.current?.click()}
                  >
                    <HugeiconsIcon icon={SignatureIcon} size={15} />
                    {formData.consumerSignatureUrl ? 'Change Signature' : 'Upload Sign Image'}
                  </button>
                  {formData.consumerSignatureUrl && (
                    <button
                      type="button"
                      className="btn-pill-subtle"
                      style={{ color: 'var(--accent-rose)' }}
                      onClick={() => updateField('consumerSignatureUrl', null)}
                      title="Remove uploaded signature"
                    >
                      Remove
                    </button>
                  )}
                  <input
                    ref={consumerSigInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleConsumerSigUpload}
                  />
                </div>

                {formData.consumerSignatureUrl && (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '6px 12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <img
                      src={formData.consumerSignatureUrl}
                      alt="Sign Preview"
                      style={{
                        height: '32px',
                        maxWidth: '85px',
                        objectFit: 'contain',
                        background: '#ffffff',
                        borderRadius: '4px',
                        padding: '2px'
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Rendered in First Party signature box
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sub-Card 3: Application & System Specs */}
            <div className="section-subcard">
              <div className="section-header-row">
                <div className="section-title">
                  <HugeiconsIcon icon={File02Icon} size={16} className="section-icon-blue" />
                  Solar System & Equipment Specs
                </div>
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
                  <label className="field-label">Mobile Number</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="9913997154"
                    value={formData.mobileNo}
                    onChange={e => updateField('mobileNo', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-2col-grid">
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
                  <label className="field-label">Account No (Discom)</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="28527134225"
                    value={formData.consumerAccountNo}
                    onChange={e => updateField('consumerAccountNo', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Sub-Card 4: Scan Application PDF Dropzone */}
            <div className="section-subcard">
              <div className="section-header-row">
                <div className="section-title">
                  <HugeiconsIcon icon={Upload04Icon} size={16} className="section-icon-blue" />
                  Scan Application PDF
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: 'var(--accent-emerald)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  Auto-Extract
                </span>
              </div>

              <div
                className={`pro-dropzone ${isDragging ? 'drag-active' : ''}`}
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="dropzone-icon-circle">
                  {isProcessing ? (
                    <HugeiconsIcon icon={RefreshIcon} size={20} className="spin" />
                  ) : (
                    <HugeiconsIcon icon={Upload04Icon} size={20} />
                  )}
                </div>
                <div>
                  <div className="dropzone-title">
                    {isProcessing ? 'Analyzing Document...' : 'Upload Application PDF'}
                  </div>
                  <div className="dropzone-desc">
                    Auto-fills applicant name, address, ref no & specs
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            {/* Sub-Card 5: Stamp & Registered Office Settings */}
            <div className="section-subcard">
              <div className="section-header-row">
                <div className="section-title">
                  <HugeiconsIcon icon={Building03Icon} size={16} className="section-icon-blue" />
                  Vendor Details & Stamp
                </div>
                <div className="switch-wrapper">
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
              </div>

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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={formData.customStampUrl || formData.vendorStamp}
                      alt="Active Stamp"
                      style={{
                        width: '38px',
                        height: '38px',
                        objectFit: 'contain',
                        background: '#ffffff',
                        borderRadius: '50%',
                        padding: '2px',
                        border: '1px solid #cbd5e1'
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                        {formData.selectedCompany === 'sunroof'
                          ? 'Sunroof Energy Stamp'
                          : 'Sunlight Green Stamp'}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        Attached to Page 4 Second Party cell
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-pill-subtle"
                    style={{ fontSize: '0.72rem' }}
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
          </div>
        </aside>

        {/* Right Side: Preview Panel */}
        <main className="preview-panel-container">
          {/* Top Preview Toolbar */}
          <div className="preview-top-toolbar">
            <div className="preview-title-block">
              <HugeiconsIcon icon={ViewIcon} size={17} className="preview-title-icon" />
              Preview
            </div>

            {/* Page Navigation Capsule */}
            <div className="page-nav-capsule">
              <button
                type="button"
                className="capsule-arrow-btn"
                disabled={currentPage <= 1}
                onClick={() => {
                  setViewMode('single');
                  setCurrentPage(prev => Math.max(1, prev - 1));
                }}
                title="Previous Page"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              </button>

              <span
                className="capsule-page-indicator"
                onClick={() => setViewMode(prev => (prev === 'all' ? 'single' : 'all'))}
                style={{ cursor: 'pointer' }}
                title="Click to toggle All Pages / Single Page"
              >
                {viewMode === 'all' ? 'All 4 Pages' : `Page ${currentPage} of 4`}
              </span>

              <button
                type="button"
                className="capsule-arrow-btn"
                disabled={currentPage >= 4}
                onClick={() => {
                  setViewMode('single');
                  setCurrentPage(prev => Math.min(4, prev + 1));
                }}
                title="Next Page"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </button>
            </div>

            {/* Zoom Controls Capsule */}
            <div className="zoom-controls-capsule">
              <button
                type="button"
                className="zoom-btn"
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
                title="Zoom Out"
              >
                <HugeiconsIcon icon={ZoomOutIcon} size={14} />
              </button>
              <span className="zoom-pct-label">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                className="zoom-btn"
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                title="Zoom In"
              >
                <HugeiconsIcon icon={ZoomInIcon} size={14} />
              </button>
              <button
                type="button"
                className="zoom-btn"
                onClick={() => setZoomLevel(1)}
                title="Reset Zoom"
              >
                <HugeiconsIcon icon={RotateLeft01Icon} size={13} />
              </button>
            </div>
          </div>

          {/* Document Scroller Canvas */}
          <div className="preview-scroller-canvas">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px'
              }}
            >
              <DocumentPages data={formData} activeTab={activeTabProp} />
            </div>
          </div>
        </main>
      </div>

      {/* Generating Overlay Modal */}
      {isExporting && (
        <div className="progress-overlay">
          <div className="progress-box">
            <div className="pro-spinner"></div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
              Generating Official Agreement PDF
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {exportProgress?.stage || 'Preparing 4-page A4 document...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
