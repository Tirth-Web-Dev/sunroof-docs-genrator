import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { HugeiconsIcon, Calendar03Icon, ArrowLeft01Icon, ArrowRight01Icon } from "./Hugeicons";
import "./AgreementDatePicker.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AgreementDatePicker({
  day = "",
  month = "",
  year = "",
  onChangeDay,
  onChangeMonth,
  onChangeYear,
  onSelectDate,
  onOpenChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    onOpenChange?.(isOpen);
    return () => onOpenChange?.(false);
  }, [isOpen, onOpenChange]);

  const parsedYear = parseInt(year, 10);
  const parsedMonth = parseInt(month, 10);
  const parsedDay = parseInt(day, 10);
  const hasValidDate =
    !isNaN(parsedYear) && parsedYear >= 1900 && parsedYear <= 2100 &&
    !isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12 &&
    !isNaN(parsedDay) && parsedDay >= 1 && parsedDay <= 31;

  const today = new Date();
  const [viewYear, setViewYear] = useState(hasValidDate ? parsedYear : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(hasValidDate ? parsedMonth - 1 : today.getMonth());

  useEffect(() => {
    if (isOpen && hasValidDate) {
      setViewYear(parsedYear);
      setViewMonth(parsedMonth - 1);
    }
  }, [isOpen, parsedYear, parsedMonth, hasValidDate]);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = popoverRef.current?.offsetWidth || 292;
    const popoverHeight = popoverRef.current?.offsetHeight || 344;
    let left = rect.left;
    let top = rect.bottom + 8;

    if (left + popoverWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - popoverWidth - 12);
    }

    const spaceBelow = window.innerHeight - rect.bottom - 12;
    if (spaceBelow >= 240) {
      top = Math.min(rect.bottom + 8, window.innerHeight - popoverHeight - 12);
    } else if (rect.top - 12 >= popoverHeight + 8) {
      top = rect.top - popoverHeight - 8;
    } else {
      top = Math.max(12, window.innerHeight - popoverHeight - 12);
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    const rafId = requestAnimationFrame(updatePosition);
    const handleOutside = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setShowMonthYearPicker(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowMonthYearPicker(false);
      }
    };
    const handleReposition = () => updatePosition();
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDaySelect = (d, mOffset = 0) => {
    let targetMonth = viewMonth + mOffset;
    let targetYear = viewYear;
    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    } else if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
    const dd = String(d).padStart(2, "0");
    const mm = String(targetMonth + 1).padStart(2, "0");
    const yyyy = String(targetYear);
    onSelectDate(dd, mm, yyyy);
    setIsOpen(false);
    setShowMonthYearPicker(false);
  };

  const handleToday = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = String(now.getFullYear());
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onSelectDate(dd, mm, yyyy);
    setIsOpen(false);
    setShowMonthYearPicker(false);
  };

  // Build 6-week calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({ day: daysInPrevMonth - i, offset: -1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, offset: 0 });
  }
  const totalNeeded = calendarCells.length <= 35 ? 35 : 42;
  let nextDay = 1;
  while (calendarCells.length < totalNeeded) {
    calendarCells.push({ day: nextDay++, offset: 1 });
  }

  return (
    <>
      <div className={`lg-date-pill ${isOpen ? "open" : ""}`} ref={triggerRef}>
        <div className="lg-date-segments">
          <div className="lg-date-seg">
            <span className="lg-date-seg-lbl">DD</span>
            <input
              type="text"
              placeholder="DD"
              maxLength={2}
              value={day}
              onChange={(e) => onChangeDay(e.target.value)}
              className="lg-date-seg-input"
              aria-label="Agreement Day"
            />
          </div>
          <span className="lg-date-sep">/</span>
          <div className="lg-date-seg">
            <span className="lg-date-seg-lbl">MM</span>
            <input
              type="text"
              placeholder="MM"
              maxLength={2}
              value={month}
              onChange={(e) => onChangeMonth(e.target.value)}
              className="lg-date-seg-input"
              aria-label="Agreement Month"
            />
          </div>
          <span className="lg-date-sep">/</span>
          <div className="lg-date-seg year">
            <span className="lg-date-seg-lbl">YYYY</span>
            <input
              type="text"
              placeholder="YYYY"
              maxLength={4}
              value={year}
              onChange={(e) => onChangeYear(e.target.value)}
              className="lg-date-seg-input"
              aria-label="Agreement Year"
            />
          </div>
        </div>

        <button
          type="button"
          className={`lg-date-cal-trigger ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen((o) => !o)}
          title="Open Calendar"
          aria-label="Open Calendar"
        >
          <HugeiconsIcon icon={Calendar03Icon} size={15} />
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className="lg-calendar-popover"
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            role="dialog"
            aria-label="Choose Agreement Date"
          >
            <div className="lg-cal-header">
              <button
                type="button"
                className="lg-cal-month-btn"
                onClick={() => setShowMonthYearPicker((s) => !s)}
              >
                <span>{MONTH_NAMES[viewMonth]} {viewYear}</span>
                <span className={`lg-cal-month-chevron ${showMonthYearPicker ? "open" : ""}`}>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                </span>
              </button>

              {!showMonthYearPicker && (
                <div className="lg-cal-nav">
                  <button
                    type="button"
                    className="lg-cal-nav-btn"
                    onClick={handlePrevMonth}
                    title="Previous Month"
                    aria-label="Previous Month"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                  </button>
                  <button
                    type="button"
                    className="lg-cal-nav-btn"
                    onClick={handleNextMonth}
                    title="Next Month"
                    aria-label="Next Month"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </button>
                </div>
              )}
            </div>

            {showMonthYearPicker ? (
              <div className="lg-cal-ym-panel">
                <div className="lg-cal-year-row">
                  <button
                    type="button"
                    className="lg-cal-nav-btn"
                    onClick={() => setViewYear((y) => y - 1)}
                    aria-label="Previous Year"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={13} />
                  </button>
                  <span className="lg-cal-year-display">{viewYear}</span>
                  <button
                    type="button"
                    className="lg-cal-nav-btn"
                    onClick={() => setViewYear((y) => y + 1)}
                    aria-label="Next Year"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                  </button>
                </div>
                <div className="lg-cal-months-grid">
                  {SHORT_MONTHS.map((mName, idx) => (
                    <button
                      key={mName}
                      type="button"
                      className={`lg-cal-month-chip ${idx === viewMonth ? "active" : ""}`}
                      onClick={() => {
                        setViewMonth(idx);
                        setShowMonthYearPicker(false);
                      }}
                    >
                      {mName}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="lg-cal-weekdays">
                  {WEEKDAYS.map((w) => (
                    <span key={w} className="lg-cal-weekday">{w}</span>
                  ))}
                </div>

                <div className="lg-cal-grid">
                  {calendarCells.map((cell, idx) => {
                    const isCurrentMonth = cell.offset === 0;
                    const cellMonth = viewMonth + cell.offset;
                    const isSelected =
                      hasValidDate &&
                      parsedDay === cell.day &&
                      parsedMonth - 1 === ((cellMonth + 12) % 12) &&
                      parsedYear === (cellMonth < 0 ? viewYear - 1 : cellMonth > 11 ? viewYear + 1 : viewYear);

                    const isToday =
                      isCurrentMonth &&
                      today.getDate() === cell.day &&
                      today.getMonth() === viewMonth &&
                      today.getFullYear() === viewYear;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDaySelect(cell.day, cell.offset)}
                        className={
                          "lg-cal-day" +
                          (!isCurrentMonth ? " muted" : "") +
                          (isSelected ? " selected" : "") +
                          (isToday && !isSelected ? " today" : "")
                        }
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div className="lg-cal-footer">
              <button type="button" className="lg-cal-footer-btn" onClick={handleToday}>
                Today
              </button>
              <button
                type="button"
                className="lg-cal-footer-btn primary"
                onClick={() => {
                  setIsOpen(false);
                  setShowMonthYearPicker(false);
                }}
              >
                Done
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

