import React from 'react';
import { TabType } from '../types';
import { t } from '../translations';
import { Icon } from '../icons';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  lang: 'ar' | 'en';
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  lang,
}) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'D', label: 'اليوم', icon: 'i:calendar' },
    { id: 'T', label: 'مهام', icon: 'i:check' },
    { id: 'R', label: 'روتين', icon: 'i:repeat' },
    { id: 'S', label: 'إحصائيات', icon: 'i:chart' },
  ];

  return (
    <div id="bar">
      <div className="tabs main" id="nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={'t' + tab.id}
            className={currentTab === tab.id ? 'on' : ''}
            onClick={() => onSelectTab(tab.id)}
            aria-label={t(tab.label, lang)}
          >
            <span className="ti">
              <Icon name={tab.icon} />
            </span>
            <span className="tn">{t(tab.label, lang)}</span>
          </button>
        ))}
      </div>
      <button
        id="tH"
        className={currentTab === 'H' ? 'on' : ''}
        onClick={() => onSelectTab('H')}
        aria-label={t('المزيد', lang)}
      >
        <Icon name="i:dots" size="24px" />
      </button>
    </div>
  );
};
