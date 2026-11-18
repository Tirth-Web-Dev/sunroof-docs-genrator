import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  HugeiconsIcon, Building03Icon, UserIcon, Download04Icon,
  RefreshIcon, Delete02Icon, ViewIcon, Upload04Icon,
  ZoomInIcon, ZoomOutIcon, SignatureIcon, SparklesIcon,
  ChevronDown01Icon, SolarPanel03Icon, AlertCircleIcon, Calendar03Icon,
  CheckmarkCircle02Icon
} from "./components/Hugeicons";
import confetti from "canvas-confetti";
import { parseApplicationPdf } from "./utils/pdfParser";
import { cleanSignatureImage } from "./utils/cleanSignature";
import { playPageSwitchSound } from "./utils/soundEffects";
import { COMPANY_PROFILES, INITIAL_AGREEMENT_DATA, BANK_PRESETS, applyCompanyToData, DEFAULT_QUOTATION_SPECS } from "./utils/constants";
import { DocumentPages } from "./components/DocumentPages";
import { QuotationPage } from "./components/QuotationPage";
import { SolarPricingModal } from "./components/SolarPricingModal";
import { AgreementDatePicker } from "./components/AgreementDatePicker";
import { BankDropdown } from "./components/BankDropdown";
import { AddressDropdown } from "./components/AddressDropdown";
import { BrandPreloader } from "./components/BrandPreloader";

