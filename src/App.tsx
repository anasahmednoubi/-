import React, { useState, useEffect, useRef } from 'react';
import {
  Task,
  Routine,
  TabType,
  PeriodType,
  ThemeType,
  TabPosType,
  PbStyleType,
  ToneType,
  UserProfile,
  FontConfig,
  AccountLinks,
} from './types';
import { t, cap } from './translations';
import { key, today, due, pct } from './utils';
import { playTone } from './audio';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TodayView } from './components/TodayView';
import { TasksView } from './components/TasksView';
import { RoutineView } from './components/RoutineView';
import { StatsView } from './components/StatsView';
import { MoreView, ACCENT_PALETTE } from './components/MoreView';
import { Modals, ActiveModal } from './components/Modals';
import { TourModal } from './components/TourModal';
import { Toast, ToastMessage } from './components/Toast';
import { Confetti } from './components/Confetti';

const STORAGE_KEYS = {
  tasks: 'tasks-progress-v1',
  routines: 'routines-v1',
  theme: 'theme-v1',
  accent: 'acc-v1',
  pbStyle: 'pbstyle-v1',
  tabPos: 'tabpos-v1',
  lang: 'lang-v1',
  profile: 'profile-v1',
  font: 'font-v1',
  notif: 'notif-on-v1',
  links: 'link-v1',
  tour: 'tour-v2',
  toneN: 'tone-v1',
  toneT: 'tone-t-v1',
  toneR: 'tone-r-v1',
};

