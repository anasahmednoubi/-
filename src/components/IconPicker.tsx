import React, { useState, useMemo } from 'react';
import { ICK, Icon } from '../icons';
import { t } from '../translations';
import { normalizeStr } from '../utils';

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  lang: 'ar' | 'en';
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
  lang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    const q = normalizeStr(search).trim();
    if (!q) {
      return ICK.map((x) => x[0]);
    }
    const terms = q.split(/\s+/);
    return ICK.filter((x) =>
      terms.every((term) => normalizeStr(x[1]).includes(term))
    ).map((x) => x[0]);
  }, [search]);

  return (
    <div style={{ flex: '1 1 100%' }}>
      <button
        type="button"
        className="chip on"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#16a34a',
          color: '#fff',
          padding: '4px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '18px', display: 'inline-flex' }}>
          <Icon name={selectedIcon} size="18px" />
        </span>
        <span style={{ fontSize: '13px' }}>
          {t('اختر أيقونة', lang)}{' '}
          <Icon
            name="i:chevdown"
            size="14px"
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.25s ease',
            }}
          />
        </span>
      </button>

      <div className={`collapsible-drawer ${isOpen ? 'open' : ''}`}>
        <div className="collapsible-drawer-inner">
          <div style={{ marginTop: '8px', maxWidth: '100%', overflow: 'hidden' }}>
            <input
              placeholder={
                t('ابحث عن أيقونة', lang) +
                ' (' +
                t('مثلًا: رياضة، قهوة،', lang) +
                ' book)'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', marginBottom: '8px' }}
            />
            {filteredIcons.length === 0 ? (
              <div className="sub">
                {t('لا توجد نتائج. جرّب كلمة أخرى.', lang)}
              </div>
            ) : (
              <div className="ipk">
                {filteredIcons.map((name) => {
                  const iconVal = 'i:' + name;
                  const isSelected = selectedIcon === iconVal;
                  return (
                    <button
                      key={name}
                      type="button"
                      className={`chip ${isSelected ? 'on' : ''}`}
                      onClick={() => {
                        onSelectIcon(iconVal);
                        setIsOpen(false);
                      }}
                      aria-label={name}
                      style={{ padding: '8px', fontSize: '20px' }}
                    >
                      <Icon name={iconVal} size="22px" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
