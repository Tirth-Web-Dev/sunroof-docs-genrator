import React from 'react';

/**
 * Renders company stamp image (Sunroof Energy / Sunlight Green Energy) or SVG fallback
 */
export function Stamp({ stampImg, vendorName = 'SUNROOF ENERGY', customStampUrl = null }) {
  const activeStampSrc = customStampUrl || stampImg;

  if (activeStampSrc) {
    return (
      <div className="stamp-container">
        <img
          src={activeStampSrc}
          alt={`${vendorName} Official Stamp`}
          className="company-stamp-img"
        />
      </div>
    );
  }

  // Generate fallback curved SVG text stamp if no image provided
  const stampName = vendorName.toUpperCase() || 'SUNROOF ENERGY';

  return (
    <div className="stamp-container" title="Official Vendor Stamp">
      <svg
        viewBox="0 0 160 160"
        width="100"
        height="100"
        className="official-seal-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path
            id="upperCirclePath"
            d="M 24,80 A 56,56 0 1,1 136,80"
            fill="none"
          />
          <path
            id="lowerCirclePath"
            d="M 136,80 A 56,56 0 0,1 24,80"
            fill="none"
          />
        </defs>

        <g stroke="#1d4ed8" fill="none" strokeWidth="2.5" opacity="0.88">
          <circle cx="80" cy="80" r="76" strokeDasharray="6 3" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="70" strokeWidth="2.5" />
          <circle cx="80" cy="80" r="46" strokeWidth="1.5" />
        </g>

        <text
          fill="#1d4ed8"
          fontSize="11"
          fontWeight="bold"
          fontFamily="'Arial', sans-serif"
          letterSpacing="2px"
          opacity="0.9"
        >
          <textPath href="#upperCirclePath" startOffset="50%" textAnchor="middle">
            {stampName.length > 24 ? stampName.slice(0, 24) : stampName}
          </textPath>
        </text>

        <text
          fill="#1d4ed8"
          fontSize="9"
          fontWeight="bold"
          fontFamily="'Arial', sans-serif"
          letterSpacing="2px"
          opacity="0.9"
        >
          <textPath href="#lowerCirclePath" startOffset="50%" textAnchor="middle">
            ★ PM SURYA GHAR ★
          </textPath>
        </text>

        <g stroke="#1d4ed8" fill="none" strokeWidth="1.8" transform="translate(80, 80) scale(0.65)">
          <circle cx="0" cy="0" r="16" fill="#1d4ed8" fillOpacity="0.12" />
          <line x1="0" y1="-26" x2="0" y2="-18" strokeWidth="2" />
          <line x1="0" y1="18" x2="0" y2="26" strokeWidth="2" />
          <line x1="-26" y1="0" x2="-18" y2="0" strokeWidth="2" />
          <line x1="18" y1="0" x2="26" y2="0" strokeWidth="2" />
          <polygon points="-8,-6 8,-6 10,6 -10,6" stroke="#1d4ed8" strokeWidth="1.5" fill="#2563eb" fillOpacity="0.25" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#1d4ed8" />
          <line x1="-9" y1="0" x2="9" y2="0" stroke="#1d4ed8" />
        </g>

        <path
          d="M 38,98 Q 50,65 65,85 T 82,75 Q 98,60 115,88 T 132,82"
          fill="none"
          stroke="#1e40af"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}