export const App: React.FC = () => {
  // App state
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.lang);
      if (saved === 'en') return 'en';
    } catch {
      // ignore
    }
    return 'ar';
  });

  const [curTab, setCurTab] = useState<TabType>('D');
  const [periodR, setPeriodR] = useState<PeriodType>('W');
  const [periodS, setPeriodS] = useState<PeriodType>('W');

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.tasks);
      if (s) return JSON.parse(s) || [];
    } catch {
      // ignore
    }
    return [];
  });

  const [routines, setRoutines] = useState<Routine[]>(() => {
    try {
      const r = localStorage.getItem(STORAGE_KEYS.routines);
      if (r) return JSON.parse(r) || [];
    } catch {
      // ignore
    }
    return [];
  });

  const [theme, setTheme] = useState<ThemeType>(() => {
    try {
      const th = localStorage.getItem(STORAGE_KEYS.theme);
      if (th === 'dark' || th === 'light') return th;
    } catch {
      // ignore
    }
    return 'auto';
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    try {
      const c = localStorage.getItem(STORAGE_KEYS.accent);
      if (c && ACCENT_PALETTE.some((x) => x[0] === c)) return c;
    } catch {
      // ignore
    }
    return '#7c3aed';
  });

  const [pbStyle, setPbStyle] = useState<PbStyleType>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.pbStyle);
      if (s) return s as PbStyleType;
    } catch {
      // ignore
    }
    return 'gauge';
  });

  const [tabPos, setTabPos] = useState<TabPosType>(() => {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.tabPos);
      if (p === 'top') return 'top';
    } catch {
      // ignore
    }
    return 'bottom';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.profile);
      if (p) return JSON.parse(p);
    } catch {
      // ignore
    }
    return { name: '' };
  });

  const [fontConfig, setFontConfig] = useState<FontConfig>(() => {
    try {
      const f = localStorage.getItem(STORAGE_KEYS.font);
      if (f) return JSON.parse(f);
    } catch {
      // ignore
    }
    return { f: '', s: 1 };
  });

  const [notifEnabled, setNotifEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.notif) === '1';
    } catch {
      return false;
    }
  });

  const [tones, setTones] = useState<{ n: ToneType; t: ToneType; r: ToneType }>(() => {
    const res = { n: 'chime' as ToneType, t: 'pop' as ToneType, r: 'chime' as ToneType };
    try {
      const tn = localStorage.getItem(STORAGE_KEYS.toneN) as ToneType;
      const tt = localStorage.getItem(STORAGE_KEYS.toneT) as ToneType;
      const tr = localStorage.getItem(STORAGE_KEYS.toneR) as ToneType;
      if (tn) res.n = tn;
      if (tt) res.t = tt;
      if (tr) res.r = tr;
    } catch {
      // ignore
    }
    return res;
  });

  const [accountLinks, setAccountLinks] = useState<AccountLinks>(() => {
    try {
      const l = localStorage.getItem(STORAGE_KEYS.links);
      if (l) return JSON.parse(l);
    } catch {
      // ignore
    }
    return {};
  });

  const [tourSeen, setTourSeen] = useState<Record<string, number>>(() => {
    try {
      const ts = localStorage.getItem(STORAGE_KEYS.tour);
      if (ts) return JSON.parse(ts);
    } catch {
      // ignore
    }
    return {};
  });

  const [showTour, setShowTour] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const prevLeftRef = useRef<number | null>(null);

  // Sync state to local storage and document element
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.routines, JSON.stringify(routines));
    } catch {
      // ignore
    }
  }, [routines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.lang, lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.title = cap(t('إنجازاتي', lang));
  }, [lang]);

  useEffect(() => {
    const h = document.documentElement;
    if (theme === 'auto') {
      h.removeAttribute('data-theme');
      try {
        localStorage.removeItem(STORAGE_KEYS.theme);
      } catch {
        // ignore
      }
    } else {
      h.setAttribute('data-theme', theme);
      try {
        localStorage.setItem(STORAGE_KEYS.theme, theme);
      } catch {
        // ignore
      }
    }
  }, [theme]);

  useEffect(() => {
    const h = document.documentElement;
    if (accentColor === '#7c3aed') {
      h.removeAttribute('data-acc');
      h.style.removeProperty('--ab');
      try {
        localStorage.removeItem(STORAGE_KEYS.accent);
      } catch {
        // ignore
      }
    } else {
      h.setAttribute('data-acc', '1');
      h.style.setProperty('--ab', accentColor);
      try {
        localStorage.setItem(STORAGE_KEYS.accent, accentColor);
      } catch {
        // ignore
      }
    }
  }, [accentColor]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.pbStyle, pbStyle);
    } catch {
      // ignore
    }
  }, [pbStyle]);

  useEffect(() => {
    const h = document.documentElement;
    h.classList.toggle('tbtop', tabPos === 'top');
    try {
      localStorage.setItem(STORAGE_KEYS.tabPos, tabPos);
    } catch {
      // ignore
    }
  }, [tabPos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    // Dynamic Font Application
    const h = document.documentElement;
    if (fontConfig.f) {
      const linkId = 'gfont-' + fontConfig.f.replace(/\s+/g, '-');
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontConfig.f.replace(
          / /g,
          '+'
        )}:wght@400;700&display=swap`;
        document.head.appendChild(link);
      }
      h.style.setProperty(
        '--ff',
        `"${fontConfig.f}", system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif`
      );
    } else {
      h.style.removeProperty('--ff');
    }
    h.style.setProperty('--zs', String(fontConfig.s));
    try {
      localStorage.setItem(STORAGE_KEYS.font, JSON.stringify(fontConfig));
    } catch {
      // ignore
    }
  }, [fontConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.links, JSON.stringify(accountLinks));
    } catch {
      // ignore
    }
  }, [accountLinks]);

  // Check tour for current tab
  useEffect(() => {
    if (!tourSeen.off && !tourSeen[curTab]) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowTour(false);
    }
  }, [curTab, tourSeen]);

  // Confetti trigger detection on today's items
  useEffect(() => {
    const k = key(today());
    const rs = routines.filter((r) => due(r, today()));
    const ts = tasks.filter((task) => !task.finished || task.fin === k);
    const left =
      rs.filter((r) => !r.log[k]).length +
      ts.filter((task) => !(task.finished || task.dk === k)).length;
    const total = rs.length + ts.length;

    if (total > 0) {
      if (prevLeftRef.current !== null && prevLeftRef.current > 0 && left === 0) {
        setShowConfetti(true);
      }
      prevLeftRef.current = left;
    } else {
      prevLeftRef.current = null;
    }
  }, [tasks, routines]);

  const notifyUser = (title: string, body: string) => {
    if (!notifEnabled) return;
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body });
        return;
      } catch {
        // fallback
      }
    }
    setToast({ id: Date.now(), title, body });
  };

  const handleToggleTheme = () => {
    const isDark =
      theme === 'dark' ||
      (theme === 'auto' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    setTheme(next);
  };

  const effectiveTheme: 'dark' | 'light' =
    theme === 'auto'
      ? typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  // Actions on Tasks
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'done' | 'finished'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(),
      done: 0,
      finished: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddAmount = (id: number, amt: number) => {
    const k = key(today());
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const newDone = Math.min(task.target, task.done + amt);
        const isFin = newDone >= task.target;
        const newHist = [...(task.hist || []), { d: k, a: amt }];
        return {
          ...task,
          done: newDone,
          finished: isFin,
          fin: isFin ? k : task.fin,
          hist: newHist,
        };
      })
    );
  };

  const handleFinishTask = (id: number) => {
    const k = key(today());
    playTone(tones.n);
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        return {
          ...task,
          finished: true,
          fin: k,
        };
      })
    );
  };

  const handleDoneTaskClick = (task: Task) => {
    const k = key(today());
    if (task.dk === k) {
      // undo today's contribution
      setTasks((prev) =>
        prev.map((tItem) => {
          if (tItem.id !== task.id) return tItem;
          const restoredDone = Math.max(0, tItem.done - (tItem.dadd || 0));
          const updatedHist = (tItem.hist || []).filter((h) => !h.m);
          return {
            ...tItem,
            done: restoredDone,
            finished: false,
            fin: undefined,
            dk: undefined,
            dadd: undefined,
            hist: updatedHist,
          };
        })
      );
    } else if (!task.finished) {
      setActiveModal({ type: 'logAmount', task });
    }
  };

  const handleConfirmAmountModal = (taskId: number, amount: number) => {
    const k = key(today());
    const targetTask = tasks.find((t) => t.id === taskId);
    if (!targetTask) return;

    const add = Math.min(targetTask.target - targetTask.done, amount);
    if (add <= 0) return;

    playTone(tones.n);
    notifyUser(
      t('إنجازاتي', lang),
      `${t('أحسنت! تم تسجيل تقدمك في:', lang)} ${targetTask.name}`
    );

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const newDone = task.done + add;
        const isFin = newDone >= task.target;
        const newHist = [...(task.hist || []), { d: k, a: add, m: 1 }];
        return {
          ...task,
          done: newDone,
          dk: k,
          dadd: add,
          finished: isFin,
          fin: isFin ? k : task.fin,
          hist: newHist,
        };
      })
    );
  };

  // Actions on Routines
  const handleAddRoutine = (
    newRoutineData: Omit<Routine, 'id' | 'log' | 'created'>
  ) => {
    const newRoutine: Routine = {
      ...newRoutineData,
      id: Date.now(),
      log: {},
      created: key(today()),
    };
    setRoutines((prev) => [...prev, newRoutine]);
  };

  const handleTickTodayRoutine = (id: number) => {
    const k = key(today());
    const r = routines.find((x) => x.id === id);
    if (!r) return;
    const isCurrentlyDone = !!r.log[k];

    if (!isCurrentlyDone) {
      playTone(tones.n);
      notifyUser(
        t('إنجازاتي', lang),
        `${t('أحسنت! أتممت الروتين:', lang)} ${r.name}`
      );
    }

    setRoutines((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newLog = { ...item.log };
        if (newLog[k]) {
          delete newLog[k];
        } else {
          newLog[k] = true;
        }
        return { ...item, log: newLog };
      })
    );
  };

  const handleTickDateRoutine = (id: number, dateKey: string) => {
    playTone(tones.n);
    setRoutines((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newLog = { ...item.log };
        let newCreated = item.created;
        if (newLog[dateKey]) {
          delete newLog[dateKey];
        } else {
          newLog[dateKey] = true;
          if (dateKey < newCreated) {
            newCreated = dateKey;
          }
        }
        return { ...item, log: newLog, created: newCreated };
      })
    );
  };

  const handleTourGotIt = () => {
    const updated = { ...tourSeen, [curTab]: 1 };
    setTourSeen(updated);
    setShowTour(false);
    try {
      localStorage.setItem(STORAGE_KEYS.tour, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleTourSkip = () => {
    const updated = { ...tourSeen, off: 1 };
    setTourSeen(updated);
    setShowTour(false);
    try {
      localStorage.setItem(STORAGE_KEYS.tour, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleReplayTour = () => {
    setTourSeen({});
    try {
      localStorage.removeItem(STORAGE_KEYS.tour);
    } catch {
      // ignore
    }
    setShowTour(true);
  };

  const handleWipeAll = () => {
    setTasks([]);
    setRoutines([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.tasks);
      localStorage.removeItem(STORAGE_KEYS.routines);
    } catch {
      // ignore
    }
    setToast({
      id: Date.now(),
      title: t('إنجازاتي', lang),
      body: t('مسح جميع البيانات', lang),
    });
  };

  // Touch Swipe navigation support
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const tabs: TabType[] = ['D', 'T', 'R', 'S', 'H'];
    const dir = dx > 0 ? (lang === 'en' ? -1 : 1) : lang === 'en' ? 1 : -1;
    const currIdx = tabs.indexOf(curTab);
    const nextIdx = currIdx + dir;
    if (nextIdx >= 0 && nextIdx < tabs.length) {
      setCurTab(tabs[nextIdx]);
    }
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <main>
        <Header
          theme={theme}
          effectiveTheme={effectiveTheme}
          onToggleTheme={handleToggleTheme}
          lang={lang}
        />

        {tabPos === 'top' && (
          <div style={{ marginBottom: '14px' }}>
            <Navigation
              currentTab={curTab}
              onSelectTab={setCurTab}
              lang={lang}
            />
          </div>
        )}

        <div key={curTab} className="tab-pane">
          {curTab === 'D' && (
            <TodayView
              tasks={tasks}
              routines={routines}
              pbStyle={pbStyle}
              onSelectTab={setCurTab}
              onTickRoutine={handleTickTodayRoutine}
              onDoneTask={handleDoneTaskClick}
              onOpenEditTask={(task) =>
                setActiveModal({ type: 'editTask', task })
              }
              onOpenEditRoutine={(routine) =>
                setActiveModal({ type: 'editRoutine', routine })
              }
              lang={lang}
            />
          )}

          {curTab === 'T' && (
            <TasksView
              tasks={tasks}
              onAddTask={handleAddTask}
              onAddAmount={handleAddAmount}
              onFinishTask={handleFinishTask}
              onDoneTask={handleDoneTaskClick}
              onOpenEdit={(task) =>
                setActiveModal({ type: 'editTask', task })
              }
              onDeleteTask={(task) =>
                setActiveModal({ type: 'confirmDelTask', task })
              }
              lang={lang}
            />
          )}

          {curTab === 'R' && (
            <RoutineView
              routines={routines}
              period={periodR}
              onChangePeriod={setPeriodR}
              onAddRoutine={handleAddRoutine}
              onTickDate={handleTickDateRoutine}
              onOpenEdit={(routine) =>
                setActiveModal({ type: 'editRoutine', routine })
              }
              onDeleteRoutine={(routine) =>
                setActiveModal({ type: 'confirmDelRoutine', routine })
              }
              onReorderRoutines={setRoutines}
              lang={lang}
            />
          )}

          {curTab === 'S' && (
            <StatsView
              tasks={tasks}
              routines={routines}
              period={periodS}
              onChangePeriod={setPeriodS}
              lang={lang}
            />
          )}

          {curTab === 'H' && (
            <MoreView
              tasksCount={tasks.length}
              routinesCount={routines.length}
              profile={profile}
              onUpdateProfile={setProfile}
              fontConfig={fontConfig}
              onUpdateFont={setFontConfig}
              theme={theme}
              onChangeTheme={setTheme}
              accentColor={accentColor}
              onChangeAccentColor={setAccentColor}
              pbStyle={pbStyle}
              onChangePbStyle={setPbStyle}
              tabPos={tabPos}
              onChangeTabPos={setTabPos}
              notifEnabled={notifEnabled}
              onToggleNotif={() => {
                const next = !notifEnabled;
                setNotifEnabled(next);
                try {
                  localStorage.setItem(STORAGE_KEYS.notif, next ? '1' : '0');
                } catch {
                  // ignore
                }
                if (next && 'Notification' in window) {
                  Notification.requestPermission();
                }
              }}
              tones={tones}
              onChangeTone={(tk, tv) => {
                const updated = { ...tones, [tk]: tv };
                setTones(updated);
                try {
                  const sKey =
                    tk === 'n'
                      ? STORAGE_KEYS.toneN
                      : tk === 't'
                      ? STORAGE_KEYS.toneT
                      : STORAGE_KEYS.toneR;
                  localStorage.setItem(sKey, tv);
                } catch {
                  // ignore
                }
              }}
              accountLinks={accountLinks}
              onUpdateLinks={setAccountLinks}
              lang={lang}
              onChangeLang={setLang}
              onReplayTour={handleReplayTour}
              onAskWipe={() => setActiveModal({ type: 'confirmWipe' })}
            />
          )}
        </div>

        {tabPos === 'bottom' && (
          <Navigation
            currentTab={curTab}
            onSelectTab={setCurTab}
            lang={lang}
          />
        )}
      </main>

      <Modals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onSaveTask={(updated) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === updated.id ? updated : t))
          );
        }}
        onSaveRoutine={(updated) => {
          setRoutines((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
          );
        }}
        onDeleteTask={(id) => {
          setTasks((prev) => prev.filter((t) => t.id !== id));
        }}
        onDeleteRoutine={(id) => {
          setRoutines((prev) => prev.filter((r) => r.id !== id));
        }}
        onConfirmAmount={handleConfirmAmountModal}
        onConfirmWipe={handleWipeAll}
        lang={lang}
      />

      {showTour && (
        <TourModal
          currentTab={curTab}
          lang={lang}
          onGotIt={handleTourGotIt}
          onSkip={handleTourSkip}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />

      <Confetti
        show={showConfetti}
        onDone={() => setShowConfetti(false)}
        lang={lang}
      />
    </div>
  );
};
export default App;
