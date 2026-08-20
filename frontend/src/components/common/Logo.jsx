import React from 'react';

/**
 * Custom SVG Brand Logo for CloudStay — Hostel & Accommodation Management.
 * Features a geometric accommodation structure with connected cloud architecture nodes.
 */
export default function Logo({ size = 32, variant = 'light', showText = true, subtitle = true }) {
  // Color palette for logo mark based on variant
  const isLight = variant === 'light'; // Light elements on dark navy navbar/footer
  const primaryColor = isLight ? '#38BDF8' : '#2563EB'; // Sky blue / Primary blue
  const accentColor  = isLight ? '#60A5FA' : '#102A43'; // Light blue / Deep navy
  const roofColor    = isLight ? '#14B8A6' : '#14B8A6'; // Teal accent
  const textColor    = isLight ? '#F8FAFC' : '#102A43';
  const subtextColor = isLight ? '#94A3B8' : '#486581';

  return (
    <div className="cloudstay-logo-container" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer subtle shield/circle background */}
        <rect width="36" height="36" rx="8" fill={isLight ? 'rgba(255, 255, 255, 0.08)' : '#E8F1FA'} />
        
        {/* Main Hostel Building Structure */}
        <path
          d="M10 16L18 9.5L26 16V26.5C26 27.0523 25.5523 27.5 25 27.5H11C10.4477 27.5 10 27.0523 10 26.5V16Z"
          fill={isLight ? '#1E293B' : '#FFFFFF'}
          stroke={primaryColor}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Windows / Accommodation Grid */}
        <rect x="13" y="17" width="4" height="4" rx="0.75" fill={primaryColor} />
        <rect x="19" y="17" width="4" height="4" rx="0.75" fill={primaryColor} />
        
        {/* Doorway */}
        <path d="M15.5 27.5V23C15.5 22.4477 15.9477 22 16.5 22H19.5C20.0523 22 20.5 22.4477 20.5 23V27.5" fill={roofColor} />

        {/* Cloud Connection Arc */}
        <path
          d="M7 14C7 11.5 8.8 8.5 13 8.5C14.2 7 16.5 6 19 6C23 6 25 8.5 25.5 10.5C27.5 10.5 29 12 29 14"
          stroke={roofColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="0.5 0"
        />

        {/* Status/Node Indicator */}
        <circle cx="26" cy="9" r="2" fill={primaryColor} />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: size >= 32 ? '1.1rem' : '0.95rem', fontWeight: 700, color: textColor, letterSpacing: '-0.02em' }}>
            CloudStay
          </span>
          {subtitle && (
            <span style={{ fontSize: '0.625rem', fontWeight: 700, color: subtextColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.1rem' }}>
              Hostel Management
            </span>
          )}
        </div>
      )}
    </div>
  );
}
