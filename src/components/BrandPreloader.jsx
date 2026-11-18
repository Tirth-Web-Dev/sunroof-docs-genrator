import React, { useEffect, useRef, useState } from "react";
import { COMPANY_PROFILES } from "../utils/constants";

/**
 * Minimalist architectural preloader (~3.6s total):
 * Reveals the bare Sunroof Energy mark with a masked typographic lockup and
 * hairline progress rule, then flies the logo smoothly into the navbar badge.
 */
export function BrandPreloader({ targetLogoRef, onComplete }) {
  const [phase, setPhase] = useState("loading"); // 'loading' | 'flying'
  const preLogoRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      const quickTimer = setTimeout(() => onCompleteRef.current?.(), 300);
      return () => clearTimeout(quickTimer);
    }

    let flightAnim = null;
    let finishTimer = null;

    const loadTimer = setTimeout(() => {
      const startEl = preLogoRef.current;
      const targetEl = targetLogoRef?.current;

      setPhase("flying");

      if (startEl && targetEl) {
        const sRect = startEl.getBoundingClientRect();
        const tRect = targetEl.getBoundingClientRect();

        if (sRect.width > 0 && tRect.width > 0) {
          const dx = tRect.left + tRect.width / 2 - (sRect.left + sRect.width / 2);
          const dy = tRect.top + tRect.height / 2 - (sRect.top + sRect.height / 2);
          const scale = tRect.width / sRect.width;

          flightAnim = startEl.animate(
            [
              { transform: "translate3d(0px, 0px, 0) scale(1)" },
              {
                transform: `translate3d(${(dx * 0.54).toFixed(1)}px, ${(dy * 0.42).toFixed(1)}px, 0) scale(${(1 - (1 - scale) * 0.48).toFixed(4)})`,
                offset: 0.48,
              },
              { transform: `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(4)})` },
            ],
            {
              duration: 1050,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "forwards",
            }
          );

          finishTimer = setTimeout(() => {
            onCompleteRef.current?.();
          }, 1060);
          return;
        }
      }

      finishTimer = setTimeout(() => onCompleteRef.current?.(), 500);
    }, 2550);

    return () => {
      clearTimeout(loadTimer);
      if (finishTimer) clearTimeout(finishTimer);
      if (flightAnim) flightAnim.cancel();
    };
  }, [targetLogoRef]);

  return (
    <div
      className={`brand-preloader ${phase === "flying" ? "is-flying" : ""}`}
      aria-hidden="true"
    >
      <div className="brand-preloader-backdrop" />

      <div className="brand-preloader-stage">
        <div className="brand-preloader-mark-wrap">
          <div className="brand-preloader-aura" />
          <div className="brand-preloader-logo-pop">
            <img
              ref={preLogoRef}
              src={COMPANY_PROFILES.sunroof.logo}
              alt="Sunroof Energy"
              className="brand-preloader-logo"
            />
          </div>
        </div>

        <div className="brand-preloader-copy">
          <div className="brand-preloader-title-mask">
            <span className="brand-preloader-title">{COMPANY_PROFILES.sunroof.name}</span>
          </div>
          <div className="brand-preloader-hairline">
            <span className="brand-preloader-hairline-fill" />
          </div>
        </div>
      </div>
    </div>
  );
}
