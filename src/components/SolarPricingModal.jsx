import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SOLAR_PRICING_PLANS } from '../utils/solarPricingData';

import {
  HugeiconsIcon,
  SolarPanel03Icon
} from './Hugeicons';
import './SolarPricingModal.css';

const BRAND_KEYS = Object.keys(SOLAR_PRICING_PLANS);

function findNearestRow(rows, targetKw) {
  if (!rows?.length || !targetKw) return null;
  let best = rows[0];
  let bestDiff = Math.round(Math.abs(rows[0].kw - targetKw) * 1000) / 1000;
  for (let i = 1; i < rows.length; i++) {
    const diff = Math.round(Math.abs(rows[i].kw - targetKw) * 1000) / 1000;
    if (diff < bestDiff) {
      best = rows[i];
      bestDiff = diff;
    }
  }
  return { row: best, diff: bestDiff, isExact: bestDiff <= 0.015 };
}

export function SolarPricingModal({ isOpen, onClose, onSelectPlan, appliedCapacity = '' }) {
  // Brand tabs: 'aps' | 'waree' | 'adani' (auto-selects best match on open)
  const [activeBrand, setActiveBrand] = useState('aps');
  const [brandDir, setBrandDir] = useState(1);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const modalBodyRef = useRef(null);

  const targetKw = useMemo(() => {
    const parsed = parseFloat(String(appliedCapacity || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [appliedCapacity]);

  // Compute nearest/exact match per brand & per model
  const matchInfo = useMemo(() => {
    if (!targetKw) return { bestBrand: 'aps', byBrand: {} };

    let winningBrand = 'aps';
    let winningDiff = Infinity;
    const byBrand = {};

    BRAND_KEYS.forEach((brandKey) => {
      const brand = SOLAR_PRICING_PLANS[brandKey];
      const byModel = {};
      let brandBestDiff = Infinity;

      brand.models.forEach((model) => {
        const match = findNearestRow(model.rows, targetKw);
        if (match) {
          byModel[model.id] = match;
          if (match.diff < brandBestDiff) {
            brandBestDiff = match.diff;
          }
        }
      });

      byBrand[brandKey] = { byModel, bestDiff: brandBestDiff };
      if (brandBestDiff + 0.001 < winningDiff) {
        winningDiff = brandBestDiff;
        winningBrand = brandKey;
      }
    });

    return { bestBrand: winningBrand, byBrand };
  }, [targetKw]);

  useEffect(() => {
    if (isOpen) {
      if (targetKw && matchInfo.bestBrand) {
        setActiveBrand(matchInfo.bestBrand);
      }
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 240);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender, targetKw, matchInfo.bestBrand]);

  // Scroll highlighted matched rows smoothly into view when modal opens or brand switches
  useEffect(() => {
    if (!shouldRender || isClosing || !targetKw) return;
    const id = setTimeout(() => {
      const matchedEls = modalBodyRef.current?.querySelectorAll('.rpm-row.is-match');
      matchedEls?.forEach((el) => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }, 280);
    return () => clearTimeout(id);
  }, [shouldRender, isClosing, activeBrand, targetKw]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 220);
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!shouldRender) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [shouldRender, handleClose]);

  if (!shouldRender) return null;

  const currentBrandData = SOLAR_PRICING_PLANS[activeBrand] || SOLAR_PRICING_PLANS.aps;
  const bifacialModel = currentBrandData.models[0];
  const topconModel = currentBrandData.models[1];
  const activeBrandIdx = Math.max(0, BRAND_KEYS.indexOf(activeBrand));

  const handleBrandSwitch = (nextId) => {
    if (nextId === activeBrand) return;
    const prevIdx = BRAND_KEYS.indexOf(activeBrand);
    const nextIdx = BRAND_KEYS.indexOf(nextId);
    setBrandDir(nextIdx >= prevIdx ? 1 : -1);
    setActiveBrand(nextId);
  };

  const handleRowClick = (model, row) => {
    onSelectPlan({
      kw: row.kw.toString(),
      panels: `${row.panels} Panel`,
      totalCost: row.totalCost,
      subsidy: row.subsidy,
      payable: row.payable,
      solarPanelMake: model.makeDescription,
      brand: currentBrandData.brand,
      modelName: model.name
    });
    handleClose();
  };

  const renderCard = (model, subtitle, badgeText, cardSide) => {
    if (!model) return null;
    const modelMatch = matchInfo.byBrand[activeBrand]?.byModel?.[model.id] || null;
    const brandBestDiff = matchInfo.byBrand[activeBrand]?.bestDiff ?? Infinity;
    const isPrimaryModelForBrand =
      modelMatch && Math.abs(modelMatch.diff - brandBestDiff) <= 0.001;

    return (
      <div className={`rpm-card rpm-card-${cardSide}`}>
        {/* Card Header matching reference */}
        <div className="rpm-card-header">
          <div className="rpm-header-left">
            <div className="rpm-icon-box">
              <HugeiconsIcon icon={SolarPanel03Icon} size={22} color="var(--apple-blue)" />
            </div>
            <div className="rpm-header-text">
              <h3 className="rpm-card-title">{model.name}</h3>
              <p className="rpm-card-subtitle">{subtitle}</p>
            </div>
          </div>
          <span className="rpm-pill-badge font-bold">
            {badgeText}
          </span>
        </div>

        {/* HeroUI Nested-Card Rate Table */}
        <div className="hu-table-shell rpm-hu-table" role="table" aria-label={model.name}>
          <div className="hu-table-head rpm-hu-grid" role="row">
            <div className="hu-th" role="columnheader">Capacity (kW)</div>
            <div className="hu-th" role="columnheader">Total Cost (₹)</div>
            <div className="hu-th" role="columnheader">Subsidy (₹)</div>
            <div className="hu-th right" role="columnheader">Net Payable (₹)</div>
          </div>

          <div className="hu-table-body-card rpm-table-body" role="rowgroup">
            {model.rows.map((row, idx) => {
              const isRowMatched = modelMatch?.row?.panels === row.panels;
              const matchLabel = modelMatch?.isExact ? 'Exact' : 'Nearest';
              return (
                <div
                  key={row.panels}
                  className={`hu-tr rpm-hu-grid rpm-row ${isRowMatched ? 'is-match' : ''} ${isRowMatched && isPrimaryModelForBrand ? 'is-primary-match' : ''}`}
                  style={{ '--row-idx': idx }}
                  role="row"
                  onClick={() => handleRowClick(model, row)}
                >
                  <div className="hu-td rpm-cell rpm-cell-cap" role="cell">
                    <span className="rpm-cap-pill">
                      <strong>{row.panels}</strong>
                      <span className="rpm-cap-sub">({row.kw} kW)</span>
                    </span>
                    {isRowMatched && (
                      <span className={`rpm-match-tag ${modelMatch.isExact ? 'exact' : 'nearest'}`}>
                        {matchLabel}
                      </span>
                    )}
                  </div>
                  <div className="hu-td rpm-cell" role="cell">
                    <span className="rpm-cost-text">₹ {row.totalCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="hu-td rpm-cell" role="cell">
                    <span className="rpm-sub-text">₹ {row.subsidy.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="hu-td rpm-cell right" role="cell">
                    <span className="rpm-pay-pill">₹ {row.payable.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`rpm-backdrop ${isClosing ? 'is-closing' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`rpm-container ${isClosing ? 'is-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar with Brand Tabs & Close */}
        <div className="rpm-top-bar">
          <div className="rpm-brand-group">
            <span className="rpm-brand-label">Select Brand:</span>
            <div
              className="rpm-brand-tabs"
              style={{
                '--brand-count': BRAND_KEYS.length,
                '--brand-idx': activeBrandIdx
              }}
            >
              <span className="rpm-brand-glider" aria-hidden="true" />
              {Object.values(SOLAR_PRICING_PLANS).map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => handleBrandSwitch(brand.id)}
                  className={`rpm-brand-btn ${activeBrand === brand.id ? 'active' : ''}`}
                >
                  {brand.brand}
                </button>
              ))}
            </div>
            {targetKw && (
              <span className="rpm-applied-chip" title="Extracted Applied Capacity from Application PDF">
                Applied: <strong>{targetKw} kW</strong>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rpm-close-btn"
            title="Close Rate Sheet"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Animated Side-by-Side Dual Cards */}
        <div
          ref={modalBodyRef}
          key={activeBrand}
          className="rpm-dual-grid"
          style={{ '--brand-dir': brandDir }}
        >
          {renderCard(bifacialModel, 'Higher efficiency  |  Better performance', 'BIFACIAL', 'left')}
          {renderCard(topconModel, 'High output  |  Long lasting', 'TOPCON', 'right')}
        </div>
      </div>
    </div>
  );
}
