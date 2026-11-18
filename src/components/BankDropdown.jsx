import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ALL_SUNROOF_BANKS } from "../utils/constants";
import { HugeiconsIcon, ChevronDown01Icon } from "./Hugeicons";

const BANK_OPTIONS = [
  {
    key: "all",
    title: "All Banks (Default)",
    subtitle: "Show all 3 Sunroof Energy banks",
  },
  ...ALL_SUNROOF_BANKS.map((b) => ({
    key: b.key,
    title: b.label || b.bankName,
    subtitle: `${b.branchName} · ${b.ifscCode}`,
  })),
];

export function BankDropdown({ value = "all", onChange, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 280 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
    return () => onOpenChange?.(false);
  }, [isOpen, onOpenChange]);

  const selected = BANK_OPTIONS.find((opt) => opt.key === value) || BANK_OPTIONS[0];

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 228;
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
          <span className="lg-dropdown-value">{selected.title}</span>
          <span className="lg-dropdown-sub">{selected.subtitle}</span>
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
            aria-label="Select Bank Option"
          >
            {BANK_OPTIONS.map((opt, idx) => {
              const isSelected = opt.key === value;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`lg-dropdown-item ${isSelected ? "selected" : ""}`}
                  style={{ "--item-idx": idx }}
                  onClick={() => {
                    onChange(opt.key);
                    setIsOpen(false);
                  }}
                >
                  <div className="lg-dropdown-item-text">
                    <span className="lg-dropdown-item-title">{opt.title}</span>
                    <span className="lg-dropdown-item-sub">{opt.subtitle}</span>
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

