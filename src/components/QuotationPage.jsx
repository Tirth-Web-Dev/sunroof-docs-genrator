import React from 'react';
import { COMPANY_PROFILES, ALL_SUNROOF_BANKS, BANK_PRESETS } from '../utils/constants';
import { Stamp } from './Stamp';
import './QuotationPage.css';

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];
const TENS_WORDS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function twoDigitsToWords(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o ? `${TENS_WORDS[t]} ${ONES[o]}` : TENS_WORDS[t];
}

function numberToIndianWords(amount) {
  const num = Math.round(Number(amount) || 0);
  if (num <= 0) return 'Zero Rupees Only';

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const rest = num % 100;

  const parts = [];
  if (crore) parts.push(`${twoDigitsToWords(crore)} Crore`);
  if (lakh) parts.push(`${twoDigitsToWords(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigitsToWords(thousand)} Thousand`);
  if (hundred) parts.push(`${ONES[hundred]} Hundred`);
  if (rest) parts.push(twoDigitsToWords(rest));

  return `(${parts.join(' ')} Only)`;
}

export function QuotationPage({ data, isGhost = false }) {
  const {
    consumerName = '',
    consumerAddress = '',
    mobileNo = '',
    includeDate = true,
    executionDay = '',
    executionMonth = '',
    executionYear = '',
    vendorStamp = null,
    vendorName = '',
    customStampUrl = null,
    q_companyPreset = 'sunroof',
    q_brandName = 'SUNROOF ENERGY',
    q_regOfficeAddress = '',
    q_contactNumber = '',
    q_emailAddress = '',
    q_bankPreset = 'all',
    q_bankName = '',
    q_branchName = '',
    q_accountNumber = '',
    q_ifscCode = '',
    q_capacityKw = '',
    q_panelQty = '',
    q_solarPanelMake = '',
    q_inverterMake = '',
    q_inverterQty = '',
    q_monitoringDetails = '',
    q_monitoringQty = '',
    q_mountingStructureDetails = '',
    q_mountingStructureQty = '',
    q_dcBoxDetails = '',
    q_dcBoxQty = '',
    q_acBoxDetails = '',
    q_acBoxQty = '',
    q_dcCableDetails = '',
    q_dcCableQty = '',
    q_acCableDetails = '',
    q_acCableQty = '',
    q_cableConduitDetails = '',
    q_cableConduitQty = '',
    q_lightningArresterDetails = '',
    q_lightningArresterQty = '',
    q_earthingDetails = '',
    q_earthingQty = '',
    q_includeSubsidy = true,
    q_netSystemCost = 169000,
    q_subsidyAmount = 78000,
  } = data;

  const profile = COMPANY_PROFILES[q_companyPreset] || COMPANY_PROFILES.sunroof;

  const rawContact = q_contactNumber || profile.contact || '84603 43385';
  const displayContact = rawContact.replace('84600', '84603').replace(/^\+?91\s*/, '');

  const displayKwNum = q_capacityKw || data.appliedCapacity || '3.48';
  const displayKw = displayKwNum.toString().toLowerCase().includes('kw')
    ? displayKwNum
    : `${displayKwNum} kW`;

  const displayDate = React.useMemo(() => {
    if (includeDate && executionDay && executionMonth && executionYear) {
      const y = Number(executionYear);
      const m = Number(executionMonth) - 1;
      const d = Number(executionDay);
      const parsed = new Date(y, m, d);
      if (!Number.isNaN(parsed.getTime()) && parsed.getFullYear() === y && parsed.getMonth() === m && parsed.getDate() === d) {
        return parsed.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      }
    }
    return new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }, [includeDate, executionDay, executionMonth, executionYear]);

  const parsedNetCost =
    q_netSystemCost === '' || q_netSystemCost === null || q_netSystemCost === undefined
      ? 169000
      : Number(q_netSystemCost);
  const netCost = Number.isFinite(parsedNetCost) ? Math.max(0, parsedNetCost) : 169000;
  const hasSubsidy = q_includeSubsidy !== false;
  const parsedSubsidy =
    q_subsidyAmount === '' || q_subsidyAmount === null || q_subsidyAmount === undefined
      ? 78000
      : Number(q_subsidyAmount);
  const subsidy = hasSubsidy ? (Number.isFinite(parsedSubsidy) ? Math.max(0, parsedSubsidy) : 78000) : 0;
  const landingCost = Math.max(0, netCost - subsidy);
  const systemPayable = netCost;

  const banksToShow =
    q_bankPreset === 'all'
      ? ALL_SUNROOF_BANKS
      : [
          {
            key: q_bankPreset,
            bankName: q_bankName || BANK_PRESETS[q_bankPreset]?.bankName || '',
            branchName: q_branchName || BANK_PRESETS[q_bankPreset]?.branchName || '',
            accountNumber: q_accountNumber || BANK_PRESETS[q_bankPreset]?.accountNumber || '',
            ifscCode: q_ifscCode || BANK_PRESETS[q_bankPreset]?.ifscCode || '',
          },
        ];

  const equipmentItems = [
    { sr: 1, desc: `Solar Panel (${displayKw})`, spec: q_solarPanelMake || 'WAREE (580 W), 25-year performance warranty', qty: q_panelQty || '6 Panel' },
    { sr: 2, desc: 'Solar Inverter / Conditioning Unit', spec: q_inverterMake || 'PV BLINK / POLYCAB (10 years warranty)', qty: q_inverterQty || '3600 W' },
    { sr: 3, desc: 'System Online Monitoring with Mobile App', spec: q_monitoringDetails || 'Reputed, based on Wi-Fi', qty: q_monitoringQty || '1 Set' },
    { sr: 4, desc: 'Module Structures', spec: q_mountingStructureDetails || 'Hot Dip Galvanized 60×40 pipe 2mm / 40×40 pipe 2mm', qty: q_mountingStructureQty || 'As per Plant Capacity' },
    { sr: 5, desc: 'DC Distribution Box', spec: q_dcBoxDetails || 'DB with DC MCB — Havells & L&T make. Surge protecting device — Surgear make', qty: q_dcBoxQty || '16 ADC, 600V SPD' },
    { sr: 6, desc: 'AC Distribution Box', spec: q_acBoxDetails || 'DB with AC MCB — Havells & L&T make. Surge protecting device — Surgear make', qty: q_acBoxQty || '32 ADP' },
    { sr: 7, desc: 'Solar Grade DC Cables', spec: q_dcCableDetails || 'Polycab, TUV Approved', qty: q_dcCableQty || '4 sq.mm' },
    { sr: 8, desc: 'Solar Grade AC Cables', spec: q_acCableDetails || 'Polycab Copper Flexible Industrial Cable', qty: q_acCableQty || '4 sq.mm' },
    { sr: 9, desc: 'Cable Conduits', spec: q_cableConduitDetails || '25mm WireGuard Rigid PVC, UV Protected', qty: q_cableConduitQty || '25mm LMS' },
    { sr: 10, desc: 'Lightning Arrestor', spec: q_lightningArresterDetails || '1.3 mtr copper coated, with earthing', qty: q_lightningArresterQty || '16 sq.mm AL.' },
    { sr: 11, desc: 'Solar Plant Earthing', spec: q_earthingDetails || 'Copper bonded rod 1.5 mtr with chemical compound bag', qty: q_earthingQty || '3 Set' },
  ];

  return (
    <div className="quotation-container" id={isGhost ? undefined : 'printable-quotation'}>
      {/* DECORATIVE TOP-RIGHT GEOMETRIC SOLAR ORBIT WATERMARK */}
      <svg
        className="q-decor-sunburst"
        viewBox="0 0 380 280"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sunOrbitFade" cx="89%" cy="14%" r="72%">
            <stop offset="0%" stopColor="#94b3d4" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#b5cce3" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#f3f7fc" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="url(#sunOrbitFade)">
          <circle cx="340" cy="40" r="68" strokeWidth="1" />
          <circle cx="340" cy="40" r="108" strokeWidth="1" />
          <circle cx="340" cy="40" r="154" strokeWidth="0.9" />
          <circle cx="340" cy="40" r="208" strokeWidth="0.85" />
          <line x1="340" y1="40" x2="205" y2="215" strokeWidth="0.9" />
          <line x1="340" y1="40" x2="168" y2="162" strokeWidth="0.9" />
          <line x1="340" y1="40" x2="142" y2="100" strokeWidth="0.9" />
          <line x1="340" y1="40" x2="252" y2="240" strokeWidth="0.9" />
          <line x1="340" y1="40" x2="306" y2="255" strokeWidth="0.9" />
          <line x1="340" y1="40" x2="132" y2="42" strokeWidth="0.9" />
        </g>
      </svg>

      {/* DECORATIVE BOTTOM-LEFT ARCHITECTURAL SOLAR PANEL ARRAY */}
      <svg
        className="q-decor-solar-panel"
        viewBox="0 0 540 130"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="solarPanelFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e4d7e" />
            <stop offset="48%" stopColor="#133459" />
            <stop offset="100%" stopColor="#091a30" />
          </linearGradient>
          <linearGradient id="solarSkySheen" x1="0%" y1="0%" x2="72%" y2="95%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.34" />
            <stop offset="42%" stopColor="#38bdf8" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#091a30" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="solarFrameEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="55%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="solarGoldEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Subtle ambient shadow behind tilted panel */}
        <polygon points="0,12 502,130 0,130" fill="#0b1e36" fillOpacity="0.12" />
        {/* Extruded aluminum side bevel */}
        <polygon points="0,15 492,130 474,130 0,21" fill="url(#solarFrameEdge)" />
        {/* Main monocrystalline array face */}
        <polygon points="0,20 476,130 0,130" fill="url(#solarPanelFace)" />
        <polygon points="0,20 476,130 0,130" fill="url(#solarSkySheen)" />
        {/* Perspective horizontal cell ribs */}
        <line x1="0" y1="48" x2="354" y2="130" stroke="#7fb3e8" strokeOpacity="0.32" strokeWidth="1" />
        <line x1="0" y1="76" x2="232" y2="130" stroke="#7fb3e8" strokeOpacity="0.30" strokeWidth="1" />
        <line x1="0" y1="103" x2="116" y2="130" stroke="#7fb3e8" strokeOpacity="0.26" strokeWidth="1" />
        {/* Fine secondary busbar lines */}
        <line x1="0" y1="62" x2="293" y2="130" stroke="#93c5fd" strokeOpacity="0.14" strokeWidth="0.65" />
        <line x1="0" y1="90" x2="173" y2="130" stroke="#93c5fd" strokeOpacity="0.14" strokeWidth="0.65" />
        {/* Perspective vertical cell seams */}
        <line x1="68" y1="36" x2="16" y2="130" stroke="#bfdbfe" strokeOpacity="0.34" strokeWidth="1.25" />
        <line x1="150" y1="55" x2="104" y2="130" stroke="#bfdbfe" strokeOpacity="0.32" strokeWidth="1.25" />
        <line x1="234" y1="74" x2="196" y2="130" stroke="#bfdbfe" strokeOpacity="0.30" strokeWidth="1.25" />
        <line x1="318" y1="94" x2="290" y2="130" stroke="#bfdbfe" strokeOpacity="0.28" strokeWidth="1.25" />
        <line x1="402" y1="113" x2="386" y2="130" stroke="#bfdbfe" strokeOpacity="0.24" strokeWidth="1.25" />
        {/* Warm solar amber top rim highlight */}
        <line x1="0" y1="14.5" x2="494" y2="129.5" stroke="url(#solarGoldEdge)" strokeWidth="2.2" />
      </svg>

      {/* MAIN CONTENT LAYER */}
      <div className="q-canvas">
        {/* 1. BRAND HEADER BAR */}
        <header className="q-top-bar">
          <div className="q-brand-lockup">
            <img src={profile.logo} alt={profile.name} className="quotation-logo" />
            <span className="q-brand-sep" />
            <div className="q-brand-copy">
              <div className="q-brand-name">{q_brandName || profile.name}</div>
              <div className="q-brand-sub">CLEAN ENERGY · BRIGHTER TOMORROW</div>
            </div>
          </div>

          <div className="q-meta-right">
            <div className="q-doc-ref">+91 {displayContact} · {q_emailAddress || profile.email}</div>
            <div className="q-doc-date">Date: {displayDate}</div>
          </div>
        </header>

        {/* 2. HERO TITLE & CUSTOMER DETAILS SPLIT */}
        <section className="q-hero-split">
          <div className="q-hero-left">
            <h1 className="q-hero-title">
              <span className="q-title-light">Solar System</span>
              <span className="q-title-bold">Quotation</span>
            </h1>
          </div>

          <div className="q-hero-right">
            <div className="q-section-label">
              <span className="q-amber-pip" />
              <span>Customer Details</span>
            </div>

            <div className="q-cust-grid">
              <div className="q-cust-row">
                <span className="q-cust-k">Customer Name</span>
                <span className="q-cust-colon">:</span>
                <span className="q-cust-v strong">{consumerName || '________________________________'}</span>
              </div>
              <div className="q-cust-row">
                <span className="q-cust-k">Contact No.</span>
                <span className="q-cust-colon">:</span>
                <span className="q-cust-v">+91 {mobileNo || '__________'}</span>
              </div>
              <div className="q-cust-row">
                <span className="q-cust-k">Address</span>
                <span className="q-cust-colon">:</span>
                <span className="q-cust-v">{consumerAddress || '________________________________'}</span>
              </div>
              <div className="q-cust-row">
                <span className="q-cust-k">System Capacity</span>
                <span className="q-cust-colon">:</span>
                <span className="q-cust-v cap">{displayKw}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. SYSTEM & EQUIPMENT DETAILS TABLE */}
        <section className="q-table-section">
          <div className="q-section-label">
            <span className="q-amber-pip" />
            <span>System &amp; Equipment Details</span>
          </div>

          <div className="hu-table-shell q-hu-table" role="table" aria-label="System and Equipment Details">
            <div className="hu-table-head q-hu-grid" role="row">
              <div className="hu-th center" role="columnheader">#</div>
              <div className="hu-th" role="columnheader">Description</div>
              <div className="hu-th" role="columnheader">Make / Specification</div>
              <div className="hu-th center" role="columnheader">Quantity</div>
            </div>

            <div className="hu-table-body-card" role="rowgroup">
              {equipmentItems.map((item) => (
                <div className="hu-tr q-hu-grid" key={item.sr} role="row">
                  <div className="hu-td col-sr" role="cell">{item.sr}</div>
                  <div className="hu-td col-desc" role="cell">{item.desc}</div>
                  <div className="hu-td col-spec" role="cell">{item.spec}</div>
                  <div className="hu-td col-qty" role="cell">
                    <span className="q-qty-pill">{item.qty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. COMMERCIAL INVESTMENT SUMMARY CARD */}
        {hasSubsidy ? (
          <section className="q-cost-card">
            <div className="q-cost-left">
              <div className="q-cost-heading">System Payable Cost</div>
              <div className="q-cost-figure-sm">₹ {systemPayable.toLocaleString('en-IN')}</div>
              <div className="q-cost-sub">Includes all components, installation &amp; BOS</div>
            </div>

            <div className="q-cost-divider" />

            <div className="q-cost-mid">
              <div className="q-subsidy-badge" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17 4C11 4 6 8.5 6 15C6 16.5 6.3 17.9 6.9 19.1C8.1 19.7 9.5 20 11 20C17.5 20 20 14 20 7V4H17Z"
                    stroke="#d97706"
                    strokeWidth="1.9"
                    strokeLinejoin="round"
                  />
                  <path d="M5 20C8.5 16.5 12 13 16 10" stroke="#d97706" strokeWidth="1.9" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="q-cost-micro">Estimated Subsidy</div>
                <div className="q-cost-subsidy-val">− ₹ {subsidy.toLocaleString('en-IN')}*</div>
              </div>
            </div>

            <div className="q-cost-divider" />

            <div className="q-cost-right" key={landingCost}>
              <div className="q-cost-micro strong">Net Customer Cost</div>
              <div className="q-cost-hero">₹ {landingCost.toLocaleString('en-IN')}</div>
              <div className="q-cost-words">{numberToIndianWords(landingCost)}</div>
            </div>
          </section>
        ) : (
          <section className="q-cost-card single">
            <div className="q-cost-single-left">
              <div className="q-cost-heading lg">Total System Payable Cost</div>
              <div className="q-cost-sub">
                Includes all components, installation &amp; applicable charges ({displayKw} System)
              </div>
            </div>

            <div className="q-cost-divider" />

            <div className="q-cost-single-right" key={landingCost}>
              <div className="q-cost-hero">₹ {landingCost.toLocaleString('en-IN')}</div>
              <div className="q-cost-words">{numberToIndianWords(landingCost)}</div>
            </div>
          </section>
        )}

        {/* 5. BANK DETAILS FOR PAYMENT */}
        <section className="q-bank-section">
          <div className="q-section-label">
            <span className="q-amber-pip" />
            <span>Bank Details for Payment</span>
          </div>

          <div className={`q-bank-row ${banksToShow.length === 1 ? 'single' : ''}`}>
            {banksToShow.map((b, idx) => (
              <div
                key={`${q_bankPreset}-${b.key}`}
                className="q-bank-col bank-card-enter"
                style={{ '--bank-idx': idx }}
              >
                <div className="q-bank-title">{b.bankName}</div>
                <div className="q-bank-line"><span>A/C:</span> <strong>{b.accountNumber}</strong></div>
                <div className="q-bank-line"><span>IFSC:</span> <strong>{b.ifscCode}</strong></div>
                <div className="q-bank-line"><span>Branch:</span> <span>{b.branchName}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. TERMS & CONDITIONS + AUTHORIZED SIGNATORY */}
        <footer className="q-bottom-row">
          <div className="q-terms-area">
            <div className="q-section-label compact">
              <span className="q-amber-pip" />
              <span>Terms &amp; Conditions</span>
            </div>

            <div className="q-terms-grid">
              <div className="q-term-item"><span>•</span>System warranty: 5Year (WIRING AND ACCESSORIES)</div>
              <div className="q-term-item"><span>•</span>Rates applicable on single system only.</div>
              <div className="q-term-item"><span>•</span>Execution period - 60 days from date of receiving the work order and issuing advance</div>
              <div className="q-term-item"><span>•</span>Subsidy disbursed on beneficiary account after meter installation.</div>
              <div className="q-term-item"><span>•</span>Transportation : Including</div>
              <div className="q-term-item"><span>•</span>Existing Meter shifting charge extras actual.</div>
              <div className="q-term-item"><span>•</span>Solar Net Meter Charges: Including</div>
              <div className="q-term-item"><span>•</span>ELCB Required in all block (customer scope)</div>
            </div>
          </div>

          <div className="q-sign-area">
            <div className="q-sign-for">For {q_brandName || profile.name}</div>
            <div className="q-stamp-holder">
              <Stamp stampImg={vendorStamp} vendorName={vendorName} customStampUrl={customStampUrl} />
            </div>
            <div className="q-sign-caption">Authorized Signature</div>
          </div>
        </footer>

        {/* SUBTLE REGISTERED OFFICE ADDRESS FOOTER LINE (RIGHT SIDE ABOVE CORNER MARGIN) */}
        <div className="q-reg-addr-note">
          {q_regOfficeAddress || profile.address}
        </div>
      </div>
    </div>
  );
}
