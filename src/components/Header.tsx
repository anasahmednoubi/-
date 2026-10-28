import React from 'react';
import { ThemeType } from '../types';
import { t } from '../translations';
import { Icon } from '../icons';

interface HeaderProps {
  theme: ThemeType;
  effectiveTheme: 'dark' | 'light';
  onToggleTheme: () => void;
  lang: 'ar' | 'en';
}

export const Header: React.FC<HeaderProps> = ({
  effectiveTheme,
  onToggleTheme,
  lang,
}) => {
  return (
    <div className="hd">
      <div className="brand">
        <svg
          className="logo"
          width="40"
          height="40"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lgS" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".38" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="13"
            style={{
              fill: 'var(--lbg)',
              stroke: 'var(--lbd)',
              strokeWidth: 1.5,
            }}
          />
          <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#lgS)" />
          <circle
            cx="24"
            cy="25"
            r="13"
            fill="none"
            style={{ stroke: 'var(--lfg)' }}
            strokeOpacity=".28"
            strokeWidth="4"
          />
          <circle
            className="arc"
            cx="24"
            cy="25"
            r="13"
            fill="none"
            style={{ stroke: 'var(--lfg)' }}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="61 82"
            transform="rotate(-90 24 25)"
          />
          <path
            d="M18.5 25.5l4 4 7.5-8.5"
            fill="none"
            style={{ stroke: 'var(--lfg)' }}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M39 4.5l1.1 3.4 3.4 1.1-3.4 1.1L39 13.5l-1.1-3.4-3.4-1.1 3.4-1.1z"
            style={{ fill: 'var(--lfg)' }}
          />
        </svg>
        <h1>{t('إنجازاتي', lang)}</h1>
      </div>
      <button
        className="del"
        id="thm"
        onClick={onToggleTheme}
        aria-label={t('تبديل الوضع الليلي', lang)}
      >
        <Icon name={effectiveTheme === 'dark' ? 'i:sun' : 'i:moon'} size="22px" />
      </button>
    </div>
  );
};