export default function App() {
  const [formData, setFormData] = useState(() => applyCompanyToData("sunroof", INITIAL_AGREEMENT_DATA));
  const [activeModule, setActiveModule] = useState("agreement");
  const [leavingModule, setLeavingModule] = useState(null);
  const [transitionEpoch, setTransitionEpoch] = useState(0);
  const [navDir, setNavDir] = useState(1);
  const [quotationTab, setQuotationTab] = useState("system");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanPhase, setScanPhase] = useState(0);
  const [printScope, setPrintScope] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const isSidebarBlurred = isDatePickerOpen || isBankDropdownOpen || isAddressDropdownOpen;
  const zoomFillPct = Math.max(0, Math.min(100, ((zoomLevel - 0.5) / (1.5 - 0.5)) * 100));
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);
  const toastTimersRef = useRef({});
  const scanTimersRef = useRef([]);
  const pointerRafRef = useRef(0);
  const transitionTimerRef = useRef(null);
  const previewScrollerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingSig, setIsDraggingSig] = useState(false);
  const [highlightSig, setHighlightSig] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [vendorOpen, setVendorOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowPricingModal(false);
        setWarningModal(prev => (prev.isOpen ? { ...prev, isOpen: false } : prev));
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        setZoomLevel(p => Math.min(1.5, +(p + 0.1).toFixed(2)));
      } else if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        setZoomLevel(p => Math.max(0.5, +(p - 0.1).toFixed(2)));
      } else if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        setZoomLevel(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Warning Modal State
  const [warningModal, setWarningModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    confirmColor: "danger",
    onConfirm: () => { },
  });

  const fileInputRef = useRef(null);
  const stampInputRef = useRef(null);
  const consumerSigInputRef = useRef(null);
  const signatureDropRef = useRef(null);
  const costSummaryRef = useRef(null);
  const navLogoRef = useRef(null);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const workflowTimersRef = useRef([]);
  const bothQueueRef = useRef(false);
  const returnToAgreementAfterPrintRef = useRef(false);
  const activeModuleRef = useRef(activeModule);
  useEffect(() => { activeModuleRef.current = activeModule; }, [activeModule]);

  const dismissToast = useCallback((id) => {
    if (toastTimersRef.current[id]) {
      clearTimeout(toastTimersRef.current[id]);
      delete toastTimersRef.current[id];
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showNotif = useCallback((msg, type = "success") => {
    const id = ++toastIdRef.current;
    const normalizedType = type === "danger" ? "error" : type;
    setToasts(prev => [...prev.slice(-2), { id, msg, type: normalizedType }]);
    toastTimersRef.current[id] = setTimeout(() => {
      delete toastTimersRef.current[id];
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4200);
  }, []);

  const promptClearForm = () => {
    setWarningModal({
      isOpen: true,
      title: "Clear All Extracted Details?",
      message: "Are you sure you want to reset customer data, application number, address, and signature? This cannot be undone.",
      confirmLabel: "Clear Form",
      confirmColor: "danger",
      onConfirm: () => {
        setWarningModal(prev => ({ ...prev, isOpen: false }));
        handleClearForm();
      }
    });
  };

  const handleBankPresetToggle = (presetKey) => {
    if (presetKey === "all") {
      setFormData(prev => ({ ...prev, q_bankPreset: "all" }));
      showNotif("Showing all 3 Sunroof Energy banks on Quotation", "info");
      return;
    }
    const p = BANK_PRESETS[presetKey] || BANK_PRESETS.dcb;
    setFormData(prev => ({
      ...prev,
      q_bankPreset: presetKey,
      q_bankName: p.bankName,
      q_branchName: p.branchName,
      q_accountNumber: p.accountNumber,
      q_ifscCode: p.ifscCode
    }));
    showNotif("Selected bank: " + p.bankName, "info");
  };

  const handleResetBOS = () => {
    setFormData(prev => ({
      ...prev,
      ...DEFAULT_QUOTATION_SPECS
    }));
    showNotif("BOS specifications reset to official Sunroof defaults!", "success");
  };

  const handleApplyPricingPlan = (plan) => {
    const qp = Math.round((Number(plan.totalCost) / 0.9) / 1000) * 1000;
    const kwNum = parseFloat(plan.kw) || 3.3;
    const invWatt = kwNum >= 5 ? `${Math.round(kwNum * 1000)} W` : (kwNum >= 3.5 ? "4000 W" : (kwNum >= 3 ? "3600 W" : `${Math.round(kwNum * 1000)} W`));
    setFormData(prev => ({
      ...prev,
      q_capacityKw: plan.kw,
      appliedCapacity: plan.kw,
      q_panelQty: plan.panels,
      q_netSystemCost: String(qp),
      q_subsidyAmount: "78000",
      q_solarPanelMake: plan.solarPanelMake,
      q_basePriceListCost: String(plan.totalCost),
      q_inverterMake: prev.q_inverterMake || "PV BLINK / POLYCAB (10 years warranty)",
      q_inverterQty: prev.q_inverterQty || invWatt
    }));
    showNotif("Applied " + plan.brand + " " + plan.kw + " kW — Rs. " + qp.toLocaleString("en-IN"), "success");
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    const id = setTimeout(() => {
      costSummaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 320);
    workflowTimersRef.current.push(id);
  };

  const handleFileUpload = async (file) => {
    if (isProcessing) return;
    if (!file || (!file.type.includes("pdf") && !file.name.endsWith(".pdf"))) {
      showNotif("Please upload a valid PDF file.", "warning");
      return;
    }

    scanTimersRef.current.forEach((t) => clearTimeout(t));
    scanTimersRef.current = [];

    setIsProcessing(true);
    setScanPhase(0);
    setUploadedFileName(file.name);
    showNotif("Scanning PDF — auto-filling details...", "info");

    const MIN_SCAN_MS = 3400;
    const scanStartedAt = Date.now();
    scanTimersRef.current.push(setTimeout(() => setScanPhase(1), 1100));
    scanTimersRef.current.push(setTimeout(() => setScanPhase(2), 2250));

    try {
      const ex = await parseApplicationPdf(file);
      const elapsed = Date.now() - scanStartedAt;
      if (elapsed < MIN_SCAN_MS) {
        await new Promise((r) => setTimeout(r, MIN_SCAN_MS - elapsed));
      }

      let day = formData.executionDay, month = formData.executionMonth, year = formData.executionYear;
      if (ex.applicationDate) {
        const p = ex.applicationDate.split(/[-/]/);
        if (p.length === 3) { day = p[0]; month = p[1]; year = p[2]; }
      }

      setFormData(prev => ({
        ...prev,
        consumerName: ex.applicantName || prev.consumerName,
        consumerAddress: ex.address || prev.consumerAddress,
        mobileNo: ex.mobileNo || prev.mobileNo,
        consumerAccountNo: ex.consumerAccountNo || prev.consumerAccountNo,
        applicationNo: ex.applicationNo || prev.applicationNo,
        appliedCapacity: ex.appliedCapacity || prev.appliedCapacity,
        discom: ex.discom || prev.discom,
        executionDay: day,
        executionMonth: month,
        executionYear: year,
      }));
      setScanned(true);
      setDetailsOpen(true);
      setHighlightSig(true);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      showNotif("Details extracted and filled in successfully", "success");

      scanTimersRef.current.push(setTimeout(() => {
        signatureDropRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 380));
      scanTimersRef.current.push(setTimeout(() => setHighlightSig(false), 3400));
    } catch (err) {
      console.error(err);
      showNotif("Could not read PDF. Please check the file and try again.", "error");
    } finally {
      setIsProcessing(false);
      setScanPhase(0);
    }
  };

  const handleConsumerSigUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    e.target.value = "";
    const cleanedUrl = await cleanSignatureImage(f);
    setFormData(prev => ({ ...prev, consumerSignatureUrl: cleanedUrl }));
    showNotif("Signature cleaned & uploaded — opening Quotation…", "success");
    setQuotationTab("system");
    const t1 = setTimeout(() => {
      switchModule("quotation");
      const t2 = setTimeout(() => {
        setShowPricingModal(true);
      }, 1000);
      workflowTimersRef.current.push(t2);
    }, 280);
    workflowTimersRef.current.push(t1);
  };

  const handleStampUpload = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      const nextUrl = URL.createObjectURL(f);
      e.target.value = "";
      setFormData(prev => {
        if (prev.customStampUrl && prev.customStampUrl.startsWith("blob:")) {
          URL.revokeObjectURL(prev.customStampUrl);
        }
        return { ...prev, customStampUrl: nextUrl, includeStamp: true };
      });
      showNotif("Stamp uploaded", "success");
    }
  };

  const handleClearForm = () => {
    setFormData(prev => ({ ...prev, consumerName: "", consumerAddress: "", mobileNo: "", consumerAccountNo: "", applicationNo: "", appliedCapacity: "", consumerSignatureUrl: null }));
    setScanned(false);
    setUploadedFileName("");
    showNotif("Customer fields cleared", "info");
  };

  useEffect(() => {
    if (!printScope) return undefined;

    const printClasses = ["print-mode-agreement", "print-mode-quotation", "print-mode-both"];
    document.body.classList.remove(...printClasses);
    document.body.classList.add(`print-mode-${printScope}`);

    const previousTitle = document.title;
    const cleanName = (formData.consumerName || "Consumer").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 32) || "Consumer";
    const cleanAppNo = (formData.applicationNo || "Agreement").replace(/[^a-zA-Z0-9-]+/g, "_").replace(/^_|_$/g, "") || "Agreement";
    if (printScope === "agreement") {
      document.title = `Agreement_${cleanName}_${cleanAppNo}`;
    } else if (printScope === "quotation") {
      document.title = `Quotation_${cleanName}`;
    } else {
      document.title = `Agreement_and_Quotation_${cleanName}`;
    }

    let cancelled = false;
    let cleanedUp = false;
    let timerId = null;

    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      const finishedScope = printScope;
      document.body.classList.remove(...printClasses);
      document.title = previousTitle;
      setPrintScope(null);

      if (finishedScope === "agreement" && bothQueueRef.current) {
        bothQueueRef.current = false;
        const nextPrintTimer = setTimeout(() => {
          setPrintScope("quotation");
        }, 160);
        workflowTimersRef.current.push(nextPrintTimer);
        return;
      }

      if (finishedScope === "quotation" && returnToAgreementAfterPrintRef.current) {
        returnToAgreementAfterPrintRef.current = false;
        const switchTimer = setTimeout(() => {
          switchModule("agreement");
        }, 250);
        workflowTimersRef.current.push(switchTimer);
      }
    };

    const handleAfterPrint = () => {
      cleanup();
    };

    window.addEventListener("afterprint", handleAfterPrint, { once: true });

    const triggerPrint = async () => {
      const targetImages = Array.from(
        document.querySelectorAll("#printable-agreement img, #printable-quotation img")
      );
      await Promise.all(
        targetImages.map((img) => (typeof img.decode === "function" ? img.decode().catch(() => {}) : Promise.resolve()))
      );
      if (cancelled) return;
      window.print();
      // Fallback cleanup in case browser drops afterprint event
      setTimeout(() => {
        if (!cancelled) cleanup();
      }, 150);
    };

    const rafId = requestAnimationFrame(() => {
      timerId = setTimeout(triggerPrint, 80);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      window.removeEventListener("afterprint", handleAfterPrint);
      document.body.classList.remove(...printClasses);
      document.title = previousTitle;
    };
  }, [printScope, formData.consumerName, formData.applicationNo]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current);
      Object.values(toastTimersRef.current).forEach((t) => clearTimeout(t));
      scanTimersRef.current.forEach((t) => clearTimeout(t));
      workflowTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const readinessChecks = useMemo(() => {
    const issues = [];
    if (!formData.consumerName?.trim()) {
      issues.push({
        id: "name",
        scope: ["agreement", "quotation", "both"],
        label: "Customer Name is empty",
        fixModule: "agreement",
      });
    }
    if (!formData.consumerSignatureUrl) {
      issues.push({
        id: "sig",
        scope: ["agreement", "both"],
        label: "Consumer Signature is not uploaded",
        fixModule: "agreement",
        fixTarget: "sig",
      });
    }
    const digits = (formData.mobileNo || "").replace(/\D/g, "");
    if (digits.length < 10) {
      issues.push({
        id: "mobile",
        scope: ["agreement", "quotation", "both"],
        label: "Contact number is missing or under 10 digits",
        fixModule: "agreement",
      });
    }
    if (!formData.applicationNo?.trim() || !formData.consumerAccountNo?.trim()) {
      issues.push({
        id: "appNo",
        scope: ["agreement", "both"],
        label: "Application No. or Consumer A/C No. is blank",
        fixModule: "agreement",
      });
    }
    if (!(Number(formData.q_netSystemCost) > 0)) {
      issues.push({
        id: "cost",
        scope: ["quotation", "both"],
        label: "Quotation Cost is missing or zero",
        fixModule: "quotation",
      });
    }
    const appKw = parseFloat(String(formData.appliedCapacity || "").replace(/[^0-9.]/g, ""));
    const qKw = parseFloat(String(formData.q_capacityKw || "").replace(/[^0-9.]/g, ""));
    if (Number.isFinite(appKw) && Number.isFinite(qKw) && appKw > 0 && qKw > 0 && Math.abs(appKw - qKw) > 0.75) {
      issues.push({
        id: "capMismatch",
        scope: ["quotation", "both"],
        label: `Quotation capacity (${qKw} kW) differs from Agreement (${appKw} kWp)`,
        fixModule: "quotation",
      });
    }
    return issues;
  }, [
    formData.consumerName,
    formData.consumerSignatureUrl,
    formData.mobileNo,
    formData.applicationNo,
    formData.consumerAccountNo,
    formData.q_netSystemCost,
    formData.appliedCapacity,
    formData.q_capacityKw,
  ]);

  const activeModuleChecks = useMemo(
    () => readinessChecks.filter((c) => c.scope.includes(activeModule)),
    [readinessChecks, activeModule]
  );

  const jumpToIssue = (issue) => {
    if (!issue) return;
    if (issue.fixModule && issue.fixModule !== activeModuleRef.current) {
      switchModule(issue.fixModule);
    }
    if (issue.fixTarget === "sig") {
      setHighlightSig(true);
      const id = setTimeout(() => {
        signatureDropRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 360);
      workflowTimersRef.current.push(id);
      const id2 = setTimeout(() => setHighlightSig(false), 3200);
      workflowTimersRef.current.push(id2);
    }
  };

  const proceedWithPrint = (type) => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setLeavingModule(null);
    if (type === "both") {
      bothQueueRef.current = true;
      returnToAgreementAfterPrintRef.current = true;
      setPrintScope("agreement");
      return;
    }
    bothQueueRef.current = false;
    returnToAgreementAfterPrintRef.current = false;
    setPrintScope(type);
  };

  const handleDownload = (type) => {
    const relevant = readinessChecks.filter((c) => c.scope.includes(type));
    if (relevant.length === 0) {
      proceedWithPrint(type);
      return;
    }
    setWarningModal({
      isOpen: true,
      title: "Almost Ready",
      message: `${relevant.length} detail${relevant.length > 1 ? "s are" : " is"} missing before saving your PDF:`,
      items: relevant,
      confirmLabel: "Print Anyway",
      confirmColor: "primary",
      onConfirm: () => {
        setWarningModal((prev) => ({ ...prev, isOpen: false }));
        proceedWithPrint(type);
      },
    });
  };

  const switchModule = (nextModule) => {
    const current = activeModuleRef.current;
    if (nextModule === current) return;
    playPageSwitchSound();
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setIsDatePickerOpen(false);
    setIsBankDropdownOpen(false);
    setIsAddressDropdownOpen(false);
    if (previewScrollerRef.current) {
      previewScrollerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
    setNavDir(nextModule === "quotation" ? 1 : -1);
    setLeavingModule(current);
    setActiveModule(nextModule);
    setTransitionEpoch((e) => e + 1);
    transitionTimerRef.current = setTimeout(() => {
      setLeavingModule(null);
      transitionTimerRef.current = null;
    }, 3100);
  };

  const handleShellPointerMove = useCallback((e) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const target = e.target instanceof Element ? e.target : null;
    if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current);
    pointerRafRef.current = requestAnimationFrame(() => {
      const surface = target?.closest(".section-card, .scan-hero-zone, .floating-preview-dock, .pro-navbar");
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      surface.style.setProperty("--mx", `${(clientX - rect.left).toFixed(1)}px`);
      surface.style.setProperty("--my", `${(clientY - rect.top).toFixed(1)}px`);
    });
  }, []);

  const upd = (f, v) => setFormData(prev => ({ ...prev, [f]: v }));

  return (
    <>
      {!preloaderDone && (
        <BrandPreloader
          targetLogoRef={navLogoRef}
          onComplete={() => setPreloaderDone(true)}
        />
      )}
      {toasts.length > 0 && (
        <div className="lg-toast-stack" role="status" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`lg-toast ${t.type}`}>
              <span className="lg-toast-icon" aria-hidden="true">
                {t.type === "success" ? (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                ) : t.type === "info" ? (
                  <HugeiconsIcon icon={SparklesIcon} size={15} />
                ) : (
                  <HugeiconsIcon icon={AlertCircleIcon} size={16} />
                )}
              </span>
              <div className="lg-toast-body">
                <span className="lg-toast-title">
                  {t.type === "success"
                    ? "Completed"
                    : t.type === "info"
                    ? "Update"
                    : t.type === "warning"
                    ? "Notice"
                    : "Error"}
                </span>
                <span className="lg-toast-msg">{t.msg}</span>
              </div>
              <button
                type="button"
                className="lg-toast-close"
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss notification"
              >
                ×
              </button>
              <span className="lg-toast-progress" aria-hidden="true" />
            </div>
          ))}
        </div>
      )}
      <div className="app-shell" onPointerMove={handleShellPointerMove}>

        {/* NAVBAR */}
        <header className="pro-navbar">
          <div className="brand-wrapper">
            <div className="active-company-nav-badge">
              <img
                ref={navLogoRef}
                src={COMPANY_PROFILES.sunroof.logo}
                alt="Sunroof Energy"
                className="active-company-nav-logo"
                style={{ opacity: preloaderDone ? 1 : 0 }}
              />
              <div className="active-company-nav-text">
                <span className="active-company-nav-title">{COMPANY_PROFILES.sunroof.name}</span>
              </div>
            </div>
          </div>

          <div className="module-tabs-wrapper">
            <div
              className="segmented-control nav-segmented"
              style={{ "--active-idx": activeModule === "quotation" ? 1 : 0 }}
            >
              <span className="segmented-glider" aria-hidden="true" />
              <button
                type="button"
                className={`segmented-item ${activeModule === "agreement" ? "active" : ""}`}
                onClick={() => switchModule("agreement")}
              >
                Agreement
              </button>
              <button
                type="button"
                className={`segmented-item ${activeModule === "quotation" ? "active" : ""}`}
                onClick={() => switchModule("quotation")}
              >
                Quotation
              </button>
            </div>
          </div>

          <div className="navbar-right-actions">
            {(activeModule === "agreement" || activeModule === "quotation") && (
              <button
                type="button"
                className="btn-download-both"
                onClick={() => handleDownload("both")}
                disabled={Boolean(printScope)}
                title="Print / Save both Agreement & Quotation as selectable-text PDF"
              >
                <HugeiconsIcon icon={Download04Icon} size={14} />
                <span>{printScope === "both" ? "Preparing…" : "Download Both"}</span>
              </button>
            )}
          </div>
        </header>

        <div className="main-layout-grid">
          {/* SIDEBAR */}
          <aside className={"sidebar-panel-container" + (isSidebarBlurred ? " popover-focused" : "")}>
            <div className="sidebar-stage">
              {[
                ...(leavingModule ? [{ mod: leavingModule, isLeaving: true, key: `leave-${leavingModule}-${transitionEpoch}` }] : []),
                { mod: activeModule, isLeaving: false, key: `enter-${activeModule}-${transitionEpoch}` },
              ].map(({ mod, isLeaving, key }) => (
                <div
                  key={key}
                  className={`sidebar-content ${isLeaving ? "is-leaving" : transitionEpoch > 0 ? "is-entering" : "module-fade-enter"}`}
                  aria-hidden={isLeaving || undefined}
                >
                  {mod === "agreement" ? (
                <>
                  {/* STEP 1: SMART ADAPTIVE PDF SCAN */}
                  <div className={"section-card" + (!scanned ? " highlighted" : "")}>
                    <div className="section-card-header">
                      <div className="section-card-title">
                        <span className="section-icon"><HugeiconsIcon icon={Upload04Icon} size={14} /></span>
                        Application PDF
                      </div>
                      {scanned ? (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="btn-pill-subtle primary"
                        >
                          Replace PDF
                        </button>
                      ) : (
                        <span className="scan-auto-tag">
                          <HugeiconsIcon icon={SparklesIcon} size={10} /> Auto-fill
                        </span>
                      )}
                    </div>
                    <div className="section-card-body">
                      <input
                        ref={isLeaving ? undefined : fileInputRef}
                        type="file"
                        accept="application/pdf"
                        style={{ display: "none" }}
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) handleFileUpload(f);
                          e.target.value = "";
                        }}
                      />
                      {isProcessing || !scanned ? (
                        <div className={"scan-hero-zone" + (isDragging ? " drag-active" : "") + (isProcessing ? " is-scanning" : "")}
                          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={e => { e.preventDefault(); setIsDragging(false); if (!isProcessing && e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]); }}
                          onClick={() => { if (!isProcessing) fileInputRef.current?.click(); }}>
                          {isProcessing ? (
                            <div className="scan-optical-stage">
                              <span className="scan-corner tl" aria-hidden="true" />
                              <span className="scan-corner tr" aria-hidden="true" />
                              <span className="scan-corner bl" aria-hidden="true" />
                              <span className="scan-corner br" aria-hidden="true" />

                              <div className="scan-doc-wireframe" aria-hidden="true">
                                <span className="scan-laser-beam" />
                                <div className="scan-wire-head">
                                  <span className="scan-wire-logo" />
                                  <div className="scan-wire-lines">
                                    <span className="scan-wire-bar w70" />
                                    <span className="scan-wire-bar w45" />
                                  </div>
                                </div>
                                <span className="scan-wire-bar w90" />
                                <span className="scan-wire-bar w82" />
                                <div className="scan-wire-grid">
                                  <span className="scan-wire-chip" />
                                  <span className="scan-wire-chip" />
                                </div>
                                <span className="scan-wire-bar w60" />
                              </div>

                              <div className="scan-stage-caption">
                                <span className="lg-spinner" aria-hidden="true" />
                                <span>
                                  {scanPhase === 0
                                    ? "Reading PDF document…"
                                    : scanPhase === 1
                                    ? "Recognizing consumer & meter fields…"
                                    : "Verifying & syncing PM Surya Ghar data…"}
                                </span>
                              </div>
                              <div className="scan-stage-progress" aria-hidden="true">
                                <span className="scan-stage-progress-fill" />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="scan-icon-ring">
                                <HugeiconsIcon icon={Upload04Icon} size={20} />
                              </div>
                              <div className="scan-hero-title">Upload Application PDF</div>
                              <div className="scan-hero-sub">Drop MNRE PDF here or click to browse</div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="scanned-summary-pill">
                          <span className="scanned-summary-badge" aria-hidden="true">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                          </span>
                          <div className="scanned-summary-main">
                            <span className="scanned-summary-status">PDF Extracted ✓</span>
                            <span className="scanned-summary-name">{formData.consumerName || uploadedFileName || "Application Extracted"}</span>
                            <span className="scanned-summary-meta">
                              {formData.applicationNo || uploadedFileName || "PDF details filled"}
                            </span>
                          </div>
                          {formData.appliedCapacity && <span className="scanned-summary-cap">{formData.appliedCapacity}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LIVE EXTRACTION TELEMETRY DURING PROCESSING */}
                  {isProcessing && (
                    <div className="glass-skeleton-card">
                      <div className="glass-skeleton-head">
                        <span className="lg-spinner" aria-hidden="true" />
                        <span>Live Extraction Pipeline</span>
                        {uploadedFileName && <span className="scan-telemetry-file">{uploadedFileName}</span>}
                      </div>
                      <div className="scan-step-list">
                        {[
                          { idx: 0, label: "Parsing MNRE PDF pages & layout" },
                          { idx: 1, label: "Extracting Consumer Name, A/C & Capacity" },
                          { idx: 2, label: "Populating Agreement & Quotation fields" },
                        ].map((step) => {
                          const state = scanPhase > step.idx ? "done" : scanPhase === step.idx ? "active" : "pending";
                          return (
                            <div key={step.idx} className={`scan-step-item ${state}`}>
                              <span className="scan-step-dot" aria-hidden="true">
                                {state === "done" ? "✓" : state === "active" ? "•" : ""}
                              </span>
                              <span className="scan-step-label">{step.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="lg-skeleton-grid">
                        <span className="lg-skeleton-bar md" />
                        <span className="lg-skeleton-bar md" />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: REVIEW & EDIT */}
                  <div className={"section-card" + (scanned ? " highlighted" : "")}>
                    <div className="collapsible-header section-card-header" onClick={() => setDetailsOpen(p => !p)}>
                      <div className="section-card-title">
                        <span className="section-icon"><HugeiconsIcon icon={UserIcon} size={14} /></span>
                        Applicant &amp; Agreement Details
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {scanned && (
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); promptClearForm(); }}
                            className="btn-pill-subtle danger"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={11} />
                            Clear
                          </button>
                        )}
                        <HugeiconsIcon icon={ChevronDown01Icon} size={16} className={"collapsible-chevron" + (detailsOpen ? " open" : "")} />
                      </div>
                    </div>
                    <div className={"accordion-collapse" + (detailsOpen ? " open" : "")}>
                      <div className="accordion-inner">
                        <div className="section-card-body">
                        {/* AGREEMENT DATE */}
                        <div className="field-group">
                          <div className="field-label-row">
                            <span className="field-label field-label-inline">
                              <HugeiconsIcon icon={Calendar03Icon} size={12} style={{ color: "var(--apple-blue)" }} />
                              Agreement Date
                            </span>
                            <div className="switch-wrapper">
                              <span className="switch-label-tag">{formData.includeDate ? "Active" : "Blank"}</span>
                              <label className="pro-switch" title="Toggle Agreement Date">
                                <input
                                  type="checkbox"
                                  checked={!!formData.includeDate}
                                  onChange={e => upd("includeDate", e.target.checked)}
                                />
                                <span className="pro-slider"></span>
                              </label>
                            </div>
                          </div>
                          {formData.includeDate ? (
                            <AgreementDatePicker
                              day={formData.executionDay || ""}
                              month={formData.executionMonth || ""}
                              year={formData.executionYear || ""}
                              onOpenChange={isLeaving ? undefined : setIsDatePickerOpen}
                              onChangeDay={(v) => upd("executionDay", v)}
                              onChangeMonth={(v) => upd("executionMonth", v)}
                              onChangeYear={(v) => upd("executionYear", v)}
                              onSelectDate={(dd, mm, yyyy) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  executionDay: dd,
                                  executionMonth: mm,
                                  executionYear: yyyy,
                                }));
                                showNotif(`Agreement date set to ${dd}/${mm}/${yyyy}`, "info");
                              }}
                            />
                          ) : (
                            <div className="date-blank-indicator">
                              <span>Left blank for physical stamp paper execution</span>
                            </div>
                          )}
                        </div>

                        {/* CUSTOMER NAME */}
                        <div className="field-group">
                          <label className="field-label">Customer Full Name</label>
                          <input
                            type="text"
                            placeholder="e.g. THAKOR MANORJI PRATAPJI"
                            value={formData.consumerName || ""}
                            onChange={e => upd("consumerName", e.target.value)}
                            className="field-input"
                          />
                        </div>

                        {/* INSTALLATION ADDRESS */}
                        <div className="field-group">
                          <label className="field-label">Installation Address</label>
                          <textarea
                            rows={2}
                            placeholder="e.g. AT-HARIJ, District: Patan, State: GUJARAT, PIN Code: 384240"
                            value={formData.consumerAddress || ""}
                            onChange={e => upd("consumerAddress", e.target.value)}
                            className="field-textarea"
                            spellCheck={false}
                          />
                        </div>

                        {/* CAPACITY / MOBILE / REF / ACCT */}
                        <div className="form-2col-grid">
                          <div className="field-group">
                            <label className="field-label">Capacity (kWp)</label>
                            <input
                              type="text"
                              placeholder="3.300 kWp"
                              value={formData.appliedCapacity || ""}
                              onChange={e => upd("appliedCapacity", e.target.value)}
                              className="field-input"
                            />
                          </div>
                          <div className="field-group">
                            <label className="field-label">Mobile No</label>
                            <input
                              type="tel"
                              placeholder="9913997154"
                              value={formData.mobileNo || ""}
                              onChange={e => upd("mobileNo", e.target.value)}
                              className="field-input"
                            />
                          </div>
                          <div className="field-group">
                            <label className="field-label">Application Ref No</label>
                            <input
                              type="text"
                              placeholder="NP-GJUG25-8615248"
                              value={formData.applicationNo || ""}
                              onChange={e => upd("applicationNo", e.target.value)}
                              className="field-input mono"
                            />
                          </div>
                          <div className="field-group">
                            <label className="field-label">Account No</label>
                            <input
                              type="text"
                              placeholder="28527134225"
                              value={formData.consumerAccountNo || ""}
                              onChange={e => upd("consumerAccountNo", e.target.value)}
                              className="field-input mono"
                            />
                          </div>
                        </div>

                        {/* CUSTOMER SIGNATURE */}
                        <div className="field-group" ref={isLeaving ? undefined : signatureDropRef}>
                          <div className="field-label-row">
                            <span className="field-label">Customer Signature (All 3 Pages)</span>
                            {formData.consumerSignatureUrl && <span className="scan-auto-tag">Uploaded ✓</span>}
                          </div>
                          <div className={"scan-hero-zone" + (isDraggingSig ? " drag-active" : "") + (highlightSig ? " highlight-pulse" : "")}
                            onDragOver={e => { e.preventDefault(); setIsDraggingSig(true); }}
                            onDragLeave={() => setIsDraggingSig(false)}
                            onDrop={e => { e.preventDefault(); setIsDraggingSig(false); const f = e.dataTransfer.files?.[0]; if (f) { setFormData(prev => ({ ...prev, consumerSignatureUrl: URL.createObjectURL(f) })); showNotif("Signature uploaded", "success"); } }}
                            onClick={() => consumerSigInputRef.current?.click()}
                            style={{ padding: "20px", minHeight: "auto", marginBottom: "8px", cursor: "pointer" }}>
                            <div className="scan-icon-ring"><HugeiconsIcon icon={SignatureIcon} size={20} /></div>
                            <div className="scan-hero-title">{formData.consumerSignatureUrl ? "Change Signature" : "Upload Signature"}</div>
                            <div className="scan-hero-sub">Drop signature image here or click to browse</div>
                          </div>
                          {formData.consumerSignatureUrl && (
                            <div className="sig-preview-row" style={{ marginTop: "8px" }}>
                              <img src={formData.consumerSignatureUrl} alt="Signature" className="sig-thumb" />
                              <span className="sig-desc">Auto-placed on all 3 pages (bottom left)</span>
                              <button
                                type="button"
                                onClick={() => upd("consumerSignatureUrl", null)}
                                className="btn-pill-subtle danger"
                                style={{ marginLeft: "auto" }}
                              >
                                Remove
                              </button>
                            </div>
                          )}
                          <input ref={isLeaving ? undefined : consumerSigInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleConsumerSigUpload} />
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VENDOR & STAMP */}
                  <div className="section-card">
                    <div className="collapsible-header section-card-header" onClick={() => setVendorOpen(p => !p)}>
                      <div className="section-card-title">
                        <span className="section-icon"><HugeiconsIcon icon={Building03Icon} size={14} /></span>
                        Vendor &amp; Stamp
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="switch-wrapper" onClick={e => e.stopPropagation()}>
                          <span className="switch-label-tag">Stamp</span>
                          <label className="pro-switch" title="Toggle Stamp">
                            <input
                              type="checkbox"
                              checked={!!formData.includeStamp}
                              onChange={e => upd("includeStamp", e.target.checked)}
                            />
                            <span className="pro-slider"></span>
                          </label>
                        </div>
                        <HugeiconsIcon icon={ChevronDown01Icon} size={16} className={"collapsible-chevron" + (vendorOpen ? " open" : "")} />
                      </div>
                    </div>
                    <div className={"accordion-collapse" + (vendorOpen ? " open" : "")}>
                      <div className="accordion-inner">
                        <div className="section-card-body">
                          <div className="field-group">
                            <label className="field-label">Company Legal Name</label>
                            <input type="text" value={formData.vendorName || ""} onChange={e => upd("vendorName", e.target.value)} className="field-input" />
                          </div>
                          <div className="field-group">
                            <label className="field-label">Registered Office</label>
                            <AddressDropdown
                              value={formData.vendorAddress || ""}
                              onChange={addr => upd("vendorAddress", addr)}
                              onOpenChange={isLeaving ? undefined : setIsAddressDropdownOpen}
                            />
                            <textarea rows={2} value={formData.vendorAddress || ""} onChange={e => upd("vendorAddress", e.target.value)} className="field-textarea" spellCheck={false} />
                          </div>
                          {formData.includeStamp && (
                            <div className="stamp-row">
                              <img src={formData.customStampUrl || formData.vendorStamp} alt="Stamp" className="stamp-img-thumb" />
                              <div className="stamp-info">
                                <span className="stamp-name">Sunroof Energy Stamp</span>
                                <span className="stamp-sub">Attached to all 3 pages</span>
                              </div>
                              <button type="button" onClick={() => stampInputRef.current?.click()} className="btn-pill-subtle">Replace</button>
                              <input ref={isLeaving ? undefined : stampInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleStampUpload} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* QUOTATION INSPECTOR SUB-TABS */}
                  <div
                    className="segmented-control full-width cols-3"
                    style={{ "--active-idx": quotationTab === "bos" ? 1 : quotationTab === "company" ? 2 : 0 }}
                  >
                    <span className="segmented-glider" aria-hidden="true" />
                    <button
                      type="button"
                      className={`segmented-item ${quotationTab === "system" ? "active" : ""}`}
                      onClick={() => setQuotationTab("system")}
                    >
                      System &amp; Cost
                    </button>
                    <button
                      type="button"
                      className={`segmented-item ${quotationTab === "bos" ? "active" : ""}`}
                      onClick={() => setQuotationTab("bos")}
                    >
                      BOS Specs
                    </button>
                    <button
                      type="button"
                      className={`segmented-item ${quotationTab === "company" ? "active" : ""}`}
                      onClick={() => setQuotationTab("company")}
                    >
                      Company
                    </button>
                  </div>

                  {quotationTab === "system" && (
                    <div className="module-fade-enter quotation-tab-stack" key="q-system">
                      {/* QUOTATION CUSTOMER & SYSTEM */}
                      <div className="section-card highlighted">
                        <div className="section-card-header"><div className="section-card-title"><span className="section-icon"><HugeiconsIcon icon={UserIcon} size={13} /></span>Customer Details</div></div>
                        <div className="section-card-body">
                          <div className="field-group"><label className="field-label">Customer Name</label><input type="text" value={formData.consumerName || ""} onChange={e => upd("consumerName", e.target.value)} className="field-input" /></div>
                          <div className="field-group"><label className="field-label">Address</label><textarea rows={2} value={formData.consumerAddress || ""} onChange={e => upd("consumerAddress", e.target.value)} className="field-textarea" spellCheck={false} /></div>
                          <div className="field-group"><label className="field-label">Contact No</label><input type="tel" value={formData.mobileNo || ""} onChange={e => upd("mobileNo", e.target.value)} className="field-input" /></div>
                        </div>
                      </div>

                      <div className="section-card highlighted">
                        <div className="section-card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <div className="section-card-title"><span className="section-icon"><HugeiconsIcon icon={SolarPanel03Icon} size={13} /></span>Solar System &amp; Equipment</div>
                          <button type="button" onClick={() => setShowPricingModal(true)} className="btn-pill-subtle primary" title="Select plan from APS, WAREE, ADANI">
                            <HugeiconsIcon icon={SolarPanel03Icon} size={12} />
                            Rate Chart
                          </button>
                        </div>
                        <div className="section-card-body">
                          <div className="form-2col-grid">
                            <div className="field-group"><label className="field-label">Capacity (KW)</label><input type="text" value={formData.q_capacityKw || ""} onChange={e => upd("q_capacityKw", e.target.value)} className="field-input" /></div>
                            <div className="field-group"><label className="field-label">Panel Qty</label><input type="text" value={formData.q_panelQty || ""} onChange={e => upd("q_panelQty", e.target.value)} className="field-input" /></div>
                          </div>
                          <div className="field-group"><label className="field-label">Solar Panel Make / Spec</label><input type="text" value={formData.q_solarPanelMake || ""} onChange={e => upd("q_solarPanelMake", e.target.value)} className="field-input" /></div>
                          <div className="form-2col-grid">
                            <div className="field-group"><label className="field-label">Inverter Make</label><input type="text" value={formData.q_inverterMake || ""} onChange={e => upd("q_inverterMake", e.target.value)} className="field-input" /></div>
                            <div className="field-group"><label className="field-label">Inverter Qty</label><input type="text" value={formData.q_inverterQty || ""} onChange={e => upd("q_inverterQty", e.target.value)} className="field-input" /></div>
                          </div>
                          <div style={{ marginTop: "4px", paddingTop: "10px", borderTop: "1px dashed var(--border-subtle)" }}>
                            <div className={formData.q_includeSubsidy !== false ? "form-2col-grid" : ""}>
                              <div className="field-group">
                                <label className="field-label">Quotation Cost (₹)</label>
                                <input type="text" value={formData.q_netSystemCost || ""} onChange={e => upd("q_netSystemCost", e.target.value)} placeholder="e.g. 169000" className="field-input mono" style={{ fontWeight: 700, color: "var(--apple-blue)" }} />
                              </div>
                              {formData.q_includeSubsidy !== false && (
                                <div className="field-group">
                                  <label className="field-label">Subsidy (₹)</label>
                                  <input type="text" value={formData.q_subsidyAmount || ""} onChange={e => upd("q_subsidyAmount", e.target.value)} placeholder="e.g. 78000" className="field-input mono" style={{ fontWeight: 700, color: "var(--text-main)" }} />
                                </div>
                              )}
                            </div>
                            {formData.q_basePriceListCost && <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "6px" }}>Base ₹ {Number(formData.q_basePriceListCost).toLocaleString("en-IN")} ÷ 90% = ₹ {Number(formData.q_netSystemCost).toLocaleString("en-IN")}</div>}
                          </div>
                        </div>
                      </div>

                      {/* COST & SUBSIDY CALCULATOR */}
                      <div className="section-card highlighted" ref={isLeaving ? undefined : costSummaryRef}>
                        <div className="section-card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                          <div className="section-card-title"><span className="section-icon"><HugeiconsIcon icon={ViewIcon} size={13} /></span>Cost &amp; Subsidy Summary</div>
                          <div className="switch-wrapper">
                            <span className="switch-label-tag">{formData.q_includeSubsidy !== false ? "Subsidy" : "No Subsidy"}</span>
                            <label className="pro-switch" title="Toggle Government Subsidy on Quotation">
                              <input
                                type="checkbox"
                                checked={formData.q_includeSubsidy !== false}
                                onChange={e => upd("q_includeSubsidy", e.target.checked)}
                              />
                              <span className="pro-slider"></span>
                            </label>
                          </div>
                        </div>
                        <div className="section-card-body">
                          <div className="hero-cost-card">
                            <div className="hero-cost-top">
                              <span className="hero-cost-label">{formData.q_includeSubsidy !== false ? "Customer Landing Cost" : "Total Payable Amount"}</span>
                              <span className="hero-cost-tag">{formData.q_includeSubsidy !== false ? "After Subsidy" : "Without Subsidy"}</span>
                            </div>
                            <div className="hero-cost-amount">
                              ₹ {(formData.q_includeSubsidy !== false
                                ? Math.max(0, Number(formData.q_netSystemCost || 0) - Number(formData.q_subsidyAmount || 0))
                                : Number(formData.q_netSystemCost || 0)
                              ).toLocaleString("en-IN")}
                            </div>
                            <div className="hero-cost-meta">
                              {formData.q_includeSubsidy !== false ? (
                                <>
                                  <span>System ₹ {Number(formData.q_netSystemCost || 0).toLocaleString("en-IN")}</span>
                                  <span>−</span>
                                  <span>Subsidy ₹ {Number(formData.q_subsidyAmount || 0).toLocaleString("en-IN")}</span>
                                </>
                              ) : (
                                <span>Direct System Cost (No Government Subsidy)</span>
                              )}
                            </div>
                          </div>

                          <div className="hu-table-shell pricing-hu-table" role="table" aria-label="Pricing Summary">
                            <div className="hu-table-head pricing-hu-grid" role="row">
                              <div className="hu-th" role="columnheader">Summary Item</div>
                              <div className="hu-th text-right" role="columnheader">Amount (₹)</div>
                            </div>
                            <div className="hu-table-body-card" role="rowgroup">
                              <div className="hu-tr pricing-hu-grid" role="row">
                                <div className="hu-td" role="cell">System Payable Cost</div>
                                <div className="hu-td text-right font-bold text-main" role="cell">₹ {Number(formData.q_netSystemCost || 0).toLocaleString("en-IN")}</div>
                              </div>
                              {formData.q_includeSubsidy !== false && (
                                <div className="hu-tr pricing-hu-grid" role="row">
                                  <div className="hu-td" role="cell">Gov. Subsidy Amount</div>
                                  <div className="hu-td text-right font-bold text-green" role="cell">₹ {Number(formData.q_subsidyAmount || 0).toLocaleString("en-IN")}</div>
                                </div>
                              )}
                              <div className="hu-tr pricing-hu-grid highlight-landing-row" role="row">
                                <div className="hu-td font-bold text-blue" role="cell">{formData.q_includeSubsidy !== false ? "Customer Landing Cost" : "Net Payable Amount"}</div>
                                <div className="hu-td text-right font-extrabold text-blue-bright" role="cell">
                                  ₹ {(formData.q_includeSubsidy !== false
                                    ? Math.max(0, Number(formData.q_netSystemCost || 0) - Number(formData.q_subsidyAmount || 0))
                                    : Number(formData.q_netSystemCost || 0)
                                  ).toLocaleString("en-IN")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {quotationTab === "bos" && (
                    <div className="module-fade-enter quotation-tab-stack" key="q-bos">
                      {/* BALANCE OF SYSTEM */}
                      <div className="section-card highlighted">
                        <div className="section-card-header">
                          <div className="section-card-title">
                            <span className="section-icon"><HugeiconsIcon icon={ViewIcon} size={13} /></span>
                            Balance of System (BOS)
                          </div>
                          <button
                            type="button"
                            onClick={handleResetBOS}
                            className="btn-pill-subtle"
                            title="Reset all BOS items to official Sunroof defaults"
                          >
                            Reset Defaults
                          </button>
                        </div>
                        <div className="section-card-body">
                          {[
                            ["Online Monitoring", "q_monitoringDetails", "q_monitoringQty", "Reputed, based on Wi-Fi", "1 Set"],
                            ["Module Structures", "q_mountingStructureDetails", "q_mountingStructureQty", "Hot Dip Galvanized 60×40 pipe 2mm", "As per Plant Capacity"],
                            ["DC Dist. Box", "q_dcBoxDetails", "q_dcBoxQty", "DB with DC MCB — Havells & L&T", "16 ADC, 600V SPD"],
                            ["AC Dist. Box", "q_acBoxDetails", "q_acBoxQty", "DB with AC MCB — Havells & L&T", "32 ADP"],
                            ["DC Cables", "q_dcCableDetails", "q_dcCableQty", "Polycab, TUV Approved", "4 sq.mm"],
                            ["AC Cables", "q_acCableDetails", "q_acCableQty", "Polycab Copper Flexible Cable", "4 sq.mm"],
                            ["Cable Conduits", "q_cableConduitDetails", "q_cableConduitQty", "25mm WireGuard Rigid PVC", "25mm LMS"],
                            ["Lightning Arrestor", "q_lightningArresterDetails", "q_lightningArresterQty", "1.3 mtr copper coated, with earthing", "16 sq.mm AL."],
                            ["Solar Earthing", "q_earthingDetails", "q_earthingQty", "Copper bonded rod 1.5 mtr with chemical bag", "3 Set"]
                          ].map(([l, dk, qk, dp, qp]) => (
                            <div key={dk} className="form-bos-grid">
                              <div className="field-group"><label className="field-label">{l}</label><input type="text" value={formData[dk] || ""} placeholder={dp} onChange={e => upd(dk, e.target.value)} className="field-input" /></div>
                              <div className="field-group"><label className="field-label">Qty</label><input type="text" value={formData[qk] || ""} placeholder={qp} onChange={e => upd(qk, e.target.value)} className="field-input" /></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {quotationTab === "company" && (
                    <div className="module-fade-enter quotation-tab-stack" key="q-company">
                      {/* COMPANY & BANK INFO */}
                      <div className="section-card highlighted">
                        <div className="section-card-header"><div className="section-card-title"><span className="section-icon"><HugeiconsIcon icon={Building03Icon} size={13} /></span>Company &amp; Bank Info</div></div>
                        <div className="section-card-body">
                          <div className="field-group"><label className="field-label">Company Brand Name</label><input type="text" value={formData.q_brandName || ""} onChange={e => upd("q_brandName", e.target.value)} className="field-input" /></div>
                          <div className="field-group">
                            <label className="field-label">Reg. Office Address</label>
                            <AddressDropdown
                              value={formData.q_regOfficeAddress || ""}
                              onChange={addr => upd("q_regOfficeAddress", addr)}
                              onOpenChange={isLeaving ? undefined : setIsAddressDropdownOpen}
                            />
                            <textarea rows={2} value={formData.q_regOfficeAddress || ""} onChange={e => upd("q_regOfficeAddress", e.target.value)} className="field-textarea" spellCheck={false} />
                          </div>
                          <div className="field-group"><label className="field-label">Contact Number</label><input type="tel" value={formData.q_contactNumber || ""} onChange={e => upd("q_contactNumber", e.target.value)} className="field-input" /></div>
                          <div className="field-group"><label className="field-label">Email Address</label><input type="email" value={formData.q_emailAddress || ""} onChange={e => upd("q_emailAddress", e.target.value)} className="field-input" /></div>

                          <div className="bank-preset-card">
                            <div className="bank-preset-header">
                              <label className="bank-preset-title">Quotation Bank Display</label>
                              <span className="bank-badge">
                                {formData.q_bankPreset === "all" || !formData.q_bankPreset
                                  ? "All 3 Banks"
                                  : BANK_PRESETS[formData.q_bankPreset]?.label || "Single Bank"}
                              </span>
                            </div>

                            <BankDropdown
                              value={formData.q_bankPreset || "all"}
                              onChange={handleBankPresetToggle}
                              onOpenChange={isLeaving ? undefined : setIsBankDropdownOpen}
                            />
                          </div>

                          {formData.q_bankPreset && formData.q_bankPreset !== "all" ? (
                            <div className="form-2col-grid">
                              <div className="field-group"><label className="field-label">Bank Name</label><input type="text" value={formData.q_bankName || ""} onChange={e => upd("q_bankName", e.target.value)} className="field-input" /></div>
                              <div className="field-group"><label className="field-label">Branch Name</label><input type="text" value={formData.q_branchName || ""} onChange={e => upd("q_branchName", e.target.value)} className="field-input" /></div>
                              <div className="field-group"><label className="field-label">Account Number</label><input type="text" value={formData.q_accountNumber || ""} onChange={e => upd("q_accountNumber", e.target.value)} className="field-input mono" /></div>
                              <div className="field-group"><label className="field-label">IFSC Code</label><input type="text" value={formData.q_ifscCode || ""} onChange={e => upd("q_ifscCode", e.target.value)} className="field-input mono" /></div>
                            </div>
                          ) : (
                            <div className="bank-all-summary">
                              <span>Displaying Sarvodaya Co-op. Bank, DCB Bank, and Bank of Baroda on the quotation.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
                </div>
              ))}
            </div>

            {/* Sticky Download & Pre-Print Readiness */}
            <div className="sidebar-sticky-footer">
              {activeModuleChecks.length === 0 ? (
                <div className="readiness-pill ready" title="All required fields & signature are verified">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                  <span>Ready to Print</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="readiness-pill warn"
                  onClick={() => jumpToIssue(activeModuleChecks[0])}
                  title={activeModuleChecks.map((c) => c.label).join(" · ")}
                >
                  <HugeiconsIcon icon={AlertCircleIcon} size={13} />
                  <span>{activeModuleChecks.length} Missing: {activeModuleChecks[0].label}</span>
                </button>
              )}
              <button
                type="button"
                className="btn-download-primary"
                disabled={Boolean(printScope)}
                onClick={() => handleDownload(activeModule)}
              >
                <HugeiconsIcon icon={Download04Icon} size={16} />
                <span>{printScope === activeModule ? "Preparing Print…" : ("Download " + (activeModule === "agreement" ? "Agreement (3 Pages)" : "Quotation (1 Page)"))}</span>
              </button>
            </div>
          </aside>

          {/* PREVIEW STAGE */}
          <main className="preview-panel-container">
            <div className={"preview-scroller-canvas" + (leavingModule ? " is-transitioning" : "")} ref={previewScrollerRef}>
              {(printScope === "agreement" || printScope === "both") && activeModule !== "agreement" && (
                <div className="print-auxiliary-sheet" aria-hidden="true">
                  <div id="printable-agreement"><DocumentPages data={formData} activeTab="all" /></div>
                </div>
              )}
              <div className="preview-transition-stage" style={{ "--nav-dir": navDir }}>
                {leavingModule && (
                  <div
                    className="preview-layer is-leaving"
                    key={`leave-doc-${leavingModule}-${transitionEpoch}`}
                    aria-hidden="true"
                  >
                    <div className="document-scale-wrapper" style={{ transform: "scale(" + zoomLevel + ")" }}>
                      {leavingModule === "agreement" ? (
                        <div><DocumentPages data={formData} activeTab="all" /></div>
                      ) : (
                        <QuotationPage data={formData} isGhost={true} />
                      )}
                    </div>
                  </div>
                )}
                <div
                  className={`preview-layer ${transitionEpoch > 0 ? "is-entering" : "preview-stage-enter"}`}
                  key={`enter-doc-${activeModule}-${transitionEpoch}`}
                >
                  <div className="document-scale-wrapper" style={{ transform: "scale(" + zoomLevel + ")" }}>
                    {activeModule === "agreement" ? (
                      <div id="printable-agreement"><DocumentPages data={formData} activeTab="all" /></div>
                    ) : (
                      <QuotationPage data={formData} />
                    )}
                  </div>
                </div>
              </div>
              {(printScope === "quotation" || printScope === "both") && activeModule !== "quotation" && (
                <div className="print-auxiliary-sheet" aria-hidden="true">
                  <QuotationPage data={formData} />
                </div>
              )}
            </div>

            {/* FLOATING LIQUID GLASS BOTTOM CONTROL DOCK */}
            <div className="floating-preview-dock" role="toolbar" aria-label="Document Preview Controls">
              <div className="dock-doc-meta" key={activeModule} style={{ "--nav-dir": navDir }}>
                <HugeiconsIcon icon={ViewIcon} size={14} className="preview-title-icon" />
                <span className="dock-doc-title">{activeModule === "agreement" ? "Agreement" : "Quotation"}</span>
                <span className="preview-page-badge">{activeModule === "agreement" ? "3 Pages" : "1 Page"}</span>
              </div>

              <span className="dock-divider" aria-hidden="true" />

              <div className="dock-zoom-group">
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setZoomLevel(p => Math.max(0.5, +(p - 0.1).toFixed(2)))}
                  title="Zoom Out (Ctrl -)"
                >
                  <HugeiconsIcon icon={ZoomOutIcon} size={13} />
                </button>
                <input
                  type="range"
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="dock-zoom-slider"
                  style={{ "--zoom-fill": `${zoomFillPct}%` }}
                  aria-label="Zoom Level"
                />
                <span className="zoom-pct-label">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setZoomLevel(p => Math.min(1.5, +(p + 0.1).toFixed(2)))}
                  title="Zoom In (Ctrl +)"
                >
                  <HugeiconsIcon icon={ZoomInIcon} size={13} />
                </button>
                <button
                  type="button"
                  className="zoom-btn"
                  onClick={() => setZoomLevel(1)}
                  title="Reset Zoom (Ctrl 0)"
                  aria-label="Reset Zoom"
                >
                  <HugeiconsIcon icon={RefreshIcon} size={13} />
                </button>
              </div>

              <span className="dock-divider" aria-hidden="true" />

              <button
                type="button"
                className="dock-export-pill"
                disabled={Boolean(printScope)}
                onClick={() => handleDownload(activeModule)}
                title={`Print / Save ${activeModule === "agreement" ? "Agreement" : "Quotation"} as selectable-text PDF`}
              >
                <HugeiconsIcon icon={Download04Icon} size={13} />
                <span>{printScope === activeModule ? "Preparing…" : "Export"}</span>
              </button>
            </div>
          </main>
        </div>

        {/* WARNING / CONFIRMATION MODAL */}
        {warningModal.isOpen && (
          <div className="rpm-backdrop" onClick={() => setWarningModal(prev => ({ ...prev, isOpen: false }))}>
            <div className="warning-modal-box" onClick={e => e.stopPropagation()}>
              <div className="warning-modal-header">
                <div className={`warning-modal-icon ${warningModal.confirmColor !== "danger" ? "warn" : ""}`}>
                  <HugeiconsIcon icon={AlertCircleIcon} size={22} />
                </div>
                <h3 className="warning-modal-title">{warningModal.title}</h3>
              </div>
              <p className="warning-modal-msg">
                {warningModal.message}
              </p>
              {Array.isArray(warningModal.items) && warningModal.items.length > 0 && (
                <ul className="readiness-check-list">
                  {warningModal.items.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="readiness-check-item"
                        onClick={() => {
                          setWarningModal((prev) => ({ ...prev, isOpen: false }));
                          jumpToIssue(item);
                        }}
                      >
                        <HugeiconsIcon icon={AlertCircleIcon} size={14} />
                        <span>{item.label}</span>
                        <span className="readiness-fix-tag">Fix</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="warning-modal-actions">
                <button
                  type="button"
                  onClick={() => setWarningModal(prev => ({ ...prev, isOpen: false }))}
                  className="btn-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={warningModal.onConfirm}
                  className={`btn-modal-confirm ${warningModal.confirmColor || "danger"}`}
                >
                  {warningModal.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SOLAR PRICING RATE SHEET MODAL */}
        <SolarPricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          onSelectPlan={handleApplyPricingPlan}
          appliedCapacity={formData.appliedCapacity}
        />
      </div>
    </>
  );
}
