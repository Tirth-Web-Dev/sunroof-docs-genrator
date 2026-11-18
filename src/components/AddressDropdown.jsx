import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { SUNROOF_ADDRESSES } from "../utils/constants";
import { HugeiconsIcon, ChevronDown01Icon } from "./Hugeicons";

/**
 * Liquid Glass dropdown for switching between preset Sunroof Energy office addresses.
 */
export function AddressDropdown({ value = "", onChange, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 280 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
    return () => onOpenChange?.(false);
  }, [isOpen, onOpenChange]);

  const matchedPreset = SUNROOF_ADDRESSES.find(
    (opt) => opt.address.trim() === (value || "").trim()
  );

  const displayTitle = matchedPreset ? matchedPreset.label : "Custom Address";
  const displaySub = matchedPreset
    ? matchedPreset.address
    : value || "Enter custom office address below";

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 160;
    let top = rect.bottom + 6;
    if (top + menuHeight > window.innerHeight - 12) {
      top = Math.max(12, rect.top - menuHeight - 6);
    }
    setCoords({
      top,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleReposition = () => updatePosition();

    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`lg-dropdown-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="lg-dropdown-trigger-text">
          <span className="lg-dropdown-value">{displayTitle}</span>
          <span className="lg-dropdown-sub">{displaySub}</span>
        </div>
        <HugeiconsIcon
          icon={ChevronDown01Icon}
          size={15}
          className={`lg-dropdown-chevron ${isOpen ? "open" : ""}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="lg-dropdown-menu"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
            }}
            role="listbox"
            aria-label="Select Office Address"
          >
            {SUNROOF_ADDRESSES.map((opt, idx) => {
              const isSelected = matchedPreset?.key === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`lg-dropdown-item ${isSelected ? "selected" : ""}`}
                  style={{ "--item-idx": idx }}
                  onClick={() => {
                    onChange(opt.address);
                    setIsOpen(false);
                  }}
                >
                  <div className="lg-dropdown-item-text">
                    <span className="lg-dropdown-item-title">{opt.label}</span>
                    <span className="lg-dropdown-item-sub">{opt.address}</span>
                  </div>
                  {isSelected && <span className="lg-dropdown-check" aria-hidden="true">✓</span>}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}

